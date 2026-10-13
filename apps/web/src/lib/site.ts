export const site = {
  name: "Statin",
  url: "https://statin.com",
  email: "hello@statin.com",
  title: "Statin · Engineering for web apps, commerce, and AI integrations",
  description:
    "Statin is a product engineering company. We design and build custom web apps, SaaS platforms, commerce systems, and backend, data, and AI integrations, with security, performance, and measurement engineered in.",
  short:
    "A product engineering company building web apps, commerce systems, and backend, data, and AI integrations.",
  year: 2026,
  twitter: "@statin_26",
} as const;

export type SocialLink = {
  id: "linkedin" | "x" | "instagram";
  label: string;
  handle: string;
  href: string;
  detail: string;
};

export const social: SocialLink[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "/company/statin",
    href: "https://www.linkedin.com/company/statin/posts/?feedView=all",
    detail: "Company updates, technology, and insights.",
  },
  {
    id: "x",
    label: "X",
    handle: "@statin_26",
    href: "https://x.com/statin_26",
    detail: "Product updates and conversations.",
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "@statin.io",
    href: "https://www.instagram.com/statin.io/",
    detail: "Behind the scenes, culture, and visual stories.",
  },
];

export type NavLink = { href: string; label: string; detail?: string };

export const companyNav: NavLink[] = [
  { href: "/about", label: "About", detail: "Why Statin exists and what we believe." },
  { href: "/approach", label: "Our approach", detail: "How an engagement runs, step by step." },
  { href: "/#updates", label: "Updates", detail: "Follow what we are building." },
];

export const footerNav: NavLink[] = [
  { href: "/services", label: "Solutions" },
  { href: "/work", label: "Work" },
  { href: "/approach", label: "Approach" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
