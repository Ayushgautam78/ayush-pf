"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show when near the very top
      if (currentScrollY < 60) {
        setIsVisible(true);
      } else {
        const delta = currentScrollY - lastScrollY.current;
        if (delta > 8) {
          // Scrolling down: hide the navigation / Let's talk bar
          setIsVisible(false);
        } else if (delta < -8) {
          // Scrolling up: reveal immediately
          setIsVisible(true);
        }
      }

      setIsScrolled(currentScrollY > 80);
      lastScrollY.current = currentScrollY;
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
        animate={{
          opacity: isVisible || isOpen ? 1 : 0,
          y: isVisible || isOpen ? 0 : -90,
        }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          className={`pointer-events-auto flex items-center justify-between gap-4 md:gap-8 px-4 md:px-6 py-2.5 rounded-full border transition-all duration-500 ${
            isScrolled
              ? "bg-[#0d0f14]/90 backdrop-blur-xl border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
              : "bg-[#0d0f14]/75 backdrop-blur-md border-white/10"
          }`}
          style={{ maxWidth: "720px", width: "100%" }}
        >
          {/* Logo with signature crimson dot */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs font-bold text-[var(--ivory)] tracking-[0.15em] transition-colors cursor-pointer flex items-center gap-0.5"
          >
            <span>AYUSH</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--crimson)] inline-block ml-0.5" />
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="text-[0.72rem] text-[var(--text-secondary)] hover:text-[var(--ivory)] tracking-[0.1em] uppercase transition-colors cursor-pointer font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA: Strong Crimson Anchor */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollTo("#contact")}
              className="px-4 py-1.5 rounded-full bg-[var(--crimson)] text-[var(--ivory)] hover:bg-[var(--crimson-bright)] text-[0.72rem] font-semibold tracking-wider transition-all duration-200 cursor-pointer shadow-[0_2px_12px_rgba(169,24,35,0.35)]"
            >
              Let&apos;s talk
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative w-7 h-7 flex flex-col items-center justify-center gap-1 text-[var(--ivory)] cursor-pointer"
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
            className="fixed inset-0 z-40 bg-[var(--bg-primary)]/98 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
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
                  className="text-lg font-light tracking-wide text-[var(--ivory)] hover:text-[var(--crimson)] transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}

              <div className="w-12 h-px bg-[var(--border-subtle)] my-2" />

              <button
                onClick={() => scrollTo("#contact")}
                className="px-6 py-2.5 rounded-full bg-[var(--crimson)] text-[var(--ivory)] font-medium text-sm tracking-wider cursor-pointer shadow-[0_4px_16px_rgba(169,24,35,0.4)]"
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
