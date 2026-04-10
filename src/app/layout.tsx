import type { Metadata } from "next";
import "./globals.css";
import I18nProvider from "@/components/providers/I18nProvider";
import PageTransition from "@/components/providers/PageTransition";
import Sidebar from "@/components/layout/Sidebar";
import { ToastProvider } from "@/components/ui/Toast";
import { ApiStatusProvider } from "@/components/providers/ApiStatusProvider";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: `${config.siteName} — Minecraft Utility Tools`,
  description: "Powerful, free Minecraft utility tools for players and server admins.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <I18nProvider>
          <ApiStatusProvider>
            <ToastProvider>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-auto pb-20 md:pb-0">
                  <PageTransition>{children}</PageTransition>
                </div>
              </div>
            </ToastProvider>
          </ApiStatusProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
