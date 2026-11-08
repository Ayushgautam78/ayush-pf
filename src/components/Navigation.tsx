"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scrollToSection, scrollToY } from "@/lib/scroll";

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
  const progressRef = useRef<HTMLDivElement>(null);

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

      if (progressRef.current) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progressRef.current.style.transform = `scaleX(${max > 0 ? currentScrollY / max : 0})`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback((href: string) => {
    setIsOpen(false);
    scrollToSection(href);
  }, []);

  return (
    <>
      {/* Reading progress along the top edge: stays when the bar hides */}
      <div className="fixed top-0 inset-x-0 h-px z-[60] pointer-events-none" aria-hidden="true">
        <div
          ref={progressRef}
          className="h-full bg-[var(--gold)] origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <motion.header
        className="fixed top-0 inset-x-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: isVisible || isOpen ? 1 : 0,
          y: isVisible || isOpen ? 0 : -90,
        }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          className={`flex items-center justify-between gap-4 px-[var(--content-padding)] py-4 transition-colors duration-500 ${
            isScrolled ? "bg-[var(--bg-primary)]/80 backdrop-blur-lg" : "bg-transparent"
          }`}
        >
          <button
            onClick={() => scrollToY(0)}
            className="font-[family-name:var(--font-display)] text-lg sm:text-xl tracking-[0.06em] text-[var(--ivory)] hover:text-[var(--gold-bright)] transition-colors cursor-pointer"
          >
            Ayush Gautam
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item, i) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="text-micro text-[var(--text-secondary)] hover:text-[var(--ivory)] transition-colors cursor-pointer"
              >
                <span className="text-[var(--gold)] mr-1.5">0{i + 1}</span>
                <span className="link-underline">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => scrollTo("#contact")} className="btn-ghost px-3 py-1.5 sm:px-4 sm:py-2">
              Let&apos;s talk
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-1.5 text-[var(--ivory)] cursor-pointer"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              <span className={`block w-6 h-px bg-current transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
              <span className={`block w-6 h-px bg-current transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[var(--bg-primary)] flex flex-col justify-center px-[var(--content-padding)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex flex-col items-start gap-5">
              {NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item.label}
                  onClick={() => scrollTo(item.href)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.05 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-baseline gap-4 font-[family-name:var(--font-display)] text-5xl uppercase text-[var(--ivory)] hover:text-[var(--gold)] transition-colors cursor-pointer"
                >
                  <span className="text-micro text-[var(--gold)]">0{i + 1}</span>
                  {item.label}
                </motion.button>
              ))}
            </div>
            <div className="meander w-full mt-10" aria-hidden="true" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
