"use client";

import { useEffect } from "react";
import "./globals.css";
import InstallPWAButton from "@/components/InstallPWAButton";

export default function RootLayout({ children }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("✅ Service Worker aktif"))
        .catch((err) => console.error("❌ Gagal mendaftar SW:", err));
    }
  }, []);

  return (
    <html lang="id">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4CAF50" />
      </head>
      <body>
        {children}
        <InstallPWAButton /> {/* 🟢 Tombol install muncul di kanan bawah */}
      </body>
    </html>
  );
}
