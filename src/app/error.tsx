"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import * as Sentry from "@sentry/nextjs";
import { useTranslation } from "react-i18next";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0c0c0f] px-6 text-center">
      <Image src="/spoak.svg" alt="Spoak" width={40} height={40} className="mb-6 opacity-60" />
      <p className="text-7xl font-black text-white/10 select-none mb-2">500</p>
      <h1 className="text-xl font-bold text-white mb-2">{t("errors.serverError")}</h1>
      <p className="text-sm text-zinc-500 max-w-xs mb-8">{t("errors.serverErrorDesc")}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          {t("errors.retry")}
        </button>
        <Link
          href="/"
          className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
        >
          {t("errors.goHome")}
        </Link>
      </div>
      {error.digest && (
        <p className="mt-6 text-xs text-zinc-700 font-mono">{t("errors.errorCode")}: {error.digest}</p>
      )}
    </div>
  );
}
