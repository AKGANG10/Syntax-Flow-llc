import "server-only";
import { z } from "zod";
import {
  areaOptions,
  budgetOptions,
  candidateEngagementOptions,
  headcountOptions,
  hiringEngagementOptions,
  limits,
  timelineOptions,
  values,
  workPreferenceOptions,
} from "./options";

/** Authoritative server-side validation. Client checks are a convenience only. */

// z.string(msg) also covers a missing field, so clients never see a raw "expected string" message.
const text = (max: number, msg = "This field is required.") => z.string(msg).trim().min(1, msg).max(max, `Keep this under ${max} characters.`);
const optionalText = (max: number) => z.string().trim().max(max, `Keep this under ${max} characters.`).optional().default("");
const detail = (msg: string) =>
  z.string(msg).trim().min(limits.minDetail, msg).max(limits.long, `Keep this under ${limits.long} characters.`);

const contact = {
  name: text(limits.name, "Enter your name."),
  email: z.string("Enter a valid email address.").trim().max(limits.email).pipe(z.email("Enter a valid email address.")),
  phone: z
    .string()
    .trim()
    .max(limits.phone)
    .regex(/^[+()\d\s.-]*$/, "Use digits, spaces and + ( ) - only.")
    .optional()
    .default(""),
};

const meta = {
  /** Honeypot. Real visitors never see or fill it. */
  hp: z.string().max(200).optional().default(""),
  /** Milliseconds between the form appearing and submission. */
  elapsedMs: z.number().int().nonnegative().max(1000 * 60 * 60 * 24),
};

const technology = z.object({
  kind: z.literal("technology"),
  ...contact,
  ...meta,
  company: optionalText(limits.company),
  project: detail("Tell us a little about what you want to build (at least 10 characters)."),
  areas: z.array(z.enum(values(areaOptions))).max(areaOptions.length).optional().default([]),
  timeline: z.enum(values(timelineOptions), "Choose a timeline."),
  budget: z.enum(values(budgetOptions)).optional(),
  industry: optionalText(limits.short),
});

const talent = z.object({
  kind: z.literal("talent"),
  ...contact,
  ...meta,
  company: text(limits.company, "Enter your company name."),
  roles: detail("Describe the role or team you need (at least 10 characters)."),
  headcount: z.enum(values(headcountOptions), "Choose how many people you need."),
  engagement: z.enum(values(hiringEngagementOptions), "Choose an engagement type."),
  location: optionalText(limits.short),
  timeline: z.enum(values(timelineOptions), "Choose a timeline."),
});

const both = z.object({
  kind: z.literal("both"),
  ...contact,
  ...meta,
  company: optionalText(limits.company),
  goal: detail("Tell us what you are trying to accomplish (at least 10 characters)."),
  areas: z.array(z.enum(values(areaOptions))).max(areaOptions.length).optional().default([]),
  headcount: z.enum(values(headcountOptions)).optional(),
  timeline: z.enum(values(timelineOptions), "Choose a timeline."),
});

const httpsUrl = z
  .string()
  .trim()
  .max(300)
  .refine((v) => {
    if (!v) return true;
    try {
      return new URL(v).protocol === "https:";
    } catch {
      return false;
    }
  }, "Enter a full https:// link, or leave this empty.");

const candidate = z.object({
  kind: z.literal("candidate"),
  ...contact,
  ...meta,
  location: text(limits.short, "Enter your city and state, or country."),
  roles: text(limits.short * 2, "Tell us which roles you are interested in."),
  skills: text(limits.medium, "List your main skills."),
  workPreference: z.enum(values(workPreferenceOptions), "Choose a work preference."),
  engagement: z.enum(values(candidateEngagementOptions), "Choose an engagement type."),
  profileUrl: httpsUrl.optional().default(""),
  message: optionalText(limits.medium * 2),
  consent: z.literal(true, "Please confirm you have read the privacy notice."),
});

export const inquirySchema = z.discriminatedUnion("kind", [technology, talent, both, candidate]);
export type Inquiry = z.infer<typeof inquirySchema>;

/** Flatten zod issues to { field: firstMessage } for the client. */
export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
