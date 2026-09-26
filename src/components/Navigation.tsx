"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback((href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <>
      {/* Minimal floating nav */}
      <motion.header
        className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          className={`pointer-events-auto flex items-center justify-between gap-4 md:gap-8 px-4 md:px-6 py-2.5 rounded-full border transition-all duration-500 ${
            isScrolled
              ? "bg-[#f4efe6]/90 backdrop-blur-xl border-[var(--border-medium)] shadow-[0_4px_25px_rgba(0,0,0,0.06)]"
              : "bg-[#f4efe6]/70 backdrop-blur-md border-[var(--border-subtle)]"
          }`}
          style={{ maxWidth: "720px", width: "100%" }}
        >
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs font-bold text-[var(--text-primary)] hover:text-[var(--accent)] tracking-[0.15em] transition-colors cursor-pointer"
          >
            AYUSH
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="text-[0.72rem] text-[var(--text-muted)] hover:text-[var(--text-primary)] tracking-[0.1em] uppercase transition-colors cursor-pointer font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollTo("#contact")}
              className="px-4 py-1.5 rounded-full bg-[#0e1014] text-white hover:bg-[var(--accent)] hover:text-[#0e1014] text-[0.72rem] font-semibold tracking-wider transition-colors cursor-pointer"
            >
              Let&apos;s talk
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative w-7 h-7 flex flex-col items-center justify-center gap-1 text-[var(--text-primary)] cursor-pointer"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <span
                className={`block w-4 h-[1px] bg-current transition-transform duration-300 ${
                  isOpen ? "rotate-45 translate-y-[3px]" : ""
                }`}
              />
              <span
                className={`block w-4 h-[1px] bg-current transition-transform duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-[2px]" : ""
                }`}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[var(--bg-primary)]/97 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex flex-col items-center gap-6">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollTo(item.href)}
                  className="text-lg font-light tracking-wide text-[var(--text-primary)] hover:opacity-70 transition-opacity cursor-pointer"
                >
                  {item.label}
                </button>
              ))}

              <div className="w-12 h-px bg-[var(--border-subtle)] my-2" />

              <button
                onClick={() => scrollTo("#contact")}
                className="px-6 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-medium text-sm tracking-wider cursor-pointer"
              >
                Let&apos;s talk
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
