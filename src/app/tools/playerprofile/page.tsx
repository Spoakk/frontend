"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { api, PlayerProfile } from "@/lib/api";
import { IconSpinner, IconDownload } from "@/components/ui/Icons";
import { CopyButton } from "@/components/ui/CopyButton";
import { Button } from "@/components/ui/Button";
import { SectionCard, Card } from "@/components/ui/Card";

function InfoRow({ label, value, onCopy, copyLabel }: { label: string; value: string; onCopy?: () => void; copyLabel?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/6 last:border-0">
      <span className="text-xs text-zinc-500 shrink-0 w-28">{label}</span>
      <span className="text-sm text-white font-mono truncate flex-1 text-right">{value}</span>
      {onCopy && (
        <CopyButton onCopyAction={onCopy} className="ml-3 shrink-0 text-xs text-zinc-600 hover:text-zinc-300 transition-colors">
          {copyLabel}
        </CopyButton>
      )}
    </div>
  );
}

function HeadCanvas({ skinUrl }: { skinUrl: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<import("@/lib/headRenderer").SkinHeadRenderer | null>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    let renderer: import("@/lib/headRenderer").SkinHeadRenderer;
    import("@/lib/headRenderer").then(({ SkinHeadRenderer }) => {
      if (!containerRef.current) return;
      renderer = new SkinHeadRenderer(containerRef.current);
      rendererRef.current = renderer;
      if (skinUrl) renderer.loadSkin(skinUrl);
    });
    return () => { renderer?.dispose(); rendererRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { if (skinUrl && rendererRef.current) rendererRef.current.loadSkin(skinUrl); }, [skinUrl]);
  return <div ref={containerRef} className="h-full w-full" />;
}

function BodyCanvas({ skinUrl, capeUrl, model }: { skinUrl: string | null; capeUrl: string | null; model: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<import("@/lib/skinRenderer").SkinRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let renderer: import("@/lib/skinRenderer").SkinRenderer;
    import("@/lib/skinRenderer").then(({ SkinRenderer }) => {
      if (!containerRef.current) return;
      renderer = new SkinRenderer(containerRef.current);
      rendererRef.current = renderer;
      renderer.setModelType(model === "slim" ? "alex" : "steve");
      if (skinUrl) renderer.loadSkin(skinUrl);
      if (capeUrl) renderer.loadCape(capeUrl);
    });
    return () => { renderer?.dispose(); rendererRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { 
    if (!rendererRef.current) return;
    const renderer = rendererRef.current;
    if (skinUrl) renderer.loadSkin(skinUrl);
    if (capeUrl) renderer.loadCape(capeUrl);
    renderer.setModelType(model === "slim" ? "alex" : "steve");
  }, [skinUrl, capeUrl, model]);

  return <div ref={containerRef} className="h-full w-full" />;
}

export default function PlayerProfilePage() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = input.trim();
    if (!name) return;
    setLoading(true); setError(null); setProfile(null);
    try {
      const data = await api.player(name);
      setProfile(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      setError(
        msg.includes("404") || msg.includes("not found")
          ? t("playerprofile.notFound", { name })
          : t("playerprofile.errorBackend")
      );
    } finally {
      setLoading(false);
    }
  };

  const copyInfo = (val: string) => {
    navigator.clipboard.writeText(val);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0f] px-6 py-10 md:py-12 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t("playerprofile.badge")}
          </span>
          <h1 className="text-2xl font-bold text-white">{t("playerprofile.title")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t("playerprofile.description")}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("playerprofile.placeholder")}
            maxLength={16}
            className="flex-1 rounded-lg border border-white/8 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-emerald-500/50 focus:outline-none transition-colors"
          />
          <Button
            variant="primaryNormal"
            type="submit"
            disabled={loading || !input.trim()}
            className="flex-shrink-0 !py-2.5 !px-5"
          >
            {loading ? <span className="flex items-center gap-2"><IconSpinner /> {t("playerprofile.lookingUp")}</span> : t("playerprofile.lookupBtn")}
          </Button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >{error}</motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {profile && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
              <Card className="flex items-stretch gap-4">
                <div className="h-32 w-32 shrink-0 bg-white/[0.02]"><HeadCanvas skinUrl={profile.skin_url} /></div>
                <div className="flex-1 py-4 pr-4 flex flex-col justify-center min-w-0">
                  <p className="text-xl font-bold text-white">{profile.username}</p>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5 truncate">{profile.uuid_formatted}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-0.5 text-xs text-zinc-400 capitalize">{profile.skin_model}</span>
                    {profile.cape_url && (
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400">{t("playerprofile.hasCape")}</span>
                    )}
                  </div>
                </div>
                <div className="h-32 w-24 shrink-0 bg-white/[0.02]">
                  <BodyCanvas skinUrl={profile.skin_url} capeUrl={profile.cape_url} model={profile.skin_model} />
                </div>
              </Card>

              <SectionCard bodyClassName="px-5 py-1">
                <InfoRow label={t("playerprofile.labelUsername")}  value={profile.username}       onCopy={() => copyInfo(profile.username)} copyLabel={t("common.copy")} />
                <InfoRow label={t("playerprofile.labelUuid")}      value={profile.uuid_formatted} onCopy={() => copyInfo(profile.uuid_formatted)} copyLabel={t("common.copy")} />
                <InfoRow label={t("playerprofile.labelUuidRaw")}   value={profile.uuid}           onCopy={() => copyInfo(profile.uuid)} copyLabel={t("common.copy")} />
                <InfoRow label={t("playerprofile.labelSkinModel")} value={profile.skin_model} />
                <InfoRow label={t("playerprofile.labelCape")}      value={profile.cape_url ? t("playerprofile.capeYes") : t("playerprofile.capeNone")} />
              </SectionCard>

              <div className="grid grid-cols-2 gap-3">
                {profile.skin_url && (
                  <Card href={profile.skin_url} clickable
                    className="flex items-center justify-center gap-2 py-2.5 text-xs text-zinc-400 hover:text-white"
                  >
                    <IconDownload className="h-3.5 w-3.5" />
                    {t("playerprofile.downloadSkin")}
                  </Card>
                )}
                {profile.cape_url && (
                  <Card href={profile.cape_url} clickable
                    className="flex items-center justify-center gap-2 py-2.5 text-xs text-zinc-400 hover:text-white"
                  >
                    <IconDownload className="h-3.5 w-3.5" />
                    {t("playerprofile.downloadCape")}
                  </Card>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
