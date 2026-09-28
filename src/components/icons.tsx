import type { SVGProps } from "react";

// UI chrome icons. Pause/Timer and Reset use the v2 library glyphs
// (icon-protocol-pause-and-return, icon-protocol-weekly-reset); the
// protocol and section icons live in visuals/ProtocolIcon.tsx.

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 22, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const MapIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 4.5 3.75 6.6v12.9L9 17.4l6 2.1 5.25-2.1V4.5L15 6.6 9 4.5Z" />
    <path d="M9 4.5v12.9M15 6.6v12.9" />
  </Base>
);

export const LayersIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m12 3.75 8.25 4.5L12 12.75 3.75 8.25 12 3.75Z" />
    <path d="m3.75 12 8.25 4.5 8.25-4.5" />
    <path d="m3.75 15.75 8.25 4.5 8.25-4.5" />
  </Base>
);

export const TimerIcon = (p: IconProps) => (
  <Base strokeWidth={1.5} {...p}>
    <path d="M5.5 3H18.5M5.5 21H18.5" />
    <path d="M7.5 3V6.5A4.5 4.5 0 0 0 16.5 6.5V3" />
    <path d="M7.5 21V17.5A4.5 4.5 0 0 1 16.5 17.5V21" />
    <path d="M12 16.32C13.2 17.44 13.6 18.4 13.6 19.12A2 2 0 0 1 10.4 19.12C10.4 18.4 10.8 17.44 12 16.32Z" fill="currentColor" stroke="none" />
  </Base>
);

export const PauseIcon = (p: IconProps) => (
  <Base strokeWidth={1.5} {...p}>
    <path d="M5.5 3H18.5M5.5 21H18.5" />
    <path d="M7.5 3V6.5A4.5 4.5 0 0 0 16.5 6.5V3" />
    <path d="M7.5 21V17.5A4.5 4.5 0 0 1 16.5 17.5V21" />
    <path d="M12 16.32C13.2 17.44 13.6 18.4 13.6 19.12A2 2 0 0 1 10.4 19.12C10.4 18.4 10.8 17.44 12 16.32Z" fill="currentColor" stroke="none" />
  </Base>
);

export const ResetIcon = (p: IconProps) => (
  <Base strokeWidth={1.5} {...p}>
    <path d="M4 21V9A8 8 0 0 1 20 9V21Z" />
    <path d="M4 12.5H20" />
    <path d="M15 16.6A3 3 0 1 1 13.9 14.3" />
    <path d="M14.2 12.9L14.1 14.5L15.7 14.6" />
    <path d="M12 4.6C12.9 5.4 13.2 6.1 13.2 6.7A1.2 1.2 0 0 1 10.8 6.7C10.8 6.1 11.1 5.4 12 4.6Z" fill="currentColor" stroke="none" />
  </Base>
);

export const InfoIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.25" />
    <path d="M12 11v5M12 8h.01" />
  </Base>
);

export const ChevronRight = (p: IconProps) => (
  <Base {...p}>
    <path d="m9.5 6 6 6-6 6" />
  </Base>
);

export const ArrowRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
);

export const ArrowLeft = (p: IconProps) => (
  <Base {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Base>
);

export const CheckIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Base>
);

export const XIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
  </Base>
);

export const AlertIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 4.5 2.75 19.5h18.5L12 4.5Z" />
    <path d="M12 10v4M12 17h.01" />
  </Base>
);

export const QuoteIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 18.5c3-1 4.5-3.5 4.5-7V6.5H5V12h4.5M14.5 18.5c3-1 4.5-3.5 4.5-7V6.5h-4.5V12H19" />
  </Base>
);

export const ToolIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="4.5" y="4.5" width="15" height="15" rx="3.5" />
    <path d="M8.5 12h7M12 8.5v7" />
  </Base>
);

export const StarIcon = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <Base {...p} fill={filled ? "currentColor" : "none"}>
    <path
      d="M12 3.5l2.47 5.14 5.53.72-4.06 3.98 1.03 5.66L12 16.2l-4.97 2.8 1.03-5.66-4.06-3.98 5.53-.72L12 3.5Z"
      strokeLinejoin="round"
    />
  </Base>
);

export const ClockIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Base>
);
