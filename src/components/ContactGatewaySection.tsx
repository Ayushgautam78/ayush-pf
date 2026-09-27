"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

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

export function ContactGatewaySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contactWrapperRef = useRef<HTMLDivElement>(null);
  const zoomFlareRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  useEffect(() => {
    const container = containerRef.current;
    const contactWrapper = contactWrapperRef.current;
    const zoomFlare = zoomFlareRef.current;
    if (!container || !contactWrapper || !zoomFlare) return;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

    function update() {
      if (!container || !contactWrapper || !zoomFlare) return;
      const viewH = window.innerHeight;
      const rect = container.getBoundingClientRect();

      if (rect.bottom < -50 || rect.top > viewH + 50) return;

      const scrollDistance = Math.max(1, rect.height - viewH);
      const progress = rect.top <= 0 ? clamp(-rect.top / scrollDistance, 0, 1) : 0;

      // Flare scale and bloom
      if (progress <= 0) {
        zoomFlare.style.opacity = "0.08";
        zoomFlare.style.transform = "scale(0.5)";
      } else if (progress <= 0.45) {
        const ft = progress / 0.45;
        zoomFlare.style.opacity = String(lerp(0.08, 0.65, ft));
        zoomFlare.style.transform = `scale(${lerp(0.5, 2.2, ft)})`;
      } else {
        const ft = (progress - 0.45) / 0.55;
        zoomFlare.style.opacity = String(lerp(0.65, 0.05, ft));
        zoomFlare.style.transform = `scale(${lerp(2.2, 4.5, ft)})`;
      }

      // Smooth reveal of contact form without full-screen blur or trapping
      if (progress < 0.35) {
        contactWrapper.style.opacity = "0";
        contactWrapper.style.visibility = "hidden";
        contactWrapper.style.pointerEvents = "none";
        contactWrapper.style.transform = "translateY(24px)";
      } else if (progress <= 0.8) {
        const t = (progress - 0.35) / 0.45;
        contactWrapper.style.visibility = "visible";
        contactWrapper.style.opacity = String(t);
        contactWrapper.style.transform = `translateY(${lerp(24, 0, t)}px)`;
        contactWrapper.style.pointerEvents = t >= 0.8 ? "auto" : "none";
      } else {
        contactWrapper.style.visibility = "visible";
        contactWrapper.style.opacity = "1";
        contactWrapper.style.transform = "translateY(0)";
        contactWrapper.style.pointerEvents = "auto";
      }
    }

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
      className="relative w-full bg-[var(--bg-primary)] overflow-visible"
      style={{ minHeight: "175vh" }}
      aria-label="Contact"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(15,17,22,0.95) 0%, rgba(9,10,13,1) 85%)",
          }}
          aria-hidden="true"
        />

        {/* Cinematic Crimson & Ivory Portal Flare */}
        <div
          className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          <div
            ref={zoomFlareRef}
            className="absolute rounded-full will-change-transform"
            style={{
              width: "clamp(250px, 38vw, 550px)",
              height: "clamp(250px, 38vw, 550px)",
              background:
                "radial-gradient(circle, rgba(169,24,35,0.32) 0%, rgba(169,24,35,0.08) 45%, transparent 75%)",
              filter: "blur(35px)",
              opacity: 0.08,
              transform: "scale(0.5)",
            }}
          />
          <div
            className="absolute w-[1px] h-[150vh] pointer-events-none opacity-30"
            style={{
              background:
                "linear-gradient(180deg, transparent, rgba(169,24,35,0.5) 50%, transparent)",
            }}
          />
        </div>

        {/* Contact form in deep near-black/charcoal container - NO data-lenis-prevent, NO nested scroll trapping */}
        <div
          ref={contactWrapperRef}
          className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 md:p-8 will-change-transform"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(18,20,27,0.99) 0%, rgba(9,10,13,1) 100%)",
            opacity: 0,
            visibility: "hidden",
            pointerEvents: "none",
            transform: "translateY(24px)",
          }}
        >
          <div className="w-full max-w-xl mx-auto px-5 sm:px-8 md:px-10 py-3 sm:py-6 text-[var(--ivory)] max-h-[94vh] overflow-y-auto overscroll-contain">
            {submitted ? (
              <div className="text-center py-16 sm:py-20 space-y-4 sm:space-y-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[var(--crimson)] mx-auto flex items-center justify-center bg-[var(--crimson)]/10">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--crimson)]"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-display)] text-[var(--ivory)]">Details received</h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-sm mx-auto">Thank you for reaching out. I usually reply within 24 hours.</p>
                <button type="button" onClick={() => setSubmitted(false)} className="mt-3 px-5 py-2 rounded-full border border-white/20 text-xs sm:text-sm text-[var(--ivory)] hover:bg-[var(--crimson)] hover:border-[var(--crimson)] transition-colors cursor-pointer">Send another</button>
              </div>
            ) : (
              <>
                {/* Header */}
                <p className="text-micro text-[var(--crimson)] tracking-[0.25em] mb-2 sm:mb-4 font-semibold">(Leave your details)</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)] text-[var(--ivory)] leading-[1] tracking-wide uppercase mb-2 sm:mb-4">
                  Open the door
                </h2>

                <div className="flex items-center gap-2.5 mb-5 sm:mb-8 md:mb-10">
                  <span className="text-xs sm:text-sm text-[var(--text-secondary)]">Or just write:</span>
                  <a href="mailto:hello@ayush.dev" className="text-xs sm:text-sm md:text-base text-[var(--ivory)] border-b border-[var(--crimson)] pb-0.5 hover:text-[var(--crimson)] transition-colors">hello@ayush.dev</a>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div className="contact-field">
                    <label htmlFor="c-name">Name</label>
                    <input id="c-name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your full name" />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="c-email">Email</label>
                    <input id="c-email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="name@company.com" />
                  </div>

                  {/* Phone with country code selector */}
                  <div className="contact-field">
                    <label htmlFor="c-phone">Phone</label>
                    <div className="flex items-center border-b border-white/15 focus-within:border-[var(--crimson)] transition-colors">
                      <div className="relative flex items-center pr-2 border-r border-white/15 mr-3">
                        <select
                          value={formData.countryCode}
                          onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                          className="bg-transparent text-[var(--ivory)] text-sm pr-5 py-3 outline-none cursor-pointer border-none appearance-none font-mono"
                          style={{ width: "auto", minWidth: "75px" }}
                          aria-label="Country Calling Code"
                        >
                          {COUNTRY_CODES.map((cc) => (
                            <option key={`${cc.country}-${cc.code}`} value={cc.code} className="bg-[#12141c] text-[var(--ivory)]">
                              {cc.country} {cc.code}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                      <input
                        id="c-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Phone number"
                        className="flex-1 bg-transparent text-[var(--ivory)] text-sm py-3 outline-none border-none placeholder-[var(--text-muted)]"
                        style={{ borderBottom: "none" }}
                      />
                    </div>
                  </div>

                  <div className="contact-field relative">
                    <label htmlFor="c-reason">Reason</label>
                    <div className="relative">
                      <select id="c-reason" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })}>
                        {REASON_OPTIONS.map((opt) => (<option key={opt} value={opt} className="bg-[#12141c] text-[var(--ivory)]">{opt}</option>))}
                      </select>
                      <svg className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                    </div>
                  </div>

                  <div className="contact-field">
                    <label htmlFor="c-msg">Message</label>
                    <textarea id="c-msg" rows={2} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="A few words" className="resize-none" />
                  </div>

                  {/* Bottom row: Submit + Social icons */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between pt-4 gap-6">
                    <div>
                      <button type="submit" disabled={loading} className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[var(--crimson)] text-[var(--ivory)] hover:bg-[var(--crimson-bright)] text-sm font-semibold tracking-wide transition-all shadow-[0_4px_16px_rgba(169,24,35,0.4)] disabled:opacity-50 cursor-pointer">
                        <span>{loading ? "Sending..." : "Send Details"}</span>
                        {!loading && (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>)}
                      </button>
                      <p className="text-[0.65rem] text-[var(--text-secondary)] mt-3">No spam. A real reply, usually the same day.</p>
                    </div>

                    {/* Social icons at bottom-right */}
                    <div className="flex items-center gap-2.5 pb-1">
                      {/* Twitter/X */}
                      <a
                        href="https://x.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full border border-white/10 bg-[#13151d] shadow-sm flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:border-[var(--crimson)] hover:bg-[var(--crimson)]/20 transition-all cursor-pointer"
                        aria-label="Twitter / X"
                        title="Twitter / X"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                      </a>
                      {/* Instagram */}
                      <a
                        href="https://instagram.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full border border-white/10 bg-[#13151d] shadow-sm flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:border-[var(--crimson)] hover:bg-[var(--crimson)]/20 transition-all cursor-pointer"
                        aria-label="Instagram"
                        title="Instagram"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
                      </a>
                      {/* GitHub */}
                      <a
                        href="https://github.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full border border-white/10 bg-[#13151d] shadow-sm flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:border-[var(--crimson)] hover:bg-[var(--crimson)]/20 transition-all cursor-pointer"
                        aria-label="GitHub"
                        title="GitHub"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                      </a>
                      {/* LinkedIn */}
                      <a
                        href="https://linkedin.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full border border-white/10 bg-[#13151d] shadow-sm flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:border-[var(--crimson)] hover:bg-[var(--crimson)]/20 transition-all cursor-pointer"
                        aria-label="LinkedIn"
                        title="LinkedIn"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                      </a>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
