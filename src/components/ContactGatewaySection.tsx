"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { DOORS, clamp, damp, easeInOutCubic, easeOutCubic, lerp, range, stickyProgress } from "@/lib/motion";
import { SocialLinks } from "./SocialLinks";
import { Magnetic } from "./Tilt";
import { GreekVista } from "./GreekVista";
import { DustMotes } from "./DustMotes";

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

const COLUMN_WIDTH = "clamp(34px,7.5vw,128px)";
/** Distance from the screen edge to the doorway: wall, column, a sliver of wall. */
const DOOR_INSET = `calc(5vw + ${COLUMN_WIDTH})`;
const LINTEL = "calc(17svh + 12px)";
/** Height of the stone steps the doorway stands on. */
const STEPS = "11svh";

const DOOR_SURFACE =
  "repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 2px, transparent 2px 9px), linear-gradient(180deg, #1d1918 0%, #110f0e 55%, #090808 100%)";
const METAL = "linear-gradient(180deg, #6b6762 0%, #3a3734 45%, #1c1b1a 100%)";
const STUDS = "radial-gradient(circle, rgba(242,238,230,0.42) 0 1.4px, rgba(0,0,0,0.6) 1.6px 2.4px, transparent 2.6px)";
const WALL =
  "repeating-linear-gradient(0deg, rgba(242,238,230,0.05) 0 1px, transparent 1px 56px), linear-gradient(180deg, #121111 0%, #0a0a0a 100%)";

/** A bronze strap across the door, studded along its length. */
function Strap({ top }: { top: string }) {
  return (
    <div className="absolute inset-x-0 h-[3.2%]" style={{ top, background: METAL, boxShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>
      <div className="w-full h-full" style={{ backgroundImage: STUDS, backgroundSize: "22px 100%", backgroundPosition: "center" }} />
    </div>
  );
}

/** A cast ring knocker hanging from a boss. */
function Knocker({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 100 120" className={`absolute w-[clamp(30px,5vw,76px)] ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id="knocker-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2eee6" />
          <stop offset="0.45" stopColor="#8f8a84" />
          <stop offset="1" stopColor="#2b2927" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="28" r="22" fill="url(#knocker-metal)" />
      <circle cx="50" cy="28" r="12" fill="#151413" />
      <circle cx="50" cy="28" r="5" fill="#d62a1f" />
      <circle cx="50" cy="72" r="34" fill="none" stroke="url(#knocker-metal)" strokeWidth="9" />
      <circle cx="50" cy="72" r="34" fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="1" />
    </svg>
  );
}

/**
 * One leaf of the temple door. It has a front face and a visible edge, so it
 * reads as a thick slab when it swings, and a shade layer the scroll
 * darkens as the face turns away from the light.
 */
function Door({ side }: { side: "left" | "right" }) {
  const seam = side === "left" ? "right" : "left";
  return (
    <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
      <div className="absolute inset-0 overflow-hidden" style={{ background: DOOR_SURFACE, boxShadow: "inset 0 0 60px rgba(0,0,0,0.7)" }}>
        <Strap top="7%" />
        <Strap top="89%" />
        <div className="absolute inset-x-[9%] top-[14%] bottom-[14%] flex flex-col gap-[4%]">
          {[3, 2].map((flex) => (
            <div
              key={flex}
              className="relative border border-[var(--red-border)]"
              style={{ flex, boxShadow: "inset 6px 6px 14px rgba(0,0,0,0.7), inset -2px -2px 0 rgba(242,238,230,0.06)" }}
            >
              <div
                className="absolute inset-[9%] border border-[var(--border-subtle)]"
                style={{ backgroundImage: STUDS, backgroundSize: "30px 30px" }}
              />
            </div>
          ))}
        </div>
        <Knocker className={`top-[40%] ${seam === "right" ? "right-[11%]" : "left-[11%]"}`} />
        <div className={`absolute top-0 bottom-0 ${seam}-0 meander-v`} />
        <div data-shade className="absolute inset-0 bg-black" style={{ opacity: 0 }} />
      </div>
      {/* The door's thickness, seen as it swings */}
      <div
        className={`absolute top-0 bottom-0 ${seam}-0 w-[22px]`}
        style={{
          background: "linear-gradient(90deg, #2a2725, #121110)",
          transform: `rotateY(${side === "left" ? -90 : 90}deg)`,
          transformOrigin: seam === "right" ? "100% 50%" : "0% 50%",
        }}
      />
    </div>
  );
}

/** A fluted column: capital, shaft and base. */
function Column({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute top-0 bottom-0 flex flex-col ${className}`} style={{ width: COLUMN_WIDTH }} aria-hidden="true">
      <div className="h-[3%] bg-[var(--bone)] opacity-90" />
      <div className="h-[2.2%] mx-[-12%] bg-[var(--bone)]" />
      <div
        className="flex-1 mx-[6%] fluting border-x border-[var(--border-medium)]"
        style={{ backgroundColor: "#171616", boxShadow: "inset -18px 0 24px rgba(0,0,0,0.6), inset 10px 0 18px rgba(242,238,230,0.05)" }}
      />
      <div className="h-[2.4%] mx-[-8%] bg-[var(--bone)] opacity-90" />
    </div>
  );
}

/**
 * ContactGatewaySection
 *
 * "Open the door", literally. A temple front closes the page: the sword
 * (SingleSwordSystem) strikes the seam and light cracks through. The heavy
 * doors swing inward on their hinges onto a sunset colonnade (GreekVista),
 * and the camera walks through the doorway into it, where the form waits.
 * Every beat runs on a damped copy of scroll progress so it glides.
 */
export function ContactGatewaySection() {
  const containerRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const templeRef = useRef<HTMLDivElement>(null);
  const doorLeftRef = useRef<HTMLDivElement>(null);
  const doorRightRef = useRef<HTMLDivElement>(null);
  const vistaRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const crackRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const spillRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLCanvasElement>(null);

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
    const temple = templeRef.current;
    const doorLeft = doorLeftRef.current;
    const doorRight = doorRightRef.current;
    const vista = vistaRef.current;
    const dim = dimRef.current;
    const crack = crackRef.current;
    const rays = raysRef.current;
    const ring = ringRef.current;
    const spill = spillRef.current;
    const dustCanvas = dustRef.current;
    const dust = dustCanvas?.getContext("2d");
    if (!container || !form || !temple || !doorLeft || !doorRight || !vista || !dim || !crack || !rays || !ring || !spill || !dustCanvas || !dust) return;

    // Grit shaken loose from the lintel by the strike
    type Mote = { x: number; y: number; vx: number; vy: number; life: number; size: number };
    let motes: Mote[] = [];
    let lastTarget = 0;
    const shakeDust = () => {
      const w = dustCanvas.width;
      motes = Array.from({ length: 140 }, () => ({
        x: Math.random() * w,
        y: Math.random() * 6,
        vx: (Math.random() - 0.5) * 18,
        vy: 20 + Math.random() * 60,
        life: 1.4 + Math.random() * 1.8,
        size: 0.6 + Math.random() * 1.6,
      }));
    };
    const drawDust = (dt: number) => {
      if (!motes.length) return;
      dust.clearRect(0, 0, dustCanvas.width, dustCanvas.height);
      motes = motes.filter((m) => (m.life -= dt) > 0);
      for (const m of motes) {
        m.vy += 140 * dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        dust.fillStyle = `rgba(214, 205, 192, ${Math.min(1, m.life) * 0.7})`;
        dust.fillRect(m.x, m.y, m.size, m.size);
      }
    };
    const sizeDust = () => {
      dustCanvas.width = dustCanvas.offsetWidth;
      dustCanvas.height = dustCanvas.offsetHeight;
    };
    sizeDust();
    window.addEventListener("resize", sizeDust);

    const shades = [doorLeft, doorRight].map((door) => door.querySelector<HTMLElement>("[data-shade]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let smooth = 0;

    const update = (_time: number, deltaTime: number) => {
      const viewH = window.innerHeight;
      const rect = container.getBoundingClientRect();
      if (rect.bottom < -50 || rect.top > viewH + 50) return;

      const target = rect.top <= 0 ? stickyProgress(rect, viewH) : 0;
      const dt = Math.min((deltaTime || 16) / 1000, 0.05);
      if (lastTarget < DOORS.impact && target >= DOORS.impact && !reducedMotion) shakeDust();
      lastTarget = target;
      drawDust(dt);
      // A low stiffness gives the doors their weight
      smooth = reducedMotion ? target : damp(smooth, target, 5.5, dt);
      const p = smooth;

      // The strike knocks the doors ajar and they shudder
      const hit = range(p, DOORS.impact, DOORS.impact + 0.05);
      const jolt = hit > 0 && hit < 1 ? Math.sin(hit * Math.PI * 4) * (1 - hit) * 1.4 : 0;
      const ajar = easeOutCubic(range(p, DOORS.impact, DOORS.impact + 0.05)) * 3.5;
      const open = easeInOutCubic(range(p, DOORS.openStart, DOORS.openEnd));
      const angle = ajar + open * 100 + jolt;
      doorLeft.style.transform = `rotateY(${angle}deg)`;
      doorRight.style.transform = `rotateY(${-angle}deg)`;
      shades.forEach((shade) => {
        if (shade) shade.style.opacity = String(0.1 + open * 0.6);
      });

      // A blade of light through the crack, then rays as the doors part
      crack.style.opacity = String(range(p, DOORS.impact, DOORS.impact + 0.03) * (1 - range(open, 0.15, 0.5)));
      const pass = easeInOutCubic(range(p, DOORS.passStart, DOORS.passEnd));
      rays.style.opacity = String(clamp(open * 1.4) * (1 - pass) * 0.9);

      const ringT = range(p, DOORS.impact, DOORS.impact + 0.12);
      ring.style.opacity = ringT > 0 && ringT < 1 ? String(1 - ringT) : "0";
      ring.style.transform = `translate(-50%, -50%) scale(${lerp(0.1, 1.5, ringT)})`;

      // Sunlight spills out over the steps as the gap widens
      spill.style.opacity = String(clamp(open * 1.3) * (1 - pass));
      spill.style.transform = `scaleX(${lerp(0.05, 1, open)})`;

      // The camera shakes with the strike, eases forward as the doors open,
      // then walks through
      const shake = hit > 0 && hit < 1 && !reducedMotion ? Math.sin(hit * Math.PI * 9) * (1 - hit) * 7 : 0;
      temple.style.transform = `translate3d(0, ${shake}px, 0) scale(${lerp(1, 1.08, open) * lerp(1, 3.6, pass)})`;
      temple.style.opacity = String(1 - range(pass, 0.6, 1));
      temple.style.visibility = pass >= 0.999 ? "hidden" : "visible";
      vista.style.transform = `scale(${lerp(1.4, 1, easeOutCubic(range(p, DOORS.openStart, DOORS.passEnd)))})`;

      const reveal = easeInOutCubic(range(p, DOORS.formStart, DOORS.formEnd));
      dim.style.opacity = String(reveal * 0.6);
      form.style.opacity = String(reveal);
      form.style.transform = `translate3d(0, ${lerp(40, 0, reveal)}px, 0)`;
      form.style.pointerEvents = reveal >= 0.7 ? "auto" : "none";
      form.style.visibility = reveal > 0 ? "visible" : "hidden";
    };

    gsap.ticker.add(update);
    update(0, 16);

    return () => {
      gsap.ticker.remove(update);
      window.removeEventListener("resize", sizeDust);
    };
  }, []);

  return (
    <section
      id="contact"
      ref={containerRef}
      data-scroll-progress={DOORS.rest}
      className="relative z-[2] w-full bg-[var(--bg-primary)]"
      style={{ height: "380svh" }}
      aria-label="Contact"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[var(--bg-primary)]">
        {/* Beyond the doors */}
        <div ref={vistaRef} className="absolute inset-0 will-change-transform" style={{ transformOrigin: "50% 62%" }} aria-hidden="true">
          <GreekVista />
          <DustMotes count={70} />
        </div>
        <div ref={dimRef} className="absolute inset-0 bg-[var(--bg-primary)]" style={{ opacity: 0 }} aria-hidden="true" />

        {/* The form, standing in the colonnade */}
        <div
          ref={formRef}
          className="absolute inset-0 z-10 flex items-center justify-center p-3 sm:p-8 will-change-transform"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          <div className="w-full max-w-3xl max-h-full overflow-y-auto p-5 sm:p-10 text-[var(--bone)] bg-[rgba(8,8,9,0.72)] backdrop-blur-md border border-[var(--border-medium)]" data-lenis-prevent>
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
                  <p className="text-micro section-index mb-3"><span>Ε</span><span className="text-[var(--red)]">Leave your details</span></p>
                  <h2 className="font-[family-name:var(--font-display)] font-extrabold uppercase tracking-[-0.05em] text-[2.3rem] sm:text-7xl leading-[0.9] mb-3">
                    The door is open
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Or write:{" "}
                    <a href="mailto:hello@ayush.dev" className="text-[var(--bone)] border-b border-[var(--red)] pb-0.5 hover:text-[var(--red-bright)] transition-colors">
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
                    <Magnetic>
                      <button type="submit" disabled={loading} className="btn-red px-7 py-3.5">
                        {loading ? "Sending..." : "Send Details"}
                        {!loading && <span aria-hidden="true">→</span>}
                      </button>
                    </Magnetic>
                    <SocialLinks />
                  </div>
                  {sendError && (
                    <p role="alert" className="text-sm text-[var(--red-bright)]">
                      {sendError}
                    </p>
                  )}
                </form>
              </>
            )}
          </div>
        </div>

        {/* The temple front: it grows past the camera as you walk through */}
        <div ref={templeRef} className="absolute inset-0 z-20 will-change-transform" style={{ transformOrigin: "50% 62%" }} aria-hidden="true">
          {/* Architrave with the Delphic maxim */}
          <div
            className="absolute inset-x-0 top-0 h-[17svh] flex flex-col items-center justify-end pb-[1.6svh] border-b border-[var(--border-medium)]"
            style={{ background: WALL }}
          >
            <p className="font-greek text-[var(--bone)] text-[clamp(1.2rem,4.4vw,3.6rem)] tracking-[0.32em] leading-none pl-[0.32em]">
              ΓΝΩΘΙ ΣΕΑΥΤΟΝ
            </p>
            <p className="text-micro text-[var(--text-secondary)] mt-2">Know thyself</p>
          </div>
          <div className="meander absolute inset-x-0 top-[17svh]" />

          {/* Walls either side of the doorway, each with its column */}
          <div className="absolute left-0" style={{ top: LINTEL, bottom: STEPS, width: DOOR_INSET, background: WALL }}>
            <Column className="right-[1vw]" />
          </div>
          <div className="absolute right-0" style={{ top: LINTEL, bottom: STEPS, width: DOOR_INSET, background: WALL }}>
            <Column className="left-[1vw]" />
          </div>

          {/* Three stone steps up to the threshold, with light pouring down them */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col" style={{ height: STEPS }}>
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className="flex-1 border-t border-[rgba(242,238,230,0.22)]"
                style={{
                  marginInline: `${-step * 1.5}vw`,
                  background: `linear-gradient(180deg, ${["#2a2827", "#1f1e1d", "#161515"][step]} 0%, #0b0b0b 100%)`,
                }}
              />
            ))}
            <div
              ref={spillRef}
              className="absolute inset-0 pointer-events-none"
              style={{
                opacity: 0,
                mixBlendMode: "screen",
                clipPath: "polygon(38% 0, 62% 0, 82% 100%, 18% 100%)",
                background: "linear-gradient(180deg, rgba(255,226,206,0.75) 0%, rgba(214,42,31,0.25) 70%, transparent 100%)",
              }}
            />
          </div>

          {/* The doorway */}
          <div className="absolute" style={{ top: LINTEL, bottom: STEPS, left: DOOR_INSET, right: DOOR_INSET, perspective: "1600px" }}>
            {/* Light through the crack after the strike */}
            <div
              ref={crackRef}
              className="absolute inset-y-0 left-1/2 w-[6px] -translate-x-1/2"
              style={{
                opacity: 0,
                background: "linear-gradient(180deg, #fff7ee, #ffd6c4 60%, #d62a1f)",
                boxShadow: "0 0 30px 8px rgba(255,200,180,0.55), 0 0 90px 30px rgba(214,42,31,0.35)",
              }}
            />
            <div ref={doorLeftRef} className="absolute inset-y-0 left-0 w-1/2 will-change-transform" style={{ transformOrigin: "0% 50%", transformStyle: "preserve-3d" }}>
              <Door side="left" />
              <p className="absolute right-[12%] bottom-[16%] font-[family-name:var(--font-display)] font-extrabold uppercase text-[var(--bone)] text-[clamp(1rem,4.2vw,5.4rem)] leading-none tracking-[-0.05em]" style={{ textShadow: "0 2px 12px #000" }}>
                Open the
              </p>
            </div>
            <div ref={doorRightRef} className="absolute inset-y-0 right-0 w-1/2 will-change-transform" style={{ transformOrigin: "100% 50%", transformStyle: "preserve-3d" }}>
              <Door side="right" />
              <p className="absolute left-[12%] bottom-[16%] font-greek italic text-[var(--red)] text-[clamp(1.2rem,5vw,6.4rem)] leading-none" style={{ textShadow: "0 2px 12px #000" }}>
                door
              </p>
            </div>
            {/* Sunlight pouring past the doors */}
            <div
              ref={raysRef}
              className="absolute inset-0 pointer-events-none"
              style={{
                opacity: 0,
                mixBlendMode: "screen",
                background:
                  "conic-gradient(from 180deg at 50% -10%, transparent 0deg, rgba(255,226,210,0.0) 150deg, rgba(255,226,210,0.35) 165deg, rgba(255,240,230,0.0) 172deg, rgba(255,226,210,0.3) 180deg, rgba(255,240,230,0) 188deg, rgba(255,226,210,0.35) 195deg, transparent 210deg)",
              }}
            />
            {/* The depth of the opening: shadow inside the lintel and jambs */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ boxShadow: "inset 0 40px 50px -10px rgba(0,0,0,0.9), inset 36px 0 40px -14px rgba(0,0,0,0.85), inset -36px 0 40px -14px rgba(0,0,0,0.85)" }}
            />
            <canvas ref={dustRef} className="absolute inset-0 w-full h-full pointer-events-none" />
          </div>
        </div>

        <div
          ref={ringRef}
          className="absolute left-1/2 top-[48%] w-[70vmin] h-[70vmin] rounded-full border border-[var(--bone)] z-30 pointer-events-none"
          style={{ opacity: 0 }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
