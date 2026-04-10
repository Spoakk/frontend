import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Spoak Widget",
  description: "Embeddable Minecraft server status widget",
};

export default function WidgetLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
