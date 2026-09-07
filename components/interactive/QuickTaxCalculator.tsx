'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calculator, Receipt, Home } from 'lucide-react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

type TabId = 'pph21' | 'ppn' | 'pbb';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'pph21', label: 'PPh 21', icon: <Calculator size={16} /> },
  { id: 'ppn', label: 'PPN 11%', icon: <Receipt size={16} /> },
  { id: 'pbb', label: 'PBB', icon: <Home size={16} /> },
];

/* ─── Slider Component ─────────────────────────────────────────── */
function Slider({
  label,
  min,
  max,
  value,
  onChange,
  format = (v: number) => `Rp ${v.toLocaleString('id-ID')}`,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-300">{label}</label>
        <span className="text-sm font-semibold text-emerald-400">
          {format(value)}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-slate-700">
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          step={Math.round((max - min) / 200)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

/* ─── Result Row ───────────────────────────────────────────────── */
function ResultRow({
  label,
  value,
  highlight = false,
  prefix = 'Rp ',
}: {
  label: string;
  value: number;
  highlight?: boolean;
  prefix?: string;
}) {
  return (
    <div
      className={`flex justify-between items-center rounded-xl px-4 py-3 ${
        highlight
          ? 'bg-emerald-500/10 border border-emerald-500/30'
          : 'bg-slate-800/50'
      }`}
    >
      <span
        className={`text-sm font-medium ${
          highlight ? 'text-emerald-300' : 'text-slate-400'
        }`}
      >
        {label}
      </span>
      <AnimatedCounter
        endValue={value}
        prefix={prefix}
        className={`text-base font-bold ${
          highlight ? 'text-emerald-400' : 'text-white'
        }`}
      />
    </div>
  );
}

/* ─── Tab: PPh 21 ──────────────────────────────────────────────── */
function PPh21Tab() {
  const PTKP = 4_500_000;
  const [salary, setSalary] = useState(6_000_000);

  const taxBase = Math.max(0, salary - PTKP);
  const pph21 = Math.round(taxBase * 0.05);
  const takeHome = salary - pph21;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Slider
          label="Gaji Bruto per Bulan"
          min={3_000_000}
          max={25_000_000}
          value={salary}
          onChange={setSalary}
        />
        <div className="text-xs text-slate-500 bg-slate-800/40 rounded-lg px-3 py-2">
          PTKP (Penghasilan Tidak Kena Pajak): Rp 4.500.000/bulan
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Hasil Perhitungan
        </p>
        <ResultRow label="Gaji Bruto" value={salary} />
        <ResultRow label="Penghasilan Kena Pajak" value={taxBase} />
        <ResultRow label="Potongan PPh 21 (5%)" value={pph21} highlight />
        <ResultRow label="Take Home Pay (Gaji Bersih)" value={takeHome} highlight />
      </div>
    </div>
  );
}

/* ─── Tab: PPN ─────────────────────────────────────────────────── */
function PPNTab() {
  const [price, setPrice] = useState(500_000);

  const ppn = Math.round(price * 0.11);
  const total = price + ppn;

  return (
    <div className="space-y-6">
      <Slider
        label="Harga Barang / Jasa"
        min={10_000}
        max={5_000_000}
        value={price}
        onChange={setPrice}
      />
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Hasil Perhitungan
        </p>
        <ResultRow label="Harga Sebelum PPN" value={price} />
        <ResultRow label="PPN 11%" value={ppn} highlight />
        <ResultRow label="Total Pembayaran" value={total} highlight />
      </div>
    </div>
  );
}

/* ─── Tab: PBB ─────────────────────────────────────────────────── */
function PBBTab() {
  const NJOPTKP = 12_000_000;
  const [njopBumi, setNjopBumi] = useState(150_000_000);
  const [njopBangunan, setNjopBangunan] = useState(80_000_000);

  const totalNjop = njopBumi + njopBangunan;
  const njopKenaPajak = Math.max(0, totalNjop - NJOPTKP);
  const pbb = Math.round(njopKenaPajak * 0.005 * 0.2);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Slider
          label="NJOP Bumi (Tanah)"
          min={10_000_000}
          max={1_000_000_000}
          value={njopBumi}
          onChange={setNjopBumi}
          format={(v) => `Rp ${(v / 1_000_000).toFixed(0)} Jt`}
        />
        <Slider
          label="NJOP Bangunan"
          min={10_000_000}
          max={500_000_000}
          value={njopBangunan}
          onChange={setNjopBangunan}
          format={(v) => `Rp ${(v / 1_000_000).toFixed(0)} Jt`}
        />
        <div className="text-xs text-slate-500 bg-slate-800/40 rounded-lg px-3 py-2">
          NJOPTKP: Rp 12.000.000 | Tarif: 0,5% × 20% = 0,1%
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Hasil Perhitungan
        </p>
        <ResultRow label="Total NJOP" value={totalNjop} />
        <ResultRow label="NJOP Kena Pajak" value={njopKenaPajak} />
        <ResultRow label="Estimasi PBB per Tahun" value={pbb} highlight />
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────── */
export default function QuickTaxCalculator() {
  const [activeTab, setActiveTab] = useState<TabId>('pph21');

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Glow effect */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent blur-xl pointer-events-none" />

      <div className="relative rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Kalkulator Pajak Interaktif
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">Hitung Pajakmu Sekarang</h3>
          <p className="text-sm text-slate-400 mt-0.5">
            Estimasi real-time berdasarkan regulasi perpajakan Indonesia
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 p-2 bg-slate-800/40 mx-4 mt-4 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6 min-h-[360px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              {activeTab === 'pph21' && <PPh21Tab />}
              {activeTab === 'ppn' && <PPNTab />}
              {activeTab === 'pbb' && <PBBTab />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer note */}
        <div className="px-6 pb-4 pt-0 text-center">
          <p className="text-xs text-slate-600">
            * Perhitungan bersifat estimasi untuk tujuan edukasi. Konsultasikan dengan konsultan pajak untuk angka akurat.
          </p>
        </div>
      </div>
    </div>
  );
}
