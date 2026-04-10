"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0c0c0f] px-6 text-center">
      <Image src="/spoak.svg" alt="Spoak" width={40} height={40} className="mb-6 opacity-60" />
      <p className="text-7xl font-black text-white/10 select-none mb-2">404</p>
      <h1 className="text-xl font-bold text-white mb-2">{t("errors.notFound")}</h1>
      <p className="text-sm text-zinc-500 max-w-xs mb-8">{t("errors.notFoundDesc")}</p>
      <Link
        href="/"
        className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
      >
        {t("errors.goHome")}
      </Link>
    </div>
  );
}
