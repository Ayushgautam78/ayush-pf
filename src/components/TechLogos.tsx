"use client";

import React, { useState } from "react";

interface TechItem {
  name: string;
  category: "Development" | "Mobile" | "Tools & Systems";
  brandColor: string;
  svg: (color: string) => React.ReactNode;
}

export const TECH_ITEMS: TechItem[] = [
  {
    name: "TypeScript",
    category: "Development",
    brandColor: "#3178C6",
    svg: (color) => (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
        <rect x="2" y="2" width="20" height="20" rx="4" stroke={color} strokeWidth="1.8" />
        <path d="M5 8h6M8 8v9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M14 14.5c.8.8 1.8 1 2.7.7.8-.3 1.3-1 1.3-1.7s-.6-1.3-1.6-1.6l-.8-.3c-1.3-.4-2.1-1.1-2.1-2.3 0-1.4 1.2-2.3 2.7-2.3 1.2 0 2.2.5 2.8 1.3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "React",
    category: "Development",
    brandColor: "#61DAFB",
    svg: (color) => (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <circle cx="12" cy="12" r="2.2" fill={color} />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke={color} strokeWidth="1.5" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke={color} strokeWidth="1.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke={color} strokeWidth="1.5" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    name: "Next.js",
    category: "Development",
    brandColor: "#EDE4D0",
    svg: (color) => (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.6" />
        <path d="M8 8v8M16 8l-8 9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M16 8v5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "JavaScript",
    category: "Development",
    brandColor: "#F7DF1E",
    svg: (color) => (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="4" stroke={color} strokeWidth="1.8" />
        <path d="M7 13.5v2a1.5 1.5 0 003 0V8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M14 14.5c.8.8 1.8 1 2.7.7.8-.3 1.3-1 1.3-1.7s-.6-1.3-1.6-1.6l-.8-.3c-1.3-.4-2.1-1.1-2.1-2.3 0-1.4 1.2-2.3 2.7-2.3 1.2 0 2.2.5 2.8 1.3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Node.js",
    category: "Development",
    brandColor: "#68A063",
    svg: (color) => (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <path d="M12 2l8.5 5v10L12 22l-8.5-5V7L12 2z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M12 7.5v9M8 10l8 4M16 10l-8 4" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "HTML5 / CSS3",
    category: "Development",
    brandColor: "#E34F26",
    svg: (color) => (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <path d="M4 3l1.8 16.5L12 22l6.2-2.5L20 3H4z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M7 7h10M7.5 11h9M8 15h8l-.5 3-3.5 1-3.5-1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Android",
    category: "Mobile",
    brandColor: "#3DDC84",
    svg: (color) => (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <path d="M6 10h12v7a2 2 0 01-2 2H8a2 2 0 01-2-2v-7z" stroke={color} strokeWidth="1.6" />
        <path d="M7 10c0-2.8 2.2-5 5-5s5 2.2 5 5H7z" stroke={color} strokeWidth="1.6" />
        <circle cx="9.5" cy="7.5" r="0.8" fill={color} />
        <circle cx="14.5" cy="7.5" r="0.8" fill={color} />
        <path d="M8 4l-1.5-2M16 4l1.5-2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 11v5M20 11v5M9 19v3M15 19v3" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Kotlin",
    category: "Mobile",
    brandColor: "#7F52FF",
    svg: (color) => (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="1.5" />
        <path d="M3 21L21 3M3 12l9-9M12 21l9-9" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Python",
    category: "Tools & Systems",
    brandColor: "#3776AB",
    svg: (color) => (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <path d="M11.5 3c-3 0-5 1.5-5 3.5V8h5v1.5H5.5C3.5 9.5 2 11.2 2 13.5S3.5 17 5.5 17H7v-2.2c0-1.8 1.5-3.3 3.3-3.3h5.2c1.4 0 2.5-1.1 2.5-2.5V5.5c0-1.4-1.1-2.5-2.5-2.5h-4z" stroke={color} strokeWidth="1.4" />
        <circle cx="8" cy="5.5" r="0.75" fill={color} />
        <path d="M12.5 21c3 0 5-1.5 5-3.5V16h-5v-1.5h6c2 0 3.5-1.7 3.5-4s-1.5-3.5-3.5-3.5H17v2.2c0 1.8-1.5 3.3-3.3 3.3H8.5C7.1 12.5 6 13.6 6 15v3.5C6 19.9 7.1 21 8.5 21h4z" stroke={color} strokeWidth="1.4" />
        <circle cx="16" cy="18.5" r="0.75" fill={color} />
      </svg>
    ),
  },
  {
    name: "Docker",
    category: "Tools & Systems",
    brandColor: "#2496ED",
    svg: (color) => (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <path d="M3 13c1.5 0 2.5-1 3.5-1s2 1 3.5 1 2.5-1 3.5-1 2 1 3.5 1 2.5-1 4-1c.5 4-2 7-9 7s-9.5-3-9-7z" stroke={color} strokeWidth="1.5" />
        <path d="M6 10h2.5V8H6v2zM9.5 10H12V8H9.5v2zM13 10h2.5V8H13v2zM9.5 7H12V5H9.5v2z" stroke={color} strokeWidth="1.3" />
        <circle cx="18" cy="14" r="0.8" fill={color} />
      </svg>
    ),
  },
  {
    name: "Git & GitHub",
    category: "Tools & Systems",
    brandColor: "#F05032",
    svg: (color) => (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <circle cx="6" cy="6" r="2.5" stroke={color} strokeWidth="1.6" />
        <circle cx="6" cy="18" r="2.5" stroke={color} strokeWidth="1.6" />
        <circle cx="18" cy="12" r="2.5" stroke={color} strokeWidth="1.6" />
        <path d="M6 8.5v7M8 7.5l7.5 3.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function TechBadge({ tech }: { tech: TechItem }) {
  const [hovered, setHovered] = useState(false);
  const defaultColor = "var(--text-secondary)";
  const currentColor = hovered ? (tech.name === "Next.js" ? "#0e1014" : tech.brandColor) : defaultColor;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all duration-300 cursor-default"
      style={{
        borderColor: hovered ? "var(--accent)" : "var(--border-subtle)",
        backgroundColor: hovered ? "#ffffff" : "var(--bg-elevated)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 4px 16px rgba(245,158,11,0.12)" : "none",
      }}
    >
      {/* Icon */}
      <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
        {tech.svg(currentColor)}
      </div>

      {/* Label */}
      <span
        className="text-[0.78rem] font-medium tracking-wide transition-colors duration-300"
        style={{
          color: hovered ? "var(--text-primary)" : "var(--text-secondary)",
        }}
      >
        {tech.name}
      </span>
    </div>
  );
}
