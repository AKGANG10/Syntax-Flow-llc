/**
 * Photography manifest. Every entry was checked on its Unsplash page on
 * 2026-11-18 and shows "Free to use under the Unsplash License" (not
 * Unsplash+). Details and terms: docs/ASSET_LICENSES.md.
 *
 * Files are produced by `npm run media:import -- <folder>` from the original
 * downloads. Until a file exists, <PhotoFrame> renders an original procedural
 * graphic instead, so the site never ships a broken image.
 *
 * Stock imagery is illustrative: never caption it as Syntax Flow staff,
 * offices or clients.
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
  unsplashId: string;
  alt: string;
  photographer: string;
  page: string;
};

export const media: Record<MediaKey, Media> = {
  discover: {
    key: "discover",
    unsplashId: "fQOyF0D0cDU",
    alt: "A wall covered in planning sticky notes",
    photographer: "Jakub Żerdzicki",
    page: "https://unsplash.com/photos/a-wall-with-a-bunch-of-sticky-notes-on-it-fQOyF0D0cDU",
  },
  design: {
    key: "design",
    unsplashId: "pqzRfBhd9r0",
    alt: "A designer sketching interface wireframes at a desk beside a laptop",
    photographer: "UX Indonesia",
    page: "https://unsplash.com/photos/man-designing-wireframes-at-desk-with-laptop-pqzRfBhd9r0",
  },
  build: {
    key: "build",
    unsplashId: "bWVBCDtTRJI",
    alt: "A developer's desk at night with several monitors showing code",
    photographer: "Jakub Żerdzicki",
    page: "https://unsplash.com/photos/programmer-coding-at-a-desk-with-several-monitors-bWVBCDtTRJI",
  },
  connect: {
    key: "connect",
    unsplashId: "UikYLDQj9_I",
    alt: "Colleagues gathered around a computer in an open office, discussing the screen",
    photographer: "Vitaly Gariev",
    page: "https://unsplash.com/photos/team-collaborating-around-a-computer-in-an-office-UikYLDQj9_I",
  },
  scale: {
    key: "scale",
    unsplashId: "klWUhr-wPJ8",
    alt: "Rows of server racks in a data center",
    photographer: "imgix",
    page: "https://unsplash.com/photos/server-racks-in-data-center-klWUhr-wPJ8",
  },
  transform: {
    key: "transform",
    unsplashId: "ybJO3h3YsiE",
    alt: "Modern glass skyscrapers reflecting each other against the sky",
    photographer: "Sebastian Schuster",
    page: "https://unsplash.com/photos/modern-glass-skyscrapers-reflecting-the-sky-ybJO3h3YsiE",
  },
  typing: {
    key: "typing",
    unsplashId: "8ljjFxQFwKM",
    alt: "Close-up of hands typing on a keyboard with source code on the screens behind",
    photographer: "Jakub Żerdzicki",
    page: "https://unsplash.com/photos/hands-typing-on-a-keyboard-with-computer-screens-8ljjFxQFwKM",
  },
  office: {
    key: "office",
    unsplashId: "pYlBAu3de0w",
    alt: "A bright open-plan office with rows of desks and large windows",
    photographer: "Bernd Dittrich",
    page: "https://unsplash.com/photos/an-office-with-a-lot-of-desks-and-chairs-pYlBAu3de0w",
  },
  colleagues: {
    key: "colleagues",
    unsplashId: "tRvuRPE8cr4",
    alt: "Two colleagues reviewing a project together on a laptop",
    photographer: "Vitaly Gariev",
    page: "https://unsplash.com/photos/two-colleagues-collaborating-on-a-project-at-a-laptop-tRvuRPE8cr4",
  },
  technician: {
    key: "technician",
    unsplashId: "ufT32_VFS-I",
    alt: "A technician working on server equipment with tools",
    photographer: "Valentin Lacoste",
    page: "https://unsplash.com/photos/technician-working-on-server-equipment-with-tools-ufT32_VFS-I",
  },
};

export const mediaSrc = (key: MediaKey) => `/images/${key}.jpg`;
