export const site = {
  name: "Statin",
  url: "https://statin.com",
  email: "hello@statin.com",
  description:
    "Statin is a product studio for startup founders. We design and engineer websites, SaaS platforms, and ecommerce stores that a small team can run.",
  year: 2026,
} as const;

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/approach", label: "Approach" },
  { href: "/about", label: "About" },
] as const;

export type Service = {
  slug: string;
  index: string;
  title: string;
  short: string;
  summary: string;
  lede: string;
  audience: string;
  includes: string[];
  timeline: string;
  outcome: string;
  phases: { name: string; detail: string }[];
  stack: string[];
};

export const services: Service[] = [
  {
    slug: "websites",
    index: "01",
    title: "Website systems",
    short: "Websites",
    summary:
      "Marketing and product sites with a content model, a design system, and the speed a buyer expects.",
    lede: "The public face of the company, built so a founder can explain the offer, publish the next page, and send a serious buyer somewhere that holds up.",
    audience:
      "Founders launching a company, repositioning an offer, or replacing a site that no longer matches the product.",
    includes: [
      "Narrative, information architecture, and page system",
      "Interface design and a small, durable design system",
      "Marketing site on a CMS the team can edit",
      "Performance, metadata, and analytics wired on launch",
      "Handoff notes and a first month of stewardship",
    ],
    timeline: "Typically four to eight weeks for a focused company site.",
    outcome:
      "A site that can carry a sales conversation, an investor read, and the next six months of publishing.",
    phases: [
      {
        name: "Narrative",
        detail:
          "We write the structure of the offer: who it is for, what changes for them, and which pages have to exist on day one.",
      },
      {
        name: "System",
        detail:
          "Typography, layout, and components are designed once and reused, so the fifth page looks as considered as the first.",
      },
      {
        name: "Production",
        detail:
          "The site is engineered, measured, and handed over with access, redirects, and a short guide for editing.",
      },
    ],
    stack: ["Next.js", "A CMS your team can edit", "Analytics", "Design system"],
  },
  {
    slug: "saas",
    index: "02",
    title: "SaaS development",
    short: "SaaS",
    summary:
      "Multi-tenant products with accounts, billing, permissions, and a surface you can put in front of a customer.",
    lede: "The first version of the product, scoped tightly enough to launch and structured so the second version does not require a rewrite.",
    audience:
      "Founders with a specific workflow to productize: a service they already deliver, or software a small set of customers is waiting on.",
    includes: [
      "Product framing, roles, and the first release boundary",
      "Core flows for signup, daily use, and admin",
      "Authentication, tenancy, and permission model",
      "Billing integration and a path from trial to paid",
      "Staging, production, and a written operating guide",
    ],
    timeline: "Typically eight to sixteen weeks for a first paid release.",
    outcome:
      "A product a customer can sign into, a founder can demo, and a small team can support.",
    phases: [
      {
        name: "Boundary",
        detail:
          "We decide what the first release refuses to do. That boundary is what makes the date real.",
      },
      {
        name: "Product",
        detail:
          "Interface and engineering move together: the flows, the data model, and the empty states a new customer actually sees.",
      },
      {
        name: "Operate",
        detail:
          "Billing, roles, email, and the admin views you need the week after the first customer arrives.",
      },
    ],
    stack: ["Next.js", "TypeScript", "Auth and billing", "Postgres"],
  },
  {
    slug: "ecommerce",
    index: "03",
    title: "Ecommerce",
    short: "Ecommerce",
    summary:
      "Stores with a catalog, checkout, and the operations behind orders a small team has to fulfill.",
    lede: "A store that can take a real order, explain the goods, and leave the founder with a back office instead of a pile of spreadsheets.",
    audience:
      "Product brands and retail founders opening a first store, or outgrowing a theme that cannot carry subscriptions, wholesale, or a real catalog.",
    includes: [
      "Catalog structure, product storytelling, and merchandising",
      "Storefront design matched to the brand, not a stock theme",
      "Checkout, tax, shipping, and payment setup",
      "Order operations the team can run on a weekday morning",
      "Measurement for traffic, product views, and purchased orders",
    ],
    timeline: "Typically six to twelve weeks for a launch-ready store.",
    outcome:
      "A store that can take payment, a catalog the team can extend, and a fulfillment path that is written down.",
    phases: [
      {
        name: "Catalog",
        detail:
          "We shape how goods are named, grouped, and photographed in the interface before we decorate a homepage.",
      },
      {
        name: "Purchase",
        detail:
          "The path from product to paid order is designed and tested, including the states customers hit when something is missing.",
      },
      {
        name: "Operations",
        detail:
          "Shipping, notifications, and the views your team uses after the order exists.",
      },
    ],
    stack: ["Headless storefront", "Commerce platform", "Payments", "Analytics"],
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

export const standards = [
  { label: "Fixed scope", detail: "A written boundary before build begins." },
  { label: "Named lead", detail: "One person accountable for the engagement." },
  { label: "Weekly demo", detail: "Working software, not a slide about software." },
  { label: "Founder in the room", detail: "Decisions stay with the person who owns the company." },
] as const;

export const fit = {
  yes: [
    "You are a founder, or a very small team, and you will stay close to the work.",
    "The offer is specific: a service, a product, or goods you can describe without a diagram.",
    "You want design and engineering on the same schedule.",
    "You are preparing for customers, a launch, or a first serious buyer.",
  ],
  no: [
    "You need a bench of twenty engineers placed into an existing org chart.",
    "The brief is still an app for everyone, in every industry.",
    "You want a theme with a logo on it and nothing else changed.",
  ],
} as const;

export const method = [
  {
    index: "01",
    name: "Brief",
    time: "Week 0",
    detail:
      "A working session and a written scope. You see the plan, the boundary, and the team before anyone designs a screen.",
  },
  {
    index: "02",
    name: "Shape",
    time: "Weeks 1–2",
    detail:
      "Information architecture, the key flows, and a visual direction you can react to with specifics.",
  },
  {
    index: "03",
    name: "Build",
    time: "Weekly",
    detail:
      "One environment, one lead, a demo every week. Scope changes are written down before they enter the work.",
  },
  {
    index: "04",
    name: "Launch",
    time: "Handoff",
    detail:
      "Access, measurement, documentation, and the first month of stewardship so launch is not the last conversation.",
  },
] as const;

export const engagements = [
  {
    name: "Foundation",
    fit: "A company site or a focused storefront.",
    detail:
      "Fixed scope, a single lead, and a date you can put on a calendar. Built for founders who need the public company to catch up with the real one.",
    points: ["One primary surface", "Design and engineering", "Launch and handoff"],
  },
  {
    name: "Product",
    fit: "A SaaS or a commerce platform.",
    detail:
      "Phased so the first release can take a real user. Accounts, payments, and the admin views are part of the release, not a sequel.",
    points: ["Release boundary", "Core product flows", "Billing and roles"],
    featured: true,
  },
  {
    name: "Partnership",
    fit: "After the first launch.",
    detail:
      "A monthly cadence for improvements, measurement, and the next release. You keep a team without hiring one before the company is ready.",
    points: ["Monthly priorities", "The same lead", "A roadmap you can read"],
  },
] as const;

export const patterns = [
  {
    index: "01",
    eyebrow: "Website system",
    title: "The company, explained once.",
    situation:
      "The founder can describe the offer in a room. The site still reads like a placeholder, or like a company from three versions ago.",
    build: [
      "A narrative that starts with the buyer’s problem, not the company’s chronology",
      "A page system for product, proof, pricing or engagement, and a clear next step",
      "A CMS and a design system so the next announcement does not require a project",
    ],
    receives: [
      "The live site and the source",
      "Editor access and a short publishing guide",
      "Analytics on the pages that matter",
    ],
    shape: "Four to eight weeks",
    specimen: "site" as const,
  },
  {
    index: "02",
    eyebrow: "SaaS platform",
    title: "The first version customers can pay for.",
    situation:
      "There is a workflow the founder already performs by hand, in inboxes and spreadsheets. A small set of buyers will use it if it exists.",
    build: [
      "Signup, the daily job-to-be-done, and an admin that is not an afterthought",
      "Tenancy, roles, and a billing path from trial to paid",
      "Empty states, errors, and the emails a new account actually receives",
    ],
    receives: [
      "Staging and production",
      "A written model of roles and billing",
      "Enough documentation to support the first customers",
    ],
    shape: "Eight to sixteen weeks",
    specimen: "saas" as const,
  },
  {
    index: "03",
    eyebrow: "Ecommerce",
    title: "A store that can take the order.",
    situation:
      "The goods are real. The brand is forming. The current store is a theme that cannot carry the catalog, the checkout, or the morning after an order.",
    build: [
      "Catalog structure and product pages that sell the object, not a grid of boxes",
      "Checkout, shipping, tax, and payment set up for how you actually fulfill",
      "The operational views for orders, inventory signals, and customer mail",
    ],
    receives: [
      "A storefront the team can merchandize",
      "Payment and shipping configuration",
      "A launch checklist and measurement",
    ],
    shape: "Six to twelve weeks",
    specimen: "commerce" as const,
  },
] as const;

export const principles = [
  {
    index: "01",
    title: "One team through production",
    detail:
      "Strategy, interface, and engineering stay in the same engagement. Work is not thrown over a wall and reassembled later.",
  },
  {
    index: "02",
    title: "Decisions in writing",
    detail:
      "Scope, changes, and open questions live in a record you can read. Memory is not the project plan.",
  },
  {
    index: "03",
    title: "Software a founder can operate",
    detail:
      "If the team cannot edit the site, support a customer, or see an order, the launch is incomplete.",
  },
  {
    index: "04",
    title: "Restraint",
    detail:
      "We ship the smaller thing that can meet a customer. Range is added when the first release has been used.",
  },
] as const;

export const inquiryOptions = {
  practices: [
    { value: "websites", label: "Website" },
    { value: "saas", label: "SaaS product" },
    { value: "ecommerce", label: "Ecommerce store" },
    { value: "unsure", label: "Not sure yet" },
  ],
  stages: [
    { value: "forming", label: "Still forming the offer" },
    { value: "building", label: "Building, nothing public yet" },
    { value: "live", label: "Something is already live" },
    { value: "replacing", label: "Replacing what we have" },
  ],
  timelines: [
    { value: "exploring", label: "Exploring" },
    { value: "month", label: "This month" },
    { value: "quarter", label: "This quarter" },
    { value: "later", label: "Later this year" },
  ],
} as const;
