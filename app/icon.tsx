import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          border: "1px solid rgba(139,92,246,0.4)",
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 900,
            color: "white",
            letterSpacing: "-0.5px",
            lineHeight: 1,
          }}
        >
          AK
        </span>
      </div>
    ),
    { ...size }
  );
}
