import type { ReactNode } from "react";

export interface IconProps {
  className?: string;
}

/** 24px stroke icons on a shared grid. `aria-hidden` by default — labels live in text. */
function Svg({
  className = "h-5 w-5",
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const Globe = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
  </Svg>
);

export const Check = (p: IconProps) => (
  <Svg {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </Svg>
);

export const Shield = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.5 5 6.2v5.1c0 4.2 2.8 7.9 7 9.2 4.2-1.3 7-5 7-9.2V6.2Z" />
    <path d="m9.2 12.2 2 2 3.6-4" />
  </Svg>
);

export const Users = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="8.5" r="3.2" />
    <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0M16 5.7a3.2 3.2 0 0 1 0 5.9M17.2 14.4a5.5 5.5 0 0 1 3.3 5.1" />
  </Svg>
);

export const Briefcase = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="7.5" width="18" height="12" rx="2.2" />
    <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3 12.5h18" />
  </Svg>
);

export const UserPlus = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9.5" cy="8.5" r="3.4" />
    <path d="M3.5 19.5a6 6 0 0 1 12 0M18.5 8v6M21.5 11h-6" />
  </Svg>
);

export const Sparkle = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.5 13.9 9l5.6 2-5.6 2-1.9 5.5L10.1 13 4.5 11l5.6-2Z" />
  </Svg>
);

export const Scale = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4v16M7 20h10M6 8h12M6 8l-2.5 5.5a2.8 2.8 0 0 0 5 0Zm12 0 2.5 5.5a2.8 2.8 0 0 1-5 0ZM12 6.2 18 8M12 6.2 6 8" />
  </Svg>
);

export const Handshake = (p: IconProps) => (
  <Svg {...p}>
    <path d="m11 17 1.6 1.6a1.6 1.6 0 0 0 2.3-2.3M12.6 18.6 9.4 15.4M3 11l3-4.5h4L12 8l2-1.5h4L21 11" />
    <path d="m14 8-3.2 2.6a1.7 1.7 0 0 0 2.2 2.5L15 11.5l4 4a1.6 1.6 0 0 1-2.3 2.3M5 16l1.5 1.5" />
  </Svg>
);

export const Chat = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20.5 12.3c0 4-3.8 7.2-8.5 7.2a9.8 9.8 0 0 1-2.8-.4L4 20.5l1.5-3.8A6.9 6.9 0 0 1 3.5 12.3C3.5 8.3 7.3 5 12 5s8.5 3.3 8.5 7.3Z" />
  </Svg>
);

export const Menu = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const Close = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const Clock = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </Svg>
);

export const MapPin = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </Svg>
);

export const Language = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 6h8M7.5 4v2M9.8 6c0 3.6-2.5 6.8-6.3 8M5.5 9.5c1 2 2.9 3.6 5.3 4.4M12.5 20l4-9.5 4 9.5M14 16.5h5" />
  </Svg>
);

export const Search = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 5 5" />
  </Svg>
);

/** A coin stack with a "no" mark — used for "no fees". */
export const NoFee = (p: IconProps) => (
  <Svg {...p}>
    <ellipse cx="9" cy="6" rx="5.5" ry="2.2" />
    <path d="M3.5 6v4c0 1.2 2.5 2.2 5.5 2.2M3.5 10v4c0 1.2 2.5 2.2 5.5 2.2M14.5 6v3" />
    <circle cx="16.5" cy="16" r="4.5" />
    <path d="m13.3 19.2 6.4-6.4" />
  </Svg>
);

export const Document = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8Z" />
    <path d="M14 3.5V8h4.5M9 12h6M9 15.5h6" />
  </Svg>
);

export const GraduationCap = (p: IconProps) => (
  <Svg {...p}>
    <path d="m12 4.5 10 4.5-10 4.5L2 9Z" />
    <path d="M6 11v4.5c0 1.4 2.7 3 6 3s6-1.6 6-3V11M22 9v5" />
  </Svg>
);

export const Compass = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m15.5 8.5-2 5-5 2 2-5Z" />
  </Svg>
);

/** Solid shield with a keyhole dot — the hero badge mark. */
export const ShieldSolid = ({ className = "h-5 w-5" }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill="currentColor"
      d="M12 2.5 4.5 5.4v5.8c0 4.7 3.1 8.8 7.5 10.3 4.4-1.5 7.5-5.6 7.5-10.3V5.4Z"
    />
    <circle cx="12" cy="11" r="2.3" fill="#fff" />
    <path d="M12 12.5v2.8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const Bolt = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13.5 3 5.5 13.5h6l-1 7.5 8-10.5h-6Z" />
  </Svg>
);

/** Solid rocket — the "next opportunity" mark. */
export const RocketSolid = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
    <path
      fill="currentColor"
      d="M20.6 3.4c-3.9-.4-7.6 1.1-10.2 4L8.7 9.2l-3.4-.4a1 1 0 0 0-.8.3L2.6 11a.6.6 0 0 0 .3 1l3.6 1 4.5 4.5 1 3.6a.6.6 0 0 0 1 .3l1.9-1.9a1 1 0 0 0 .3-.8l-.4-3.4 1.8-1.7c2.9-2.6 4.4-6.3 4-10.2Z"
    />
    <circle cx="15.3" cy="8.7" r="1.9" fill="#fff" />
    <path
      fill="currentColor"
      d="M6.3 15.6c-1.4.2-2.6 1.4-2.8 3.4l-.2 1.7 1.7-.2c2-.2 3.2-1.4 3.4-2.8Z"
      opacity="0.7"
    />
  </svg>
);

export const Mail = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </Svg>
);

export const Phone = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.6 3.5h2.6l1.6 4.2-2 1.4a11 11 0 0 0 6.1 6.1l1.4-2 4.2 1.6v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />
  </Svg>
);

/** The LinkedIn "in" mark, drawn in the same stroke style as the rest. */
export const LinkedIn = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="3.5" />
    <path d="M8 10.5V17M12 17v-6.5M12 13.5a2.5 2.5 0 0 1 5 0V17" />
    <circle cx="8" cy="7.5" r="0.6" fill="currentColor" />
  </Svg>
);
