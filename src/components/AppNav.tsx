"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { navItems } from "@/data/nav";
import { ApIcon } from "./ApIcon";
import { InfoIcon } from "./icons";

const iconFor: Record<string, ReactNode> = {
  "/": <ApIcon id="situation-map" size={22} mono />,
  "/protocols": <ApIcon id="field-kit" size={22} mono />,
  "/pause": <ApIcon id="pause-and-return" size={22} mono />,
  "/weekly-reset": <ApIcon id="weekly-reset" size={22} mono />,
  "/about": <InfoIcon size={22} />,
};

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav
      data-chrome
      className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-lg border-t border-rule/35 bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
      aria-label="Primary"
    >
      <ul className="flex items-stretch justify-between px-1.5">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="min-w-0 flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="group flex min-h-16 flex-col items-center justify-center gap-1 px-1"
              >
                <span
                  className={`flex h-8 w-full max-w-14 items-center justify-center rounded-full transition-colors ${
                    active
                      ? "bg-accent text-paper shadow-[0_4px_12px_-4px_rgb(44_62_45/0.6)]"
                      : "text-ink-muted group-hover:bg-accent/[0.07] group-hover:text-accent"
                  }`}
                >
                  {iconFor[item.href]}
                </span>
                <span
                  className={`text-xs leading-none ${
                    active ? "font-semibold text-accent" : "font-medium text-ink-muted"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
