"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is your typical turnaround time for a project?",
    answer:
      "Most custom web experiences and interactive landing pages take between 2 to 4 weeks depending on scope, 3D/motion complexity, and feedback cycles. Fast-track sprints are also available for urgent milestone launches.",
  },
  {
    question: "How does the design and development collaboration work?",
    answer:
      "We begin with discovery and narrative alignment, craft high-fidelity interaction prototypes, and build directly with modern engineering stacks (Next.js 16, React 19, GSAP, TypeScript). You get private staging deployment previews throughout every phase.",
  },
  {
    question: "Can you collaborate with existing engineering or product teams?",
    answer:
      "Absolutely. I frequently plug into existing development teams as a specialized creative engineer or design engineer to elevate key interactive user touchpoints, optimize performance, or engineer Web3 tooling.",
  },
  {
    question: "What technology stack and animation libraries do you specialize in?",
    answer:
      "My primary stack centers on Next.js, React 19, TypeScript, and Tailwind CSS. For animation and 3D graphics, I specialize in GSAP (ScrollTrigger, Flip, Scrub physics), Three.js / WebGL canvas rendering, and Lenis smooth scrolling.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative z-10 py-16 md:py-24 px-[var(--content-padding)] border-t border-[var(--slate-blue)]/30"
      aria-label="Frequently Asked Questions"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--slate-blue)]/60 bg-[var(--bg-storm-deep)]/60 text-micro tracking-[0.2em] text-[var(--muted-bronze)] uppercase font-medium mb-3">
            <span>SOME DOUBTS</span>
          </div>

          <h2 className="text-section font-bold tracking-tight text-[var(--warm-ivory)] leading-tight mb-3">
            Frequently Asked Questions
          </h2>

          <p className="text-body text-[var(--weathered-stone)] max-w-xl mx-auto font-light">
            Answers to common questions regarding collaboration, project timelines, engineering stacks, and workflow.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-[var(--metallic-highlight)]/60 bg-[var(--bg-storm-deep)]/75 shadow-lg"
                    : "border-[var(--slate-blue)]/40 bg-[var(--bg-storm-deep)]/30 hover:border-[var(--slate-blue)]/80 hover:bg-[var(--bg-storm-deep)]/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base md:text-lg font-semibold text-[var(--warm-ivory)] pr-4">
                    {item.question}
                  </span>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-transform duration-300 ${
                      isOpen
                        ? "border-[var(--metallic-highlight)] bg-[var(--metallic-highlight)]/10 text-[var(--metallic-highlight)] rotate-45"
                        : "border-[var(--slate-blue)] text-[var(--weathered-stone)]"
                    }`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 md:px-6 md:pb-7 pt-1 border-t border-[var(--slate-blue)]/20 animate-in fade-in duration-200">
                    <p className="text-small text-[var(--weathered-stone)] leading-relaxed font-light">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom helper badge */}
        <div className="mt-10 p-5 rounded-2xl border border-[var(--slate-blue)]/50 bg-[var(--bg-storm-deep)]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <p className="text-small text-[var(--weathered-stone)]">
              Have a custom inquiry or special project requirements?
              <span className="block sm:inline sm:ml-1 text-[var(--warm-ivory)] font-medium">
                Typical reply within 12 hours.
              </span>
            </p>
          </div>
          <a
            href="#contact"
            className="px-4 py-2 rounded-xl border border-[var(--metallic-highlight)]/50 bg-[var(--metallic-highlight)]/10 hover:bg-[var(--metallic-highlight)]/25 text-micro tracking-wider uppercase font-semibold text-[var(--warm-ivory)] transition-colors whitespace-nowrap cursor-pointer"
          >
            Direct Inquiry →
          </a>
        </div>
      </div>
    </section>
  );
}
