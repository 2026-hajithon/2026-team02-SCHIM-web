function CanvasGuideBorder() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 size-full"
      viewBox="0 0 360 560"
      preserveAspectRatio="none"
    >
      <rect
        x="0.5"
        y="0.5"
        width="359"
        height="559"
        rx="20"
        fill="none"
        stroke="var(--color-paper-tape)"
        strokeWidth="1"
        strokeDasharray="8 6"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default CanvasGuideBorder;
