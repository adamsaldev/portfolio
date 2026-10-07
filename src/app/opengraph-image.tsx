import { ImageResponse } from "next/og";
import { personal, seo } from "@/data/portfolio";

// Typographic share card generated at build time — no photos or logos.
// TODO(PORTFOLIO): Optionally replace with a designed /src/app/opengraph-image.png
export const alt = seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#f7f7f5",
          color: "#111111",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, color: "#6b6b68", letterSpacing: 2 }}>
          SOFTWARE ENGINEER
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 128, fontWeight: 600, letterSpacing: -6, lineHeight: 1 }}>
            {personal.name}
          </div>
          <div style={{ marginTop: 32, fontSize: 34, color: "#555553", maxWidth: 900, lineHeight: 1.35 }}>
            {personal.affiliation}
          </div>
        </div>
        <div style={{ display: "flex", width: 64, height: 6, background: "#fa4616" }} />
      </div>
    ),
    size,
  );
}
