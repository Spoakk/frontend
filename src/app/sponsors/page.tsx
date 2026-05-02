"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CopyButton } from "@/components/ui/CopyButton";
import { IconHeart } from "@/components/ui/Icons";
import { SectionCard } from "@/components/ui/Card";
import DonateModal from "@/components/sponsors/DonateModal";

const CRYPTO = [
  { name: "Ethereum",  address: "0xf09bA63D240Fb5144717CdD1b8375a1025F9Fa10" },
  { name: "Bitcoin",   address: "bc1qdmwq3ekcxmk7cewvxjmru8qg4m9x9qrkmacc8a" },
  { name: "Solana",    address: "Erv8bUB1aB4wwYSj9Vh3HLAY3LMoLmTHQNmp6s52pxK4" },
  { name: "Linea",     address: "0xf09bA63D240Fb5144717CdD1b8375a1025F9Fa10" },
  { name: "Base",      address: "0xf09bA63D240Fb5144717CdD1b8375a1025F9Fa10" },
  { name: "BNB Chain", address: "0xf09bA63D240Fb5144717CdD1b8375a1025F9Fa10" },
  { name: "Tron",      address: "THd6HJYV442wtt9ji87rSCZQBnPvv6BhYq" },
];

export default function SponsorsPage() {
  const { t } = useTranslation();
  const [donateOpen, setDonateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0c0c0f] px-6 py-10 md:py-12 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-medium text-pink-400 mb-3">
            <IconHeart className="h-3 w-3" /> {t("sponsors.badge")}
          </span>
          <h1 className="text-2xl font-bold text-white">{t("sponsors.title")}</h1>
          <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{t("sponsors.description")}</p>
        </div>

        <SectionCard className="mb-4" bodyClassName="p-6">
          <h2 className="text-sm font-semibold text-white mb-1">{t("sponsors.whyTitle")}</h2>
          <p className="text-sm text-zinc-500 leading-relaxed mb-4">{t("sponsors.whyDesc")}</p>
          <ul className="space-y-2">
            {(t("sponsors.perks", { returnObjects: true }) as string[]).map((perk, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-400 shrink-0" />
                {perk}
              </li>
            ))}
          </ul>
        </SectionCard>

        <a
          href="https://www.buymeacoffee.com/tandstik"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full mb-3"
        >
          <Image
            src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=tandstik&button_colour=FFDD00&font_colour=000000&font_family=Lato&outline_colour=000000&coffee_colour=ffffff"
            alt="Buy me a coffee"
            width={217}
            height={60}
            className="hover:opacity-90 transition-opacity"
            unoptimized
          />
        </a>

        <SectionCard
          className="mb-3"
          bodyClassName="p-6"
          header={
            <>
              <h2 className="text-sm font-semibold text-white">{t("sponsors.cryptoTitle")}</h2>
              <button
                onClick={() => setDonateOpen(true)}
                className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/20 transition-colors"
              >
                {t("sponsors.donateBtn")}
              </button>
            </>
          }
        >
          <p className="text-xs text-zinc-500 mb-4">{t("sponsors.cryptoDesc")}</p>
          <div className="space-y-2">
            {CRYPTO.map(({ name, address }) => (
              <div key={name} className="flex items-center gap-3 rounded-lg border border-white/6 bg-white/2 px-3 py-2.5">
                <span className="text-xs font-medium text-zinc-400 w-20 shrink-0">{name}</span>
                <span className="text-xs text-zinc-500 font-mono truncate flex-1">{address}</span>
                <CopyButton textToCopy={address} successMessage={t("sponsors.cryptoCopied")} className="shrink-0 rounded-md border border-white/8 bg-white/5 px-2 py-1 text-xs text-zinc-500 hover:border-emerald-500/30 hover:text-emerald-400 transition-colors">
                  {t("common.copy")}
                </CopyButton>
              </div>
            ))}
          </div>
        </SectionCard>

        <p className="text-center text-xs text-zinc-600 mt-4">{t("sponsors.thanks")}</p>
      </motion.div>

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </div>
  );
}
