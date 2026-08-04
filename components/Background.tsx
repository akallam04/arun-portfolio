export function Background() {
  return (
    <div className="grain pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#e9f2fb]">
      {/* Sky wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #dcecfb 0%, #e9f2fb 45%, #f4f9ff 100%)",
        }}
      />
      {/* Sky-blue glow */}
      <div
        className="aurora-blob aurora-a"
        style={{
          top: "-12%",
          left: "-8%",
          width: "55vw",
          height: "55vw",
          maxWidth: 760,
          maxHeight: 760,
          background:
            "radial-gradient(circle, rgba(56,150,235,0.28) 0%, transparent 65%)",
        }}
      />
      {/* Cloud white */}
      <div
        className="aurora-blob aurora-b"
        style={{
          top: "-6%",
          right: "-12%",
          width: "48vw",
          height: "48vw",
          maxWidth: 640,
          maxHeight: 640,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.95) 0%, transparent 65%)",
        }}
      />
      {/* Soft cyan drift */}
      <div
        className="aurora-blob aurora-c"
        style={{
          bottom: "-18%",
          left: "30%",
          width: "60vw",
          height: "60vw",
          maxWidth: 820,
          maxHeight: 820,
          background:
            "radial-gradient(circle, rgba(103,200,240,0.22) 0%, transparent 65%)",
        }}
      />
      {/* Low cloud bank */}
      <div
        className="aurora-blob aurora-b"
        style={{
          bottom: "-10%",
          right: "5%",
          width: "40vw",
          height: "30vw",
          maxWidth: 560,
          maxHeight: 420,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.85) 0%, transparent 60%)",
        }}
      />
      <div className="dot-grid absolute inset-0" />
    </div>
  );
}
