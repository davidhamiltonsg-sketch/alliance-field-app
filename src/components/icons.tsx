import type { SVGProps } from "react";

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
  <Base {...p}>
    <circle cx="12" cy="13.5" r="7.25" />
    <path d="M12 9.75v3.75l2.25 1.5M9.75 3h4.5" />
  </Base>
);

export const PauseIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M9.5 7v10M14.5 7v10" />
  </Base>
);

export const ResetIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4.5 12a7.5 7.5 0 0 1 12.8-5.3L19.5 9" />
    <path d="M19.5 4.5V9H15" />
    <path d="M19.5 12a7.5 7.5 0 0 1-12.8 5.3L4.5 15" />
    <path d="M4.5 19.5V15H9" />
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
