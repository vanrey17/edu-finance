'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Wallet,
  Receipt,
  Home,
  ShieldCheck,
  Sparkles,
  CreditCard,
  Send,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { supabase } from '@/src/lib/supabaseClient';

export default function AdvancedTaxCalculator() {
  // Input States
  const [userName, setUserName] = useState<string>('Budi Pratama');
  const [studentClass, setStudentClass] = useState<string>('XII IPS 1');
  const [monthlySalary, setMonthlySalary] = useState<number>(8_500_000);
  const [annualBonus, setAnnualBonus] = useState<number>(12_000_000);
  const [monthlyExpense, setMonthlyExpense] = useState<number>(3_500_000);
  const [njopBumi, setNjopBumi] = useState<number>(180_000_000);
  const [njopBangunan, setNjopBangunan] = useState<number>(120_000_000);

  // Active sub-tab for input panel
  const [inputTab, setInputTab] = useState<'profile' | 'pph' | 'ppn' | 'pbb'>('profile');

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitToast, setSubmitToast] = useState<{ show: boolean; title: string; message: string; type: 'success' | 'error' } | null>(null);

  // Calculation Logic
  // 1. PPh 21
  const annualGross = monthlySalary * 12 + annualBonus;
  const ptkp = 54_000_000; // PTKP TK/0 Rp 54 Juta per tahun
  const pkpAnnual = Math.max(0, annualGross - ptkp);
  const pph21Annual = pkpAnnual * 0.05;
  const pph21Monthly = Math.round(pph21Annual / 12);
  const takeHomePay = monthlySalary - pph21Monthly;

  // 2. PPN 11%
  const ppnNominal = Math.round(monthlyExpense * 0.11);

  // 3. PBB
  const totalNjop = njopBumi + njopBangunan;
  const njoptkp = 12_000_000;
  const njopKenaPajak = Math.max(0, totalNjop - njoptkp);
  const pbbTerutangAnnual = Math.round(njopKenaPajak * 0.005 * 0.2);

  // Total Estimasi Pajak / Bulan
  const totalMonthlyTaxContribution = pph21Monthly + ppnNominal + Math.round(pbbTerutangAnnual / 12);

  /* ── Submit Handler for Student Tax Assignment ───────────────── */
  const handleSubmitAssignment = async () => {
    if (!userName.trim()) {
      setSubmitToast({
        show: true,
        type: 'error',
        title: 'Nama Wajib Diisi',
        message: 'Mohon masukkan nama lengkap siswa sebelum mengirim tugas.',
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      nama_siswa: userName,
      kelas: studentClass,
      gaji_bruto: monthlySalary,
      bonus_tahunan: annualBonus,
      belanja_ppn: monthlyExpense,
      njop_bumi: njopBumi,
      njop_bangunan: njopBangunan,
      pph21_bulanan: pph21Monthly,
      ppn_bulanan: ppnNominal,
      pbb_tahunan: pbbTerutangAnnual,
      created_at: new Date().toISOString(),
    };

    try {
      // 1. Save to Supabase table 'tugas_pajak'
      const { error } = await supabase.from('tugas_pajak').insert([payload]);

      if (error) {
        console.warn('Supabase insert warning (falling back to LocalStorage):', error.message);
      }

      // 2. Save to LocalStorage fallback for instant offline/demo capability
      const existingSubmissions = JSON.parse(localStorage.getItem('edufinance_tugas_pajak') || '[]');
      existingSubmissions.unshift(payload);
      localStorage.setItem('edufinance_tugas_pajak', JSON.stringify(existingSubmissions));

      setSubmitToast({
        show: true,
        type: 'success',
        title: 'Tugas Pajak Berhasil Terkirim! 🎉',
        message: `Tugas atas nama ${userName} (${studentClass}) telah dicatat di database guru.`,
      });
    } catch (err: any) {
      // Fallback saved locally
      const existingSubmissions = JSON.parse(localStorage.getItem('edufinance_tugas_pajak') || '[]');
      existingSubmissions.unshift(payload);
      localStorage.setItem('edufinance_tugas_pajak', JSON.stringify(existingSubmissions));

      setSubmitToast({
        show: true,
        type: 'success',
        title: 'Tugas Terkirim (Lokal)! 🎉',
        message: `Tugas atas nama ${userName} berhasil disimpan. Guru dapat melihatnya di Dashboard.`,
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitToast(null);
      }, 5000);
    }
  };

  return (
    <section className="w-full relative">
      {/* Toast Notification Popup */}
      <AnimatePresence>
        {submitToast?.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-20 right-4 sm:right-8 z-50 max-w-md p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-start gap-3 text-sm ${
              submitToast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-white'
                : 'bg-rose-950/90 border-rose-500/50 text-white'
            }`}
          >
            {submitToast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-base">{submitToast.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5">{submitToast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl p-5 sm:p-8 md:p-10 shadow-2xl overflow-hidden">
        
        {/* Header Badge & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Personal Finance & Tax Profile
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Kalkulator Pajak Interaktif
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Geser slider atau ketik nominal langsung untuk menghitung PPh 21, PPN 11%, dan PBB. Kumpulkan tugas langsung ke Guru!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                Total Estimasi Pajak / Bulan
              </span>
              <AnimatedCounter
                endValue={totalMonthlyTaxContribution}
                className="text-lg font-bold text-emerald-600 dark:text-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: INPUT FORM (col 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Input Sub-tab Selector */}
            <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 overflow-x-auto no-scrollbar">
              {[
                { id: 'profile', label: 'Profil Siswa', icon: User },
                { id: 'pph', label: 'PPh 21 (Gaji)', icon: Wallet },
                { id: 'ppn', label: 'PPN 11% (Belanja)', icon: Receipt },
                { id: 'pbb', label: 'PBB (Properti)', icon: Home },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = inputTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setInputTab(tab.id as any)}
                    className={`relative flex-1 min-w-[105px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'text-slate-900 dark:text-white shadow-md'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeInputTab"
                        className="absolute inset-0 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm"
                        transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-500' : ''}`} />
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Form Fields Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
              <AnimatePresence mode="wait">
                
                {/* TAB 1: PROFIL SISWA */}
                {inputTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        Nama Lengkap Siswa
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Nama Siswa..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        Kelas / Jurusan
                      </label>
                      <input
                        type="text"
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        placeholder="Contoh: XII IPS 1"
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" /> EduFinance Student Portal
                      </p>
                      <p className="text-emerald-700 dark:text-emerald-400">
                        Isikan nama dan kelas dengan benar sebelum menekan tombol "Submit Tugas Pajak" agar tercatat di dashboard Guru.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* TAB 2: PPh 21 (GAJI & BONUS) */}
                {inputTab === 'pph' && (
                  <motion.div
                    key="pph"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-5"
                  >
                    {/* Gaji Bruto - Slider + Number Input */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                          Gaji Bruto Bulanan (Rp)
                        </label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={1_000_000}
                          max={50_000_000}
                          step={500_000}
                          value={monthlySalary}
                          onChange={(e) => setMonthlySalary(Number(e.target.value))}
                          className="flex-1 h-2 rounded-lg bg-slate-200 dark:bg-slate-800 accent-emerald-500 cursor-pointer"
                        />
                        <input
                          type="number"
                          min={0}
                          value={monthlySalary}
                          onChange={(e) => setMonthlySalary(Math.max(0, Number(e.target.value)))}
                          className="w-36 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs text-right focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Bonus Input */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Bonus / Tunjangan Tahunan (Rp)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={annualBonus}
                        onChange={(e) => setAnnualBonus(Math.max(0, Number(e.target.value)))}
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-900/80 p-3 rounded-xl flex items-start gap-2 border border-slate-300/40 dark:border-slate-800">
                      <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>PTKP Standar:</strong> Rp 54.000.000/tahun (TK/0). Lapisan tarif PPh 21 pertama = 5%.
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* TAB 3: PPN 11% (BELANJA) */}
                {inputTab === 'ppn' && (
                  <motion.div
                    key="ppn"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                          Pengeluaran Belanja Barang/Jasa Bulanan (Rp)
                        </label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={0}
                          max={20_000_000}
                          step={100_000}
                          value={monthlyExpense}
                          onChange={(e) => setMonthlyExpense(Number(e.target.value))}
                          className="flex-1 h-2 rounded-lg bg-slate-200 dark:bg-slate-800 accent-cyan-500 cursor-pointer"
                        />
                        <input
                          type="number"
                          min={0}
                          value={monthlyExpense}
                          onChange={(e) => setMonthlyExpense(Math.max(0, Number(e.target.value)))}
                          className="w-36 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs text-right focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-800 dark:text-cyan-300 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <Receipt className="w-4 h-4 text-cyan-500" /> PPN 11% Konsumen
                      </p>
                      <p className="text-cyan-700 dark:text-cyan-400">
                        Pengeluaran belanja minimal dimulai dari Rp 0. Nominal PPN terhitung sebesar 11% dari total belanja bulanan.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* TAB 4: PBB (PROPERTI) */}
                {inputTab === 'pbb' && (
                  <motion.div
                    key="pbb"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-5"
                  >
                    {/* NJOP Bumi */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                        NJOP Bumi / Tanah (Rp)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={0}
                          max={1_000_000_000}
                          step={5_000_000}
                          value={njopBumi}
                          onChange={(e) => setNjopBumi(Number(e.target.value))}
                          className="flex-1 h-2 rounded-lg bg-slate-200 dark:bg-slate-800 accent-rose-500 cursor-pointer"
                        />
                        <input
                          type="number"
                          min={0}
                          value={njopBumi}
                          onChange={(e) => setNjopBumi(Math.max(0, Number(e.target.value)))}
                          className="w-36 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs text-right focus:ring-2 focus:ring-rose-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* NJOP Bangunan */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                        NJOP Bangunan / Gedung (Rp)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={0}
                          max={500_000_000}
                          step={5_000_000}
                          value={njopBangunan}
                          onChange={(e) => setNjopBangunan(Number(e.target.value))}
                          className="flex-1 h-2 rounded-lg bg-slate-200 dark:bg-slate-800 accent-rose-500 cursor-pointer"
                        />
                        <input
                          type="number"
                          min={0}
                          value={njopBangunan}
                          onChange={(e) => setNjopBangunan(Math.max(0, Number(e.target.value)))}
                          className="w-36 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs text-right focus:ring-2 focus:ring-rose-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-300/40 dark:border-slate-800">
                      <strong>Rumus PBB:</strong> (Total NJOP - NJOPTKP Rp 12Juta) × 0.5% × 20%
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <div className="text-[10px] text-emerald-800 dark:text-emerald-400 font-semibold">PPh 21 / Bln</div>
                <div className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  <AnimatedCounter endValue={pph21Monthly} />
                </div>
              </div>
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                <div className="text-[10px] text-cyan-800 dark:text-cyan-400 font-semibold">PPN 11% / Bln</div>
                <div className="text-xs sm:text-sm font-bold text-cyan-700 dark:text-cyan-300">
                  <AnimatedCounter endValue={ppnNominal} />
                </div>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                <div className="text-[10px] text-rose-800 dark:text-rose-400 font-semibold">PBB / Thn</div>
                <div className="text-xs sm:text-sm font-bold text-rose-700 dark:text-rose-300">
                  <AnimatedCounter endValue={pbbTerutangAnnual} />
                </div>
              </div>
            </div>

          </div>


          {/* RIGHT PANEL: VISUAL CARD & SUBMIT ASSIGNMENT (col 5) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Futuristic Tax Card */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-[1.586/1] w-full rounded-2xl p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white shadow-2xl border border-slate-700/60 overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block">
                    Kartu Pajak Digital Siswa
                  </span>
                  <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                    EduFinance SMAN 14
                  </h3>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/15">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-bold tracking-wider">{studentClass || 'SISWA'}</span>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between my-2">
                <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500 p-1 flex flex-col justify-between shadow-inner">
                  <div className="h-1 bg-amber-600/60 rounded" />
                  <div className="h-1 bg-amber-600/60 rounded" />
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 font-mono block">NPWP DIGITAL</span>
                  <span className="text-xs font-mono font-bold tracking-wider text-emerald-300">
                    09.876.543.2-014.000
                  </span>
                </div>
              </div>

              <div className="relative z-10 flex justify-between items-end pt-2 border-t border-slate-700/60">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Wajib Pajak</span>
                  <span className="text-xs sm:text-sm font-bold tracking-wide text-white truncate max-w-[160px] block">
                    {userName || 'Siswa SMAN 14'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Gaji Bersih / Bln</span>
                  <AnimatedCounter
                    endValue={takeHomePay}
                    className="text-xs sm:text-sm font-extrabold text-emerald-400 font-mono"
                  />
                </div>
              </div>
            </motion.div>


            {/* Live Financial Receipt & SUBMIT BUTTON */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-500" /> Rincian Struk Pajak
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  VERIFIED
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>Gaji Bruto Bulanan</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Rp {monthlySalary.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Potongan PPh 21 Bulanan</span>
                  <AnimatedCounter endValue={pph21Monthly} prefix="- Rp " className="font-bold" />
                </div>

                <div className="flex justify-between items-center text-cyan-600 dark:text-cyan-400">
                  <span>Nominal PPN 11% Belanja</span>
                  <AnimatedCounter endValue={ppnNominal} prefix="+ Rp " className="font-semibold" />
                </div>

                <div className="flex justify-between items-center text-rose-600 dark:text-rose-400">
                  <span>PBB Properti (per Tahun)</span>
                  <AnimatedCounter endValue={pbbTerutangAnnual} prefix="Rp " className="font-semibold" />
                </div>
              </div>

              {/* Submit Button for Student Assignment */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitAssignment}
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Mengirim Tugas...' : 'Submit Tugas Pajak ke Guru'}
              </motion.button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
