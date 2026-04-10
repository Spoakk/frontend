"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { IconSpinner, IconDownloadCloud } from "@/components/ui/Icons";

interface ModrinthVersion {
  version_number: string;
  game_versions: string[];
  loaders: string[];
  files: { primary: boolean; url: string }[];
}

const ALLOWED_DOWNLOAD_HOSTS = ["cdn.modrinth.com"];

function isSafeDownloadUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      ALLOWED_DOWNLOAD_HOSTS.some(h => parsed.hostname === h || parsed.hostname.endsWith("." + h))
    );
  } catch {
    return false;
  }
}

function isValidModrinthVersion(v: unknown): v is ModrinthVersion {
  if (!v || typeof v !== "object") return false;
  const obj = v as Record<string, unknown>;
  return (
    typeof obj.version_number === "string" &&
    Array.isArray(obj.game_versions) &&
    Array.isArray(obj.loaders) &&
    Array.isArray(obj.files)
  );
}

interface DownloadModalProps {
  open: boolean;
  onClose: () => void;
  pluginSlug: string | null;
  pluginName: string;
}

export default function DownloadModal({ open, onClose, pluginSlug, pluginName }: DownloadModalProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState<ModrinthVersion[]>([]);
  const [gameVersions, setGameVersions] = useState<string[]>([]);
  const [loaders, setLoaders] = useState<string[]>([]);
  const [selectedGameVersion, setSelectedGameVersion] = useState<string>("");
  const [selectedLoader, setSelectedLoader] = useState<string>("");

  const fetchVersions = useCallback(() => {
    if (!pluginSlug) return;
    Promise.resolve().then(() => {
      setLoading(true);
      fetch(`https://api.modrinth.com/v2/project/${pluginSlug}/version`)
        .then(res => res.json())
        .then((data: unknown) => {
          if (!Array.isArray(data)) {
            setVersions([]); setGameVersions([]); setLoaders([]);
            return;
          }
          const typed = (data as unknown[]).filter(isValidModrinthVersion);
          setVersions(typed);
          const gvs = new Set<string>();
          const lds = new Set<string>();
          typed.forEach(v => {
            v.game_versions?.forEach(gv => gvs.add(gv));
            v.loaders?.forEach(ld => lds.add(ld));
          });
          const gvsArray = Array.from(gvs).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
          const ldsArray = Array.from(lds).sort();
          setGameVersions(gvsArray);
          setLoaders(ldsArray);
          if (gvsArray.length > 0) setSelectedGameVersion(gvsArray[0]);
          if (ldsArray.length > 0) setSelectedLoader(ldsArray[0]);
        })
        .catch(e => { console.error("Failed to load versions", e); setVersions([]); })
        .finally(() => setLoading(false));
    });
  }, [pluginSlug]);

  useEffect(() => {
    if (open && pluginSlug) fetchVersions();
  }, [open, pluginSlug, fetchVersions]);

  const matchedVersion = versions.find(v =>
    v.game_versions?.includes(selectedGameVersion) &&
    v.loaders?.includes(selectedLoader)
  );

  const downloadUrl = matchedVersion?.files?.find(f => f.primary)?.url ?? matchedVersion?.files?.[0]?.url;

  return (
    <Modal open={open} onClose={onClose} title={`${pluginName} - ${t("marketplace.downloadTitle", "Download")}`}>
      {loading ? (
        <div className="py-8 flex justify-center">
          <IconSpinner className="h-6 w-6 text-emerald-400" />
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("marketplace.gameVersion", "Game Version")}</label>
            <Select
              value={selectedGameVersion}
              onChange={setSelectedGameVersion}
              options={gameVersions.map(v => ({ value: v, label: v }))}
              placeholder={t("marketplace.selectGameVersion", "Select version")}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("marketplace.software", "Software (Loader)")}</label>
            <Select
              value={selectedLoader}
              onChange={setSelectedLoader}
              options={loaders.map(l => ({ value: l, label: l.charAt(0).toUpperCase() + l.slice(1) }))}
              placeholder={t("marketplace.selectSoftware", "Select loader")}
            />
          </div>
          <div className="pt-2">
            {downloadUrl ? (
              <Button variant="primary" className="w-full" onClick={() => {
                if (downloadUrl && isSafeDownloadUrl(downloadUrl)) {
                  window.open(downloadUrl, "_blank", "noopener,noreferrer");
                }
              }}>
                <IconDownloadCloud className="h-4 w-4" />
                {t("marketplace.downloadBtn", "Download")} ({matchedVersion?.version_number})
              </Button>
            ) : (
              <Button variant="secondary" className="w-full opacity-60 cursor-not-allowed">
                {t("marketplace.noVersionFound", "No matching version found")}
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
