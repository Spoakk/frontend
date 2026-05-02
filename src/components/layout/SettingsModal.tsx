"use client";

import { useTranslation } from "react-i18next";
import Modal from "@/components/ui/Modal";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useQuickAccessContext } from "@/components/providers/QuickAccessProvider";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { t } = useTranslation();
  const { quickAccess, setQuickAccess, multiTool, setMultiTool } = useQuickAccessContext();

  return (
    <Modal open={open} onClose={onClose} title={t("settings.title")}>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">{t("settings.language")}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{t("settings.languageDesc")}</p>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="border-t border-white/8 pt-4 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-white">{t("settings.quickAccess")}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{t("settings.quickAccessDesc")}</p>
          </div>
          <button
            role="switch"
            aria-checked={quickAccess}
            onClick={() => setQuickAccess(!quickAccess)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              quickAccess ? "bg-emerald-500" : "bg-white/10"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                quickAccess ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="border-t border-white/8 pt-4 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-white">{t("settings.multiTool")}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{t("settings.multiToolDesc")}</p>
          </div>
          <button
            role="switch"
            aria-checked={multiTool}
            onClick={() => setMultiTool(!multiTool)}
            disabled={!quickAccess}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              multiTool && quickAccess ? "bg-emerald-500" : "bg-white/10"
            } ${!quickAccess ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                multiTool && quickAccess ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="border-t border-white/8 pt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-white">{t("settings.version")}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{t("settings.versionDesc")}</p>
          </div>
          <span className="text-xs text-zinc-600 font-mono">0.2.0</span>
        </div>
      </div>
    </Modal>
  );
}
