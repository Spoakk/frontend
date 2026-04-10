"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/ui/Modal";
import { CopyButton } from "@/components/ui/CopyButton";
import { ServerStatus } from "@/lib/api";

interface WidgetModalProps {
  open: boolean;
  onClose: () => void;
  result: ServerStatus | null;
}

export default function WidgetModal({ open, onClose, result }: WidgetModalProps) {
  const { t } = useTranslation();

  const widgetCode = useMemo(() => {
    if (!result) return "";
    const widgetUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/widget/mcping?host=${encodeURIComponent(result.host)}&port=${result.port}`;
    return `<iframe src="${widgetUrl}" width="400" height="120" frameborder="0" style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);"></iframe>`;
  }, [result]);

  return (
    <Modal open={open} onClose={onClose} title={t("mcping.widgetTitle")}>
      <div className="space-y-4">
        <p className="text-sm text-zinc-400">{t("mcping.widgetDesc")}</p>

        <div>
          <p className="text-xs font-medium text-zinc-500 mb-2">{t("mcping.widgetPreview")}</p>
          <div className="rounded-lg border border-white/10 bg-[#0c0c0f] p-4 relative">
            {result && (
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  {result.favicon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={result.favicon}
                      alt="Server icon"
                      className="h-16 w-16 rounded-lg"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                      <span className="text-2xl">🎮</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white truncate mb-1">
                    {result.host}
                  </h3>

                  <div className="flex items-center gap-3 text-xs">
                    {result.online && result.players_online !== null && (
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span className="text-zinc-400">
                          {result.players_online}/{result.players_max} {t("mcping.players")}
                        </span>
                      </div>
                    )}
                    {result.online && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-zinc-500">•</span>
                        <span className="text-zinc-400 font-mono">
                          {result.latency_ms}ms
                        </span>
                      </div>
                    )}
                    {!result.online && (
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                        <span className="text-red-400">{t("mcping.offline")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <a
              href="https://spoak.cc"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 flex items-center gap-1 text-zinc-600 hover:text-white transition-colors group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/spoak.svg" alt="Spoak" className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              <span className="text-[10px]">powered by Spoak</span>
            </a>
          </div>
          <p className="text-[10px] text-zinc-600 mt-2">
            {t("mcping.widgetAutoUpdate")}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-zinc-500">{t("mcping.widgetCode")}</p>
            <CopyButton
              textToCopy={widgetCode}
              successMessage={t("mcping.widgetCopied")}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-400 hover:border-emerald-500/30 hover:bg-white/10 hover:text-emerald-400"
            >
              {t("common.copy")}
            </CopyButton>
          </div>
          <pre className="rounded-lg border border-white/10 bg-[#0a0a0c] px-3 py-2.5 text-[11px] text-zinc-300 font-mono overflow-x-auto whitespace-pre-wrap break-all">
            {widgetCode}
          </pre>
        </div>
      </div>
    </Modal>
  );
}
