import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Multiamerica Vehículos",
  description: "Catálogo de vehículos Multiamerica — Vehículos, SUV y más.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className="
          bg-gradient-to-b from-black via-[#1a0800] to-black
          text-white min-h-screen flex flex-col
          scroll-smooth selection:bg-orange-600/40
        "
      >
        {/* 🔝 Header superior */}
        <Header />

        {/* 🔹 Contenido principal */}
        <main
          className="
            flex-1 mt-20
            w-full
            overflow-x-hidden
            px-2 sm:px-4 md:px-6
          "
        >
          {children}
        </main>

        {/* 🔻 Footer */}
        <Footer />

        {/* 📊 Herramientas de Vercel */}
        {process.env.NODE_ENV === "production" && (
          <>
            <SpeedInsights />
            <Analytics />
          </>
        )}
      </body>
    </html>
  );
}
