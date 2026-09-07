'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/src/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Receipt,
  Library,
  Scale,
  Edit,
  CheckSquare,
  PieChart,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building2,
  Store,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Info,
  Layers,
  FileSpreadsheet,
  TrendingUp,
  Coins,
  Wallet,
  Calculator,
  RefreshCw,
} from 'lucide-react';

/* ─── Interfaces ─── */
export interface JournalEntry {
  id: string;
  tanggal: string;
  keterangan: string;
  ref: string;
  debit: number;
  kredit: number;
}

export interface AdjustmentEntry {
  id: string;
  tanggal: string;
  keterangan: string;
  ref: string;
  debit: number;
  kredit: number;
}

export interface TransactionDoc {
  id: string;
  tanggal: string;
  nomorBukti: string;
  keterangan: string;
  nominal: number;
  akunDebit: string;
  akunKredit: string;
}

/* ─── Initial Sample Data for Perusahaan Jasa ─── */
const defaultServiceTransactions: TransactionDoc[] = [
  { id: 't1', tanggal: '2025-10-01', nomorBukti: 'BKM-01', keterangan: 'Setoran modal awal pemilik', nominal: 20000000, akunDebit: 'Kas (101)', akunKredit: 'Modal Pemilik (301)' },
  { id: 't2', tanggal: '2025-10-03', nomorBukti: 'BKK-01', keterangan: 'Pembayaran sewa gedung 1 tahun', nominal: 3600000, akunDebit: 'Sewa Dibayar Dimuka (103)', akunKredit: 'Kas (101)' },
];

const defaultServiceJournal: JournalEntry[] = [
  { id: 'j1', tanggal: '2025-10-01', keterangan: 'Kas', ref: '101', debit: 20000000, kredit: 0 },
  { id: 'j2', tanggal: '2025-10-01', keterangan: 'Modal Pemilik', ref: '301', debit: 0, kredit: 20000000 },
  { id: 'j3', tanggal: '2025-10-03', keterangan: 'Sewa Dibayar Dimuka', ref: '103', debit: 3600000, kredit: 0 },
  { id: 'j4', tanggal: '2025-10-03', keterangan: 'Kas', ref: '101', debit: 0, kredit: 3600000 },
  { id: 'j5', tanggal: '2025-10-06', keterangan: 'Perlengkapan', ref: '104', debit: 1500000, kredit: 0 },
  { id: 'j6', tanggal: '2025-10-06', keterangan: 'Kas', ref: '101', debit: 0, kredit: 1500000 },
  { id: 'j7', tanggal: '2025-10-10', keterangan: 'Piutang Usaha', ref: '102', debit: 4000000, kredit: 0 },
  { id: 'j8', tanggal: '2025-10-10', keterangan: 'Pendapatan Jasa', ref: '401', debit: 0, kredit: 4000000 },
  { id: 'j9', tanggal: '2025-10-15', keterangan: 'Kas', ref: '101', debit: 5000000, kredit: 0 },
  { id: 'j10', tanggal: '2025-10-15', keterangan: 'Pendapatan Jasa', ref: '401', debit: 0, kredit: 5000000 },
  { id: 'j11', tanggal: '2025-10-25', keterangan: 'Beban Gaji', ref: '501', debit: 2500000, kredit: 0 },
  { id: 'j12', tanggal: '2025-10-25', keterangan: 'Kas', ref: '101', debit: 0, kredit: 2500000 },
];

const defaultServiceAdjustments: AdjustmentEntry[] = [
  { id: 'a1', tanggal: '2025-10-31', keterangan: 'Beban Sewa', ref: '502', debit: 300000, kredit: 0 },
  { id: 'a2', tanggal: '2025-10-31', keterangan: 'Sewa Dibayar Dimuka', ref: '103', debit: 0, kredit: 300000 },
  { id: 'a3', tanggal: '2025-10-31', keterangan: 'Beban Perlengkapan', ref: '503', debit: 500000, kredit: 0 },
  { id: 'a4', tanggal: '2025-10-31', keterangan: 'Perlengkapan', ref: '104', debit: 0, kredit: 500000 },
];

/* ─── Initial Sample Data for Perusahaan Dagang ─── */
const defaultTradingTransactions: TransactionDoc[] = [
  { id: 'tt1', tanggal: '2025-10-02', nomorBukti: 'FB-01', keterangan: 'Pembelian barang dagang kredit dari PT Mulia', nominal: 10000000, akunDebit: 'Pembelian (501)', akunKredit: 'Utang Dagang (201)' },
  { id: 'tt2', tanggal: '2025-10-05', nomorBukti: 'FJ-01', keterangan: 'Penjualan barang dagang tunai', nominal: 6500000, akunDebit: 'Kas (101)', akunKredit: 'Penjualan (401)' },
  { id: 'tt3', tanggal: '2025-10-08', nomorBukti: 'BKK-01', keterangan: 'Pembayaran beban angkut pembelian', nominal: 500000, akunDebit: 'Beban Angkut Pembelian (502)', akunKredit: 'Kas (101)' },
  { id: 'tt4', tanggal: '2025-10-12', nomorBukti: 'FJ-02', keterangan: 'Penjualan barang dagang kredit (faktur)', nominal: 8000000, akunDebit: 'Piutang Dagang (102)', akunKredit: 'Penjualan (401)' },
  { id: 'tt5', tanggal: '2025-10-20', nomorBukti: 'BKK-02', keterangan: 'Pelunasan utang dagang ke PT Mulia', nominal: 5000000, akunDebit: 'Utang Dagang (201)', akunKredit: 'Kas (101)' },
];

const defaultTradingJournal: JournalEntry[] = [
  { id: 'tj1', tanggal: '2025-10-02', keterangan: 'Pembelian', ref: '501', debit: 10000000, kredit: 0 },
  { id: 'tj2', tanggal: '2025-10-02', keterangan: 'Utang Dagang', ref: '201', debit: 0, kredit: 10000000 },
  { id: 'tj3', tanggal: '2025-10-05', keterangan: 'Kas', ref: '101', debit: 6500000, kredit: 0 },
  { id: 'tj4', tanggal: '2025-10-05', keterangan: 'Penjualan', ref: '401', debit: 0, kredit: 6500000 },
  { id: 'tj5', tanggal: '2025-10-08', keterangan: 'Beban Angkut Pembelian', ref: '502', debit: 500000, kredit: 0 },
  { id: 'tj6', tanggal: '2025-10-08', keterangan: 'Kas', ref: '101', debit: 0, kredit: 500000 },
  { id: 'tj7', tanggal: '2025-10-12', keterangan: 'Piutang Dagang', ref: '102', debit: 8000000, kredit: 0 },
  { id: 'tj8', tanggal: '2025-10-12', keterangan: 'Penjualan', ref: '401', debit: 0, kredit: 8000000 },
  { id: 'tj9', tanggal: '2025-10-20', keterangan: 'Utang Dagang', ref: '201', debit: 5000000, kredit: 0 },
  { id: 'tj10', tanggal: '2025-10-20', keterangan: 'Kas', ref: '101', debit: 0, kredit: 5000000 },
];

const defaultTradingAdjustments: AdjustmentEntry[] = [
  { id: 'ta1', tanggal: '2025-10-31', keterangan: 'Ikhtisar Laba Rugi', ref: '303', debit: 4000000, kredit: 0 },
  { id: 'ta2', tanggal: '2025-10-31', keterangan: 'Persediaan Barang Dagang Awal', ref: '105', debit: 0, kredit: 4000000 },
  { id: 'ta3', tanggal: '2025-10-31', keterangan: 'Persediaan Barang Dagang Akhir', ref: '105', debit: 6000000, kredit: 0 },
  { id: 'ta4', tanggal: '2025-10-31', keterangan: 'Ikhtisar Laba Rugi', ref: '303', debit: 0, kredit: 6000000 },
];

/* ─── 7 Stages Metadata ─── */
const stagesMeta = [
  {
    step: 1,
    id: 'identifikasi',
    title: '1. Identifikasi Transaksi',
    icon: Receipt,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    guide: 'Kumpulkan dan analisis bukti transaksi (kwitansi, nota, faktur). Tentukan akun mana yang bertambah/berkurang di posisi Debit atau Kredit.',
  },
  {
    step: 2,
    id: 'jurnal_umum',
    title: '2. Jurnal Umum',
    icon: BookOpen,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    guide: 'Catat seluruh transaksi secara kronologis dengan aturan Double-Entry. Pastikan total Debit sama persis dengan total Kredit (Balance).',
  },
  {
    step: 3,
    id: 'buku_besar',
    title: '3. Posting Buku Besar',
    icon: Library,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    guide: 'Pindahkan mutasi dari jurnal umum ke masing-masing kelompok akun (Kas, Piutang, Modal, dll.) untuk menghitung saldo akhir tiap akun.',
  },
  {
    step: 4,
    id: 'neraca_saldo',
    title: '4. Neraca Saldo',
    icon: Scale,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    guide: 'Daftar rekapitulasi seluruh saldo akhir buku besar sebelum penyesuaian. Nilai total Debit dan Kredit wajib seimbang (Balance).',
  },
  {
    step: 5,
    id: 'jurnal_penyesuaian',
    title: '5. Jurnal Penyesuaian',
    icon: Edit,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    guide: 'Catat penyesuaian akhir periode (misal: beban perlengkapan terpakai, sewa kadaluwarsa, atau penyusutan) agar laporan mencerminkan kondisi riil.',
  },
  {
    step: 6,
    id: 'neraca_disesuaikan',
    title: '6. Neraca Saldo Disesuaikan',
    icon: CheckSquare,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    guide: 'Gabungkan saldo Neraca Saldo awal dengan mutasi Jurnal Penyesuaian. Menjadi data final siap pakai untuk Laporan Keuangan.',
  },
  {
    step: 7,
    id: 'laporan_keuangan',
    title: '7. Laporan Keuangan',
    icon: PieChart,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-400/40',
    guide: 'Penyusunan Laporan Laba Rugi (Pendapatan - Beban) dan Laporan Posisi Keuangan (Neraca: Aset = Liabilitas + Ekuitas). Jika seluruh tahap balance, tugas dapat dikirim ke Guru!',
  },
];

export default function UnifiedAccountingLab() {
  // Student Header State
  const [studentName, setStudentName] = useState<string>('Siswa EduFinance');
  const [studentClass, setStudentClass] = useState<string>('XII IPS 1');
  const [companyType, setCompanyType] = useState<'service' | 'trading'>('service');
  const [activeStep, setActiveStep] = useState<number>(1);

  // Data States
  const [transactions, setTransactions] = useState<TransactionDoc[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true);
  const [journalRows, setJournalRows] = useState<JournalEntry[]>(defaultServiceJournal);
  const [adjustmentRows, setAdjustmentRows] = useState<AdjustmentEntry[]>(defaultServiceAdjustments);

  // Submit & Toast States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<{ show: boolean; title: string; message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoadingTransactions(true);

      const { data, error } = await supabase
        .from('materi_akuntansi')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      const formatted =
        data?.map((item: any) => ({
          id: item.id,
          tanggal: item.tanggal,
          nomorBukti: item.nomor_bukti,
          nominal: item.nominal,
          keterangan: item.keterangan,
          akunDebit: item.akun_debit,
          akunKredit: item.akun_kredit,
        })) || [];

      setTransactions(formatted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTransactions(false);
    }
  };
  // Handle Switch Company Type
  const handleCompanyTypeChange = (type: 'service' | 'trading') => {
    setCompanyType(type);
    if (type === 'service') {
      setTransactions(defaultServiceTransactions);
      setJournalRows(defaultServiceJournal);
      setAdjustmentRows(defaultServiceAdjustments);
    } else {
      setTransactions(defaultTradingTransactions);
      setJournalRows(defaultTradingJournal);
      setAdjustmentRows(defaultTradingAdjustments);
    }
  };

  /* ─── Calculated Values & Balances ─── */
  // 1. Journal Umum Totals
  const journalTotalDebit = journalRows.reduce((sum, r) => sum + (Number(r.debit) || 0), 0);
  const journalTotalKredit = journalRows.reduce((sum, r) => sum + (Number(r.kredit) || 0), 0);
  const journalDiff = Math.abs(journalTotalDebit - journalTotalKredit);
  const isJournalBalanced = journalTotalDebit === journalTotalKredit && journalTotalDebit > 0;

  // 2. Ledger Calculation (Buku Besar)
  const ledgerAccounts = useMemo(() => {
    const map = new Map<string, { ref: string; totalDebit: number; totalKredit: number; saldoDebit: number; saldoKredit: number; entries: JournalEntry[] }>();

    journalRows.forEach((row) => {
      const key = row.keterangan.trim();
      if (!key) return;
      const current = map.get(key) || { ref: row.ref || '-', totalDebit: 0, totalKredit: 0, saldoDebit: 0, saldoKredit: 0, entries: [] };
      current.totalDebit += Number(row.debit) || 0;
      current.totalKredit += Number(row.kredit) || 0;
      current.entries.push(row);
      map.set(key, current);
    });

    // Compute net balance (Debit vs Kredit standard)
    const result: Array<{ name: string; ref: string; debit: number; kredit: number; netDebit: number; netKredit: number; entries: JournalEntry[] }> = [];
    map.forEach((val, name) => {
      const diff = val.totalDebit - val.totalKredit;
      result.push({
        name,
        ref: val.ref,
        debit: val.totalDebit,
        kredit: val.totalKredit,
        netDebit: diff >= 0 ? diff : 0,
        netKredit: diff < 0 ? Math.abs(diff) : 0,
        entries: val.entries,
      });
    });

    return result;
  }, [journalRows]);

  // 3. Trial Balance (Neraca Saldo)
  const trialTotalDebit = ledgerAccounts.reduce((sum, a) => sum + a.netDebit, 0);
  const trialTotalKredit = ledgerAccounts.reduce((sum, a) => sum + a.netKredit, 0);
  const trialDiff = Math.abs(trialTotalDebit - trialTotalKredit);
  const isTrialBalanced = trialTotalDebit === trialTotalKredit && trialTotalDebit > 0;

  // 4. Adjustments Totals (Jurnal Penyesuaian)
  const adjTotalDebit = adjustmentRows.reduce((sum, r) => sum + (Number(r.debit) || 0), 0);
  const adjTotalKredit = adjustmentRows.reduce((sum, r) => sum + (Number(r.kredit) || 0), 0);
  const adjDiff = Math.abs(adjTotalDebit - adjTotalKredit);
  const isAdjBalanced = adjTotalDebit === adjTotalKredit && adjTotalDebit > 0;

  // 5. Adjusted Trial Balance (Neraca Saldo Disesuaikan)
  const adjustedAccounts = useMemo(() => {
    const map = new Map<string, { name: string; ref: string; netDebit: number; netKredit: number }>();

    // Start with Ledger net balances
    ledgerAccounts.forEach((acc) => {
      map.set(acc.name, { name: acc.name, ref: acc.ref, netDebit: acc.netDebit, netKredit: acc.netKredit });
    });

    // Apply adjustments
    adjustmentRows.forEach((adj) => {
      const name = adj.keterangan.trim();
      if (!name) return;
      const existing = map.get(name) || { name, ref: adj.ref || '-', netDebit: 0, netKredit: 0 };

      const currentNet = existing.netDebit - existing.netKredit + (Number(adj.debit) || 0) - (Number(adj.kredit) || 0);
      map.set(name, {
        name,
        ref: existing.ref || adj.ref,
        netDebit: currentNet >= 0 ? currentNet : 0,
        netKredit: currentNet < 0 ? Math.abs(currentNet) : 0,
      });
    });

    return Array.from(map.values());
  }, [ledgerAccounts, adjustmentRows]);

  const adjTrialTotalDebit = adjustedAccounts.reduce((sum, a) => sum + a.netDebit, 0);
  const adjTrialTotalKredit = adjustedAccounts.reduce((sum, a) => sum + a.netKredit, 0);
  const adjTrialDiff = Math.abs(adjTrialTotalDebit - adjTrialTotalKredit);
  const isAdjTrialBalanced = adjTrialTotalDebit === adjTrialTotalKredit && adjTrialTotalDebit > 0;

  // 6. Financial Statements Summary (Laporan Keuangan)
  const incomeSummary = useMemo(() => {
    let totalPendapatan = 0;
    let totalBeban = 0;
    let totalAset = 0;
    let totalLiabilitas = 0;
    let modalAwal = 0;

    adjustedAccounts.forEach((acc) => {
      const lower = acc.name.toLowerCase();
      if (lower.includes('pendapatan') || lower.includes('penjualan')) {
        totalPendapatan += acc.netKredit || acc.netDebit;
      } else if (lower.includes('beban') || lower.includes('pembelian') || lower.includes('hpp')) {
        totalBeban += acc.netDebit || acc.netKredit;
      } else if (lower.includes('utang') || lower.includes('kewajiban')) {
        totalLiabilitas += acc.netKredit || acc.netDebit;
      } else if (lower.includes('modal')) {
        modalAwal += acc.netKredit || acc.netDebit;
      } else {
        // Aset (Kas, Piutang, Perlengkapan, Sewa Dimuka, dll.)
        totalAset += acc.netDebit || acc.netKredit;
      }
    });

    const labaBersih = totalPendapatan - totalBeban;
    const modalAkhir = modalAwal + labaBersih;
    const totalPasiva = totalLiabilitas + modalAkhir;
    const balanceDiff = Math.abs(totalAset - totalPasiva);
    const isFinancialBalanced = balanceDiff === 0 && totalAset > 0;

    return {
      totalPendapatan,
      totalBeban,
      labaBersih,
      modalAwal,
      modalAkhir,
      totalAset,
      totalLiabilitas,
      totalPasiva,
      isFinancialBalanced,
      balanceDiff,
    };
  }, [adjustedAccounts]);

  /* ─── Overall Balance Diagnostics ─── */
  const balanceDiagnostics = useMemo(() => {
    const issues: Array<{ stageNumber: number; stageName: string; difference: number; message: string }> = [];

    if (!isJournalBalanced) {
      issues.push({
        stageNumber: 2,
        stageName: 'Jurnal Umum (Tahap 2)',
        difference: journalDiff,
        message: `Debit (Rp ${journalTotalDebit.toLocaleString('id-ID')}) ≠ Kredit (Rp ${journalTotalKredit.toLocaleString('id-ID')})`,
      });
    }

    if (!isTrialBalanced) {
      issues.push({
        stageNumber: 4,
        stageName: 'Neraca Saldo (Tahap 4)',
        difference: trialDiff,
        message: `Debit (Rp ${trialTotalDebit.toLocaleString('id-ID')}) ≠ Kredit (Rp ${trialTotalKredit.toLocaleString('id-ID')})`,
      });
    }

    if (!isAdjBalanced) {
      issues.push({
        stageNumber: 5,
        stageName: 'Jurnal Penyesuaian (Tahap 5)',
        difference: adjDiff,
        message: `Debit (Rp ${adjTotalDebit.toLocaleString('id-ID')}) ≠ Kredit (Rp ${adjTotalKredit.toLocaleString('id-ID')})`,
      });
    }

    if (!isAdjTrialBalanced) {
      issues.push({
        stageNumber: 6,
        stageName: 'Neraca Saldo Disesuaikan (Tahap 6)',
        difference: adjTrialDiff,
        message: `Debit (Rp ${adjTrialTotalDebit.toLocaleString('id-ID')}) ≠ Kredit (Rp ${adjTrialTotalKredit.toLocaleString('id-ID')})`,
      });
    }

    if (!incomeSummary.isFinancialBalanced) {
      issues.push({
        stageNumber: 7,
        stageName: 'Laporan Keuangan & Neraca Akhir (Tahap 7)',
        difference: incomeSummary.balanceDiff,
        message: `Total Aset (Rp ${incomeSummary.totalAset.toLocaleString('id-ID')}) ≠ Total Pasiva/Liabilitas+Ekuitas (Rp ${incomeSummary.totalPasiva.toLocaleString('id-ID')})`,
      });
    }

    return {
      isFullyBalanced: issues.length === 0,
      issues,
    };
  }, [
    isJournalBalanced,
    journalDiff,
    journalTotalDebit,
    journalTotalKredit,
    isTrialBalanced,
    trialDiff,
    trialTotalDebit,
    trialTotalKredit,
    isAdjBalanced,
    adjDiff,
    adjTotalDebit,
    adjTotalKredit,
    isAdjTrialBalanced,
    adjTrialDiff,
    adjTrialTotalDebit,
    adjTrialTotalKredit,
    incomeSummary,
  ]);

  /* ─── Journal Row Operations ─── */
  const handleAddJournalRow = () => {
    const newRow: JournalEntry = {
      id: Date.now().toString(),
      tanggal: new Date().toISOString().split('T')[0],
      keterangan: '',
      ref: '',
      debit: 0,
      kredit: 0,
    };
    setJournalRows([...journalRows, newRow]);
  };

  const handleUpdateJournalRow = (id: string, field: keyof JournalEntry, value: any) => {
    setJournalRows(
      journalRows.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleDeleteJournalRow = (id: string) => {
    if (journalRows.length <= 1) return;
    setJournalRows(journalRows.filter((r) => r.id !== id));
  };

  /* ─── Adjustment Row Operations ─── */
  const handleAddAdjRow = () => {
    const newRow: AdjustmentEntry = {
      id: Date.now().toString(),
      tanggal: new Date().toISOString().split('T')[0],
      keterangan: '',
      ref: '',
      debit: 0,
      kredit: 0,
    };
    setAdjustmentRows([...adjustmentRows, newRow]);
  };

  const handleUpdateAdjRow = (id: string, field: keyof AdjustmentEntry, value: any) => {
    setAdjustmentRows(
      adjustmentRows.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleDeleteAdjRow = (id: string) => {
    if (adjustmentRows.length <= 1) return;
    setAdjustmentRows(adjustmentRows.filter((r) => r.id !== id));
  };

  /* ─── Submit Assignment to Teacher ─── */
  const handleSubmitFinalAssignment = async () => {
    if (!studentName.trim()) {
      setToast({
        show: true,
        type: 'error',
        title: 'Nama Diperlukan',
        message: 'Mohon masukkan nama lengkap siswa sebelum mengirim tugas.',
      });
      return;
    }

    if (!balanceDiagnostics.isFullyBalanced) {
      const firstIssue = balanceDiagnostics.issues[0];
      setToast({
        show: true,
        type: 'error',
        title: 'Siklus Belum Seimbang (Not Balanced)!',
        message: `Terdapat selisih pada ${firstIssue.stageName} sebesar Rp ${firstIssue.difference.toLocaleString('id-ID')}. Mohon seimbangkan terlebih dahulu sebelum mengirim ke Guru.`,
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      nama_siswa: studentName,
      kelas: studentClass,
      jenis_perusahaan: companyType === 'service' ? 'Perusahaan Jasa' : 'Perusahaan Dagang',
      transaksi_json: transactions,
      jurnal_json: journalRows,
      buku_besar_json: ledgerAccounts,
      neraca_saldo_json: ledgerAccounts.map((a) => ({ name: a.name, ref: a.ref, debit: a.netDebit, kredit: a.netKredit })),
      penyesuaian_json: adjustmentRows,
      neraca_disesuaikan_json: adjustedAccounts,
      laporan_keuangan_json: incomeSummary,
      total_debit: journalTotalDebit,
      total_kredit: journalTotalKredit,
      is_balance: true,
      created_at: new Date().toISOString(),
    };

    try {
      // 1. Insert into Supabase table 'tugas_akuntansi'
      const { error } = await supabase.from('tugas_akuntansi').insert([payload]);
      if (error) {
        console.warn('Supabase insert note (falling back to LocalStorage):', error.message);
      }

      // 2. Save to LocalStorage fallback
      const existing = JSON.parse(localStorage.getItem('edufinance_tugas_akuntansi') || '[]');
      existing.unshift(payload);
      localStorage.setItem('edufinance_tugas_akuntansi', JSON.stringify(existing));

      setToast({
        show: true,
        type: 'success',
        title: 'Tugas Siklus Akuntansi Terkirim! 🎉',
        message: `Seluruh 7 tahapan siklus akuntansi atas nama ${studentName} (${studentClass}) telah berhasil dikirim ke Dashboard Guru.`,
      });
    } catch (err) {
      const existing = JSON.parse(localStorage.getItem('edufinance_tugas_akuntansi') || '[]');
      existing.unshift(payload);
      localStorage.setItem('edufinance_tugas_akuntansi', JSON.stringify(existing));

      setToast({
        show: true,
        type: 'success',
        title: 'Tersimpan Offline! 🎉',
        message: `Tugas siklus akuntansi ${studentName} berhasil disimpan dan siap diperiksa Guru.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {toast && toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 max-w-md p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-start gap-3 ${toast.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-100'
              : 'bg-rose-950/95 border-rose-500/50 text-rose-100'
              }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs">
              <h4 className="font-bold text-sm mb-1">{toast.title}</h4>
              <p className="opacity-90 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-white/10"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. HEADER STUDENT INFO & COMPANY TYPE SELECTOR ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider mb-2 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Laboratorium Akuntansi Digital Terintegrasi
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Buku Kerja Siklus Akuntansi Siswa
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Panduan interaktif pengerjaan 7 tahapan akuntansi dari Identifikasi Transaksi hingga Laporan Keuangan final.
            </p>
          </div>

          {/* Company Type Switcher */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 self-start md:self-auto">
            <button
              onClick={() => handleCompanyTypeChange('service')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${companyType === 'service'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <Building2 className="w-4 h-4" />
              Perusahaan Jasa
            </button>
            <button
              onClick={() => handleCompanyTypeChange('trading')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${companyType === 'trading'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <Store className="w-4 h-4" />
              Perusahaan Dagang
            </button>
          </div>
        </div>

        {/* Input Identity Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Nama Siswa <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Nama Siswa..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Kelas <span className="text-rose-500">*</span>
            </label>
            <select
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all cursor-pointer"
            >
              <option value="XII IPS 1">XII IPS 1</option>
              <option value="XII IPS 2">XII IPS 2</option>
              <option value="XII IPS 3">XII IPS 3</option>
              <option value="XII MIPA 1">XII MIPA 1</option>
              <option value="XII MIPA 2">XII MIPA 2</option>
              <option value="XI IPS 1">XI IPS 1</option>
              <option value="XI IPS 2">XI IPS 2</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-1 flex flex-col justify-end">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Status Keseimbangan:</span>
              {balanceDiagnostics.isFullyBalanced ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Balance
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold">
                  <AlertCircle className="w-3.5 h-3.5" /> Belum Balance
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. STAGE STEPPER NAVIGATION TABS ── */}
      <div className="p-2 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {stagesMeta.map((stage) => {
            const Icon = stage.icon;
            const isActive = activeStep === stage.step;
            const isDone = activeStep > stage.step;

            return (
              <button
                key={stage.id}
                onClick={() => setActiveStep(stage.step)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-md scale-102'
                  : isDone
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${isActive
                    ? 'bg-white/20 text-white dark:bg-slate-950/20 dark:text-slate-950'
                    : isDone
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                >
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : stage.step}
                </div>
                <span>{stage.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. REAL-TIME BALANCE WARNING BANNER IF NOT BALANCED ── */}
      {!balanceDiagnostics.isFullyBalanced && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-5 rounded-2xl bg-rose-500/10 dark:bg-rose-950/40 border border-rose-500/40 text-rose-700 dark:text-rose-200 shadow-md space-y-2"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-rose-600 dark:text-rose-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>Peringatan Ketidakseimbangan Siklus Akuntansi (Not Balanced):</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
            {balanceDiagnostics.issues.map((issue, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/60 dark:bg-rose-900/30 border border-rose-300/40 dark:border-rose-700/40"
              >
                <div>
                  <span className="font-bold text-rose-700 dark:text-rose-300 block">{issue.stageName}</span>
                  <span className="text-[11px] opacity-85 font-mono">{issue.message}</span>
                </div>
                <button
                  onClick={() => setActiveStep(issue.stageNumber)}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700 transition-colors shrink-0 ml-2"
                >
                  Periksa
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── 4. TWO-CONTAINER WORKSPACE (LEFT: ACTIVE FORM, RIGHT: STEP GUIDE & PREVIOUS HISTORY) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ─── CONTAINER KIRI: FORM PENGISIAN TAHAP AKTIF (7 COLS) ─── */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">

            {/* Stage Title Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${stagesMeta[activeStep - 1].bg} ${stagesMeta[activeStep - 1].border}`}>
                  {React.createElement(stagesMeta[activeStep - 1].icon, { className: `w-5 h-5 ${stagesMeta[activeStep - 1].color}` })}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block">
                    Form Pengerjaan Tahap {activeStep}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {stagesMeta[activeStep - 1].title}
                  </h3>
                </div>
              </div>

              {/* Quick Reset Sample Button */}
              <button
                onClick={() => handleCompanyTypeChange(companyType)}
                title="Reset ke Contoh Standar"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Isi Contoh</span>
              </button>
            </div>

            {/* ── TAHAP 1: FORM IDENTIFIKASI TRANSAKSI ── */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Berikut adalah daftar bukti transaksi yang telah terkumpul untuk dianalisis sebelum dicatat ke Jurnal Umum:
                </p>
                <div className="space-y-3">
                  {transactions.map((tx, idx) => (
                    <div
                      key={tx.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/40 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                            {tx.nomorBukti}
                          </span>
                          <span className="text-slate-500">{tx.tanggal}</span>
                        </div>
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          Rp {tx.nominal.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {tx.keterangan}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] pt-1">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                          (D) {tx.akunDebit}
                        </span>
                        <span className="text-slate-400">➔</span>
                        <span className="text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">
                          (K) {tx.akunKredit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAHAP 2: FORM JURNAL UMUM (EXCEL-LIKE TABLE) ── */}
            {activeStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Masukkan entri debit dan kredit dengan teliti:
                  </p>
                  <button
                    onClick={handleAddJournalRow}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Baris Jurnal
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                        <th className="p-3 w-28">Tanggal</th>
                        <th className="p-3">Keterangan / Akun</th>
                        <th className="p-3 w-16 text-center">Ref</th>
                        <th className="p-3 w-32 text-right">Debit (Rp)</th>
                        <th className="p-3 w-32 text-right">Kredit (Rp)</th>
                        <th className="p-3 w-12 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 bg-white dark:bg-slate-900/50">
                      {journalRows.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-2">
                            <input
                              type="date"
                              value={row.tanggal}
                              onChange={(e) => handleUpdateJournalRow(row.id, 'tanggal', e.target.value)}
                              className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={row.keterangan}
                              onChange={(e) => handleUpdateJournalRow(row.id, 'keterangan', e.target.value)}
                              placeholder="Nama Akun..."
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={row.ref}
                              onChange={(e) => handleUpdateJournalRow(row.id, 'ref', e.target.value)}
                              placeholder="101"
                              className="w-full px-1.5 py-1.5 text-center rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={row.debit || ''}
                              onChange={(e) => handleUpdateJournalRow(row.id, 'debit', Number(e.target.value))}
                              placeholder="0"
                              className="w-full px-2 py-1.5 text-right rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={row.kredit || ''}
                              onChange={(e) => handleUpdateJournalRow(row.id, 'kredit', Number(e.target.value))}
                              placeholder="0"
                              className="w-full px-2 py-1.5 text-right rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => handleDeleteJournalRow(row.id)}
                              disabled={journalRows.length <= 1}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-30 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100 dark:bg-slate-950 font-bold border-t-2 border-slate-300 dark:border-slate-700">
                        <td colSpan={3} className="p-3 text-right">TOTAL:</td>
                        <td className={`p-3 text-right font-mono ${isJournalBalanced ? 'text-emerald-500' : 'text-rose-500'}`}>
                          Rp {journalTotalDebit.toLocaleString('id-ID')}
                        </td>
                        <td className={`p-3 text-right font-mono ${isJournalBalanced ? 'text-emerald-500' : 'text-rose-500'}`}>
                          Rp {journalTotalKredit.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 text-center">
                          {isJournalBalanced ? '✓' : '⚠️'}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* ── TAHAP 3: FORM POSTING BUKU BESAR ── */}
            {activeStep === 3 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Berikut hasil rekapitulasi mutasi akun dari Jurnal Umum ke Buku Besar (T-Account):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ledgerAccounts.map((acc, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {acc.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                          Ref: {acc.ref}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <span className="text-[10px] text-slate-500 block font-sans">Total Debit:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            Rp {acc.debit.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                          <span className="text-[10px] text-slate-500 block font-sans">Total Kredit:</span>
                          <span className="font-bold text-cyan-600 dark:text-cyan-400">
                            Rp {acc.kredit.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                      <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex justify-between pt-1 border-t border-slate-200 dark:border-slate-800/80">
                        <span>Saldo Akhir:</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400">
                          {acc.netDebit > 0 ? `Debit: Rp ${acc.netDebit.toLocaleString('id-ID')}` : `Kredit: Rp ${acc.netKredit.toLocaleString('id-ID')}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAHAP 4: FORM NERACA SALDO ── */}
            {activeStep === 4 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Daftar saldo akhir buku besar sebelum penyesuaian:
                </p>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-950 font-bold border-b border-slate-200 dark:border-slate-800">
                        <th className="p-3">Nama Akun</th>
                        <th className="p-3 w-20 text-center">Ref</th>
                        <th className="p-3 w-36 text-right">Debit (Rp)</th>
                        <th className="p-3 w-36 text-right">Kredit (Rp)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900/50">
                      {ledgerAccounts.map((acc, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{acc.name}</td>
                          <td className="p-3 text-center font-mono text-slate-500">{acc.ref}</td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {acc.netDebit > 0 ? `Rp ${acc.netDebit.toLocaleString('id-ID')}` : '-'}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-cyan-600 dark:text-cyan-400">
                            {acc.netKredit > 0 ? `Rp ${acc.netKredit.toLocaleString('id-ID')}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100 dark:bg-slate-950 font-bold border-t-2 border-slate-300 dark:border-slate-700">
                        <td colSpan={2} className="p-3 text-right">TOTAL NERACA SALDO:</td>
                        <td className={`p-3 text-right font-mono ${isTrialBalanced ? 'text-emerald-500' : 'text-rose-500'}`}>
                          Rp {trialTotalDebit.toLocaleString('id-ID')}
                        </td>
                        <td className={`p-3 text-right font-mono ${isTrialBalanced ? 'text-emerald-500' : 'text-rose-500'}`}>
                          Rp {trialTotalKredit.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* ── TAHAP 5: FORM JURNAL PENYESUAIAN ── */}
            {activeStep === 5 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Masukkan ayat jurnal penyesuaian akhir periode:
                  </p>
                  <button
                    onClick={handleAddAdjRow}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Penyesuaian
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-950 font-bold border-b border-slate-200 dark:border-slate-800">
                        <th className="p-3 w-28">Tanggal</th>
                        <th className="p-3">Nama Akun Penyesuaian</th>
                        <th className="p-3 w-16 text-center">Ref</th>
                        <th className="p-3 w-32 text-right">Debit (Rp)</th>
                        <th className="p-3 w-32 text-right">Kredit (Rp)</th>
                        <th className="p-3 w-12 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900/50">
                      {adjustmentRows.map((row) => (
                        <tr key={row.id}>
                          <td className="p-2">
                            <input
                              type="date"
                              value={row.tanggal}
                              onChange={(e) => handleUpdateAdjRow(row.id, 'tanggal', e.target.value)}
                              className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={row.keterangan}
                              onChange={(e) => handleUpdateAdjRow(row.id, 'keterangan', e.target.value)}
                              placeholder="Nama Akun..."
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={row.ref}
                              onChange={(e) => handleUpdateAdjRow(row.id, 'ref', e.target.value)}
                              placeholder="502"
                              className="w-full px-1.5 py-1.5 text-center rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={row.debit || ''}
                              onChange={(e) => handleUpdateAdjRow(row.id, 'debit', Number(e.target.value))}
                              placeholder="0"
                              className="w-full px-2 py-1.5 text-right rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-rose-500 font-bold"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={row.kredit || ''}
                              onChange={(e) => handleUpdateAdjRow(row.id, 'kredit', Number(e.target.value))}
                              placeholder="0"
                              className="w-full px-2 py-1.5 text-right rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-cyan-500 font-bold"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => handleDeleteAdjRow(row.id)}
                              disabled={adjustmentRows.length <= 1}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-30 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100 dark:bg-slate-950 font-bold border-t-2 border-slate-300 dark:border-slate-700">
                        <td colSpan={3} className="p-3 text-right">TOTAL PENYESUAIAN:</td>
                        <td className={`p-3 text-right font-mono ${isAdjBalanced ? 'text-emerald-500' : 'text-rose-500'}`}>
                          Rp {adjTotalDebit.toLocaleString('id-ID')}
                        </td>
                        <td className={`p-3 text-right font-mono ${isAdjBalanced ? 'text-emerald-500' : 'text-rose-500'}`}>
                          Rp {adjTotalKredit.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 text-center">
                          {isAdjBalanced ? '✓' : '⚠️'}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* ── TAHAP 6: FORM NERACA SALDO DISESUAIKAN ── */}
            {activeStep === 6 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Hasil penggabungan Neraca Saldo dan Jurnal Penyesuaian:
                </p>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-950 font-bold border-b border-slate-200 dark:border-slate-800">
                        <th className="p-3">Nama Akun Disesuaikan</th>
                        <th className="p-3 w-20 text-center">Ref</th>
                        <th className="p-3 w-36 text-right">Debit Disesuaikan (Rp)</th>
                        <th className="p-3 w-36 text-right">Kredit Disesuaikan (Rp)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900/50">
                      {adjustedAccounts.map((acc, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{acc.name}</td>
                          <td className="p-3 text-center font-mono text-slate-500">{acc.ref}</td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {acc.netDebit > 0 ? `Rp ${acc.netDebit.toLocaleString('id-ID')}` : '-'}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-cyan-600 dark:text-cyan-400">
                            {acc.netKredit > 0 ? `Rp ${acc.netKredit.toLocaleString('id-ID')}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100 dark:bg-slate-950 font-bold border-t-2 border-slate-300 dark:border-slate-700">
                        <td colSpan={2} className="p-3 text-right">TOTAL DISESUAIKAN:</td>
                        <td className={`p-3 text-right font-mono ${isAdjTrialBalanced ? 'text-emerald-500' : 'text-rose-500'}`}>
                          Rp {adjTrialTotalDebit.toLocaleString('id-ID')}
                        </td>
                        <td className={`p-3 text-right font-mono ${isAdjTrialBalanced ? 'text-emerald-500' : 'text-rose-500'}`}>
                          Rp {adjTrialTotalKredit.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* ── TAHAP 7: FORM LAPORAN KEUANGAN & SUBMIT FINAL ── */}
            {activeStep === 7 && (
              <div className="space-y-6">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Ringkasan Laporan Laba Rugi, Perubahan Modal, dan Neraca Posisi Keuangan Final:
                </p>

                {/* 1. Laba Rugi */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="font-bold text-xs uppercase text-emerald-600 dark:text-emerald-400">
                      1. Laporan Laba Rugi
                    </span>
                    <span className="text-[10px] text-slate-500">Pendapatan - Beban</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-600 dark:text-slate-400">Total Pendapatan:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Rp {incomeSummary.totalPendapatan.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-600 dark:text-slate-400">Total Beban Operasional:</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">
                      (Rp {incomeSummary.totalBeban.toLocaleString('id-ID')})
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-mono font-bold pt-1 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-slate-900 dark:text-white">Laba / (Rugi) Bersih:</span>
                    <span className={incomeSummary.labaBersih >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                      Rp {incomeSummary.labaBersih.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* 2. Neraca Posisi Keuangan */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="font-bold text-xs uppercase text-cyan-600 dark:text-cyan-400">
                      2. Neraca Posisi Keuangan (Balance Sheet)
                    </span>
                    <span className="text-[10px] text-slate-500">Aset = Liabilitas + Ekuitas</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-[10px] text-slate-500 block font-sans">SISI AKTIVA (TOTAL ASET):</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                        Rp {incomeSummary.totalAset.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                      <span className="text-[10px] text-slate-500 block font-sans">SISI PASIVA (UTANG + MODAL):</span>
                      <span className="font-bold text-cyan-600 dark:text-cyan-400 text-sm">
                        Rp {incomeSummary.totalPasiva.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] font-bold flex justify-between pt-1">
                    <span>Status Keseimbangan Neraca:</span>
                    <span className={incomeSummary.isFinancialBalanced ? 'text-emerald-500' : 'text-rose-500 font-mono'}>
                      {incomeSummary.isFinancialBalanced ? '✓ BALANCE (100% Sempurna)' : `⚠️ Selisih Rp ${incomeSummary.balanceDiff.toLocaleString('id-ID')}`}
                    </span>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-2">
                  <button
                    onClick={handleSubmitFinalAssignment}
                    disabled={isSubmitting || !balanceDiagnostics.isFullyBalanced}
                    className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-xl cursor-pointer ${balanceDiagnostics.isFullyBalanced
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-emerald-500/25 scale-101'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700'
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Mengirim Tugas ke Guru...
                      </>
                    ) : balanceDiagnostics.isFullyBalanced ? (
                      <>
                        <Send className="w-5 h-5" />
                        Kirim Tugas Siklus Akuntansi ke Guru (Submit) 🎉
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-rose-400" />
                        Belum Bisa Kirim (Perbaiki Selisih yang Belum Balance)
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP NAVIGATION CONTROLS (PREV & NEXT BUTTONS) ── */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                disabled={activeStep === 1}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-30 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Tahap Sebelumnya
              </button>

              {activeStep < 7 ? (
                <button
                  onClick={() => setActiveStep(Math.min(7, activeStep + 1))}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 text-xs font-black hover:bg-slate-800 dark:hover:bg-emerald-400 transition-all shadow-md cursor-pointer"
                >
                  Lanjut ke Tahap {activeStep + 1}
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Tahap Akhir
                </span>
              )}
            </div>

          </div>
        </div>

        {/* ─── CONTAINER KANAN: PANDUAN LANGKAH & RIWAYAT PENGISIAN SEBELUMNYA (5 COLS) ─── */}
        <div className="lg:col-span-5 space-y-6">

          {/* Card 1: Panduan Langkah Aktif */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
              <Info className="w-4 h-4" />
              <span>Panduan Langkah Tahap {activeStep}</span>
            </div>

            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
              {stagesMeta[activeStep - 1].title}
            </h4>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {stagesMeta[activeStep - 1].guide}
            </p>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1.5">
              <span className="font-bold text-emerald-700 dark:text-emerald-300 block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Tips Akuntansi:
              </span>
              <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                {activeStep === 1 && (
                  <>
                    <li>Cermati apakah transaksi melibatkan kas tunai atau faktur kredit.</li>
                    <li>Aset bertambah di Debit, Liabilitas/Ekuitas bertambah di Kredit.</li>
                  </>
                )}
                {activeStep === 2 && (
                  <>
                    <li>Jumlahkan seluruh kolom debit dan kredit di bagian bawah.</li>
                    <li>Jika ada selisih, cek kembali nominal di tiap baris transaksi.</li>
                  </>
                )}
                {activeStep === 3 && (
                  <>
                    <li>Kelompokkan entri dengan nama akun yang sama ke T-Account.</li>
                    <li>Hitung selisih antara sisi Debit dan sisi Kredit.</li>
                  </>
                )}
                {activeStep === 4 && (
                  <>
                    <li>Pindahkan saldo akhir tiap buku besar ke Neraca Saldo.</li>
                    <li>Pastikan total neraca saldo sama persis (Balance).</li>
                  </>
                )}
                {activeStep === 5 && (
                  <>
                    <li>Hitung nilai perlengkapan yang benar-benar telah terpakai.</li>
                    <li>Alokasikan beban sewa yang sudah jatuh tempo selama bulan berjalan.</li>
                  </>
                )}
                {activeStep === 6 && (
                  <>
                    <li>Kombinasikan saldo neraca saldo awal dengan jurnal penyesuaian.</li>
                    <li>Pastikan saldo disesuaikan bernilai seimbang (Balance).</li>
                  </>
                )}
                {activeStep === 7 && (
                  <>
                    <li>Laporan Laba Rugi memuat akun Pendapatan dan Beban.</li>
                    <li>Neraca Akhir wajib memenuhi persamaan: Aset = Utang + Modal Akhir.</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Card 2: Riwayat Pengisian Tahap Sebelumnya (Live History) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Riwayat Pengisian Terhubung</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                Live Sync
              </span>
            </div>

            {/* Contextual History based on Active Step */}
            {activeStep === 1 && (
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <p>Tahap awal: Masukkan dan pelajari bukti transaksi di sebelah kiri untuk diteruskan ke Jurnal Umum.</p>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-[11px] font-mono">
                  Jumlah Transaksi Teridentifikasi: <strong>{transactions.length} Dokumen</strong>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Referensi dari Tahap 1 (Identifikasi Transaksi):
                </span>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {transactions.map((tx, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="font-bold text-slate-900 dark:text-white">{tx.nomorBukti}</span>
                        <span className="text-emerald-500 font-bold">Rp {tx.nominal.toLocaleString('id-ID')}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">{tx.keterangan}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Ringkasan dari Tahap 2 (Jurnal Umum):
                </span>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
                  <div className="flex justify-between">
                    <span>Total Baris Jurnal:</span>
                    <strong>{journalRows.length} Entri</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Debit:</span>
                    <strong className="text-emerald-500">Rp {journalTotalDebit.toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Kredit:</span>
                    <strong className="text-cyan-500">Rp {journalTotalKredit.toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
                    <span>Status:</span>
                    <strong className={isJournalBalanced ? 'text-emerald-500' : 'text-rose-500'}>
                      {isJournalBalanced ? '✓ Balance' : `⚠️ Selisih Rp ${journalDiff.toLocaleString('id-ID')}`}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Riwayat Saldo Akun dari Tahap 3 (Buku Besar):
                </span>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {ledgerAccounts.map((acc, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs flex justify-between items-center font-mono">
                      <span className="font-sans text-slate-800 dark:text-slate-200 truncate">{acc.name}</span>
                      <span className="text-emerald-500 font-bold shrink-0">
                        Rp {(acc.netDebit || acc.netKredit).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeStep === 5 && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Riwayat dari Tahap 4 (Neraca Saldo Awal):
                </span>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
                  <div className="flex justify-between">
                    <span>Total Saldo Debit:</span>
                    <strong className="text-emerald-500">Rp {trialTotalDebit.toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Saldo Kredit:</span>
                    <strong className="text-cyan-500">Rp {trialTotalKredit.toLocaleString('id-ID')}</strong>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 6 && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Riwayat dari Tahap 5 (Jurnal Penyesuaian):
                </span>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {adjustmentRows.map((adj, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs flex justify-between items-center font-mono">
                      <span className="font-sans text-slate-800 dark:text-slate-200 truncate">{adj.keterangan}</span>
                      <span className="text-rose-500 font-bold shrink-0">
                        Rp {(Number(adj.debit) || Number(adj.kredit)).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeStep === 7 && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Kilas Balik Siklus Lengkap (Tahap 1 - 6):
                </span>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 flex justify-between">
                    <span className="font-sans text-slate-600 dark:text-slate-400">1. Jurnal Umum:</span>
                    <strong className={isJournalBalanced ? 'text-emerald-500' : 'text-rose-500'}>
                      {isJournalBalanced ? '✓ Balance' : '⚠️ Selisih'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 flex justify-between">
                    <span className="font-sans text-slate-600 dark:text-slate-400">2. Neraca Saldo:</span>
                    <strong className={isTrialBalanced ? 'text-emerald-500' : 'text-rose-500'}>
                      {isTrialBalanced ? '✓ Balance' : '⚠️ Selisih'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 flex justify-between">
                    <span className="font-sans text-slate-600 dark:text-slate-400">3. Penyesuaian:</span>
                    <strong className={isAdjBalanced ? 'text-emerald-500' : 'text-rose-500'}>
                      {isAdjBalanced ? '✓ Balance' : '⚠️ Selisih'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 flex justify-between">
                    <span className="font-sans text-slate-600 dark:text-slate-400">4. Neraca Disesuaikan:</span>
                    <strong className={isAdjTrialBalanced ? 'text-emerald-500' : 'text-rose-500'}>
                      {isAdjTrialBalanced ? '✓ Balance' : '⚠️ Selisih'}
                    </strong>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
