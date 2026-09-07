'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Receipt,
  BookOpen,
  Library,
  Scale,
  Edit,
  CheckSquare,
  PieChart,
  ChevronRight,
  Sparkles,
  Building2,
  Store,
  Layers,
  ArrowRight,
  CheckCircle2,
  Info,
} from 'lucide-react';

/* ─── Data Node Siklus Akuntansi Perusahaan Jasa ─────────────────── */
const serviceCycleNodes = [
  {
    id: 1,
    title: 'Identifikasi Transaksi',
    subtitle: 'Bukti Transaksi Fisik / Digital',
    icon: Receipt,
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/30',
    bgGlow: 'bg-emerald-500/10',
    textColor: 'text-emerald-500',
    description:
      'Langkah awal mengumpulkan dan menganalisis bukti-bukti transaksi keuangan (kwitansi, nota, faktur, bukti transfer, dll).',
    details: [
      'Memeriksa keabsahan tanda tangan & stempel bukti transaksi',
      'Menganalisis dampak akun: Mana yang bertambah vs mana yang berkurang',
      'Contoh: Kwitansi penerimaan pendapatan jasa dari pelanggan',
    ],
  },
  {
    id: 2,
    title: 'Jurnal Umum',
    subtitle: 'General Journal Entries',
    icon: BookOpen,
    color: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-500/30',
    bgGlow: 'bg-cyan-500/10',
    textColor: 'text-cyan-500',
    description:
      'Mencatat seluruh transaksi secara kronologis (berdasarkan tanggal) sesuai aturan double-entry debit dan kredit.',
    details: [
      'Kolom: Tanggal, Nama Akun, Ref, Debit, Kredit',
      'Aturan Posisi: Aset & Beban bertambah di Debit; Utang, Ekuitas & Pendapatan bertambah di Kredit',
      'Contoh: Beban Sewa (Debit) vs Kas (Kredit)',
    ],
  },
  {
    id: 3,
    title: 'Posting Buku Besar',
    subtitle: 'General Ledger / T-Account',
    icon: Library,
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-500/30',
    bgGlow: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    description:
      'Memindahkan saldo-saldo dari jurnal umum ke kelompok akun masing-masing (Buku Besar) untuk menghitung saldo akhir tiap akun.',
    details: [
      'Pengelompokan akun Aset, Liabilitas, Ekuitas, Pendapatan, dan Beban',
      'Menghitung saldo akumulasi (Debit - Kredit)',
      'Memudahkan pemantauan posisi kas dan piutang secara spesifik',
    ],
  },
  {
    id: 4,
    title: 'Neraca Saldo',
    subtitle: 'Trial Balance',
    icon: Scale,
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500/30',
    bgGlow: 'bg-amber-500/10',
    textColor: 'text-amber-500',
    description:
      'Daftar yang memuat seluruh saldo akhir akun buku besar untuk menguji kesamaan (keseimbangan) antara total Debit dan total Kredit.',
    details: [
      'Memastikan tidak ada kesalahan matematis dalam pemindahan saldo',
      'Syarat mutlak: Total Debit = Total Kredit',
      'Menjadi dasar awal sebelum melakukan penyesuaian akhir periode',
    ],
  },
  {
    id: 5,
    title: 'Jurnal Penyesuaian',
    subtitle: 'Adjusting Journal Entries',
    icon: Edit,
    color: 'from-rose-500 to-pink-600',
    borderColor: 'border-rose-500/30',
    bgGlow: 'bg-rose-500/10',
    textColor: 'text-rose-500',
    description:
      'Pencatatan untuk memperbarui saldo akun agar mencerminkan kondisi riil pada akhir periode akuntansi (Accrual Basis).',
    details: [
      'Penyesuaian Perlengkapan terpakai & Beban Dibayar Dimuka',
      'Penyusutan Aset Tetap (Peralatan/Gedung)',
      'Pendapatan diterima dimuka & Beban terutang (Gaji belum dibayar)',
    ],
  },
  {
    id: 6,
    title: 'Neraca Saldo Disesuaikan',
    subtitle: 'Adjusted Trial Balance',
    icon: CheckSquare,
    color: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-500/30',
    bgGlow: 'bg-purple-500/10',
    textColor: 'text-purple-500',
    description:
      'Neraca saldo yang telah diperbarui dengan memasukkan angka-angka hasil Jurnal Penyesuaian.',
    details: [
      'Menjadi sumber data langsung pembuatan Laporan Keuangan',
      'Angka saldo telah 100% akurat sesuai realita periode berjalan',
      'Dapat disusun bersama Kertas Kerja (Worksheet 10 Kolom)',
    ],
  },
  {
    id: 7,
    title: 'Laporan Keuangan',
    subtitle: 'Financial Statements',
    icon: PieChart,
    color: 'from-emerald-400 via-teal-500 to-cyan-500',
    borderColor: 'border-emerald-400/40',
    bgGlow: 'bg-emerald-500/15',
    textColor: 'text-emerald-400',
    description:
      'Output utama siklus akuntansi berupa Laporan Laba Rugi, Perubahan Ekuitas, Neraca Posisi Keuangan, dan Laporan Arus Kas.',
    details: [
      'Laporan Laba Rugi: Total Pendapatan - Total Beban = Laba/Rugi Bersih',
      'Laporan Perubahan Ekuitas: Modal Awal + Laba - Prive = Modal Akhir',
      'Neraca: Total Aset = Total Liabilitas + Total Ekuitas',
    ],
  },
];

/* ─── Data Fase Siklus Akuntansi Perusahaan Dagang ───────────────── */
const tradingPhases = [
  {
    phase: 1,
    title: 'Fase 1: Pencatatan Transaksi Dagang',
    subtitle: 'Special Journals & Subsidiary Ledgers',
    color: 'from-cyan-500 to-blue-600',
    badge: 'Pencatatan',
    steps: [
      {
        name: 'Identifikasi Bukti Transaksi Dagang',
        desc: 'Faktur penjualan, nota debet/kredit, kwitansi, nota kontan barang dagangan.',
      },
      {
        name: 'Jurnal Khusus & Jurnal Umum',
        desc: 'Penggunaan 4 Jurnal Khusus: Jurnal Penjualan, Jurnal Pembelian, Jurnal Penerimaan Kas, & Jurnal Pengeluaran Kas (lebih efisien dibanding perusahaan jasa).',
      },
      {
        name: 'Posting ke Buku Besar Pembantu',
        desc: 'Pencatatan rinci ke Buku Besar Pembantu Piutang Dagang (per pelanggan) & Buku Besar Pembantu Utang Dagang (per pemasok/supplier).',
      },
    ],
  },
  {
    phase: 2,
    title: 'Fase 2: Pengikhtisaran & Penyesuaian',
    subtitle: 'Trial Balance & HPP Adjustments',
    color: 'from-amber-500 to-orange-600',
    badge: 'Pengikhtisaran',
    steps: [
      {
        name: 'Neraca Saldo (Trial Balance)',
        desc: 'Pengumpulan saldo akhir seluruh akun utama dari buku besar.',
      },
      {
        name: 'Jurnal Penyesuaian Persediaan Barang',
        desc: 'Menyesuaikan nilai Persediaan Barang Dagang (PBD) dengan 2 metode: Pendekatan Ikhtisar Laba/Rugi ATAU Pendekatan Harga Pokok Penjualan (HPP).',
      },
      {
        name: 'Neraca Lajur / Kertas Kerja 10 Kolom',
        desc: 'Alat bantu menyusun Neraca Saldo, Penyesuaian, NSD, Laba Rugi, dan Neraca dalam satu tabel terpadu.',
      },
    ],
  },
  {
    phase: 3,
    title: 'Fase 3: Pelaporan & Penutupan Akhir',
    subtitle: 'Multi-Step Income Statement & Closing',
    color: 'from-emerald-500 to-teal-600',
    badge: 'Pelaporan & Penutupan',
    steps: [
      {
        name: 'Laporan Keuangan (Multi-Step)',
        desc: 'Menghitung Penjualan Bersih, HPP (Persediaan Awal + Pembelian Bersih - Persediaan Akhir), Laba Kotor, serta Laba Bersih Operasional.',
      },
      {
        name: 'Jurnal Penutup (Closing Entries)',
        desc: 'Menutup akun nominal (Penjualan, Retur, Beban-beban, HPP, Ikhtisar L/R, Prive) menjadi bernilai NOL untuk periode berikutnya.',
      },
      {
        name: 'Neraca Saldo Setelah Penutupan & Jurnal Pembalik',
        desc: 'Memastikan akun riil (Aset, Utang, Modal) siap dibuka di periode baru, diikuti Jurnal Pembalik opsional.',
      },
    ],
  },
];

export default function AccountingCycle() {
  const [activeTab, setActiveTab] = useState<'service' | 'trading'>('service');
  const [selectedServiceNode, setSelectedServiceNode] = useState<number>(1);
  const [expandedTradingPhase, setExpandedTradingPhase] = useState<number | null>(1);

  const currentNodeData = serviceCycleNodes.find((n) => n.id === selectedServiceNode) || serviceCycleNodes[0];

  return (
    <section className="w-full relative">
      {/* Background Subtle Glows */}
      <div className="absolute top-1/3 -left-10 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" />
              Interactive Accounting Timeline
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Eksplorasi Siklus Akuntansi
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Pelajari alur pencatatan keuangan dari bukti transaksi awal hingga laporan akhir untuk perusahaan jasa & dagang.
            </p>
          </div>

          {/* Tab Switcher (Perusahaan Jasa vs Dagang) */}
          <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('service')}
              className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'service'
                  ? 'text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {activeTab === 'service' && (
                <motion.div
                  layoutId="activeCycleTab"
                  className="absolute inset-0 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Building2 className={`w-4 h-4 ${activeTab === 'service' ? 'text-emerald-500' : ''}`} />
                Perusahaan Jasa
              </span>
            </button>

            <button
              onClick={() => setActiveTab('trading')}
              className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'trading'
                  ? 'text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {activeTab === 'trading' && (
                <motion.div
                  layoutId="activeCycleTab"
                  className="absolute inset-0 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Store className={`w-4 h-4 ${activeTab === 'trading' ? 'text-cyan-500' : ''}`} />
                Perusahaan Dagang
              </span>
            </button>
          </div>
        </div>


        {/* Content Section with AnimatePresence */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: PERUSAHAAN JASA */}
          {activeTab === 'service' && (
            <motion.div
              key="service-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Horizontal / Grid Step Nodes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {serviceCycleNodes.map((node) => {
                  const Icon = node.icon;
                  const isSelected = selectedServiceNode === node.id;
                  return (
                    <motion.button
                      key={node.id}
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setSelectedServiceNode(node.id)}
                      className={`relative p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all min-h-[110px] ${
                        isSelected
                          ? `bg-slate-900 text-white ${node.borderColor} shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/50 dark:bg-slate-800`
                          : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                            isSelected
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {node.id}
                        </span>
                        <Icon className={`w-4 h-4 ${isSelected ? node.textColor : 'text-slate-400'}`} />
                      </div>

                      <div>
                        <h4 className="text-xs font-bold leading-snug truncate">{node.title}</h4>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 truncate mt-0.5">{node.subtitle}</p>
                      </div>

                      {isSelected && (
                        <motion.div
                          layoutId="selectedIndicator"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-500 rounded-full"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Selected Node Expanded Detail Card */}
              <motion.div
                key={currentNodeData.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-6 sm:p-8 border border-slate-700/80 shadow-2xl relative overflow-hidden"
              >
                {/* Background Accent Glow */}
                <div className={`absolute top-0 right-0 w-64 h-64 ${currentNodeData.bgGlow} rounded-full blur-3xl pointer-events-none`} />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentNodeData.color} flex items-center justify-center shadow-lg`}>
                        <currentNodeData.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block">
                          Langkah ke-{currentNodeData.id} dari 7
                        </span>
                        <h3 className="text-xl font-extrabold text-white">{currentNodeData.title}</h3>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-slate-300 border border-white/15">
                      {currentNodeData.subtitle}
                    </span>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    {currentNodeData.description}
                  </p>

                  <div className="pt-4 border-t border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {currentNodeData.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}


          {/* TAB 2: PERUSAHAAN DAGANG */}
          {activeTab === 'trading' && (
            <motion.div
              key="trading-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* 3 Main Phase Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {tradingPhases.map((phase) => {
                  const isExpanded = expandedTradingPhase === phase.phase;
                  return (
                    <motion.div
                      key={phase.phase}
                      whileHover={{ y: -3 }}
                      onClick={() => setExpandedTradingPhase(isExpanded ? null : phase.phase)}
                      className={`cursor-pointer rounded-2xl border transition-all p-6 flex flex-col justify-between ${
                        isExpanded
                          ? 'bg-slate-900 text-white border-cyan-500/50 shadow-xl dark:bg-slate-950'
                          : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-cyan-500/30'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r ${phase.color} text-white shadow-md`}>
                            {phase.badge}
                          </span>
                          <ChevronRight
                            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                              isExpanded ? 'rotate-90 text-cyan-400' : ''
                            }`}
                          />
                        </div>

                        <h3 className="font-extrabold text-base mb-1">{phase.title}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">{phase.subtitle}</p>

                        <div className="space-y-3 pt-2">
                          {phase.steps.map((step, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-xl border text-xs space-y-1 transition-colors ${
                                isExpanded
                                  ? 'bg-white/5 border-white/10 text-slate-200'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className="font-bold flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                                <ArrowRight className="w-3.5 h-3.5" />
                                {step.name}
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed pl-5">
                                {step.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-slate-800 text-center">
                        <span className="text-[11px] font-bold text-cyan-500 flex items-center justify-center gap-1">
                          <Info className="w-3.5 h-3.5" /> Klik untuk memperluas penjelasan fase ini
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Educational Highlight Card */}
              <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-800 dark:text-cyan-300 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-sm font-bold mb-1">Perbedaan Utama Perusahaan Jasa vs Dagang:</strong>
                  Perusahaan dagang memperjualbelikan barang fisik (memiliki Persediaan Barang Dagang & HPP) dan menggunakan 4 Jurnal Khusus, sedangkan perusahaan jasa menjual layanan/keahlian tanpa persediaan fisik.
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </section>
  );
}
