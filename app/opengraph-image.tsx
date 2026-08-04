import { ImageResponse } from "next/og";

export const alt = "Arun Teja Reddy Kallam | CS @ ASU · AI, Full-Stack & Data";
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
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#e9f2fb",
          backgroundImage:
            "radial-gradient(at 8% 8%, rgba(56,150,235,0.30), transparent 60%), radial-gradient(at 95% 5%, rgba(255,255,255,0.9), transparent 55%), radial-gradient(at 60% 110%, rgba(103,200,240,0.35), transparent 60%)",
          color: "#0f2a43",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#059669",
            }}
          />
          <div style={{ fontSize: 26, color: "#047857" }}>
            Open to Fall 2026 Co-ops · Tempe, AZ
          </div>
        </div>

        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.05,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Arun Teja Reddy</span>
          <span style={{ color: "#0284c7" }}>Kallam</span>
        </div>

        <div
          style={{
            marginTop: 30,
            fontSize: 32,
            color: "rgba(15,42,67,0.72)",
            display: "flex",
          }}
        >
          CS @ ASU · AI agents, fine-tuned LLMs, full-stack apps
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 44 }}>
          {["AI / LLM", "LangGraph", "React", "Next.js", "Python", "FastAPI"].map(
            (t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  padding: "10px 22px",
                  borderRadius: 12,
                  border: "1px solid rgba(15,42,67,0.18)",
                  background: "rgba(255,255,255,0.65)",
                  fontSize: 24,
                  color: "rgba(15,42,67,0.85)",
                }}
              >
                {t}
              </div>
            )
          )}
        </div>

        <div
          style={{
            marginTop: 48,
            fontSize: 24,
            color: "rgba(15,42,67,0.45)",
            display: "flex",
          }}
        >
          arunkallam.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
