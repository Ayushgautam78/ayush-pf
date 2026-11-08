import { useId } from "react";

/** Vanishing point of the colonnade, in viewBox units. */
const VP = { x: 800, y: 600 };
const COLUMN_DEPTHS = [0, 0.7, 1.5, 2.5, 3.8, 5.4, 7.6, 10.5];

const project = (depth: number) => 1 / (1 + depth * 0.55);

/**
 * What lies beyond the temple doors: a red sunset over a Parthenon at the end
 * of a marble colonnade. Drawn in the site's three colours so it reads as the
 * same world, not a photo pasted in.
 */
export function GreekVista() {
  const id = useId().replace(/:/g, "");

  // Far to near, so nearer columns paint over farther ones
  const columns = [...COLUMN_DEPTHS].reverse().map((depth) => {
    const s = project(depth);
    const base = VP.y + 300 * s;
    const height = 560 * s;
    const width = 96 * s;
    return { depth, s, base, top: base - height, width, offset: 680 * s };
  });

  const parthenonColumns = Array.from({ length: 8 }, (_, i) => 640 + i * 46);

  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#120404" />
          <stop offset="0.35" stopColor="#5c0f09" />
          <stop offset="0.58" stopColor="#c0241a" />
          <stop offset="0.66" stopColor="#f08a6c" />
          <stop offset="0.7" stopColor="#f6dccd" />
        </linearGradient>
        <radialGradient id={`${id}-sun`}>
          <stop offset="0" stopColor="#fff7ee" />
          <stop offset="0.55" stopColor="#ffe3d2" />
          <stop offset="1" stopColor="#ffd1bd" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-haze`} cx="0.5" cy="0.62" r="0.5">
          <stop offset="0" stopColor="#ffd9c8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffd9c8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-marble`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7d7670" />
          <stop offset="0.35" stopColor="#f2eee6" />
          <stop offset="0.6" stopColor="#d8d1c6" />
          <stop offset="1" stopColor="#3a3431" />
        </linearGradient>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a1410" />
          <stop offset="0.25" stopColor="#140807" />
          <stop offset="1" stopColor="#050404" />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill={`url(#${id}-sky)`} />
      <circle cx="800" cy="500" r="130" fill={`url(#${id}-sun)`} />
      <circle cx="800" cy="500" r="96" fill="#fff4ea" />

      {/* Hills and the Parthenon on its rock */}
      <path d="M0 600 L180 560 L380 575 L560 540 L1040 540 L1240 572 L1420 556 L1600 590 L1600 900 L0 900 Z" fill="#2a0806" />
      <g fill="#0d0605">
        <path d="M560 540 L1040 540 L1010 520 L590 520 Z" />
        <rect x="610" y="508" width="380" height="14" />
        {parthenonColumns.map((x) => (
          <rect key={x} x={x - 8} y="436" width="16" height="72" />
        ))}
        <rect x="604" y="420" width="392" height="18" />
        <path d="M600 420 L800 372 L1000 420 Z" />
      </g>
      <rect width="1600" height="900" fill={`url(#${id}-haze)`} />

      {/* Floor of the colonnade, receding to the vanishing point */}
      <path d={`M0 900 L0 ${VP.y + 40} L1600 ${VP.y + 40} L1600 900 Z`} fill={`url(#${id}-floor)`} />
      <g stroke="#f2eee6" strokeOpacity="0.09" strokeWidth="1">
        {[-6, -4, -2.5, -1.4, -0.6, 0, 0.6, 1.4, 2.5, 4, 6].map((k) => (
          <line key={k} x1={VP.x} y1={VP.y} x2={VP.x + k * 260} y2="900" />
        ))}
        {COLUMN_DEPTHS.map((depth) => {
          const y = VP.y + 300 * project(depth);
          return <line key={depth} x1="0" y1={y} x2="1600" y2={y} />;
        })}
      </g>

      {/* Two rows of columns carrying a beam, converging on the temple */}
      {[-1, 1].map((side) => (
        <g key={side}>
          {/* Entablature: a lit face, a red frieze band, and its shadowed soffit */}
          {[
            { from: -70, to: -26, fill: "#ece6db" },
            { from: -26, to: -14, fill: "#a81f17" },
            { from: -14, to: 0, fill: "#6d6660" },
          ].map((band) => (
            <path
              key={band.from}
              d={`M${VP.x + side * 680} ${VP.y + 300 - 560 + band.from}
                  L${VP.x + side * 680 * project(10.5)} ${VP.y + (300 - 560 + band.from) * project(10.5)}
                  L${VP.x + side * 680 * project(10.5)} ${VP.y + (300 - 560 + band.to) * project(10.5)}
                  L${VP.x + side * 680} ${VP.y + 300 - 560 + band.to} Z`}
              fill={band.fill}
            />
          ))}
          {columns.map((c) => {
            const cx = VP.x + side * c.offset;
            return (
              <g key={c.depth} opacity={0.45 + 0.55 * c.s}>
                <rect x={cx - c.width / 2} y={c.top} width={c.width} height={c.base - c.top} fill={`url(#${id}-marble)`} />
                {[0.25, 0.5, 0.75].map((f) => (
                  <line key={f} x1={cx - c.width / 2 + c.width * f} y1={c.top} x2={cx - c.width / 2 + c.width * f} y2={c.base} stroke="#000" strokeOpacity="0.16" strokeWidth={Math.max(0.5, 2 * c.s)} />
                ))}
                <rect x={cx - c.width * 0.75} y={c.top - 10 * c.s} width={c.width * 1.5} height={12 * c.s} fill="#f2eee6" />
                <rect x={cx - c.width * 0.65} y={c.base - 8 * c.s} width={c.width * 1.3} height={8 * c.s} fill="#cfc8bc" />
                <ellipse cx={cx} cy={c.base + 4 * c.s} rx={c.width * 1.6} ry={6 * c.s} fill="#000" opacity="0.35" />
              </g>
            );
          })}
        </g>
      ))}

      {/* Sun through the doorway */}
      <g style={{ mixBlendMode: "screen" }} opacity="0.35">
        <path d="M800 500 L520 900 L1080 900 Z" fill="#ffd6c4" opacity="0.25" />
        <path d="M800 500 L640 900 L960 900 Z" fill="#fff1e8" opacity="0.35" />
      </g>
    </svg>
  );
}
