import { ImageResponse } from "next/og";

// LinkedIn cover: 1584x396. LinkedIn already prints the name and headline
// directly beneath this image, so the banner carries none of that. It shows
// proof instead: three numbers from shipped work. Content sits right of
// x=560 to clear the profile photo and stays centered for the mobile crop.
export const size = { width: 1584, height: 396 };

const STATS = [
  { value: "100%", label: "53-case agent eval pass" },
  { value: "24×", label: "cheaper fine-tuned LLM" },
  { value: "6", label: "products shipped end to end" },
];

export function GET() {
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
        {/* constellation, echoing the portfolio hero */}
        {[
          [120, 96, 5],
          [210, 172, 3],
          [318, 88, 4],
          [268, 268, 3],
          [404, 210, 5],
          [150, 300, 4],
          [462, 120, 3],
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
              background: "rgba(37,99,235,0.32)",
            }}
          />
        ))}

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
              fontSize: 19,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "rgba(15,42,67,0.42)",
              marginBottom: 26,
            }}
          >
            Evidence, not adjectives
          </div>

          <div style={{ display: "flex", gap: 22 }}>
            {STATS.map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "20px 26px",
                  borderRadius: 18,
                  border: "1px solid rgba(15,42,67,0.12)",
                  background: "rgba(255,255,255,0.72)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 46,
                    fontWeight: 800,
                    letterSpacing: -1,
                    color: "#0284c7",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    display: "flex",
                    marginTop: 6,
                    fontSize: 19,
                    color: "rgba(15,42,67,0.62)",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 30,
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: 999,
                background: "#059669",
              }}
            />
            <div style={{ display: "flex", fontSize: 21, color: "#047857" }}>
              Open to Fall 2026 co-ops
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 21,
                color: "rgba(15,42,67,0.28)",
                paddingLeft: 4,
                paddingRight: 4,
              }}
            >
              ·
            </div>
            <div style={{ display: "flex", fontSize: 21, color: "#0284c7" }}>
              arunkallam.vercel.app
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
