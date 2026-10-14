import { ImageResponse } from "next/og";

export const alt = "Statin: engineering for web apps, commerce, and AI integrations";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const layers = ["Request", "Edge", "Interface", "Services", "Data", "Intelligence", "Insight"];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#060914",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 11,
              background: "#2a4ff6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            ST
          </div>
          <div style={{ fontSize: 24, letterSpacing: 6, fontWeight: 600 }}>STATIN</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, lineHeight: 1, letterSpacing: -3, maxWidth: 900 }}>
            We engineer the systems your business runs on.
          </div>
          <div style={{ marginTop: 28, fontSize: 26, color: "#9ba4b9" }}>
            Web apps · Commerce systems · Backend, data & AI integrations
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {layers.map((layer, index) => (
            <div
              key={layer}
              style={{
                display: "flex",
                padding: "10px 18px",
                borderRadius: 999,
                fontSize: 18,
                border: "1px solid rgba(106,166,255,0.4)",
                background: index === layers.length - 1 ? "#6aa6ff" : "rgba(255,255,255,0.03)",
                color: index === layers.length - 1 ? "#060914" : "white",
              }}
            >
              {layer}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
