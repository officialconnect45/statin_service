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

export const markets = [
  "Sweden",
  "Denmark",
  "Norway",
  "Estonia",
  "Latvia",
  "Lithuania",
] as const;

/* ------------------------------------------------------------------ */
/* Hero signal path                                                    */
/* ------------------------------------------------------------------ */

export const signalPath = [
  {
    id: "request",
    label: "Request",
    tag: "URL · API call",
    detail:
      "A visitor opens a page, a customer checks out, or a partner system calls an API. Every system starts with a request.",
  },
  {
    id: "edge",
    label: "Edge",
    tag: "Cache · TLS · Headers",
    detail:
      "Hosting, caching, and security headers configured so pages load quickly and traffic arrives over a secure connection.",
  },
  {
    id: "interface",
    label: "Interface",
    tag: "Next.js · Shopify · WordPress",
    detail:
      "Storefronts, dashboards, portals, and sites built on the platform that fits the business, not the one we prefer.",
  },
  {
    id: "services",
    label: "Services",
    tag: "Node.js · FastAPI",
    detail:
      "Business logic, APIs, and webhooks: where checkout rules, permissions, and integrations live.",
  },
  {
    id: "data",
    label: "Data",
    tag: "MongoDB · PostgreSQL · ERP",
    detail:
      "Catalog, inventory, customers, and orders connected in one model instead of scattered across tools.",
  },
  {
    id: "intelligence",
    label: "Intelligence",
    tag: "AI · Automation",
    detail:
      "AI features and automation applied where they remove manual work, not as decoration.",
  },
  {
    id: "insight",
    label: "Insight",
    tag: "Analytics",
    detail:
      "Analytics on the pages and flows that matter, so the next decision is based on what actually happened.",
  },
] as const;

export const sampleRequests = [
  "GET  /checkout",
  "POST /api/orders",
  "GET  /products/linen-shirt",
  "POST /webhooks/inventory",
  "GET  /dashboard/accounts",
] as const;

/* ------------------------------------------------------------------ */
/* Problem → approach story                                            */
/* ------------------------------------------------------------------ */

export const problemSteps = [
  {
    phase: "The problem",
    title: "Businesses outgrow their software quietly.",
    detail:
      "A site that loads slowly. A store theme that cannot carry the catalog. Orders, stock, and customers split between a storefront, an ERP, and a spreadsheet.",
  },
  {
    phase: "Complexity builds",
    title: "Every workaround adds another system.",
    detail:
      "Plugins on plugins, manual exports, and integrations nobody owns. Each fix makes the next change slower and riskier.",
  },
  {
    phase: "The Statin approach",
    title: "We start with the problem, not the tool list.",
    detail:
      "Discovery maps what the business actually does. Then we choose the architecture and the stack that fit, and write down what will be delivered.",
  },
  {
    phase: "Structured data",
    title: "Data gets one shape and one path.",
    detail:
      "Catalog, inventory, customers, and orders connected through APIs and a data model the team can reason about.",
  },
  {
    phase: "Intelligence",
    title: "Manual work becomes automation.",
    detail:
      "Automation and AI features where they remove real effort: the exports, the copy-paste, the checks someone does every morning.",
  },
  {
    phase: "Security",
    title: "Access is designed, not bolted on.",
    detail:
      "Authentication, roles and permissions, validated inputs, and payments handled through the right providers from the first release.",
  },
  {
    phase: "Outcome",
    title: "One system the team can run and measure.",
    detail:
      "Analytics on the flows that matter, documentation, and a handover your team can operate without us in the room.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* How we work                                                         */
/* ------------------------------------------------------------------ */

export const processSteps = [
  {
    index: "01",
    name: "Discover",
    detail:
      "A working session on the business problem, the users, and the constraints. We review your current site, store, or system before suggesting anything.",
    output: "A shared understanding of the problem",
  },
  {
    index: "02",
    name: "Define",
    detail:
      "A written scope: deliverables, milestones, acceptance criteria, and exclusions. You see the plan and the lead before anyone designs a screen.",
    output: "Scope, milestones, acceptance criteria",
  },
  {
    index: "03",
    name: "Design",
    detail:
      "Information architecture, the key flows, and an interface direction you can react to with specifics, not adjectives.",
    output: "Flows, structure, interface",
  },
  {
    index: "04",
    name: "Build",
    detail:
      "One lead and working software demoed every week. Scope changes are written down before they enter the work.",
    output: "Weekly working software",
  },
  {
    index: "05",
    name: "Launch",
    detail:
      "Access, analytics, documentation, and handover, so launch is not the last conversation and your team can operate what shipped.",
    output: "Live system and handover",
  },
  {
    index: "06",
    name: "Support",
    detail:
      "Maintenance and ongoing development support as the product, the store, or the business grows.",
    output: "A team without a new hire",
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
    detail:
      "The person who scopes the work is still in it when it ships. You always know who is accountable.",
  },
  {
    title: "Working software every week",
    detail:
      "A weekly demo of real software, not a slide about software. You see the work while it can still change.",
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
/* Architecture                                                        */
/* ------------------------------------------------------------------ */

export type Layer = {
  id: string;
  code: string;
  name: string;
  role: string;
  detail: string;
  stack: string[];
};

export const layers: Layer[] = [
  {
    id: "edge",
    code: "L1",
    name: "Edge",
    role: "Delivery & caching",
    detail:
      "Hosting, caching, TLS, security headers, and image and asset optimization. Where most performance fixes start.",
    stack: ["CDN", "Caching", "TLS", "Headers"],
  },
  {
    id: "interface",
    code: "L2",
    name: "Interface",
    role: "Sites, stores & apps",
    detail:
      "The surface customers and teams use: business websites, storefronts, dashboards, and portals.",
    stack: ["React", "Next.js", "WordPress", "Shopify"],
  },
  {
    id: "services",
    code: "L3",
    name: "Services",
    role: "Logic & APIs",
    detail:
      "Business rules, APIs, webhooks, and background jobs that keep the rest of the system honest.",
    stack: ["Node.js", "Express", "Python", "FastAPI"],
  },
  {
    id: "data",
    code: "L4",
    name: "Data",
    role: "One source of truth",
    detail:
      "Catalog, inventory, customers, and orders, in a data model connected to the ERP and tools the business already runs.",
    stack: ["MongoDB", "PostgreSQL", "ERP sync"],
  },
  {
    id: "intelligence",
    code: "L5",
    name: "Intelligence",
    role: "AI & automation",
    detail:
      "AI features and automated workflows that take repetitive work off the team.",
    stack: ["AI APIs", "Automation", "Workflows"],
  },
];

export const rails = {
  security: {
    id: "security",
    name: "Security",
    role: "Across every layer",
    detail:
      "Authentication, roles and permissions, validated inputs, and payments handled through established providers. Designed in, not bolted on.",
    stack: ["Auth", "Roles", "Validation", "Payment providers"],
  },
  measurement: {
    id: "measurement",
    name: "Measurement",
    role: "Across every layer",
    detail:
      "Analytics wired on launch for the pages and flows that matter, so performance and conversion are visible, not guessed.",
    stack: ["Analytics", "Events", "Metadata"],
  },
} as const;

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
    detail:
      "Scope, changes, and open questions live in a record you can read. Memory is not the project plan.",
  },
  {
    index: "03",
    title: "Software a team can operate",
    detail:
      "If the team cannot edit the site, support a customer, or see an order, the launch is incomplete.",
  },
  {
    index: "04",
    title: "Restraint",
    detail:
      "We ship the smaller thing that can meet a customer. Range is added once the first release has been used.",
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
    a: "React and Next.js, Node.js and Express, Python and FastAPI, MongoDB and PostgreSQL, WordPress, Shopify, and WooCommerce, plus AI APIs for automation. The stack follows the problem, not the other way round.",
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
