"use client";

import { useState, ReactNode } from "react";
import "@/lib/i18n";
import SplashScreen from "@/components/providers/SplashScreen";

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      {children}
    </>
  );
}
