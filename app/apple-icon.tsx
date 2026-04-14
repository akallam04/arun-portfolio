import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "3px solid rgba(139,92,246,0.5)",
        }}
      >
        <span
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "white",
            letterSpacing: "-3px",
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
