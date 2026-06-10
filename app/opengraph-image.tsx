import { ImageResponse } from "next/og";

export const alt = "Arun Teja Reddy Kallam — CS @ ASU · Full-Stack & Data";
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
          backgroundColor: "#05070c",
          backgroundImage:
            "radial-gradient(at 8% 8%, rgba(59,130,246,0.35), transparent 60%), radial-gradient(at 95% 5%, rgba(16,185,129,0.22), transparent 55%), radial-gradient(at 60% 110%, rgba(168,85,247,0.30), transparent 60%)",
          color: "white",
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
              background: "#34d399",
            }}
          />
          <div style={{ fontSize: 26, color: "#6ee7b7" }}>
            Open to Summer 2026 Internships
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
          <span style={{ color: "#60a5fa" }}>Kallam</span>
        </div>

        <div
          style={{
            marginTop: 30,
            fontSize: 32,
            color: "rgba(255,255,255,0.72)",
            display: "flex",
          }}
        >
          CS @ ASU · Full-stack apps, reliable APIs, data-driven products
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 44 }}>
          {["React", "Next.js", "Python", "FastAPI", "SQL", "AI / LLM"].map(
            (t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  padding: "10px 22px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.06)",
                  fontSize: 24,
                  color: "rgba(255,255,255,0.85)",
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
            color: "rgba(255,255,255,0.45)",
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
