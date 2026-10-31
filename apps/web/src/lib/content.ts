import type { SpecimenVariant } from "@/lib/services";

/* ------------------------------------------------------------------ */
/* Who Statin builds for                                               */
/* ------------------------------------------------------------------ */

export const audiences = [
  {
    title: "Startups & SaaS teams",
    detail: "Custom web apps, integrations, and development support for technology-oriented companies.",
  },
  {
    title: "E-commerce brands & retailers",
    detail: "Shopify, WooCommerce, and custom stores, from first launch to complex catalogs.",
  },
  {
    title: "Digital agencies",
    detail: "White-label delivery capacity under the agency's brand.",
  },
  {
    title: "Growing businesses",
    detail: "Websites, redesigns, maintenance, and automation of manual work.",
  },
] as const;

export const stack = [
  "React",
  "Next.js",
  "TypeScript",
  "Flutter",
  "React Native",
  "Node.js",
  "Express",
  "Python",
  "FastAPI",
  "MongoDB",
  "PostgreSQL",
  "Shopify",
  "WooCommerce",
  "WordPress",
] as const;

export const markets = ["Sweden", "Denmark", "Norway", "Estonia", "Latvia", "Lithuania"] as const;

/* ------------------------------------------------------------------ */
/* Problem → approach story                                            */
/* ------------------------------------------------------------------ */

export const problemSteps = [
  {
    phase: "The problem",
    title: "Your business grew. Your software didn't.",
    detail:
      "A slow website, a store that can't keep up, and orders, stock, and customers spread across tools and spreadsheets. Every quick fix adds another tool.",
  },
  {
    phase: "Our approach",
    title: "We connect everything into one system.",
    detail:
      "We learn how your business really works, then connect products, stock, customers, and orders, so everyone works from the same numbers.",
  },
  {
    phase: "Automated and secure",
    title: "Repetitive work runs itself, safely.",
    detail:
      "We automate the daily copy-paste and checks, add AI where it really saves time, and build in secure logins and payments from day one.",
  },
  {
    phase: "The result",
    title: "One system that works, and numbers you can trust.",
    detail: "A fast, reliable system your team can run on its own, with clear reports on what is working.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* How we work                                                         */
/* ------------------------------------------------------------------ */

export const processSteps = [
  {
    index: "01",
    name: "Discover",
    detail: "We learn your business, your customers, and your goals, and review what you have today.",
    output: "A clear picture of the problem",
  },
  {
    index: "02",
    name: "Strategy",
    detail: "We agree the strategy and a written plan with you: what we will build, the milestones, and the timeline.",
    output: "Strategy, plan, and timeline",
  },
  {
    index: "03",
    name: "Design",
    detail: "We design the key screens and customer journeys, so you can see and approve them before we build.",
    output: "Designs you have approved",
  },
  {
    index: "04",
    name: "Build",
    detail: "One dedicated lead and a demo of working software every week, so you always know where things stand.",
    output: "Progress you can see weekly",
  },
  {
    index: "05",
    name: "Launch",
    detail: "We go live, set up analytics, and hand over everything your team needs to run it.",
    output: "Live, measured, handed over",
  },
  {
    index: "06",
    name: "Support",
    detail: "We stay with you for updates, fixes, and new features as your business grows.",
    output: "A team on call as you grow",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Build patterns (shown in place of client case studies)              */
/* ------------------------------------------------------------------ */

export type Pattern = {
  slug: string;
  index: string;
  eyebrow: string;
  title: string;
  fit: string;
  situation: string;
  build: string[];
  receives: string[];
  stack: string[];
  service: string;
  specimen: SpecimenVariant;
};

export const patterns: Pattern[] = [
  {
    slug: "saas-platform",
    index: "01",
    eyebrow: "SaaS platform",
    title: "The first version customers can pay for.",
    fit: "Startups · SaaS teams",
    situation:
      "There is a workflow the founder already performs by hand, in inboxes and spreadsheets. A small set of buyers will use it if it exists.",
    build: [
      "Signup, the daily job to be done, and an admin that is not an afterthought",
      "Tenancy, roles, and a billing path from trial to paid",
      "Empty states, errors, and the emails a new account actually receives",
    ],
    receives: [
      "Staging and production environments",
      "A written model of roles and billing",
      "Documentation to support the first customers",
    ],
    stack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    service: "saas",
    specimen: "saas",
  },
  {
    slug: "commerce-system",
    index: "02",
    eyebrow: "Commerce system",
    title: "A store that can take the order, and the morning after.",
    fit: "DTC brands · Retailers",
    situation:
      "The products are real and the brand is forming. The current store is a theme that cannot carry the catalog, the checkout, or the stock that lives in another system.",
    build: [
      "Catalog structure and product pages that sell the product, not a grid of boxes",
      "Checkout, shipping, tax, and payments set up for how you actually fulfill",
      "Inventory and ERP integration so stock and orders stay in sync",
    ],
    receives: [
      "A storefront the team can merchandise",
      "Payment and shipping configuration",
      "A launch checklist and analytics",
    ],
    stack: ["Shopify", "WooCommerce", "Next.js", "ERP integration"],
    service: "ecommerce",
    specimen: "commerce",
  },
  {
    slug: "integration-layer",
    index: "03",
    eyebrow: "Integration & automation",
    title: "The systems talk. The copy-paste stops.",
    fit: "Growing businesses · Technology startups",
    situation:
      "Orders arrive in one tool, customers live in another, and someone spends every morning moving data between them, carefully, by hand.",
    build: [
      "Services and APIs that connect the tools the business already uses",
      "A data model that gives each record one source of truth",
      "Automation and AI features for the repetitive steps",
    ],
    receives: [
      "Documented APIs and webhooks",
      "Validation and error handling for every integration",
      "A written map of where each piece of data lives",
    ],
    stack: ["Node.js", "Python", "FastAPI", "MongoDB", "AI APIs"],
    service: "integrations",
    specimen: "integration",
  },
  {
    slug: "website-system",
    index: "04",
    eyebrow: "Website system",
    title: "The company, explained once.",
    fit: "Service businesses · SMEs",
    situation:
      "The team can describe the offer in a room. The site still reads like a placeholder, loads slowly, or describes the company from three versions ago.",
    build: [
      "A narrative that starts with the buyer's problem, not the company's history",
      "A page system for services, proof, and a clear next step",
      "A CMS and design system so the next page does not require a project",
    ],
    receives: [
      "The live site and its source",
      "Editor access and a short publishing guide",
      "Analytics on the pages that matter",
    ],
    stack: ["WordPress", "Next.js", "CMS", "Analytics"],
    service: "websites",
    specimen: "site",
  },
  {
    slug: "agency-delivery",
    index: "05",
    eyebrow: "Agency delivery",
    title: "Capacity under your brand.",
    fit: "Web design & digital marketing agencies",
    situation:
      "The agency sells more digital projects than its team can build. Hiring is slow, and freelancers come and go mid-project.",
    build: [
      "Websites, stores, and custom builds delivered to the agency's scope",
      "A communication and delivery process agreed up front",
      "Work your team can review at any point in the build",
    ],
    receives: [
      "Projects delivered under your brand",
      "Documentation for your team and your client",
      "A dependable partner for the next project",
    ],
    stack: ["React", "Next.js", "WordPress", "Shopify", "Node.js"],
    service: "agency",
    specimen: "agency",
  },
];

/* ------------------------------------------------------------------ */
/* Why Statin                                                          */
/* ------------------------------------------------------------------ */

/** All working rules; the site shows `keyDifferentiators`. */
export const differentiators = [
  {
    title: "Problem first, stack second",
    detail:
      "We lead with what has to change for the business. The technology follows the problem, so we never force a platform that makes the company harder to run.",
  },
  {
    title: "Scope you can read",
    detail:
      "Deliverables, milestones, acceptance criteria, and exclusions are written down before build begins. If it is not written, it is not in the build.",
  },
  {
    title: "One lead, start to finish",
    detail: "The person who scopes the work is still in it when it ships. You always know who is accountable.",
  },
  {
    title: "Working software every week",
    detail: "A weekly demo of real software, not a slide about software. You see the work while it can still change.",
  },
  {
    title: "Full stack, including AI",
    detail:
      "Front ends, commerce, backends, data, and AI integrations in one team, so work is not thrown over a wall and reassembled later.",
  },
  {
    title: "Only what we have checked",
    detail:
      "We do not claim to have audited a site or found a problem unless we actually have. Recommendations come with the reasoning behind them.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* About / story                                                       */
/* ------------------------------------------------------------------ */

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
    detail: "Scope, changes, and open questions live in a record you can read. Memory is not the project plan.",
  },
  {
    index: "03",
    title: "Software a team can operate",
    detail: "If the team cannot edit the site, support a customer, or see an order, the launch is incomplete.",
  },
  {
    index: "04",
    title: "Restraint",
    detail: "We ship the smaller thing that can meet a customer. Range is added once the first release has been used.",
  },
] as const;

export const story = [
  {
    label: "Why Statin exists",
    detail:
      "Businesses depend on their website, their store, and their internal tools, yet those systems are often assembled from plugins, handoffs, and guesswork. Statin exists to engineer them properly: scoped in writing, built by the people you talk to, and handed over in a state your team can run.",
  },
  {
    label: "What we are building",
    detail:
      "A focused engineering company that can take a business from a clearly stated problem to a working system, across web apps, commerce, integrations, and AI.",
  },
  {
    label: "Where we are going",
    detail:
      "We are focused on startups, commerce teams, and digital agencies, starting with Scandinavia and the Baltics, and on relationships that continue well after launch.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export const faqs = [
  {
    q: "What does Statin build?",
    a: "Custom web apps and SaaS platforms, commerce systems on Shopify, WooCommerce, or custom storefronts, backend, data, and AI integrations, and business websites. We also deliver white-label development for digital agencies.",
  },
  {
    q: "How is a project priced?",
    a: "Websites and store setups can usually be quoted as a clear fixed scope. Custom development is estimated after discovery, once deliverables, milestones, acceptance criteria, and exclusions are defined. Every proposal confirms scope, integrations, content, and support before it is sent.",
  },
  {
    q: "Do you work with agencies under their brand?",
    a: "Yes. We provide implementation capacity under the agency's brand, with communication and delivery processes agreed before the first project.",
  },
  {
    q: "Which technologies do you use?",
    a: "React and Next.js, Flutter and React Native, Node.js and Express, Python and FastAPI, MongoDB and PostgreSQL, WordPress, Shopify, and WooCommerce, plus AI APIs for automation. The stack follows the problem, not the other way round.",
  },
  {
    q: "Where do you work?",
    a: "Engagements are remote. We are focused on teams in Sweden, Denmark, Norway, Estonia, Latvia, and Lithuania, and we work with teams elsewhere when the fit is right.",
  },
  {
    q: "What happens after launch?",
    a: "You receive access, analytics, and documentation for what shipped. Maintenance and ongoing development support are available if you want the same team to keep going.",
  },
] as const;

/** The four working rules shown on the site, in buyer order. */
export const keyDifferentiators = [
  "One lead, start to finish",
  "Working software every week",
  "Problem first, stack second",
  "Full stack, including AI",
].map((title) => {
  const item = differentiators.find((entry) => entry.title === title);
  if (!item) throw new Error(`Unknown differentiator: ${title}`);
  return item;
});
