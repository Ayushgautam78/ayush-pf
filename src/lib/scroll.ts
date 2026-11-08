import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

export const scrollToY = (y: number) => {
  if (instance) {
    instance.scrollTo(y, { duration: 1.6 });
  } else {
    window.scrollTo({ top: y, behavior: "smooth" });
  }
};

/**
 * Scrolls to a section. A section with data-scroll-progress is a tall sticky
 * wrapper, and landing at its top would miss the content it reveals.
 */
export const scrollToSection = (selector: string) => {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  const progress = Number(el.dataset.scrollProgress ?? 0);
  scrollToY(top + progress * Math.max(0, el.offsetHeight - window.innerHeight));
};
