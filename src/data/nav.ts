import type { NavItem } from "./types";

/** Five tabs. Help lives in the header on every screen; About sits inside Together. */
export const navItems: NavItem[] = [
  { href: "/", label: "Now" },
  { href: "/protocols", label: "Tools" },
  { href: "/pause", label: "Pause" },
  { href: "/weekly-reset", label: "Week" },
  { href: "/together", label: "Together" },
];

/** Pages that belong to a tab without sharing its URL prefix. */
export const navAliases: Record<string, string[]> = {
  "/together": ["/about", "/connect"],
};
