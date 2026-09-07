'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  AlertCircle,
  Scale,
  Sparkles,
  Building2,
  Store,
  FileSpreadsheet,
} from 'lucide-react';
import { supabase } from '@/src/lib/supabaseClient';

export interface JournalRow {
  id: string;
  tanggal: string;
  keterangan: string;
  ref: string;
  debit: number;
  kredit: number;
}

const initialServiceRows: JournalRow[] = [
  { id: '1', tanggal: '2025-10-01', keterangan: 'Kas', ref: '101', debit: 15000000, kredit: 0 },
  { id: '2', tanggal: '2025-10-01', keterangan: 'Modal Pemilik', ref: '301', debit: 0, kredit: 15000000 },
  { id: '3', tanggal: '2025-10-03', keterangan: 'Beban Sewa', ref: '501', debit: 2500000, kredit: 0 },
  { id: '4', tanggal: '2025-10-03', keterangan: 'Kas', ref: '101', debit: 0, kredit: 2500000 },
];

const initialTradingRows: JournalRow[] = [
  { id: '1', tanggal: '2025-10-02', keterangan: 'Pembelian Barang Dagang', ref: '105', debit: 8000000, kredit: 0 },
  { id: '2', tanggal: '2025-10-02', keterangan: 'Utang Dagang (PT Mulia)', ref: '201', debit: 0, kredit: 8000000 },
  { id: '3', tanggal: '2025-10-05', keterangan: 'Kas', ref: '101', debit: 5000000, kredit: 0 },
  { id: '4', tanggal: '2025-10-05', keterangan: 'Penjualan Barang Dagang', ref: '401', debit: 0, kredit: 5000000 },
];

export default function DigitalWorkbook() {
  const [studentName, setStudentName] = useState<string>('Siswa EduFinance');
  const [studentClass, setStudentClass] = useState<string>('XII IPS 1');
  const [companyType, setCompanyType] = useState<'service' | 'trading'>('service');
  const [rows, setRows] = useState<JournalRow[]>(initialServiceRows);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<{ show: boolean; title: string; message: string; type: 'success' | 'error' } | null>(null);

  // Calculate totals
  const totalDebit = rows.reduce((sum, r) => sum + (Number(r.debit) || 0), 0);
  const totalKredit = rows.reduce((sum, r) => sum + (Number(r.kredit) || 0), 0);
  const isBalanced = totalDebit === totalKredit && totalDebit > 0;
  const difference = Math.abs(totalDebit - totalKredit);

  // Switch company type & reset rows
  const handleCompanyTypeChange = (type: 'service' | 'trading') => {
    setCompanyType(type);
    setRows(type === 'service' ? initialServiceRows : initialTradingRows);
  };

  // Add new row
  const handleAddRow = () => {
    const newRow: JournalRow = {
      id: Date.now().toString(),
      tanggal: new Date().toISOString().split('T')[0],
      keterangan: '',
      ref: '',
      debit: 0,
      kredit: 0,
    };
    setRows([...rows, newRow]);
  };

  // Update cell value
  const handleUpdateRow = (id: string, field: keyof JournalRow, value: any) => {
    setRows(
      rows.map((row) => {
        if (row.id === id) {
          return { ...row, [field]: value };
        }
        return row;
      })
    );
  };

  // Delete row
  const handleDeleteRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((r) => r.id !== id));
  };

  // Submit Handler for Accounting Assignment
  const handleSubmitAssignment = async () => {
    if (!studentName.trim()) {
      setToast({
        show: true,
        type: 'error',
        title: 'Nama Diperlukan',
        message: 'Mohon isi nama lengkap siswa sebelum mengirim jurnal.',
      });
      return;
    }

    if (!isBalanced) {
      setToast({
        show: true,
        type: 'error',
        title: 'Jurnal Belum Balance!',
        message: `Total Debit dan Kredit belum seimbang (selisih Rp ${difference.toLocaleString('id-ID')}). Periksa kembali entri Anda.`,
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      nama_siswa: studentName,
      kelas: studentClass,
      jenis_perusahaan: companyType === 'service' ? 'Perusahaan Jasa' : 'Perusahaan Dagang',
      jurnal_json: rows,
      total_debit: totalDebit,
      total_kredit: totalKredit,
      is_balance: isBalanced,
      created_at: new Date().toISOString(),
    };

    try {
      // 1. Insert into Supabase table 'tugas_akuntansi'
      const { error } = await supabase.from('tugas_akuntansi').insert([payload]);

      if (error) {
        console.warn('Supabase insert warning (falling back to LocalStorage):', error.message);
      }

      // 2. Save to LocalStorage fallback
      const existing = JSON.parse(localStorage.getItem('edufinance_tugas_akuntansi') || '[]');
      existing.unshift(payload);
      localStorage.setItem('edufinance_tugas_akuntansi', JSON.stringify(existing));

      setToast({
        show: true,
        type: 'success',
        title: 'Tugas Jurnal Terkirim! 🎉',
        message: `Buku kerja Jurnal Umum atas nama ${studentName} berhasil dikirim ke Guru.`,
      });
    } catch (err) {
      const existing = JSON.parse(localStorage.getItem('edufinance_tugas_akuntansi') || '[]');
      existing.unshift(payload);
      localStorage.setItem('edufinance_tugas_akuntansi', JSON.stringify(existing));

      setToast({
        show: true,
        type: 'success',
        title: 'Tugas Jurnal Disimpan (Lokal)! 🎉',
        message: `Tugas atas nama ${studentName} berhasil disimpan. Guru dapat memeriksanya di Dashboard.`,
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToast(null), 5000);
    }
  };

  return (
    <section className="w-full relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast?.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-20 right-4 sm:right-8 z-50 max-w-md p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-start gap-3 text-sm ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-white'
                : 'bg-rose-950/90 border-rose-500/50 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-base">{toast.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl p-5 sm:p-8 md:p-10 shadow-2xl overflow-hidden">
        
        {/* Header & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Buku Kerja Digital Siswa
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Lembar Kerja Jurnal Umum Digital
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Input transaksi langsung ke dalam tabel Excel-like, pastikan total Debit & Kredit seimbang (Balance), lalu kirim ke Guru!
            </p>
          </div>

          {/* Balance Indicator Badge */}
          <div className="flex items-center gap-3">
            <div
              className={`px-4 py-2 rounded-2xl border text-xs font-extrabold flex items-center gap-2 shadow-sm ${
                isBalanced
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30'
              }`}
            >
              <Scale className="w-4 h-4" />
              {isBalanced ? (
                <span>STATUS: SEIMBANG (BALANCE)</span>
              ) : (
                <span>BELUM BALANCE (SELISIH: Rp {difference.toLocaleString('id-ID')})</span>
              )}
            </div>
          </div>
        </div>

        {/* Student Profile Info & Modul Selector Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Nama Siswa
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Nama Siswa..."
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Kelas
            </label>
            <input
              type="text"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              placeholder="Kelas..."
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Pilih Modul Perusahaan
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleCompanyTypeChange('service')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  companyType === 'service'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Jasa
              </button>
              <button
                type="button"
                onClick={() => handleCompanyTypeChange('trading')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  companyType === 'trading'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Store className="w-3.5 h-3.5" /> Dagang
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Journal Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 font-bold uppercase tracking-wider">
                <th className="py-3 px-4 w-32">Tanggal</th>
                <th className="py-3 px-4">Keterangan / Nama Akun</th>
                <th className="py-3 px-4 w-20 text-center">Ref</th>
                <th className="py-3 px-4 w-36 text-right">Debit (Rp)</th>
                <th className="py-3 px-4 w-36 text-right">Kredit (Rp)</th>
                <th className="py-3 px-3 w-12 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 bg-white dark:bg-slate-900/60">
              {rows.map((row, index) => {
                const isKreditEntry = row.kredit > 0 && row.debit === 0;
                return (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Tanggal */}
                    <td className="p-2">
                      <input
                        type="date"
                        value={row.tanggal}
                        onChange={(e) => handleUpdateRow(row.id, 'tanggal', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:border-cyan-500 font-medium text-slate-900 dark:text-white"
                      />
                    </td>

                    {/* Keterangan */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.keterangan}
                        onChange={(e) => handleUpdateRow(row.id, 'keterangan', e.target.value)}
                        placeholder="Contoh: Kas / Beban Sewa..."
                        className={`w-full px-2.5 py-1.5 rounded-lg bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:border-cyan-500 font-semibold text-slate-900 dark:text-white ${
                          isKreditEntry ? 'pl-6 text-slate-600 dark:text-slate-300' : ''
                        }`}
                      />
                    </td>

                    {/* Ref */}
                    <td className="p-2 text-center">
                      <input
                        type="text"
                        value={row.ref}
                        onChange={(e) => handleUpdateRow(row.id, 'ref', e.target.value)}
                        placeholder="101"
                        className="w-full text-center px-1.5 py-1.5 rounded-lg bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:border-cyan-500 font-mono text-slate-700 dark:text-slate-300"
                      />
                    </td>

                    {/* Debit */}
                    <td className="p-2 text-right">
                      <input
                        type="number"
                        min={0}
                        value={row.debit}
                        onChange={(e) => handleUpdateRow(row.id, 'debit', Number(e.target.value))}
                        className="w-full text-right px-2 py-1.5 rounded-lg bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:border-cyan-500 font-bold text-emerald-600 dark:text-emerald-400"
                      />
                    </td>

                    {/* Kredit */}
                    <td className="p-2 text-right">
                      <input
                        type="number"
                        min={0}
                        value={row.kredit}
                        onChange={(e) => handleUpdateRow(row.id, 'kredit', Number(e.target.value))}
                        className="w-full text-right px-2 py-1.5 rounded-lg bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:border-cyan-500 font-bold text-cyan-600 dark:text-cyan-400"
                      />
                    </td>

                    {/* Hapus Row */}
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(row.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Hapus Baris"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Bottom Total Row */}
            <tfoot>
              <tr className="bg-slate-100 dark:bg-slate-800/90 font-black text-slate-900 dark:text-white border-t-2 border-slate-300 dark:border-slate-700">
                <td colSpan={3} className="py-3 px-4 uppercase text-slate-600 dark:text-slate-300">
                  Total Jurnal Umum
                </td>
                <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                  Rp {totalDebit.toLocaleString('id-ID')}
                </td>
                <td className="py-3 px-4 text-right text-cyan-600 dark:text-cyan-400 font-mono text-sm">
                  Rp {totalKredit.toLocaleString('id-ID')}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Table Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <button
            type="button"
            onClick={handleAddRow}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4 text-cyan-500" />
            + Tambah Baris Transaksi
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleSubmitAssignment}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Mengirim Tugas...' : 'Kumpulkan Tugas Jurnal'}
          </motion.button>
        </div>

      </div>
    </section>
  );
}
