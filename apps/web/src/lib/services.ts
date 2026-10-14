export type SpecimenVariant = "saas" | "commerce" | "integration" | "site" | "agency";

export type Service = {
  slug: string;
  index: string;
  title: string;
  short: string;
  summary: string;
  lede: string;
  audience: string;
  includes: string[];
  scoping: string;
  outcome: string;
  phases: { name: string; detail: string }[];
  stack: string[];
  specimen: SpecimenVariant;
};

// Slugs are kept stable so existing /services/* URLs continue to resolve.
export const services: Service[] = [
  {
    slug: "saas",
    index: "01",
    title: "Web apps & SaaS platforms",
    short: "Web apps",
    summary:
      "Dashboards, portals, and multi-tenant products with accounts, roles, billing, and the business workflows behind them.",
    lede: "Custom software for the work that does not fit an off-the-shelf tool: scoped tightly enough to launch, and structured so the second version does not require a rewrite.",
    audience:
      "Startups, SaaS businesses, and companies with non-standard requirements: a service they deliver by hand, or a workflow a set of customers is waiting on.",
    includes: [
      "React and Next.js front ends, dashboards, and customer portals",
      "Authentication, tenancy, roles, and a permission model",
      "API integrations and the business workflows behind them",
      "Billing integration and a path from trial to paid",
      "Staging, production, and a written operating guide",
    ],
    scoping:
      "Estimated after discovery, with deliverables, milestones, acceptance criteria, and exclusions written down before build.",
    outcome:
      "A product a customer can sign into, a team can demo, and a small team can support.",
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
          "Billing, roles, notifications, and the admin views you need the week after the first customer arrives.",
      },
    ],
    stack: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    specimen: "saas",
  },
  {
    slug: "mobile",
    index: "02",
    title: "Mobile apps",
    short: "Mobile apps",
    summary:
      "iOS and Android apps built with Flutter or React Native, connected to the accounts, data, and services behind them.",
    lede: "A mobile app customers can install, sign into, and rely on, built from one codebase for iOS and Android and supported after it reaches the stores.",
    audience:
      "Startups, SaaS businesses, and companies that need a mobile app for their customers, field teams, or an existing web product.",
    includes: [
      "Cross-platform iOS and Android apps in Flutter or React Native",
      "Authentication, push notifications, and offline-ready flows",
      "Integration with your existing APIs, backend, and data",
      "App Store and Google Play submission and release setup",
      "Maintenance and updates after launch",
    ],
    scoping:
      "Estimated after discovery, with deliverables, milestones, acceptance criteria, and exclusions written down before build.",
    outcome:
      "An app live in both stores, connected to the systems behind it, and a release process the team can repeat.",
    phases: [
      {
        name: "Scope",
        detail:
          "We decide which flows the first release needs on a phone, and which can wait for the next version.",
      },
      {
        name: "Build",
        detail:
          "Screens, navigation, and data are built in one codebase and tested on real iOS and Android devices.",
      },
      {
        name: "Release",
        detail:
          "Store listings, review, and release are handled, with a written process for every update after.",
      },
    ],
    stack: ["Flutter", "React Native", "TypeScript", "Node.js", "Firebase"],
    specimen: "saas",
  },
  {
    slug: "ecommerce",
    index: "03",
    title: "Commerce systems",
    short: "Commerce",
    summary:
      "Shopify, WooCommerce, and custom storefronts, with checkout logic, catalog structure, and the inventory and ERP integrations behind orders.",
    lede: "A store that can take a real order, explain the goods, and connect to the systems a team uses after the order exists.",
    audience:
      "DTC brands, retailers, and growing online stores, through to established retailers with complex catalogs, multi-market workflows, or ERP requirements.",
    includes: [
      "Shopify store setup, theme customization, and app integrations",
      "WooCommerce stores, payment and shipping setup, and custom plugins",
      "Tailored storefronts and custom checkout logic",
      "Inventory and ERP integrations and multi-market workflows",
      "Catalog setup, conversion improvements, and analytics",
    ],
    scoping:
      "Store setups are quoted as a clear fixed scope. Custom commerce is estimated after discovery.",
    outcome:
      "A store that can take payment, a catalog the team can extend, and a fulfillment path that is written down.",
    phases: [
      {
        name: "Catalog",
        detail:
          "We shape how products are named, grouped, and presented before we decorate a homepage.",
      },
      {
        name: "Purchase",
        detail:
          "The path from product to paid order is designed and tested, including the states customers hit when something is missing.",
      },
      {
        name: "Operations",
        detail:
          "Shipping, payments, notifications, and the integrations your team relies on after the order exists.",
      },
    ],
    stack: ["Shopify", "WooCommerce", "Next.js", "Payments", "ERP integrations"],
    specimen: "commerce",
  },
  {
    slug: "integrations",
    index: "04",
    title: "Backend, data & AI integrations",
    short: "Integrations",
    summary:
      "APIs, data models, and automation, from Node.js and Python services to AI features that remove manual work.",
    lede: "The layer most businesses never see and always depend on: the services, data, and integrations that move information between systems without someone copying it by hand.",
    audience:
      "Technology startups, agencies, and businesses automating manual work or connecting tools that were never designed to talk to each other.",
    includes: [
      "Node.js and Express, or Python and FastAPI services",
      "API design and third-party API integration",
      "Data models in MongoDB or PostgreSQL",
      "AI features and automation of manual workflows",
      "Webhooks, background jobs, and documentation",
    ],
    scoping:
      "Estimated after discovery, once the systems, data, and acceptance criteria are understood.",
    outcome:
      "Systems that exchange data reliably, and fewer hours spent moving information between tools.",
    phases: [
      {
        name: "Map",
        detail:
          "We map which systems hold which data, where it is copied by hand, and what has to stay true when it moves.",
      },
      {
        name: "Connect",
        detail:
          "Services, APIs, and data models are built with validation and error handling, not just the happy path.",
      },
      {
        name: "Automate",
        detail:
          "Automation and AI features are added where they remove real effort, then documented for your team.",
      },
    ],
    stack: ["Node.js", "Express", "Python", "FastAPI", "MongoDB", "AI APIs"],
    specimen: "integration",
  },
  {
    slug: "websites",
    index: "05",
    title: "Business websites",
    short: "Websites",
    summary:
      "Business websites, landing pages, and redesigns with a content model, a design system, and the performance a buyer expects.",
    lede: "The public face of the company, built so the team can explain the offer, publish the next page, and send a serious buyer somewhere that holds up.",
    audience:
      "Service businesses, consultants, SMEs, and marketing teams launching, repositioning, or replacing a site that no longer matches the business.",
    includes: [
      "Narrative, information architecture, and page system",
      "Custom-designed WordPress or Next.js sites the team can edit",
      "Landing pages and redesigns of existing sites",
      "Performance fixes, metadata, and analytics on launch",
      "Ongoing maintenance after handover",
    ],
    scoping:
      "Quoted as a clear fixed scope for a responsive, professionally designed site.",
    outcome:
      "A site that can carry a sales conversation and the next six months of publishing.",
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
    stack: ["WordPress", "Next.js", "A CMS your team can edit", "Analytics"],
    specimen: "site",
  },
  {
    slug: "agency",
    index: "06",
    title: "White-label agency delivery",
    short: "Agency delivery",
    summary:
      "Implementation capacity for digital agencies, delivered under the agency's brand with agreed communication and delivery processes.",
    lede: "Dependable development capacity for agencies that sell digital projects and need them built well, on time, and without a new hire.",
    audience:
      "Web design and digital marketing agencies that need delivery support across React and Next.js, Node.js, Python, WordPress, and e-commerce builds.",
    includes: [
      "Development under your agency's brand",
      "Agreed communication channels and delivery process",
      "Websites, stores, and custom builds across the stack",
      "Written scope per project, with acceptance criteria",
      "Handover documentation for your team and your client",
    ],
    scoping:
      "Agreed per project or as ongoing capacity, with the process defined before the first build.",
    outcome:
      "More capacity to say yes to projects, without changing how your clients experience your agency.",
    phases: [
      {
        name: "Agree",
        detail:
          "We agree how work arrives, who talks to whom, and what done means before the first project starts.",
      },
      {
        name: "Deliver",
        detail:
          "Projects are built to the written scope, with progress your team can review at any point.",
      },
      {
        name: "Hand back",
        detail:
          "Work is handed back documented and ready for your agency to present as its own.",
      },
    ],
    stack: ["React", "Next.js", "Node.js", "Python", "WordPress", "Shopify"],
    specimen: "agency",
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
