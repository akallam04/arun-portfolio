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
          background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 60%, #06b6d4 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "3px solid rgba(255,255,255,0.55)",
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
