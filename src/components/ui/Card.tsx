"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/components/ui/Button";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean; // hover
  href?: string;
  clickable?: boolean;
  as?: "div" | "section" | "article";
}

export function Card({ children, className, glow = false, href, clickable = false, as: Tag = "div" }: CardProps) {
  const base = cn(
    "relative rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden transition-all duration-300",
    (clickable || href || glow) && "hover:border-emerald-500/20 hover:bg-white/[0.04]",
    (clickable || href) && "cursor-pointer",
    className
  );

  const glowEl = glow && (
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-emerald-500/[0.05] to-transparent pointer-events-none" />
  );

  if (href) {
    return (
      <Link href={href} className={cn(base, "group flex flex-col")}>
        {glowEl}
        {children}
      </Link>
    );
  }

  return (
    <Tag className={cn(base, glow && "group")}>
      {glowEl}
      {children}
    </Tag>
  );
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("relative p-5", className)}>{children}</div>;
}

export interface CardContentProps {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  className?: string;
}

export function CardContent({ icon, title, description, footer, iconClassName, titleClassName, descriptionClassName, className }: CardContentProps) {
  return (
    <div className={cn("relative flex flex-col h-full", className)}>
      {icon && (
        <div className={cn(
          "mb-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-400 group-hover:border-emerald-500/20 group-hover:text-emerald-400 transition-all duration-300",
          iconClassName
        )}>
          {icon}
        </div>
      )}
      {title && (
        <p className={cn("text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors duration-200 leading-snug", titleClassName)}>
          {title}
        </p>
      )}
      {description && (
        <p className={cn("mt-1 text-xs text-zinc-600 group-hover:text-zinc-500 transition-colors duration-200 leading-snug line-clamp-2", descriptionClassName)}>
          {description}
        </p>
      )}
      {footer && <div className="mt-auto pt-3">{footer}</div>}
    </div>
  );
}

export interface SectionCardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function SectionCard({ children, header, className, bodyClassName }: SectionCardProps) {
  return (
    <div className={cn("rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden", className)}>
      {header && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.07]">
          {header}
        </div>
      )}
      <div className={cn("p-4", bodyClassName)}>
        {children}
      </div>
    </div>
  );
}
