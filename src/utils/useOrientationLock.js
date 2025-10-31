import { useEffect, useMemo, useState } from "react";

const DEFAULT_MAX_DIMENSION = 1024;

const hasCoarsePointerFallback = () => {
  if (typeof window === "undefined") return false;
  if ("matchMedia" in window) {
    try {
      const mql = window.matchMedia("(pointer: coarse)");
      if (typeof mql.matches === "boolean") return mql.matches;
    } catch {
      // ignore matchMedia errors
    }
  }
  const hasTouchEvent = "ontouchstart" in window;
  const maxTouchPoints =
    typeof navigator === "undefined" ? 0 : navigator.maxTouchPoints || 0;
  return hasTouchEvent || maxTouchPoints > 0;
};

export function useOrientationLock(options = {}) {
  const { maxDimension = DEFAULT_MAX_DIMENSION } = options;
  const [isBlocked, setIsBlocked] = useState(false);

  const matchers = useMemo(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return { orientation: undefined, pointer: undefined };
    }

    let pointer;
    try {
      pointer = window.matchMedia("(pointer: coarse)");
    } catch {
      pointer = undefined;
    }

    return {
      orientation: window.matchMedia("(orientation: landscape)"),
      pointer,
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const evaluate = () => {
      const width = window.innerWidth || document.documentElement?.clientWidth || 0;
      const height = window.innerHeight || document.documentElement?.clientHeight || 0;
      const smallestSide = Math.min(width, height);
      const isSmallDevice = smallestSide <= maxDimension;

      const isLandscape =
        (matchers.orientation?.matches ?? false) || width > height;

      const isCoarsePointer =
        matchers.pointer?.matches ?? hasCoarsePointerFallback();

      setIsBlocked(prev => {
        const next = Boolean(isSmallDevice && isLandscape && isCoarsePointer);
        return prev === next ? prev : next;
      });
    };

    const handleChange = () => evaluate();

    evaluate();

    const { orientation, pointer } = matchers;

    if (orientation) {
      if (typeof orientation.addEventListener === "function") {
        orientation.addEventListener("change", handleChange);
      } else if (typeof orientation.addListener === "function") {
        orientation.addListener(handleChange);
      }
    }

    if (pointer) {
      if (typeof pointer.addEventListener === "function") {
        pointer.addEventListener("change", handleChange);
      } else if (typeof pointer.addListener === "function") {
        pointer.addListener(handleChange);
      }
    }

    window.addEventListener("resize", evaluate);

    return () => {
      window.removeEventListener("resize", evaluate);

      if (orientation) {
        if (typeof orientation.removeEventListener === "function") {
          orientation.removeEventListener("change", handleChange);
        } else if (typeof orientation.removeListener === "function") {
          orientation.removeListener(handleChange);
        }
      }

      if (pointer) {
        if (typeof pointer.removeEventListener === "function") {
          pointer.removeEventListener("change", handleChange);
        } else if (typeof pointer.removeListener === "function") {
          pointer.removeListener(handleChange);
        }
      }
    };
  }, [matchers, maxDimension]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const { body } = document;
    if (!body) return;

    const previousOverflow = body.style.overflow;
    const previousHeight = body.style.height;

    if (isBlocked) {
      body.style.overflow = "hidden";
      body.style.height = "100vh";
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.height = previousHeight;
    };
  }, [isBlocked]);

  return isBlocked;
}
