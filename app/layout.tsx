import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import InteractiveBackground from '@/src/components/ui/InteractiveBackground';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduFinance Hub – Pembelajaran Keuangan & Pajak Digital",
  description: "Platform edukasi keuangan dan perpajakan digital untuk siswa SMA Negeri 14 Palembang. Pelajari PPh 21, PPN, PBB secara interaktif.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* Tambahkan background dasar transparan agar tidak menutup background global */}
      <body className="min-h-full flex flex-col relative bg-slate-50/90 dark:bg-slate-950/90 text-slate-900 dark:text-white">

        {/* Background global diletakkan di paling atas body */}
        <InteractiveBackground />

        {/* Konten halaman web */}
        <div className="relative z-10 flex flex-col flex-1">
          {children}
        </div>

      </body>
    </html>
  );
}