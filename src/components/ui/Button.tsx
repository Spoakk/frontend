import React from "react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export function Button({ variant = "primary", href, className, children, ...props }: ButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0c0f]";
  
  const variants = {
    primary: "group overflow-hidden rounded-xl border border-dashed border-emerald-600/50 bg-white/[0.01] px-6 py-2.5 text-emerald-400 hover:border-emerald-500/60 hover:text-white",
    secondary: "rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-zinc-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
  };

  const primaryFill = variant === "primary" && (
    <div className="absolute left-1/2 top-[100%] w-[250%] aspect-square -translate-x-1/2 translate-y-[60%] -z-10 transition-transform duration-1000 ease-out group-hover:-translate-y-[40%]">
      <div className="absolute inset-0 rounded-[40%] bg-emerald-600/80 animate-[spin_10s_linear_infinite]" />
      <div className="absolute inset-[-2%] rounded-[45%] bg-emerald-500/40 animate-[spin_13s_linear_infinite]" />
      <div className="absolute inset-[-4%] rounded-[42%] bg-emerald-500/20 animate-[spin_16s_linear_infinite]" />
    </div>
  );

  const mergedClasses = cn(baseStyles, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={mergedClasses}>
        {primaryFill}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </Link>
    );
  }

  return (
    <button className={mergedClasses} {...props}>
      {primaryFill}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
