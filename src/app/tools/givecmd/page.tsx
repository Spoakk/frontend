"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getFormat, buildGiveCommand, ENCHANTMENTS, ITEMS_BY_CATEGORY, ITEM_CATEGORIES, SelectedEnchant } from "@/lib/giveCommand";
import Select from "@/components/ui/Select";
import { api } from "@/lib/api";
import { IconSpinner, IconCheck } from "@/components/ui/Icons";
import { CopyButton } from "@/components/ui/CopyButton";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { SectionCard } from "@/components/ui/Card";

export default function GiveCmdPage() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [versions, setVersions]     = useState<string[]>([]);
  const [version, setVersion]       = useState("");
  const [category, setCategory]     = useState("sword");
  const [itemId, setItemId]         = useState("diamond_sword");
  const [player, setPlayer]         = useState("@p");
  const [count, setCount]           = useState(1);
  const [customName, setCustomName] = useState("");
  const [enchants, setEnchants]     = useState<SelectedEnchant[]>([]);

  useEffect(() => {
    api.versions().then((data) => {
      setVersions(data.versions);
      if (data.versions.length > 0) setVersion(data.versions[0]);
    }).catch(() => {});
  }, []);

  const format = version ? getFormat(version) : "components";

  const availableEnchants = useMemo(
    () => ENCHANTMENTS.filter((e) => e.applicable.includes(category)),
    [category]
  );

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    const items = ITEMS_BY_CATEGORY[cat];
    if (items?.length) setItemId(items[0].id);
    setEnchants([]);
  };

  const toggleEnchant = (id: string) => {
    setEnchants((prev) => {
      if (prev.find((e) => e.id === id)) return prev.filter((e) => e.id !== id);
      const entry = ENCHANTMENTS.find((e) => e.id === id);
      return [...prev, { id, level: entry?.maxLevel ?? 1 }];
    });
  };

  const setLevel = (id: string, level: number) => {
    setEnchants((prev) => prev.map((e) => e.id === id ? { ...e, level } : e));
  };

  const command = useMemo(
    () => version ? buildGiveCommand(player, itemId, enchants, customName, count, format) : "",
    [player, itemId, enchants, customName, count, format, version]
  );

  const copyInfo = () => {
    navigator.clipboard.writeText(command);
  };
  const copyManual = () => {
    copyInfo();
    toast(t("givecmd.commandCopied"), "success");
  };

  const items = ITEMS_BY_CATEGORY[category] ?? [];

  return (
    <div className="min-h-screen bg-[#0c0c0f] px-6 py-10 md:py-12 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t("givecmd.badge")}
          </span>
          <h1 className="text-2xl font-bold text-white">{t("givecmd.title")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t("givecmd.description")}</p>
        </div>

        <div className="space-y-5">

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("givecmd.versionLabel")}</label>
              {versions.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-zinc-500 py-2.5">
                  <IconSpinner />
                  {t("givecmd.loadingVersions")}
                </div>
              ) : (
                <Select
                  value={version}
                  onChange={setVersion}
                  options={versions.map((v) => ({ value: v, label: v }))}
                />
              )}
            </div>
            <div className="pt-5">
              <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium border ${
                format === "components"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-400"
              }`}>
                {format === "components" ? t("givecmd.formatComponents") : t("givecmd.formatNbt")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("givecmd.playerLabel")}</label>
              <input type="text" value={player} onChange={(e) => setPlayer(e.target.value)}
                className="w-full rounded-lg border border-white/8 bg-[#0c0c0f] px-3 py-2.5 text-sm text-white font-mono focus:border-emerald-500/50 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("givecmd.countLabel")}</label>
              <input type="number" min={1} max={64} value={count} onChange={(e) => setCount(Math.max(1, +e.target.value))}
                className="w-full rounded-lg border border-white/8 bg-[#0c0c0f] px-3 py-2.5 text-sm text-white focus:border-emerald-500/50 focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">{t("givecmd.categoryLabel")}</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ITEM_CATEGORIES).map(([cat, label]) => (
                <button key={cat} onClick={() => handleCategoryChange(cat)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    category === cat
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                      : "border-white/8 bg-white/[0.02] text-zinc-400 hover:border-white/15 hover:text-white"
                  }`}
                >{label}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("givecmd.itemLabel")}</label>
            <Select
              value={itemId}
              onChange={setItemId}
              options={items.map((item) => ({ value: item.id, label: item.label }))}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              {t("givecmd.customNameLabel")} <span className="text-zinc-600">{t("givecmd.customNameOptional")}</span>
            </label>
            <input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)}
              placeholder={t("givecmd.customNamePlaceholder")}
              className="w-full rounded-lg border border-white/8 bg-[#0c0c0f] px-3 py-2.5 text-sm text-white placeholder-zinc-700 focus:border-emerald-500/50 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">
              {t("givecmd.enchantmentsLabel")}
              {enchants.length > 0 && (
                <span className="ml-2 text-emerald-400">{t("givecmd.enchantmentsSelected", { count: enchants.length })}</span>
              )}
            </label>

            {availableEnchants.length === 0 ? (
              <p className="text-xs text-zinc-600">{t("givecmd.noEnchantments")}</p>
            ) : (
              <div className="space-y-1.5">
                {availableEnchants.map((enc) => {
                  const selected = enchants.find((e) => e.id === enc.id);
                  return (
                    <div key={enc.id}
                      className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                        selected ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/6 bg-white/[0.015] hover:border-white/10"
                      }`}
                    >
                      <button onClick={() => toggleEnchant(enc.id)} className="flex items-center gap-2.5 flex-1 text-left">
                        <span className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          selected ? "border-emerald-500 bg-emerald-500" : "border-white/20"
                        }`}>
                          {selected && <IconCheck />}
                        </span>
                        <span className={`text-sm ${selected ? "text-white" : "text-zinc-400"}`}>{enc.label}</span>
                        <span className="text-xs text-zinc-600 ml-auto">{t("givecmd.maxLevel", { level: enc.maxLevel })}</span>
                      </button>
                      <AnimatePresence>
                        {selected && (
                          <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="overflow-hidden">
                            <input
                              type="number" min={1} value={selected.level}
                              onChange={(e) => setLevel(enc.id, Math.max(1, +e.target.value))}
                              onClick={(e) => e.stopPropagation()}
                              className="w-16 rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 text-sm text-white text-center focus:border-emerald-500/50 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <SectionCard
            header={
              <>
                <span className="text-xs text-zinc-500 font-mono">{t("givecmd.commandLabel")}</span>
                <CopyButton onCopyAction={copyInfo} successMessage={t("givecmd.commandCopied")} className="text-xs text-zinc-500 hover:text-white transition-colors">
                  {t("common.copy")}
                </CopyButton>
              </>
            }
            bodyClassName="p-0"
          >
            <pre className="px-4 py-4 text-xs text-emerald-300 font-mono whitespace-pre-wrap break-all leading-relaxed">
              {command || "..."}
            </pre>
          </SectionCard>

          <Button variant="primaryNormal" onClick={copyManual} className="w-full mt-2">
            {t("givecmd.copyCommand")}
          </Button>

        </div>
      </motion.div>
    </div>
  );
}
