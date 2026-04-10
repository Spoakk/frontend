"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { IconCheck, IconCopy } from "@/components/ui/Icons";
import { useTranslation } from "react-i18next";
import { cn } from "@/components/ui/Button";

interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  textToCopy?: string;
  onCopyAction?: () => void;
  successMessage?: string;
  className?: string;
  children?: React.ReactNode;
}

export function CopyButton({ textToCopy, onCopyAction, successMessage, className, children, ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleCopy = () => {
    if (onCopyAction) {
      onCopyAction();
    } else if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
    }
    
    toast(successMessage || t("common.copied"), "success");
    
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn("relative overflow-hidden transition-all duration-300", className)}
      {...props}
    >
      <div className={cn("flex flex-1 items-center justify-center gap-1.5 transition-all duration-300", copied ? "opacity-0 scale-75 blur-sm" : "opacity-100 scale-100 blur-0")}>
        <IconCopy className="h-3.5 w-3.5" />
        {children}
      </div>
      
      <div className={cn("absolute inset-0 flex items-center justify-center text-emerald-400 transition-all duration-300", copied ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-125 blur-sm")}>
        <IconCheck className="h-4 w-4" />
      </div>
    </button>
  );
}
