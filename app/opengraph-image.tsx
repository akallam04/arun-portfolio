import { ImageResponse } from "next/og";
import { archivoFonts } from "@/lib/og-font";
import { PROFILE } from "@/lib/data";

export const alt = "Arun Kallam | Software and AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAME = "Arun Kallam";
const ROLE = "Software and AI Engineer";
const LEDE = "I build AI agents and test whether they really work.";
const SITE = PROFILE.domain;

export default async function OpenGraphImage() {
  const fonts = await archivoFonts([
    { text: NAME, weight: 800, stretch: 120 },
    { text: ROLE, weight: 700, stretch: 112 },
    { text: `${LEDE}${SITE}`, weight: 500, stretch: 100 },
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
          padding: "0 72px",
          backgroundColor: "#e9f2fb",
          backgroundImage:
            "linear-gradient(180deg, #dcecfb 0%, #e9f2fb 45%, #f4f9ff 100%), radial-gradient(circle at 12% 10%, rgba(56,150,235,0.30), transparent 55%), radial-gradient(circle at 92% 8%, rgba(255,255,255,0.95), transparent 50%), radial-gradient(circle at 60% 110%, rgba(103,200,240,0.28), transparent 55%)",
          color: "#14304a",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            padding: "64px 68px",
            borderRadius: 32,
            border: "1px solid rgba(15,23,42,0.10)",
            background: "rgba(255,255,255,0.55)",
            boxShadow: "0 24px 60px rgba(30,80,150,0.16)",
          }}
        >
          <div style={{ display: "flex", fontFamily: family(120), fontSize: 118, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>
            {NAME}
          </div>
          <div style={{ display: "flex", marginTop: 26, fontFamily: family(112), fontSize: 44, fontWeight: 700, color: "#14304a" }}>
            {ROLE}
          </div>
          <div style={{ display: "flex", marginTop: 18, fontFamily: family(100), fontSize: 34, fontWeight: 500, color: "#29445f" }}>
            {LEDE}
          </div>
          <div style={{ display: "flex", marginTop: 44, fontFamily: family(100), fontSize: 26, fontWeight: 500, color: "#0369a1" }}>
            {SITE}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
