"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { DOORS, easeInOutCubic, lerp, range, stickyProgress } from "@/lib/motion";
import { SocialLinks } from "./SocialLinks";

const REASON_OPTIONS = [
  "Freelance project",
  "Full-time opportunity",
  "Collaboration",
  "Open source",
  "Just saying hi",
  "Other",
];

const COUNTRY_CODES = [
  { code: "+91", country: "IN" },
  { code: "+1", country: "US" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "AU" },
  { code: "+49", country: "DE" },
  { code: "+33", country: "FR" },
  { code: "+81", country: "JP" },
  { code: "+86", country: "CN" },
  { code: "+971", country: "AE" },
  { code: "+65", country: "SG" },
  { code: "+82", country: "KR" },
  { code: "+55", country: "BR" },
  { code: "+7", country: "RU" },
  { code: "+39", country: "IT" },
  { code: "+34", country: "ES" },
  { code: "+31", country: "NL" },
  { code: "+46", country: "SE" },
  { code: "+41", country: "CH" },
  { code: "+48", country: "PL" },
  { code: "+90", country: "TR" },
  { code: "+966", country: "SA" },
  { code: "+234", country: "NG" },
  { code: "+254", country: "KE" },
  { code: "+27", country: "ZA" },
  { code: "+52", country: "MX" },
  { code: "+54", country: "AR" },
  { code: "+62", country: "ID" },
  { code: "+60", country: "MY" },
  { code: "+63", country: "PH" },
  { code: "+66", country: "TH" },
  { code: "+84", country: "VN" },
  { code: "+880", country: "BD" },
  { code: "+92", country: "PK" },
  { code: "+94", country: "LK" },
  { code: "+977", country: "NP" },
];

const DOOR_BACKGROUND = "linear-gradient(180deg, #151d3a 0%, #0c1224 55%, #080b16 100%)";

const Chevron = () => (
  <svg
    className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]"
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/**
 * ContactGatewaySection
 *
 * "Open the door", literally: the sword (SingleSwordSystem) comes down the
 * seam between two doors, and they part to reveal the form behind them.
 */
export function ContactGatewaySection() {
  const containerRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const doorLeftRef = useRef<HTMLDivElement>(null);
  const doorRightRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    reason: "Freelance project",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendError, setSendError] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSendError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, website: honeypotRef.current?.value ?? "" }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setSubmitted(true);
      setFormData((data) => ({ ...data, phone: "", message: "" }));
    } catch {
      setSendError("Your message couldn't be sent right now. Please email me directly at hello@ayush.dev.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    const form = formRef.current;
    const doorLeft = doorLeftRef.current;
    const doorRight = doorRightRef.current;
    const seam = seamRef.current;
    const ring = ringRef.current;
    if (!container || !form || !doorLeft || !doorRight || !seam || !ring) return;

    const update = () => {
      const viewH = window.innerHeight;
      const rect = container.getBoundingClientRect();
      if (rect.bottom < -50 || rect.top > viewH + 50) return;

      const p = rect.top <= 0 ? stickyProgress(rect, viewH) : 0;

      // The doors jolt on impact before they give way
      const hit = range(p, DOORS.impact, DOORS.impact + 0.05);
      const jolt = hit > 0 && hit < 1 ? Math.sin(hit * Math.PI * 4) * (1 - hit) * 7 : 0;
      const open = easeInOutCubic(range(p, DOORS.openStart, DOORS.openEnd));
      doorLeft.style.transform = `translate3d(${-open * 102}%, ${jolt}px, 0)`;
      doorRight.style.transform = `translate3d(${open * 102}%, ${jolt}px, 0)`;
      const closedOut = open >= 0.999;
      doorLeft.style.visibility = closedOut ? "hidden" : "visible";
      doorRight.style.visibility = closedOut ? "hidden" : "visible";

      seam.style.opacity = String(range(p, DOORS.impact - 0.03, DOORS.impact) * (1 - range(p, DOORS.openStart, DOORS.openStart + 0.12)));

      const ringT = range(p, DOORS.impact, DOORS.impact + 0.14);
      ring.style.opacity = ringT > 0 && ringT < 1 ? String(1 - ringT) : "0";
      ring.style.transform = `translate(-50%, -50%) scale(${lerp(0.1, 1.6, ringT)})`;

      const reveal = range(p, DOORS.formStart, DOORS.formEnd);
      form.style.opacity = String(reveal);
      form.style.transform = `translate3d(0, ${lerp(28, 0, reveal)}px, 0) scale(${lerp(0.97, 1, reveal)})`;
      form.style.pointerEvents = reveal >= 0.7 ? "auto" : "none";
      form.style.visibility = reveal > 0 ? "visible" : "hidden";
    };

    gsap.ticker.add(update);
    update();

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <section
      id="contact"
      ref={containerRef}
      data-scroll-progress={DOORS.rest}
      className="relative z-[2] w-full bg-[var(--bg-primary)]"
      style={{ height: "340svh" }}
      aria-label="Contact"
    >
      <div
        className="sticky top-0 h-[100svh] w-full overflow-hidden"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 40%, #131c3a 0%, var(--bg-primary) 75%)",
        }}
      >
        {/* The room behind the doors */}
        <div
          ref={formRef}
          className="absolute inset-0 z-10 flex items-center justify-center overflow-y-auto p-5 sm:p-8 will-change-transform"
          style={{ opacity: 0, visibility: "hidden" }}
          data-lenis-prevent
        >
          <div className="w-full max-w-3xl my-auto text-[var(--ivory)]">
            {submitted ? (
              <div className="text-center space-y-4">
                <h3 className="text-section">Details received</h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
                  Thank you for reaching out. I usually reply within 24 hours.
                </p>
                <button type="button" onClick={() => setSubmitted(false)} className="btn-ghost px-5 py-2.5 mt-3">
                  Send another
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 sm:mb-8">
                  <p className="text-micro text-[var(--gold)] mb-2">Leave your details</p>
                  <h2 className="font-[family-name:var(--font-display)] uppercase text-[2.3rem] sm:text-6xl leading-none mb-3">
                    The door is open
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Or write:{" "}
                    <a href="mailto:hello@ayush.dev" className="text-[var(--ivory)] border-b border-[var(--gold)] pb-0.5 hover:text-[var(--gold-bright)] transition-colors">
                      hello@ayush.dev
                    </a>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
                  {/* Spam trap: hidden from people, filled in by bots */}
                  <input
                    ref={honeypotRef}
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] w-px h-px opacity-0"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                    <div className="contact-field">
                      <label htmlFor="c-name">Name</label>
                      <input id="c-name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your full name" />
                    </div>

                    <div className="contact-field">
                      <label htmlFor="c-email">Email</label>
                      <input id="c-email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="name@company.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                    <div className="contact-field">
                      <label htmlFor="c-phone">Phone</label>
                      <div className="flex items-stretch gap-3">
                        <div className="relative flex-shrink-0 w-[5.6rem]">
                          <select
                            value={formData.countryCode}
                            onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                            aria-label="Country Calling Code"
                          >
                            {COUNTRY_CODES.map((cc) => (
                              <option key={`${cc.country}-${cc.code}`} value={cc.code}>
                                {cc.country} {cc.code}
                              </option>
                            ))}
                          </select>
                          <Chevron />
                        </div>
                        <input
                          id="c-phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Phone number"
                          className="min-w-0"
                        />
                      </div>
                    </div>

                    <div className="contact-field">
                      <label htmlFor="c-reason">Reason</label>
                      <div className="relative">
                        <select id="c-reason" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })}>
                          {REASON_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <Chevron />
                      </div>
                    </div>
                  </div>

                  <div className="contact-field">
                    <label htmlFor="c-msg">Message</label>
                    <textarea id="c-msg" rows={2} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="A few words about your project" className="resize-none" />
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
                    <button type="submit" disabled={loading} className="btn-gold px-6 py-3">
                      {loading ? "Sending..." : "Send Details"}
                      {!loading && <span aria-hidden="true">→</span>}
                    </button>
                    <SocialLinks />
                  </div>
                  {sendError && (
                    <p role="alert" className="text-sm text-[var(--gold-bright)]">
                      {sendError}
                    </p>
                  )}
                </form>
              </>
            )}
          </div>
        </div>

        {/* The doors */}
        <div
          ref={doorLeftRef}
          className="absolute inset-y-0 left-0 w-1/2 z-20 will-change-transform flex"
          style={{ background: DOOR_BACKGROUND }}
          aria-hidden="true"
        >
          <div className="flex-1 flex flex-col gap-3 sm:gap-5 p-3 sm:p-6 pr-4 sm:pr-8">
            <div className="flex-[3] border border-[var(--gold-border)] opacity-80" />
            <div className="flex-[2] border border-[var(--gold-border)] opacity-80" />
          </div>
          <div className="meander-v h-full" />
        </div>
        <div
          ref={doorRightRef}
          className="absolute inset-y-0 right-0 w-1/2 z-20 will-change-transform flex"
          style={{ background: DOOR_BACKGROUND }}
          aria-hidden="true"
        >
          <div className="meander-v h-full" style={{ transform: "scaleX(-1)" }} />
          <div className="flex-1 flex flex-col gap-3 sm:gap-5 p-3 sm:p-6 pl-4 sm:pl-8">
            <div className="flex-[3] border border-[var(--gold-border)] opacity-80" />
            <div className="flex-[2] border border-[var(--gold-border)] opacity-80" />
          </div>
        </div>

        {/* Below the sword's tip, so the blade never crosses the words */}
        <DoorTitle doorLeftRef={doorLeftRef} />

        <div
          ref={seamRef}
          className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 z-30 pointer-events-none"
          style={{
            opacity: 0,
            background: "linear-gradient(180deg, #fff6dc, var(--gold-bright) 46%, transparent 62%)",
            boxShadow: "0 0 26px 5px rgba(246,213,138,0.55)",
          }}
          aria-hidden="true"
        />
        <div
          ref={ringRef}
          className="absolute left-1/2 top-[46%] w-[70vmin] h-[70vmin] rounded-full border-2 border-[var(--gold-bright)] z-30 pointer-events-none"
          style={{ opacity: 0 }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

function DoorTitle({ doorLeftRef }: { doorLeftRef: React.RefObject<HTMLDivElement | null> }) {
  const titleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const update = () => {
      const door = doorLeftRef.current;
      const title = titleRef.current;
      if (!door || !title) return;
      const moved = door.getBoundingClientRect().left / door.offsetWidth;
      title.style.opacity = String(1 - range(-moved, 0, 0.14));
    };
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, [doorLeftRef]);

  return (
    <p
      ref={titleRef}
      className="absolute inset-x-0 top-[68%] z-30 text-center pointer-events-none font-[family-name:var(--font-display)] uppercase text-[13vw] sm:text-[9vw] leading-none text-[var(--ivory)]"
      aria-hidden="true"
    >
      Open the door
    </p>
  );
}
