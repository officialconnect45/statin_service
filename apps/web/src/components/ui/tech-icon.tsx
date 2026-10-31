import {
  siExpress,
  siFastapi,
  siFlutter,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siShopify,
  siTypescript,
  siWoocommerce,
  siWordpress,
  type SimpleIcon,
} from "simple-icons";

/** Official brand marks (Simple Icons, CC0), keyed by the names used in `stack`. */
const icons: Record<string, SimpleIcon> = {
  React: siReact,
  "React Native": siReact,
  "Next.js": siNextdotjs,
  TypeScript: siTypescript,
  Flutter: siFlutter,
  "Node.js": siNodedotjs,
  Express: siExpress,
  Python: siPython,
  FastAPI: siFastapi,
  MongoDB: siMongodb,
  PostgreSQL: siPostgresql,
  Shopify: siShopify,
  WooCommerce: siWoocommerce,
  WordPress: siWordpress,
};

/** A technology's logo in its brand colour; falls back to a monogram. */
export function TechIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const icon = icons[name];
  if (!icon) {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex items-center justify-center rounded-md bg-cobalt/10 text-[10px] font-bold text-cobalt ${className}`}
      >
        {name.slice(0, 2)}
      </span>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill={`#${icon.hex}`}>
      <path d={icon.path} />
    </svg>
  );
}
