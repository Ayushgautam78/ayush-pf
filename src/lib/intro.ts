"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether the preloader has handed over to the page. Entrance animations wait
 * for this, so they play when they can be seen instead of behind the curtain.
 */
const EVENT = "intro:done";

const isDone = () => document.documentElement.dataset.intro === "done";

export const markIntroDone = () => {
  if (isDone()) return;
  document.documentElement.dataset.intro = "done";
  window.dispatchEvent(new Event(EVENT));
};

const subscribe = (callback: () => void) => {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
};

export const useIntroDone = () => useSyncExternalStore(subscribe, isDone, () => false);
