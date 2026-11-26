import { ImageResponse } from "next/og";
import { archivoFonts } from "@/lib/og-font";
import { PROFILE } from "@/lib/data";

export const size = { width: 1584, height: 396 };

const STATS = [
  { value: "0 of 200", label: "changes the customer never agreed to" },
  { value: "16,994", label: "Shortfall runs, all public" },
  { value: "3,120", label: "Oversold test runs, rechecked in CI" },
];

const AVAILABILITY = "Open to full-time Software and AI Engineer roles from May 2027";
const SITE = PROFILE.domain;

export async function GET() {
  const fonts = await archivoFonts([
    { text: STATS.map((stat) => stat.value).join(""), weight: 800, stretch: 116 },
    { text: `${STATS.map((stat) => stat.label).join("")}${AVAILABILITY}${SITE}`, weight: 500, stretch: 100 },
  ]);
  const family = (stretch: number) => (fonts.some((font) => font.name === `Archivo${stretch}`) ? `Archivo${stretch}` : "sans-serif");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#e9f2fb",
          backgroundImage:
            "linear-gradient(180deg, #dcecfb 0%, #e9f2fb 45%, #f4f9ff 100%), radial-gradient(circle at 10% 20%, rgba(56,150,235,0.30), transparent 50%), radial-gradient(circle at 88% 0%, rgba(255,255,255,0.95), transparent 45%), radial-gradient(circle at 62% 120%, rgba(103,200,240,0.28), transparent 55%)",
          color: "#14304a",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 560 }}>
          <div style={{ display: "flex", gap: 20 }}>
            {STATS.map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: 290,
                  padding: "22px 26px",
                  borderRadius: 22,
                  border: "1px solid rgba(15,23,42,0.10)",
                  background: "rgba(255,255,255,0.6)",
                  boxShadow: "0 14px 40px rgba(30,80,150,0.12)",
                }}
              >
                <div style={{ display: "flex", fontFamily: family(116), fontSize: 46, fontWeight: 800, color: "#14304a" }}>
                  {stat.value}
                </div>
                <div style={{ display: "flex", marginTop: 6, fontFamily: family(100), fontSize: 19, fontWeight: 500, color: "#29445f" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28 }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: "#10b981" }} />
            <div style={{ display: "flex", fontFamily: family(100), fontSize: 22, fontWeight: 500, color: "#047857" }}>
              {AVAILABILITY}
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 10, fontFamily: family(100), fontSize: 22, fontWeight: 500, color: "#0369a1" }}>
            {SITE}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
