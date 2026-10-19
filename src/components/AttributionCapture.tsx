"use client";

import { useEffect } from "react";

import { readFirstTouch } from "@/lib/attribution";

export function AttributionCapture() {
  useEffect(() => {
    try {
      readFirstTouch(window.sessionStorage, {
        href: window.location.href,
        referrer: document.referrer,
      });
    } catch {
      // Private mode can block sessionStorage. The form reads the current URL instead.
    }
  }, []);

  return null;
}
