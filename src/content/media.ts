/**
 * Photography manifest. Every entry was checked on its Pexels page on
 * 2026-11-18: listed as "Free" under the Pexels License (free for commercial
 * use, no attribution required). Details and terms: docs/ASSET_LICENSES.md.
 *
 * Files are produced by `npm run media:import -- <folder>` from the original
 * downloads (file names contain the Pexels photo ID). Until a file exists,
 * <PhotoFrame> renders an original procedural graphic instead, so the site
 * never ships a broken image.
 *
 * Stock imagery is illustrative: never caption it as Syntax Flow staff,
 * offices or clients, or imply that the people shown endorse Syntax Flow.
 */

export type MediaKey =
  | "discover"
  | "design"
  | "build"
  | "connect"
  | "scale"
  | "transform"
  | "typing"
  | "office"
  | "colleagues"
  | "technician";

export type Media = {
  key: MediaKey;
  source: "pexels";
  sourceId: string;
  alt: string;
  photographer: string;
  page: string;
};

export const media: Record<MediaKey, Media> = {
  discover: {
    key: "discover",
    source: "pexels",
    sourceId: "29521529",
    alt: "Sticky notes arranged on a whiteboard during a planning session",
    photographer: "Jakub Zerdzicki",
    page: "https://www.pexels.com/photo/creative-brainstorming-session-with-sticky-notes-29521529/",
  },
  design: {
    key: "design",
    source: "pexels",
    sourceId: "196644",
    alt: "Interface wireframes sketched in a notebook beside a smartphone",
    photographer: "picjumbo.com",
    page: "https://www.pexels.com/photo/notebook-beside-the-iphone-on-table-196644/",
  },
  build: {
    key: "build",
    source: "pexels",
    sourceId: "16129703",
    alt: "A developer writing code across two monitors",
    photographer: "Lisa Fotios",
    page: "https://www.pexels.com/photo/man-coding-on-computers-sitting-at-desk-16129703/",
  },
  connect: {
    key: "connect",
    source: "pexels",
    sourceId: "7643742",
    alt: "A team gathered around a laptop, working through a problem together",
    photographer: "MART PRODUCTION",
    page: "https://www.pexels.com/photo/a-team-looking-at-a-laptop-and-collaborating-7643742/",
  },
  scale: {
    key: "scale",
    source: "pexels",
    sourceId: "5480781",
    alt: "Rows of server racks with network cabling in a data center",
    photographer: "Brett Sayles",
    page: "https://www.pexels.com/photo/server-racks-on-data-center-5480781/",
  },
  transform: {
    key: "transform",
    source: "pexels",
    sourceId: "7078666",
    alt: "Glass skyscrapers seen from below against a blue sky",
    photographer: "Laura Tancredi",
    page: "https://www.pexels.com/photo/skyscrapers-with-reflecting-walls-in-modern-megapolis-7078666/",
  },
  typing: {
    key: "typing",
    source: "pexels",
    sourceId: "5385526",
    alt: "Hands typing code on a laptop keyboard",
    photographer: "TREEDEO.ST",
    page: "https://www.pexels.com/photo/hands-typing-on-a-laptop-computer-5385526/",
  },
  office: {
    key: "office",
    source: "pexels",
    sourceId: "3778622",
    alt: "A bright open-plan office with rows of desks",
    photographer: "Polina Zimmerman",
    page: "https://www.pexels.com/photo/photo-of-building-interior-3778622/",
  },
  colleagues: {
    key: "colleagues",
    source: "pexels",
    sourceId: "6893945",
    alt: "Two colleagues reviewing work together on a laptop",
    photographer: "Mikhail Nilov",
    page: "https://www.pexels.com/photo/a-man-and-woman-working-together-6893945/",
  },
  technician: {
    key: "technician",
    source: "pexels",
    sourceId: "442150",
    alt: "An engineer connecting network cables in a server rack",
    photographer: "Field Engineer",
    page: "https://www.pexels.com/photo/electronics-engineer-fixing-cables-on-server-442150/",
  },
};

export const mediaSrc = (key: MediaKey) => `/images/${key}.jpg`;
