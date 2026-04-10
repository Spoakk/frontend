"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0c0c0f", fontFamily: "system-ui, sans-serif" }}>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: "24px",
        }}>
          <p style={{ fontSize: "80px", fontWeight: 900, color: "rgba(255,255,255,0.08)", margin: "0 0 8px" }}>500</p>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
            Kritik bir hata oluştu
          </h1>
          <p style={{ fontSize: "14px", color: "#71717a", maxWidth: "300px", margin: "0 0 32px" }}>
            Uygulama beklenmedik bir hatayla karşılaştı.
          </p>
          <button
            onClick={reset}
            style={{
              borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)", padding: "10px 20px",
              fontSize: "14px", fontWeight: 500, color: "#d4d4d8", cursor: "pointer",
            }}
          >
            Tekrar dene
          </button>
          {error.digest && (
            <p style={{ marginTop: "24px", fontSize: "12px", color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>
              {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
