"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const Web3Provider = dynamic(() => import("@/components/providers/Web3Provider"), {
  ssr: false,
});

export default function SponsorsLayout({ children }: { children: ReactNode }) {
  return <Web3Provider>{children}</Web3Provider>;
}
