/** Central site config: brand, navigation, contact. Edit here, reflected everywhere. */

export const site = {
  name: "QBC BOXING",
  shortName: "QBC",
  tagline: "A private athletic club for lifters, fighters, and everyone building something in between.",
  description:
    "A private athletic club built for lifters, fighters, and everyone in between. World-class coaching, uncompromising standards.",
  email: "hello@qbcboxing.com",
  phone: "(555) 018-2020",
  address: "1200 Ironworks Ave, Unit 4 — Portland, OR",
  hours: "Mon–Fri 5a–11p · Sat–Sun 7a–9p · Members 24/7",
} as const;

/** Primary top-nav (marketing). */
export const primaryNav = [
  { label: "Home", href: "/" },
  { label: "Classes", href: "/classes" },
  { label: "Membership", href: "/membership" },
  { label: "Day Pass", href: "/day-pass" },
  { label: "Trainers", href: "/trainers" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNav = {
  explore: {
    heading: "Explore",
    links: [
      { label: "Classes", href: "/classes" },
      { label: "Membership", href: "/membership" },
      { label: "Trainers", href: "/trainers" },
    ],
  },
  club: {
    heading: "Club",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Hours & Location", href: "/contact#location" },
      { label: "Client Portal", href: "/account" },
    ],
  },
  follow: {
    heading: "Follow",
    links: [
      { label: "Instagram", href: "https://instagram.com", external: true },
      { label: "TikTok", href: "https://tiktok.com", external: true },
    ],
  },
} as const;
