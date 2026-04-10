"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { IconGithub, IconDiscord, IconHeart } from "@/components/ui/Icons";

const NAV_LINKS = [
  { href: "/tools",       key: "nav.tools" },
  { href: "/marketplace", key: "nav.marketplace" },
  { href: "/docs",        key: "nav.docs" },
  { href: "/about",       key: "nav.about" },
  { href: "/sponsors",    key: "nav.sponsor" },
];

const SOCIAL_LINKS = [
  { href: "https://github.com/spoakk", label: "GitHub",  icon: <IconGithub className="h-4 w-4" /> },
  { href: "/discord",                   label: "Discord", icon: <IconDiscord className="h-4 w-4" /> },
  { href: "/sponsors",                  label: "Sponsor", icon: <IconHeart className="h-4 w-4" /> },
];

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/8 bg-[#0c0c0f]">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src="/spoak.svg" alt="Spoak" width={24} height={24} />
            <span className="font-bold text-white text-base tracking-tight">Spoak</span>
          </Link>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV_LINKS.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-zinc-500 hover:text-white transition-colors"
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 text-zinc-500 hover:border-white/20 hover:text-white transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-6 border-t border-white/6">
          <p className="text-xs text-zinc-600">{t("footer.tagline")}</p>
          <p className="text-xs text-zinc-700">© {year} Spoak. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
