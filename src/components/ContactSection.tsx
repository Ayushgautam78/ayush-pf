"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { label: "Email", href: "mailto:hello@ayush.dev", external: true },
  { label: "GitHub", href: "https://github.com/ayush", external: true },
  { label: "LinkedIn", href: "https://linkedin.com/in/ayush", external: true },
  { label: "X", href: "https://x.com/ayush", external: true },
];

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Heading lines
      headingRefs.current.forEach((line, i) => {
        if (!line) return;

        gsap.from(line, {
          y: 100,
          opacity: 0,
          skewY: 3,
          scrollTrigger: {
            trigger: line,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
        });
      });

      // Subtitle
      if (subtitleRef.current) {
        gsap.from(subtitleRef.current, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // Links
      const linkItems = linksRef.current?.querySelectorAll(".contact-link");
      if (linkItems) {
        gsap.from(linkItems, {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: linksRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-[var(--section-padding)] px-[var(--content-padding)] min-h-screen flex flex-col justify-center"
      aria-label="Contact"
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 80%, var(--barca-blue) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--off-white-faint), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Large statement */}
        <div className="mb-16 md:mb-24">
          <div
            ref={(el) => { headingRefs.current[0] = el; }}
          >
            <h2 className="text-section">LET&apos;S BUILD</h2>
          </div>
          <div
            ref={(el) => { headingRefs.current[1] = el; }}
          >
            <h2 className="text-section">SOMETHING</h2>
          </div>
          <div
            ref={(el) => { headingRefs.current[2] = el; }}
          >
            <h2 className="text-section" style={{ color: "var(--gold-muted)" }}>
              USEFUL.
            </h2>
          </div>
        </div>

        {/* Subtitle */}
        <div ref={subtitleRef} className="mb-16 md:mb-20 max-w-lg">
          <p className="text-body text-[var(--off-white-dim)] font-light mb-2">
            Available for interesting projects,
          </p>
          <p className="text-body text-[var(--off-white-dim)] font-light">
            collaborations and digital products.
          </p>
        </div>

        {/* Links */}
        <div ref={linksRef} className="flex flex-wrap gap-8 md:gap-12">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="contact-link text-small text-[var(--off-white)] tracking-[0.15em] link-underline hover:text-[var(--gold-muted)] transition-colors duration-500"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
