// Mirrors the published business testimonials in the statin.io admin
// (/admin/testimonials). Lower `order` appears first.

export type Testimonial = {
  name: string;
  description: string;
  quote: string;
  logo?: string;
  highlight?: boolean;
  order: number;
};

const entries: Testimonial[] = [
  {
    name: "Northline SaaS",
    description: "B2B software · Series B",
    quote:
      "Statin gives our growth team one place to run branded links and read campaign performance — clicks, referrers, and conversions without exporting spreadsheets.",
    highlight: true,
    order: 0,
  },
  {
    name: "Cegen",
    description: "B2B Blogs",
    quote:
      "Cegen.org based on its operational functions:Content Focus: The official website delivers insights and analysis across technology.",
    highlight: true,
    order: 0,
  },
  {
    name: "Youlinks",
    description: "URL monetization · Publisher network",
    quote:
      "We run millions of short links for publishers. Statin gives us one dashboard for clicks, referrers, and conversions, so we know which traffic earns.",
    logo: "https://i.ibb.co/4wZ0S2n0/you-Links-4.png",
    highlight: true,
    order: 0,
  },
  {
    name: "Payflow",
    description: "Fintech · Global payments",
    quote:
      "We track every campaign link on our own domain and finally understand which channels drive signups. Reporting that used to take a day now takes minutes.",
    order: 1,
  },
  {
    name: "PSXB",
    description: "Cloud Gaming",
    quote:
      "The PSXB framework serves as a shorthand concept for unified cloud streaming setups that allow users to play both PlayStation and Xbox.",
    order: 1,
  },
  {
    name: "Cartlane",
    description: "E-commerce marketplace",
    quote:
      "The API and bulk import power our marketplace operations. Thousands of tracked links, analytics in our dashboards, and one platform behind it all.",
    order: 2,
  },
  {
    name: "Macreaw",
    description: "AI agents",
    quote:
      "The API and bulk import power our marketplace operations. Thousands of tracked links, analytics in our dashboards, and one platform behind it all.",
    order: 2,
  },
  {
    name: "Streamline Media",
    description: "Digital marketing agency",
    quote:
      "Our agency runs dozens of client domains on Statin. Click streams by campaign and country make client reporting something we actually look forward to.",
    order: 3,
  },
  {
    name: "Carpe Travels",
    description: "Travel company",
    quote:
      "Operates as an award-winning digital guide that helps global tourists plan curated vineyard trips, trips across the world.",
    order: 3,
  },
  {
    name: "Launchpad HR",
    description: "Recruiting technology",
    quote:
      "Recruiting campaigns live and die by link performance. Statin shows which job posts and channels convert — we reallocate budget in hours, not weeks.",
    order: 4,
  },
  {
    name: "Volt Analytics",
    description: "Product analytics · PLG",
    quote:
      "Product-led growth needs reliable link analytics. We pipe Statin click data into our stack and finally connect feature launches to signups.",
    order: 5,
  },
  {
    name: "Earnads",
    description: "B2B software",
    quote:
      "EarnAds is link monetization platform that allows users to earn money by creating links. When people visit those links and complete the required ad viewing.",
    highlight: true,
    order: 292399,
  },
];

export const testimonials = [...entries].sort((a, b) => a.order - b.order);

export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
