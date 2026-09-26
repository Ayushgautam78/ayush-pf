"use client";

import React, { useState } from "react";

const TOPICS = [
  "Project",
  "Website / Frontend",
  "Web3 Collaboration",
  "Content Collaboration",
  "Community Collaboration",
  "Tool / Product",
  "Campaign / Promotion",
  "Other",
];

const BUDGET_OPTIONS = [
  "Just exploring",
  "Small project",
  "Medium project",
  "Larger project",
  "Not sure yet",
];

const CONTACT_METHODS = ["Email", "X", "Discord"];

export function DedicatedContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "Project",
    projectDetails: "",
    budget: "Medium project",
    moreInfo: "",
    contactMethod: "Email",
  });

  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("hello@ayush.dev");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-14 text-[var(--warm-ivory)]">
      {/* Top Bar with Return button */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--slate-blue)]/50">
        <button
          type="button"
          onClick={() => {
            const journey = document.getElementById("journey");
            if (journey) journey.scrollIntoView({ behavior: "smooth" });
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2 text-micro text-[var(--weathered-stone)] hover:text-[var(--warm-ivory)] tracking-widest uppercase transition-colors cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Return to Portfolio</span>
        </button>
        <span className="text-micro text-[var(--muted-bronze)] tracking-[0.2em] uppercase opacity-85">
          Artifact Gateway
        </span>
      </div>

      {/* Header Statement */}
      <div className="mb-12 md:mb-16">
        <p className="text-micro text-[var(--muted-bronze)] tracking-[0.25em] uppercase mb-4 font-medium">
          Direct Inquiries & Collaboration
        </p>
        <h2 className="text-section leading-[0.92] tracking-tight font-extrabold uppercase text-[var(--warm-ivory)]">
          LET&apos;S BUILD
          <br />
          SOMETHING
          <br />
          <span style={{ color: "var(--muted-bronze)" }}>USEFUL.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Option 1: Direct Email & Channels */}
        <div className="lg:col-span-4 space-y-10">
          <div>
            <h3 className="text-micro text-[var(--muted-bronze)] tracking-[0.2em] uppercase mb-4 font-medium">
              Direct Inquiries
            </h3>
            <p className="text-body text-[var(--weathered-stone)] font-light mb-6">
              Prefer a direct conversation? Drop a note directly to my inbox anytime.
            </p>

            <div className="p-5 rounded-xl border border-[var(--slate-blue)] bg-[var(--bg-storm-deep)]/60 backdrop-blur-sm space-y-4">
              <div>
                <span className="text-micro text-[var(--weathered-stone)] uppercase tracking-wider block mb-1">
                  Email
                </span>
                <a
                  href="mailto:hello@ayush.dev"
                  className="text-subheading font-medium text-[var(--warm-ivory)] hover:text-[var(--metallic-highlight)] transition-colors duration-300 break-all"
                >
                  hello@ayush.dev
                </a>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-4 py-2 rounded-lg text-micro tracking-wider uppercase border border-[var(--slate-blue)] hover:border-[var(--muted-bronze)] text-[var(--warm-ivory)] hover:bg-[var(--slate-blue)]/20 transition-all duration-300 cursor-pointer"
                >
                  {copied ? "Copied" : "Copy Email"}
                </button>
                <a
                  href="mailto:hello@ayush.dev"
                  className="px-4 py-2 rounded-lg text-micro tracking-wider uppercase bg-[var(--muted-bronze)] text-[var(--bg-primary)] font-semibold hover:bg-[var(--metallic-highlight)] transition-colors duration-300 flex items-center gap-1.5"
                >
                  <span>Open Client</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-micro text-[var(--muted-bronze)] tracking-[0.2em] uppercase mb-4 font-medium">
              Direct Channels
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { name: "X / Twitter", handle: "@ayush", href: "https://x.com" },
                { name: "GitHub", handle: "github.com", href: "https://github.com" },
                { name: "Discord", handle: "Discord Community", href: "https://discord.com" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3.5 rounded-lg border border-[var(--slate-blue)]/60 bg-[var(--bg-storm-deep)]/30 hover:border-[var(--muted-bronze)]/60 hover:bg-[var(--bg-storm-deep)]/60 transition-all duration-300"
                >
                  <div>
                    <span className="text-small font-medium text-[var(--warm-ivory)] group-hover:text-[var(--metallic-highlight)] transition-colors">
                      {item.name}
                    </span>
                    <span className="text-micro text-[var(--weathered-stone)] block">
                      {item.handle}
                    </span>
                  </div>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-[var(--weathered-stone)] group-hover:text-[var(--metallic-highlight)] transition-colors"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Option 2: Dedicated Collaboration Form */}
        <div className="lg:col-span-8">
          <div className="p-6 md:p-10 rounded-2xl border border-[var(--slate-blue)] bg-[var(--bg-storm-deep)]/70 backdrop-blur-md relative overflow-hidden">
            {/* Subtle muted bronze top border accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--muted-bronze), transparent)",
              }}
            />

            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[var(--muted-bronze)]/10 border border-[var(--muted-bronze)] mx-auto flex items-center justify-center text-[var(--metallic-highlight)]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-heading text-[var(--warm-ivory)]">Message Received</h3>
                <p className="text-body text-[var(--weathered-stone)] max-w-md mx-auto">
                  Thank you for reaching out. I usually reply within 24 to 48 hours. Looking forward to speaking!
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2.5 rounded-lg border border-[var(--slate-blue)] text-small text-[var(--warm-ivory)] hover:border-[var(--muted-bronze)] transition-colors cursor-pointer"
                >
                  Send another note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h3 className="text-micro text-[var(--muted-bronze)] tracking-[0.2em] uppercase mb-1 font-medium">
                    Collaboration Details
                  </h3>
                  <p className="text-small text-[var(--weathered-stone)]">
                    Share a few details about what you want to create.
                  </p>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-micro text-[var(--warm-ivory)] tracking-wider uppercase block mb-2 font-medium">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)]/80 border border-[var(--slate-blue)] text-[var(--warm-ivory)] placeholder-[var(--weathered-stone)]/40 focus:outline-none focus:border-[var(--muted-bronze)] transition-colors text-small"
                    />
                  </div>

                  <div>
                    <label className="text-micro text-[var(--warm-ivory)] tracking-wider uppercase block mb-2 font-medium">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)]/80 border border-[var(--slate-blue)] text-[var(--warm-ivory)] placeholder-[var(--weathered-stone)]/40 focus:outline-none focus:border-[var(--muted-bronze)] transition-colors text-small"
                    />
                  </div>
                </div>

                {/* Topic selection */}
                <div>
                  <label className="text-micro text-[var(--warm-ivory)] tracking-wider uppercase block mb-2.5 font-medium">
                    What are you reaching out about?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((topic) => (
                      <button
                        type="button"
                        key={topic}
                        onClick={() => setFormData({ ...formData, topic })}
                        className={`px-3.5 py-1.5 rounded-full text-micro tracking-wider uppercase transition-all duration-200 border cursor-pointer ${
                          formData.topic === topic
                            ? "bg-[var(--muted-bronze)] text-[var(--bg-primary)] border-[var(--muted-bronze)] font-bold shadow-[0_0_12px_rgba(140,128,101,0.3)]"
                            : "bg-[var(--bg-primary)]/60 text-[var(--weathered-stone)] border-[var(--slate-blue)] hover:border-[var(--muted-bronze)]/50"
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* What would you like to build? */}
                <div>
                  <label className="text-micro text-[var(--warm-ivory)] tracking-wider uppercase block mb-2 font-medium">
                    What would you like to build? *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.projectDetails}
                    onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                    placeholder="Tell me about the product, tool, or website you have in mind..."
                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)]/80 border border-[var(--slate-blue)] text-[var(--warm-ivory)] placeholder-[var(--weathered-stone)]/40 focus:outline-none focus:border-[var(--muted-bronze)] transition-colors text-small resize-y"
                  />
                </div>

                {/* Budget / Scope */}
                <div>
                  <label className="text-micro text-[var(--warm-ivory)] tracking-wider uppercase block mb-2.5 font-medium">
                    Budget / scope
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {BUDGET_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setFormData({ ...formData, budget: opt })}
                        className={`px-3.5 py-1.5 rounded-full text-micro tracking-wider uppercase transition-all duration-200 border cursor-pointer ${
                          formData.budget === opt
                            ? "bg-[var(--muted-bronze)] text-[var(--bg-primary)] border-[var(--muted-bronze)] font-bold shadow-[0_0_12px_rgba(140,128,101,0.3)]"
                            : "bg-[var(--bg-primary)]/60 text-[var(--weathered-stone)] border-[var(--slate-blue)] hover:border-[var(--muted-bronze)]/50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tell me a little more */}
                <div>
                  <label className="text-micro text-[var(--warm-ivory)] tracking-wider uppercase block mb-2 font-medium">
                    Tell me a little more
                  </label>
                  <textarea
                    rows={3}
                    value={formData.moreInfo}
                    onChange={(e) => setFormData({ ...formData, moreInfo: e.target.value })}
                    placeholder="Timelines, existing references, specific tech preferences, or anything else..."
                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)]/80 border border-[var(--slate-blue)] text-[var(--warm-ivory)] placeholder-[var(--weathered-stone)]/40 focus:outline-none focus:border-[var(--muted-bronze)] transition-colors text-small resize-y"
                  />
                </div>

                {/* Preferred Contact Method */}
                <div>
                  <label className="text-micro text-[var(--warm-ivory)] tracking-wider uppercase block mb-2.5 font-medium">
                    Preferred contact method
                  </label>
                  <div className="flex gap-3">
                    {CONTACT_METHODS.map((method) => (
                      <button
                        type="button"
                        key={method}
                        onClick={() => setFormData({ ...formData, contactMethod: method })}
                        className={`px-4 py-2 rounded-lg text-micro tracking-wider uppercase transition-all duration-200 border cursor-pointer ${
                          formData.contactMethod === method
                            ? "border-[var(--muted-bronze)] bg-[var(--muted-bronze)]/20 text-[var(--warm-ivory)] font-semibold"
                            : "border-[var(--slate-blue)] text-[var(--weathered-stone)] bg-[var(--bg-primary)]/50 hover:border-[var(--muted-bronze)]/50"
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-10 py-4 rounded-xl bg-[var(--muted-bronze)] text-[var(--bg-primary)] text-small font-bold tracking-widest uppercase hover:bg-[var(--metallic-highlight)] hover:shadow-[0_0_25px_rgba(183,170,137,0.35)] transition-all duration-300 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Sending..." : "Submit Inquiry"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
