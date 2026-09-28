"use client";

import { useEffect } from "react";

function applyHeight() {
  const viewport = window.visualViewport;
  const height = Math.round(viewport?.height ?? window.innerHeight);
  document.documentElement.style.setProperty("--app-height", `${height}px`);
}

export default function ViewportHeight() {
  useEffect(() => {
    applyHeight();
    window.addEventListener("resize", applyHeight);
    window.addEventListener("orientationchange", applyHeight);
    window.visualViewport?.addEventListener("resize", applyHeight);
    return () => {
      window.removeEventListener("resize", applyHeight);
      window.removeEventListener("orientationchange", applyHeight);
      window.visualViewport?.removeEventListener("resize", applyHeight);
    };
  }, []);

  return null;
}
