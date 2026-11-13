import { ImageResponse } from "next/og";

export const alt = "La Grillade de Malpa — Grillade halal à Malpassé, Marseille 13013";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #0c0a08 0%, #1a1511 65%, #31271f 100%)",
          color: "#f7efe4",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "24px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#ffb84d",
            fontWeight: 700,
          }}
        >
          100 % HALAL · MALPASSÉ · MARSEILLE 13013
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              fontSize: "82px",
              fontWeight: 900,
              lineHeight: 1.0,
              textTransform: "uppercase",
              color: "#f7efe4",
            }}
          >
            La Grillade de Malpa
          </div>
          <div
            style={{
              fontSize: "34px",
              color: "#c4b5a4",
              maxWidth: "960px",
            }}
          >
            Viandes grillées, sandwichs, assiettes, burgers &amp; tex-mex · Sur place, à emporter &amp; Uber Eats
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid #31271f",
            paddingTop: "24px",
            fontSize: "24px",
            color: "#ffb84d",
            fontWeight: 700,
          }}
        >
          <div>1 Avenue de Valdonne, 13013 Marseille</div>
          <div>Tous les jours · 11h00 – 01h00 · 09 84 37 95 25</div>
        </div>
      </div>
    ),
    { ...size },
  );
}

