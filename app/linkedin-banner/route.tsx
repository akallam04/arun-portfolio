import { ImageResponse } from "next/og";

// LinkedIn cover: 1584x396. The profile photo overlaps the lower-left on
// desktop, so all content sits right of ~x=560 and stays vertically centered
// to survive LinkedIn's mobile center-crop.
export const size = { width: 1584, height: 396 };

export function GET() {
  const chips = ["AI Agents", "LLM Fine-Tuning", "Full-Stack", "Data"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#eaf3fd",
          backgroundImage:
            "linear-gradient(120deg, #d3e7fb 0%, #eaf3fd 45%, #f7fbff 100%), radial-gradient(at 10% 24%, rgba(56,150,235,0.38), transparent 52%), radial-gradient(at 70% 118%, rgba(96,196,240,0.30), transparent 55%), radial-gradient(at 92% 12%, rgba(255,255,255,0.75), transparent 42%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* soft constellation marks, left of the content block */}
        {[
          [120, 96, 5],
          [210, 172, 3],
          [318, 88, 4],
          [268, 268, 3],
          [404, 210, 5],
          [150, 300, 4],
          [462, 108, 3],
        ].map(([x, y, r], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: r * 2,
              height: r * 2,
              borderRadius: 999,
              background: "rgba(37,99,235,0.35)",
            }}
          />
        ))}

        {/* content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 560,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#059669",
              }}
            />
            <div
              style={{
                fontSize: 21,
                letterSpacing: 1,
                color: "#047857",
              }}
            >
              Open to Fall 2026 Co-ops
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 62,
              fontWeight: 800,
              letterSpacing: -1.5,
              color: "#0f2a43",
              lineHeight: 1.1,
            }}
          >
            Arun Teja Reddy Kallam
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontSize: 27,
              color: "rgba(15,42,67,0.66)",
            }}
          >
            CS @ Arizona State · building AI agents and full-stack products
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 26 }}>
            {chips.map((c) => (
              <div
                key={c}
                style={{
                  display: "flex",
                  padding: "9px 20px",
                  borderRadius: 999,
                  border: "1px solid rgba(15,42,67,0.16)",
                  background: "rgba(255,255,255,0.72)",
                  fontSize: 20,
                  color: "rgba(15,42,67,0.78)",
                }}
              >
                {c}
              </div>
            ))}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: 12,
                fontSize: 20,
                color: "#0284c7",
              }}
            >
              arunkallam.vercel.app
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
