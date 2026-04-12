"use client";

import { useTranslation } from "react-i18next";
import Modal from "@/components/ui/Modal";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { t } = useTranslation();

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
          <div>
            <p className="text-sm text-white">{t("settings.version")}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{t("settings.versionDesc")}</p>
          </div>
          <span className="text-xs text-zinc-600 font-mono">0.1.1</span>
        </div>
      </div>
    </Modal>
  );
}
