'use client';

import Navbar from '@/src/components/ui/Navbar';
import AdvancedTaxCalculator from '@/src/components/interactive/AdvancedTaxCalculator';
import MateriIdentifikasiTransaksi from '@/src/components/interactive/MateriIdentifikasiTransaksi';
import UnifiedAccountingLab from '@/src/components/interactive/UnifiedAccountingLab';
import InteractiveBackground from '@/src/components/ui/InteractiveBackground';

import {
  Sparkles,
  Calculator,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Coins,
  GraduationCap,
  FileSpreadsheet,
} from 'lucide-react';

import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div
      className="
        relative
        isolate
        min-h-screen
        bg-slate-50
        dark:bg-slate-950
        text-slate-900
        dark:text-white
        transition-colors
        duration-300
        flex
        flex-col
        font-sans
        overflow-x-hidden
        selection:bg-emerald-500
        selection:text-white
      "
    >
      {/* =========================================================
          BACKGROUND
          ========================================================= */}
      <InteractiveBackground />

      {/* =========================================================
          NAVBAR
          ========================================================= */}
      <div className="relative z-30">
        <Navbar />
      </div>

      {/* =========================================================
          MAIN CONTENT
          ========================================================= */}
      <main
        className="
          relative
          z-10
          flex-1
          max-w-7xl
          w-full
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-8
          space-y-20
        "
      >
        {/* =======================================================
            HERO
            ======================================================= */}
        <section
          id="hero"
          className="
            relative
            pt-6
            pb-12
            md:py-16
            text-center
            space-y-8
          "
        >
          {/* School Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              bg-white/80
              dark:bg-slate-900/80
              backdrop-blur-md
              border
              border-slate-300/60
              dark:border-slate-800/80
              text-slate-700
              dark:text-slate-300
              text-xs
              font-semibold
              shadow-sm
            "
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

            <GraduationCap
              className="
                w-4
                h-4
                text-emerald-600
                dark:text-emerald-400
              "
            />

            <span>
              SMA Negeri 14 Palembang • EduFinance Hub
            </span>
          </motion.div>

          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="
              space-y-4
              max-w-5xl
              mx-auto
              p-6
              rounded-3xl
              bg-white/50
              dark:bg-slate-950/40
              backdrop-blur-sm
              border
              border-slate-200/40
              dark:border-slate-800/40
              shadow-sm
            "
          >
            <h1
              className="
                text-4xl
                sm:text-5xl
                lg:text-6xl
                font-black
                tracking-tight
                leading-[1.15]
                text-slate-900
                dark:text-white
              "
            >
              Simulator Akuntansi Interaktif{' '}
              <span
                className="
                  bg-gradient-to-r
                  from-emerald-600
                  via-teal-500
                  to-cyan-600
                  dark:from-emerald-400
                  dark:via-teal-300
                  dark:to-cyan-400
                  bg-clip-text
                  text-transparent
                "
              >
                Keuangan & Pajak Digital
              </span>
            </h1>

            <p
              className="
                text-base
                sm:text-lg
                text-slate-600
                dark:text-slate-400
                max-w-2xl
                mx-auto
                font-medium
                leading-relaxed
              "
            >
              Platform edukasi interaktif
              (Siswa & Guru) berbasis teknologi modern
              untuk memahami kalkulasi pajak PPh 21,
              PPN, PBB, serta alur pengerjaan 7 tahapan
              siklus akuntansi secara langsung.
            </p>
          </motion.div>

          {/* =====================================================
              CTA BUTTONS
              ===================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
            className="
              flex
              flex-col
              sm:flex-row
              items-center
              justify-center
              gap-4
              pt-2
            "
          >
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="#simulasi-pajak"
              className="
                w-full
                sm:w-auto
                px-8
                py-3.5
                rounded-2xl
                bg-gradient-to-r
                from-emerald-600
                to-teal-600
                hover:from-emerald-500
                hover:to-teal-500
                text-white
                font-bold
                text-sm
                shadow-xl
                shadow-emerald-500/25
                flex
                items-center
                justify-center
                gap-2.5
                transition-all
              "
            >
              <Calculator className="w-4 h-4" />

              Coba Simulasi Pajak

              <ArrowRight className="w-4 h-4" />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="#siklus-akuntansi"
              className="
                w-full
                sm:w-auto
                px-8
                py-3.5
                rounded-2xl
                bg-white/80
                dark:bg-slate-900/80
                backdrop-blur-md
                border
                border-slate-300
                dark:border-slate-700
                text-slate-800
                dark:text-slate-200
                font-bold
                text-sm
                hover:bg-slate-100
                dark:hover:bg-slate-800
                transition-all
                flex
                items-center
                justify-center
                gap-2.5
                shadow-sm
              "
            >
              <FileSpreadsheet className="w-4 h-4 text-cyan-500" />

              Laboratorium Siklus Akuntansi
            </motion.a>
          </motion.div>

          {/* =====================================================
              FEATURE CARDS
              ===================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.3,
            }}
            className="
              pt-6
              grid
              grid-cols-2
              md:grid-cols-4
              gap-4
              max-w-3xl
              mx-auto
              text-left
            "
          >
            {[
              {
                label: 'Kalkulator Pajak',
                val: 'PPh 21, PPN & PBB',
                icon: Coins,
                color: 'text-emerald-500',
              },
              {
                label: 'Siklus Akuntansi',
                val: '7 Tahap Terpadu',
                icon: BookOpen,
                color: 'text-cyan-500',
              },
              {
                label: 'Buku Kerja Siswa',
                val: 'Jasa & Dagang',
                icon: FileSpreadsheet,
                color: 'text-indigo-500',
              },
              {
                label: 'Dashboard Guru',
                val: 'Filter Kelas & Penilaian',
                icon: ShieldCheck,
                color: 'text-rose-500',
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="
                    p-6
                    rounded-2xl
                    bg-white/70
                    dark:bg-slate-900/70
                    backdrop-blur-md
                    border
                    border-slate-200/80
                    dark:border-slate-800/80
                    shadow-sm
                  "
                >
                  <Icon
                    className={`
                      w-5
                      h-5
                      ${item.color}
                      mb-1.5
                    `}
                  />

                  <div
                    className="
                      text-[11px]
                      font-medium
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {item.label}
                  </div>

                  <div
                    className="
                      text-xs
                      font-bold
                      text-slate-900
                      dark:text-white
                      truncate
                    "
                  >
                    {item.val}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </section>

        {/* =======================================================
            MODUL 1 — PAJAK
            ======================================================= */}
        <section
          id="simulasi-pajak"
          className="scroll-mt-24 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div
              className="
                w-10
                h-10
                rounded-2xl
                bg-emerald-500/10
                dark:bg-emerald-500/20
                border
                border-emerald-500/30
                flex
                items-center
                justify-center
              "
            >
              <Calculator
                className="
                  w-5
                  h-5
                  text-emerald-600
                  dark:text-emerald-400
                "
              />
            </div>

            <div>
              <span
                className="
                  text-xs
                  font-extrabold
                  text-emerald-600
                  dark:text-emerald-400
                  uppercase
                  tracking-widest
                  block
                "
              >
                Modul 1
              </span>

              <h2
                className="
                  text-2xl
                  sm:text-3xl
                  font-extrabold
                  text-slate-900
                  dark:text-white
                  tracking-tight
                "
              >
                Simulasi Pajak Terpadu
              </h2>
            </div>
          </div>

          <AdvancedTaxCalculator />
        </section>

        {/* =======================================================
            MODUL 2 — AKUNTANSI
            ======================================================= */}
        <section
          id="siklus-akuntansi"
          className="scroll-mt-24 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div
              className="
                w-10
                h-10
                rounded-2xl
                bg-cyan-500/10
                dark:bg-cyan-500/20
                border
                border-cyan-500/30
                flex
                items-center
                justify-center
              "
            >
              <BookOpen
                className="
                  w-5
                  h-5
                  text-cyan-600
                  dark:text-cyan-400
                "
              />
            </div>

            <div>
              <span
                className="
                  text-xs
                  font-extrabold
                  text-cyan-600
                  dark:text-cyan-400
                  uppercase
                  tracking-widest
                  block
                "
              >
                Modul 2
              </span>

              <h2
                className="
                  text-2xl
                  sm:text-3xl
                  font-extrabold
                  text-slate-900
                  dark:text-white
                  tracking-tight
                "
              >
                Laboratorium Siklus Akuntansi & Buku Kerja Digital
              </h2>
            </div>
          </div>

          <UnifiedAccountingLab />
        </section>
      </main>

      {/* =========================================================
          FOOTER
          ========================================================= */}
      <footer
        className="
          relative
          z-10
          border-t
          border-slate-200
          dark:border-slate-800/80
          bg-white/80
          dark:bg-slate-950/80
          backdrop-blur-md
          py-10
          mt-16
          text-slate-600
          dark:text-slate-400
          text-xs
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-4
          "
        >
          <div className="flex items-center gap-2.5">
            <div
              className="
                w-7
                h-7
                rounded-lg
                bg-emerald-500
                flex
                items-center
                justify-center
                text-white
                font-bold
              "
            >
              <Sparkles className="w-4 h-4" />
            </div>

            <span
              className="
                font-bold
                text-slate-900
                dark:text-white
                text-sm
              "
            >
              EduFinance SMAN 14 Palembang
            </span>
          </div>

          <div
            className="
              flex
              items-center
              gap-4
              text-center
              sm:text-right
            "
          >
            <a
              href="/admin"
              className="
                text-emerald-600
                dark:text-emerald-400
                font-bold
                hover:underline
              "
            >
              Dashboard Guru (CMS Admin)
            </a>

            <span>•</span>

            <p>
              © {new Date().getFullYear()} EduFinance Hub • SMAN 14 Palembang
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}