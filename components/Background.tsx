export function Background() {
  return (
    <div className="grain pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#05070c]">
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
            "radial-gradient(circle, rgba(59,130,246,0.30) 0%, transparent 65%)",
        }}
      />
      <div
        className="aurora-blob aurora-b"
        style={{
          top: "-6%",
          right: "-12%",
          width: "45vw",
          height: "45vw",
          maxWidth: 620,
          maxHeight: 620,
          background:
            "radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 65%)",
        }}
      />
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
            "radial-gradient(circle, rgba(168,85,247,0.22) 0%, transparent 65%)",
        }}
      />
      <div className="dot-grid absolute inset-0" />
    </div>
  );
}
