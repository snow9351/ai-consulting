import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export interface RevealProps {
  children: ReactNode;
  /** Stagger in ms. Keep under ~250 so nothing feels sluggish. */
  delay?: number;
  className?: string;
}

/**
 * Fades content up as it scrolls into view.
 *
 * The hidden state lives in CSS (`.reveal`), so visitors with reduced-motion
 * preferences or without JavaScript see the finished layout immediately —
 * see the `@media (prefers-reduced-motion)` block and the <noscript> rule
 * in root.tsx.
 */
export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? "reveal-in" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
