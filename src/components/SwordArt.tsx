import { useId, type Ref } from "react";

/**
 * A Greek xiphos and its scabbard, drawn on a shared 1000 x 120 canvas with
 * the tip at the right edge. Both layers use the same canvas so they can be
 * slid apart by percentages of one width.
 */
export const SWORD_ASPECT = 120 / 1000;
/** Where the scabbard's mouth sits, as a fraction of the sword's length. */
export const THROAT = 0.21;

const BLADE =
  "M210 50 C420 44 600 33 760 37 C880 41 960 54 1000 60 C960 66 880 79 760 83 C600 87 420 76 210 70 Z";
const SCABBARD =
  "M210 45 C420 39 600 28 760 32 C885 36 965 51 1012 60 C965 69 885 84 760 88 C600 92 420 81 210 75 Z";
const MEANDER = "M0 10.5h12M10.5 10.5V1.5H2.5v6h5V4.5H5";

export function SwordBlade({ sheenRef }: { sheenRef?: Ref<SVGRectElement> }) {
  const id = useId().replace(/:/g, "");

  return (
    <svg viewBox="0 0 1000 120" className="block w-full h-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.42" stopColor="#d9d8d5" />
          <stop offset="0.5" stopColor="#8c8a86" />
          <stop offset="0.58" stopColor="#c4c2be" />
          <stop offset="1" stopColor="#5d5b58" />
        </linearGradient>
        <linearGradient id={`${id}-fitting`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2eee6" />
          <stop offset="0.5" stopColor="#9d9a94" />
          <stop offset="1" stopColor="#3b3a38" />
        </linearGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <pattern id={`${id}-key`} width="12" height="12" patternUnits="userSpaceOnUse" y="54">
          <path d={MEANDER} fill="none" stroke="#d62a1f" strokeWidth="1.3" />
        </pattern>
        <pattern id={`${id}-cord`} width="9" height="22" patternUnits="userSpaceOnUse" y="49">
          <rect width="9" height="22" fill="#141414" />
          <path d="M0 22 L9 0" stroke="#d62a1f" strokeWidth="3.2" />
        </pattern>
        <clipPath id={`${id}-blade`}>
          <path d={BLADE} />
        </clipPath>
      </defs>

      {/* Blade */}
      <path d={BLADE} fill={`url(#${id}-steel)`} />
      <g clipPath={`url(#${id}-blade)`}>
        <rect x="236" y="54" width="180" height="12" fill={`url(#${id}-key)`} />
        <rect ref={sheenRef} x="0" y="0" width="260" height="120" fill={`url(#${id}-sheen)`} transform="translate(-400 0)" />
      </g>
      <path d="M214 60 L985 60" stroke="#fff" strokeOpacity="0.75" strokeWidth="1" />
      <path d={BLADE} fill="none" stroke="#1a1a1a" strokeOpacity="0.35" strokeWidth="1" />

      {/* Guard */}
      <path d="M190 30 Q200 24 210 30 L212 90 Q200 96 188 90 Z" fill={`url(#${id}-fitting)`} />
      <circle cx="200" cy="60" r="5" fill="#d62a1f" />

      {/* Grip, wrapped in red cord */}
      <rect x="44" y="49" width="146" height="22" rx="3" fill={`url(#${id}-cord)`} />
      <rect x="40" y="46" width="9" height="28" rx="2" fill={`url(#${id}-fitting)`} />
      <rect x="181" y="46" width="9" height="28" rx="2" fill={`url(#${id}-fitting)`} />

      {/* Pommel */}
      <ellipse cx="24" cy="60" rx="17" ry="24" fill={`url(#${id}-fitting)`} />
      <ellipse cx="24" cy="60" rx="8" ry="12" fill="none" stroke="#d62a1f" strokeWidth="2.5" />
    </svg>
  );
}

export function SwordScabbard() {
  const id = useId().replace(/:/g, "");

  return (
    <svg viewBox="0 0 1000 120" className="block w-full h-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-lacquer`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a3b" />
          <stop offset="0.35" stopColor="#141415" />
          <stop offset="1" stopColor="#050505" />
        </linearGradient>
        <linearGradient id={`${id}-fitting`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2eee6" />
          <stop offset="0.5" stopColor="#9d9a94" />
          <stop offset="1" stopColor="#3b3a38" />
        </linearGradient>
        <pattern id={`${id}-key`} width="12" height="12" patternUnits="userSpaceOnUse" y="54">
          <path d={MEANDER} fill="none" stroke="#d62a1f" strokeWidth="1.4" />
        </pattern>
        <clipPath id={`${id}-shape`}>
          <path d={SCABBARD} />
        </clipPath>
      </defs>

      <path d={SCABBARD} fill={`url(#${id}-lacquer)`} stroke="#f2eee6" strokeOpacity="0.35" strokeWidth="1" />
      <g clipPath={`url(#${id}-shape)`}>
        <rect x="300" y="51" width="430" height="18" fill="#0a0a0a" />
        <rect x="300" y="54" width="430" height="12" fill={`url(#${id}-key)`} />
        <rect x="300" y="50" width="430" height="1" fill="#d62a1f" />
        <rect x="300" y="69" width="430" height="1" fill="#d62a1f" />
        {/* Throat and chape */}
        <rect x="210" y="20" width="34" height="80" fill={`url(#${id}-fitting)`} />
        <rect x="248" y="20" width="4" height="80" fill="#d62a1f" />
        <rect x="930" y="20" width="90" height="80" fill={`url(#${id}-fitting)`} />
        <rect x="924" y="20" width="4" height="80" fill="#d62a1f" />
      </g>
    </svg>
  );
}
