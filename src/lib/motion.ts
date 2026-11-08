export const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Maps v from [a, b] to a clamped 0-1 range. */
export const range = (v: number, a: number, b: number) => clamp((v - a) / (b - a));

export const easeInCubic = (t: number) => t * t * t;
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Frame-rate independent smoothing toward a target. */
export const damp = (current: number, target: number, k: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-k * dt));

/** 0-1 progress through a tall wrapper whose sticky child fills the viewport. */
export const stickyProgress = (rect: DOMRect, viewH: number) =>
  clamp(-rect.top / Math.max(1, rect.height - viewH));

/**
 * Beats of the sword intro, as progress through #sword-intro. Shared so the
 * sword and the stage behind it (word, slash line, split panels) stay in sync.
 */
export const INTRO = {
  drawStart: 0.06,
  drawEnd: 0.44,
  fallEnd: 0.58,
  windupEnd: 0.72,
  swingEnd: 0.85,
  slashStart: 0.75,
  slashEnd: 0.84,
  splitStart: 0.83,
  splitEnd: 0.97,
};

/** Beats of the contact gate, as progress through #contact. */
export const DOORS = {
  impact: 0.18,
  /** The sword recoils straight after the strike, clear before the doors swing */
  withdrawStart: 0.19,
  withdrawEnd: 0.3,
  openStart: 0.24,
  openEnd: 0.56,
  /** Walking through the doorway: the temple front grows past the camera */
  passStart: 0.52,
  passEnd: 0.74,
  formStart: 0.64,
  formEnd: 0.8,
  /** Where nav links land: doors fully open, form usable. */
  rest: 0.88,
};

/**
 * The gate's smoothed progress, written by ContactGatewaySection every frame
 * and read by SingleSwordSystem, so the sword and the doors share one clock
 * and can never drift apart.
 */
export const gateClock = { progress: 0 };

export const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
