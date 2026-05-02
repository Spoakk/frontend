"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/Toast";
import { IconUpload, IconDownload, IconSpinner } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Card, SectionCard } from "@/components/ui/Card";

const ACCEPTED = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/x-icon", "image/vnd.microsoft.icon"];
const SIZE = 64;

function convertToServerIcon(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = SIZE; canvas.height = SIZE;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, SIZE, SIZE);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
    img.src = url;
  });
}

export default function ServerIconPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const [original, setOriginal] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!ACCEPTED.includes(file.type) && !file.name.match(/\.(ico|png|jpe?g|svg)$/i)) {
      toast(t("servericon.errorType"), "error");
      return;
    }
    setProcessing(true);
    setFileName(file.name);
    const origUrl = URL.createObjectURL(file);
    setOriginal(origUrl);
    try {
      const result = await convertToServerIcon(file);
      setPreview(result);
    } catch {
      toast(t("servericon.errorProcess"), "error");
    } finally {
      setProcessing(false);
    }
  }, [t, toast]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget === e.target) {
      setDragging(false);
    }
  };

  const handleDownload = () => {
    if (!preview) return;
    const a = document.createElement("a");
    a.href = preview;
    a.download = "server-icon.png";
    a.click();
    toast(t("servericon.downloaded"));
  };

  const handleReset = () => { setPreview(null); setOriginal(null); setFileName(""); };

  return (
    <div 
      className="relative min-h-screen bg-[#0c0c0f] px-6 py-10 md:py-12 max-w-xl mx-auto"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <AnimatePresence>
        {dragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="flex flex-col items-center gap-4 px-8 py-12 rounded-3xl border-2 border-dashed border-emerald-400 bg-emerald-500/10"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 0.6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex h-24 w-24 items-center justify-center rounded-2xl bg-emerald-500/20"
              >
                <IconUpload className="h-12 w-12 text-emerald-400" />
              </motion.div>
              <div className="text-center">
                <p className="text-xl font-semibold text-white mb-1">
                  {t("servericon.dropHere") || "Drop your image here"}
                </p>
                <p className="text-sm text-emerald-400">
                  {t("servericon.dropFormats")}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t("servericon.badge")}
          </span>
          <h1 className="text-2xl font-bold text-white">{t("servericon.title")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t("servericon.description")}</p>
        </div>

        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.div 
              key="dropzone" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
            >
              <div
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(true); }}
                onDragLeave={(e) => { e.stopPropagation(); }}
                onDrop={(e) => { e.stopPropagation(); handleDrop(e); }}
                onClick={() => inputRef.current?.click()}
                className="relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 px-6 py-16 flex flex-col items-center gap-4 overflow-hidden border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.02] bg-white/[0.01]"
              >
                {dragging && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/10 pointer-events-none"
                  />
                )}
                
                <motion.div
                  animate={{ 
                    scale: dragging ? 1.1 : 1,
                    rotate: dragging ? 5 : 0
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative flex h-20 w-20 items-center justify-center rounded-2xl transition-colors bg-white/5"
                >
                  <IconUpload className="h-10 w-10 transition-colors text-zinc-500" />
                  {dragging && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 rounded-2xl border-2 border-emerald-400 animate-pulse"
                    />
                  )}
                </motion.div>

                <div className="text-center relative z-10">
                  <p className="text-base font-medium text-white mb-1">
                    {t("servericon.dropText")}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {t("servericon.dropOr") || "or"} <span className="text-emerald-400 font-medium">{t("servericon.dropBrowse")}</span>
                  </p>
                  <p className="text-xs text-zinc-600 mt-2">{t("servericon.dropFormats")}</p>
                </div>

                {processing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                  >
                    <IconSpinner className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-emerald-400">{t("servericon.processing")}</span>
                  </motion.div>
                )}

                <input 
                  ref={inputRef} 
                  type="file" 
                  accept=".png,.jpg,.jpeg,.svg,.ico" 
                  className="hidden" 
                  onChange={handleFile} 
                />
              </div>

              <div className="mt-4 flex items-center gap-3 text-xs text-zinc-600">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>{t("servericon.feature1") || "Automatic 64×64 resize"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>{t("servericon.feature2") || "High quality output"}</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <SectionCard bodyClassName="p-4 flex flex-col items-center gap-3">
                  <p className="text-xs text-zinc-500">{t("servericon.labelOriginal")}</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={original!} alt="original" className="max-h-32 max-w-full rounded object-contain" />
                  <p className="text-xs text-zinc-600 font-mono truncate max-w-full">{fileName}</p>
                </SectionCard>
                <Card className="border-emerald-500/20 bg-emerald-500/5 p-4 flex flex-col items-center gap-3">
                  <p className="text-xs text-emerald-400">{t("servericon.labelResult")}</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="server-icon" className="rounded" style={{ width: 64, height: 64, imageRendering: "pixelated" }} />
                  <p className="text-xs text-zinc-500 font-mono">{t("servericon.resultMeta")}</p>
                </Card>
              </div>
              <Button variant="primaryNormal" onClick={handleDownload} className="w-full">
                <IconDownload className="h-4 w-4" />
                {t("servericon.downloadBtn")}
              </Button>
              <button onClick={handleReset}
                className="w-full rounded-lg border border-white/8 py-2.5 text-sm text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
              >
                {t("servericon.convertAnother")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-6 text-xs text-zinc-700 text-center">{t("servericon.footerNote")}</p>
      </motion.div>
    </div>
  );
}
