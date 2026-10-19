import type { ReactNode } from "react";

type IconProps = {
  className?: string;
};

function Icon({
  className = "h-5 w-5",
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function IconCafe({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M6 8h10v5.5A3.5 3.5 0 0 1 12.5 17h-3A3.5 3.5 0 0 1 6 13.5V8Z" />
      <path d="M16 9.5h1.8a2.2 2.2 0 0 1 0 4.4H16" />
      <path d="M8 20h6" />
    </Icon>
  );
}

export function IconMail({ className }: IconProps) {
  return (
    <Icon className={className}>
      <rect x="4" y="6" width="16" height="12" rx="1.5" />
      <path d="m5 7 7 6 7-6" />
    </Icon>
  );
}

export function IconProcess({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5" />
      <circle cx="12" cy="14.5" r="1" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function IconAbout({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M5 6.5h6.2A2.3 2.3 0 0 1 13.5 8.8V19H7.2A2.2 2.2 0 0 0 5 21.2V6.5Z" />
      <path d="M19 6.5h-6.2A2.3 2.3 0 0 0 10.5 8.8V19h6.3A2.2 2.2 0 0 1 19 21.2V6.5Z" />
    </Icon>
  );
}

export function IconNear({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="m4 11 16-7-7 16-2-7-7-2Z" />
    </Icon>
  );
}

export function IconArrow({ className = "h-4 w-4" }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </Icon>
  );
}
