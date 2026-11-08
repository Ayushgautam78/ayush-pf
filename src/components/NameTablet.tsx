"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const MAX_LENGTH = 14;

/** Pairs of Latin letters that ancient Greek writes as one. */
const DIGRAPHS: Record<string, string> = { TH: "Θ", PH: "Φ", PS: "Ψ", CH: "Χ", KH: "Χ", KS: "Ξ" };

const SINGLE: Record<string, string> = {
  A: "Α", B: "Β", C: "Κ", D: "Δ", E: "Ε", F: "Φ", G: "Γ", H: "Η", I: "Ι", J: "Ι",
  K: "Κ", L: "Λ", M: "Μ", N: "Ν", O: "Ο", P: "Π", Q: "Κ", R: "Ρ", S: "Σ", T: "Τ",
  U: "Υ", V: "Β", W: "Ω", X: "Ξ", Y: "Υ", Z: "Ζ", " ": " ",
};

/** A playful, not scholarly, transliteration into Greek capitals. */
const toGreek = (latin: string) => {
  let out = "";
  for (let i = 0; i < latin.length; i++) {
    const pair = DIGRAPHS[latin.slice(i, i + 2)];
    if (pair) {
      out += pair;
      i++;
    } else {
      out += SINGLE[latin[i]] ?? "";
    }
  }
  return out;
};

const EASE = [0.16, 1, 0.3, 1] as const;

function Carved({ text, className }: { text: string; className: string }) {
  return (
    <span className={`inline-flex ${className}`}>
      <AnimatePresence initial={false}>
        {text.split("").map((char, i) => (
          <motion.span
            key={`${i}-${char}`}
            className="inline-block whitespace-pre"
            initial={{ y: "70%", opacity: 0, rotate: -6, filter: "blur(6px)" }}
            animate={{ y: 0, opacity: 1, rotate: 0, filter: "blur(0px)" }}
            exit={{ y: "-40%", opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}

/**
 * A small game at the foot of the page: tap the letter tiles (or just type)
 * to carve a name into the tablet, and see it written in Greek letters.
 */
export function NameTablet() {
  const [name, setName] = useState("");
  const rootRef = useRef<HTMLElement>(null);
  const inViewRef = useRef(false);

  const add = useCallback((char: string) => {
    setName((current) => (current.length >= MAX_LENGTH ? current : current + char));
  }, []);
  const removeLast = useCallback(() => setName((current) => current.slice(0, -1)), []);

  // Typing works too, while the tablet is on screen and you are not in a form field
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
    });
    observer.observe(root);

    const onKey = (e: KeyboardEvent) => {
      if (!inViewRef.current || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target instanceof Element && e.target.closest("input, textarea, select, [contenteditable]")) return;
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) add(key);
      else if (e.key === " ") {
        e.preventDefault();
        add(" ");
      } else if (e.key === "Backspace") removeLast();
      else if (e.key === "Escape") setName("");
    };
    window.addEventListener("keydown", onKey);
    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, [add, removeLast]);

  const trimmed = name.trim();
  const greek = toGreek(name);
  const display = trimmed ? trimmed.charAt(0) + trimmed.slice(1).toLowerCase() : "";

  return (
    <section ref={rootRef} className="px-[var(--content-padding)] py-14 sm:py-20" aria-labelledby="tablet-title">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <p className="text-micro section-index mb-3">
            <span>Ω</span>
            <span className="text-[var(--red)]">Before you go</span>
          </p>
          <h2 id="tablet-title" className="text-section text-[var(--bone)]">
            Carve your name
          </h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)] max-w-xs leading-relaxed">
          Tap the letters or just type. The tablet will write it the way an Athenian would.
        </p>
      </div>

      {/* The tablet */}
      <div
        className="relative border border-[var(--border-medium)] px-4 sm:px-10 pt-8 pb-6 sm:pt-12 sm:pb-8 mb-5 sm:mb-6 overflow-hidden"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(242,238,230,0.025) 0 1px, transparent 1px 7px), linear-gradient(180deg, #1a1918 0%, #0e0d0d 100%)",
          boxShadow: "inset 0 2px 30px rgba(0,0,0,0.8)",
        }}
      >
        <div className="meander absolute top-0 inset-x-0" aria-hidden="true" />
        <div className="min-h-[1.1em] text-[clamp(2.4rem,9vw,8rem)] leading-none font-[family-name:var(--font-display)] font-extrabold uppercase tracking-[-0.04em] text-[var(--bone)] flex items-center">
          {name ? (
            <Carved text={name} className="" />
          ) : (
            <span className="text-[var(--text-muted)] opacity-50">Your name</span>
          )}
          <span className="tablet-caret ml-1 inline-block w-[0.06em] h-[0.8em] bg-[var(--red)]" aria-hidden="true" />
        </div>
        <div
          className="mt-3 sm:mt-4 min-h-[1.2em] font-greek italic text-[clamp(1.4rem,4.5vw,3.6rem)] leading-none text-[var(--red)]"
          aria-live="polite"
        >
          {greek.trim() ? <Carved text={greek} className="" /> : <span className="opacity-30">ΟΝΟΜΑ</span>}
        </div>
        <p className="mt-4 text-sm text-[var(--text-secondary)] min-h-[1.4em]">
          {display
            ? display.toLowerCase() === "ayush"
              ? "That's mine. Good taste."
              : `Χαῖρε, ${display}. That's "hello" in ancient Greek.`
            : " "}
        </p>
      </div>

      {/* Letter tiles */}
      <div className="grid grid-cols-7 sm:grid-cols-[repeat(13,minmax(0,1fr))] gap-1.5 sm:gap-2">
        {LETTERS.map((letter) => (
          <motion.button
            key={letter}
            type="button"
            onClick={() => add(letter)}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.9, y: 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className="relative aspect-square border border-[var(--border-medium)] bg-[var(--bg-surface)] hover:border-[var(--red)] hover:bg-[var(--red)] transition-colors cursor-pointer group"
            aria-label={`Add ${letter}`}
          >
            <span className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-display)] font-bold text-lg sm:text-2xl text-[var(--bone)]">
              {letter}
            </span>
            <span className="absolute top-1 right-1.5 font-greek italic text-[0.6rem] sm:text-xs text-[var(--red)] group-hover:text-[var(--bone)]">
              {SINGLE[letter]}
            </span>
          </motion.button>
        ))}
        <button
          type="button"
          onClick={() => add(" ")}
          className="col-span-2 sm:col-span-1 border border-[var(--border-medium)] text-micro text-[var(--text-secondary)] hover:text-[var(--bone)] hover:border-[var(--bone)] transition-colors cursor-pointer"
        >
          Space
        </button>
        <button
          type="button"
          onClick={removeLast}
          className="border border-[var(--border-medium)] text-[var(--text-secondary)] hover:text-[var(--bone)] hover:border-[var(--bone)] transition-colors cursor-pointer"
          aria-label="Delete last letter"
        >
          ⌫
        </button>
        <button
          type="button"
          onClick={() => setName("")}
          className="col-span-2 sm:col-span-1 border border-[var(--border-medium)] text-micro text-[var(--text-secondary)] hover:text-[var(--red-bright)] hover:border-[var(--red)] transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>
    </section>
  );
}
