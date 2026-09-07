'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/src/components/ui/Navbar';
import InteractiveBackground from '@/src/components/ui/InteractiveBackground';
import {
  Users,
  Calculator,
  BookOpen,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  FileSpreadsheet,
  TrendingUp,
  Award,
  RefreshCw,
  Sparkles,
  Lock,
  LogIn,
  ShieldCheck,
  Filter,
  Layers,
  Scale,
  PieChart,
} from 'lucide-react';
import { supabase } from '@/src/lib/supabaseClient';

/* ─── Mock initial dummy submissions ─── */
const dummyTaxSubmissions = [
  {
    id: 'tax-1',
    nama_siswa: 'Ahmad Fadillah',
    kelas: 'XII IPS 1',
    gaji_bruto: 12500000,
    pph21_bulanan: 325000,
    ppn_bulanan: 275000,
    pbb_tahunan: 450000,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'tax-2',
    nama_siswa: 'Siti Rahmawati',
    kelas: 'XII IPS 2',
    gaji_bruto: 18000000,
    pph21_bulanan: 850000,
    ppn_bulanan: 440000,
    pbb_tahunan: 650000,
    created_at: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
  },
  {
    id: 'tax-3',
    nama_siswa: 'Budi Santoso',
    kelas: 'XII IPS 1',
    gaji_bruto: 9000000,
    pph21_bulanan: 125000,
    ppn_bulanan: 150000,
    pbb_tahunan: 320000,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'tax-4',
    nama_siswa: 'Dina Lestari',
    kelas: 'XII MIPA 1',
    gaji_bruto: 15000000,
    pph21_bulanan: 550000,
    ppn_bulanan: 350000,
    pbb_tahunan: 500000,
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
];

const dummyAccountingSubmissions = [
  {
    id: 'acc-1',
    nama_siswa: 'Ahmad Fadillah',
    kelas: 'XII IPS 1',
    jenis_perusahaan: 'Perusahaan Jasa',
    total_debit: 36600000,
    total_kredit: 36600000,
    is_balance: true,
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    jurnal_json: [
      { tanggal: '2025-10-01', keterangan: 'Kas', ref: '101', debit: 20000000, kredit: 0 },
      { tanggal: '2025-10-01', keterangan: 'Modal Pemilik', ref: '301', debit: 0, kredit: 20000000 },
      { tanggal: '2025-10-03', keterangan: 'Sewa Dibayar Dimuka', ref: '103', debit: 3600000, kredit: 0 },
      { tanggal: '2025-10-03', keterangan: 'Kas', ref: '101', debit: 0, kredit: 3600000 },
      { tanggal: '2025-10-06', keterangan: 'Perlengkapan', ref: '104', debit: 1500000, kredit: 0 },
      { tanggal: '2025-10-06', keterangan: 'Kas', ref: '101', debit: 0, kredit: 1500000 },
      { tanggal: '2025-10-10', keterangan: 'Piutang Usaha', ref: '102', debit: 4000000, kredit: 0 },
      { tanggal: '2025-10-10', keterangan: 'Pendapatan Jasa', ref: '401', debit: 0, kredit: 4000000 },
      { tanggal: '2025-10-15', keterangan: 'Kas', ref: '101', debit: 5000000, kredit: 0 },
      { tanggal: '2025-10-15', keterangan: 'Pendapatan Jasa', ref: '401', debit: 0, kredit: 5000000 },
      { tanggal: '2025-10-25', keterangan: 'Beban Gaji', ref: '501', debit: 2500000, kredit: 0 },
      { tanggal: '2025-10-25', keterangan: 'Kas', ref: '101', debit: 0, kredit: 2500000 },
    ],
    laporan_keuangan_json: {
      totalPendapatan: 9000000,
      totalBeban: 2500000,
      labaBersih: 6500000,
      totalAset: 26500000,
      totalPasiva: 26500000,
    },
  },
  {
    id: 'acc-2',
    nama_siswa: 'Siti Rahmawati',
    kelas: 'XII IPS 2',
    jenis_perusahaan: 'Perusahaan Dagang',
    total_debit: 30000000,
    total_kredit: 30000000,
    is_balance: true,
    created_at: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    jurnal_json: [
      { tanggal: '2025-10-02', keterangan: 'Pembelian', ref: '501', debit: 10000000, kredit: 0 },
      { tanggal: '2025-10-02', keterangan: 'Utang Dagang', ref: '201', debit: 0, kredit: 10000000 },
      { tanggal: '2025-10-05', keterangan: 'Kas', ref: '101', debit: 6500000, kredit: 0 },
      { tanggal: '2025-10-05', keterangan: 'Penjualan', ref: '401', debit: 0, kredit: 6500000 },
      { tanggal: '2025-10-08', keterangan: 'Beban Angkut Pembelian', ref: '502', debit: 500000, kredit: 0 },
      { tanggal: '2025-10-08', keterangan: 'Kas', ref: '101', debit: 0, kredit: 500000 },
      { tanggal: '2025-10-12', keterangan: 'Piutang Dagang', ref: '102', debit: 8000000, kredit: 0 },
      { tanggal: '2025-10-12', keterangan: 'Penjualan', ref: '401', debit: 0, kredit: 8000000 },
      { tanggal: '2025-10-20', keterangan: 'Utang Dagang', ref: '201', debit: 5000000, kredit: 0 },
      { tanggal: '2025-10-20', keterangan: 'Kas', ref: '101', debit: 0, kredit: 5000000 },
    ],
    laporan_keuangan_json: {
      totalPendapatan: 14500000,
      totalBeban: 10500000,
      labaBersih: 4000000,
      totalAset: 19000000,
      totalPasiva: 19000000,
    },
  },
];

export default function AdminPage() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Dashboard Filters & Controls
  const [activeTab, setActiveTab] = useState<'tax' | 'accounting' | 'materi'>('accounting');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('all');

  // Data States
  const [taxSubmissions, setTaxSubmissions] = useState<any[]>([]);
  const [accountingSubmissions, setAccountingSubmissions] = useState<any[]>([]);
  const [materiList, setMateriList] = useState<any[]>([]);
  const [showMateriModal, setShowMateriModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [judulMateri, setJudulMateri] = useState('');
  const [deskripsiMateri, setDeskripsiMateri] = useState('');

  const [nomorBukti, setNomorBukti] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [nominal, setNominal] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [akunDebit, setAkunDebit] = useState('');
  const [akunKredit, setAkunKredit] = useState('');

  const [selectedJournalStudent, setSelectedJournalStudent] = useState<any | null>(null);
  const [modalTab, setModalTab] = useState<'jurnal' | 'laporan'>('jurnal');


  // Check login status on load
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('edufinance_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (username.toLowerCase() === 'admin' || username.toLowerCase() === 'guru') &&
      (password === 'admin123' || password === 'sman14palembang')
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem('edufinance_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Username atau password salah! (Petunjuk: admin / admin123)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('edufinance_admin_auth');
  };

  // Fetch submissions from Supabase + LocalStorage
  const fetchDashboardData = async () => {
    setIsLoading(true);

    try {
      // 1. Fetch Tax Submissions
      const { data: taxData } = await supabase.from('tugas_pajak').select('*').order('created_at', { ascending: false });
      const localTax = JSON.parse(localStorage.getItem('edufinance_tugas_pajak') || '[]');
      const combinedTax = [...(taxData || []), ...localTax, ...dummyTaxSubmissions];

      const uniqueTaxMap = new Map();
      combinedTax.forEach((item) => {
        const key = item.id || `${item.nama_siswa}-${item.created_at}`;
        if (!uniqueTaxMap.has(key)) uniqueTaxMap.set(key, item);
      });
      setTaxSubmissions(Array.from(uniqueTaxMap.values()));

      // 2. Fetch Accounting Submissions
      const { data: accData } = await supabase.from('tugas_akuntansi').select('*').order('created_at', { ascending: false });
      const localAcc = JSON.parse(localStorage.getItem('edufinance_tugas_akuntansi') || '[]');
      const combinedAcc = [...(accData || []), ...localAcc, ...dummyAccountingSubmissions];

      const uniqueAccMap = new Map();
      combinedAcc.forEach((item) => {
        const key = item.id || `${item.nama_siswa}-${item.created_at}`;
        if (!uniqueAccMap.has(key)) uniqueAccMap.set(key, item);
      });
      setAccountingSubmissions(Array.from(uniqueAccMap.values()));
    } catch (err) {
      console.warn('Dashboard fetch error fallback to local:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMateri = async () => {
    const { data, error } = await supabase
      .from('materi_akuntansi')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setMateriList(data || []);
    }
  };

  const hapusMateri = async (id: string) => {
    const { error } = await supabase
      .from('materi_akuntansi')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchMateri();
    }
  };

  const simpanMateri = async () => {
    const { data, error } = await supabase
      .from('materi_akuntansi')
      .insert([
        {
          judul: judulMateri,
          nomor_bukti: nomorBukti,
          tanggal: tanggal,
          nominal: Number(nominal),
          keterangan: keterangan,
          akun_debit: akunDebit,
          akun_kredit: akunKredit

        }
      ])
      .select();

    console.log('DATA:', data);
    console.log('ERROR:', error);

    if (error) {
      alert(error.message);
      return;
    }

    alert('Berhasil disimpan');

    fetchMateri();
    setShowMateriModal(false);
    setJudulMateri('');
    setNomorBukti('');
    setTanggal('');
    setNominal('');
    setKeterangan('');
    setAkunDebit('');
    setAkunKredit('');
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
      fetchMateri();
    }
  }, [isAuthenticated]);

  // List of available classes
  const classOptions = useMemo(() => {
    const classes = new Set<string>();
    classes.add('XII IPS 1');
    classes.add('XII IPS 2');
    classes.add('XII IPS 3');
    classes.add('XII MIPA 1');
    classes.add('XII MIPA 2');
    classes.add('XI IPS 1');
    classes.add('XI IPS 2');

    taxSubmissions.forEach((t) => t.kelas && classes.add(t.kelas));
    accountingSubmissions.forEach((a) => a.kelas && classes.add(a.kelas));

    return Array.from(classes);
  }, [taxSubmissions, accountingSubmissions]);

  // Filtered lists with class filter
  const filteredTaxList = taxSubmissions.filter((item) => {
    const matchSearch =
      item.nama_siswa?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kelas?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchClass = selectedClass === 'all' || item.kelas === selectedClass;
    return matchSearch && matchClass;
  });

  const filteredAccList = accountingSubmissions.filter((item) => {
    const matchSearch =
      item.nama_siswa?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kelas?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchClass = selectedClass === 'all' || item.kelas === selectedClass;
    return matchSearch && matchClass;
  });

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 flex flex-col font-sans overflow-x-hidden">
      {/* Background Effect */}
      <InteractiveBackground />

      {/* Navbar */}
      <Navbar />

      {/* LOGIN MODAL IF NOT AUTHENTICATED */}
      {!isAuthenticated ? (
        <main className="relative z-10 flex-1 max-w-md w-full mx-auto px-4 py-16 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-2xl space-y-6 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Login Dashboard Guru
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                EduFinance CMS Admin • SMA Negeri 14 Palembang
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-left text-xs space-y-1">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 block flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Login Test Account:
              </span>
              <p className="text-slate-600 dark:text-slate-300 font-mono">
                Username: <strong className="text-emerald-500">edufinance</strong>
              </p>
              <p className="text-slate-600 dark:text-slate-300 font-mono">
                Password: <strong className="text-emerald-500">risya14</strong>
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Username / NIP Guru
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {loginError && (
                <p className="text-xs font-bold text-rose-500 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" /> Masuk ke Dashboard
              </button>
            </form>
          </motion.div>
        </main>
      ) : (
        /* MAIN ADMIN DASHBOARD CONTENT WHEN AUTHENTICATED */
        <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

          {/* Header Title Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white shadow-2xl border border-slate-700/80">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" /> Dashboard Guru & Admin CMS
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Pemeriksaan Tugas Siswa SMAN 14
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Pantau langsung hasil simulasi pajak terpadu dan lembar kerja 7 tahapan siklus akuntansi siswa dengan filter kelas.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchDashboardData}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                Muat Ulang
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Keluar
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Simulasi Pajak</span>
                <Calculator className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {taxSubmissions.length}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Tugas Pajak Terkumpul</div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-cyan-600 dark:text-cyan-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Siklus Akuntansi</span>
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {accountingSubmissions.length}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Lembar Kerja Dikumpulkan</div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Status Balance</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                100%
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Akurasi Entri Jurnal</div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Kelas Terdaftar</span>
                <Users className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {classOptions.length}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Kelas Aktif Belajar</div>
            </div>
          </div>

          {/* Dashboard Main Tabs & Filter Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">

            {/* Tab Switcher */}
            <div className="flex p-1.5 bg-slate-200/80 dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 self-start">
              <button
                onClick={() => setActiveTab('accounting')}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'accounting'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <BookOpen className="w-4 h-4 text-cyan-500" />
                Siklus Akuntansi ({filteredAccList.length})
              </button>

              <button
                onClick={() => setActiveTab('tax')}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'tax'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <Calculator className="w-4 h-4 text-emerald-500" />
                Tugas Pajak ({filteredTaxList.length})
              </button>

              <button
                onClick={() => setActiveTab('materi')}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${activeTab === 'materi'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400'
                  }`}
              >
                Kelola Materi
              </button>
            </div>

            {/* Filter Kelas & Search Input Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">

              {/* Dropdown Filter Kelas */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm shrink-0">
                  <Filter className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Kelas:</span>
                </div>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full sm:w-44 px-3 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm cursor-pointer"
                >
                  <option value="all">Semua Kelas ({taxSubmissions.length + accountingSubmissions.length})</option>
                  {classOptions.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari Nama Siswa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
                />
              </div>

            </div>
          </div>

          {/* TAB 1: TABEL TUGAS AKUNTANSI SISWA */}
          {activeTab === 'accounting' && (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-bold uppercase tracking-wider">
                      <th className="py-4 px-5">Nama Siswa</th>
                      <th className="py-4 px-5">Kelas</th>
                      <th className="py-4 px-5">Jenis Modul</th>
                      <th className="py-4 px-5 text-right">Total Debit</th>
                      <th className="py-4 px-5 text-right">Total Kredit</th>
                      <th className="py-4 px-5 text-center">Status Balance</th>
                      <th className="py-4 px-5 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                    {filteredAccList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400">
                          Tidak ditemukan tugas akuntansi untuk kelas & kata kunci pencarian yang dipilih.
                        </td>
                      </tr>
                    ) : (
                      filteredAccList.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-4 px-5 font-bold text-slate-900 dark:text-white">
                            {item.nama_siswa}
                          </td>
                          <td className="py-4 px-5 text-slate-600 dark:text-slate-400 font-semibold">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold">
                              {item.kelas || 'XII IPS 1'}
                            </span>
                          </td>
                          <td className="py-4 px-5 font-semibold text-cyan-600 dark:text-cyan-400">
                            {item.jenis_perusahaan || 'Perusahaan Jasa'}
                          </td>
                          <td className="py-4 px-5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            Rp {(item.total_debit || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="py-4 px-5 text-right font-mono font-bold text-cyan-600 dark:text-cyan-400">
                            Rp {(item.total_kredit || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="py-4 px-5 text-center">
                            {item.is_balance !== false ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                                SEIMBANG (BALANCE)
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                                UNBALANCED
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-5 text-center">
                            <button
                              onClick={() => {
                                setSelectedJournalStudent(item);
                                setModalTab('jurnal');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center justify-center gap-1.5 mx-auto transition-all cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> Periksa Siklus
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: TABEL TUGAS PAJAK SISWA */}
          {activeTab === 'tax' && (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-bold uppercase tracking-wider">
                      <th className="py-4 px-5">Nama Siswa</th>
                      <th className="py-4 px-5">Kelas</th>
                      <th className="py-4 px-5 text-right">Gaji Bruto</th>
                      <th className="py-4 px-5 text-right">PPh 21 / Bln</th>
                      <th className="py-4 px-5 text-right">PPN 11% / Bln</th>
                      <th className="py-4 px-5 text-right">PBB / Thn</th>
                      <th className="py-4 px-5 text-center">Waktu Kumpul</th>
                      <th className="py-4 px-5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                    {filteredTaxList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500 dark:text-slate-400">
                          Tidak ditemukan tugas pajak untuk kelas & kata kunci pencarian yang dipilih.
                        </td>
                      </tr>
                    ) : (
                      filteredTaxList.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-4 px-5 font-bold text-slate-900 dark:text-white">
                            {item.nama_siswa}
                          </td>
                          <td className="py-4 px-5 text-slate-600 dark:text-slate-400 font-semibold">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold">
                              {item.kelas || 'XII IPS 1'}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right font-mono text-slate-900 dark:text-white">
                            Rp {(item.gaji_bruto || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="py-4 px-5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            Rp {(item.pph21_bulanan || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="py-4 px-5 text-right font-mono font-bold text-cyan-600 dark:text-cyan-400">
                            Rp {(item.ppn_bulanan || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="py-4 px-5 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                            Rp {(item.pbb_tahunan || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="py-4 px-5 text-center text-[11px] text-slate-500">
                            {new Date(item.created_at || Date.now()).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-4 px-5 text-center">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                              TERVERIFIKASI
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'materi' && (
            <div className="space-y-4">

              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  Materi Identifikasi Transaksi
                </h2>

                <button
                  onClick={() => setShowMateriModal(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
                >
                  + Tambah Materi
                </button>
              </div>

              {materiList.map((materi) => (
                <div
                  key={materi.id}
                  className="p-4 border rounded-xl"
                >
                  <h3 className="font-bold">
                    {materi.judul}
                  </h3>

                  <p>
                    {materi.deskripsi}
                  </p>

                  <div className="mt-2 text-sm space-y-1">

                    <div>
                      <b>Nomor Bukti:</b> {materi.nomor_bukti}
                    </div>

                    <div>
                      <b>Tanggal:</b> {materi.tanggal}
                    </div>

                    <div>
                      <b>Nominal:</b> Rp {Number(materi.nominal).toLocaleString('id-ID')}
                    </div>

                    <div>
                      <b>Keterangan:</b> {materi.keterangan}
                    </div>

                    <div>
                      <b>Akun Debit:</b> {materi.akun_debit}
                    </div>

                    <div>
                      <b>Akun Kredit:</b> {materi.akun_kredit}
                    </div>

                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => hapusMateri(materi.id)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg"
                    >
                      Hapus
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}


        </main>
      )}

      {/* ── MODAL POP-UP: RINCIAN 7 TAHAP SIKLUS AKUNTANSI SISWA ── */}
      <AnimatePresence>
        {selectedJournalStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-500 uppercase tracking-widest">
                    <FileSpreadsheet className="w-4 h-4" /> Pemeriksaan Lembar Kerja Siswa
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {selectedJournalStudent.nama_siswa} ({selectedJournalStudent.kelas})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Modul: <strong className="text-cyan-500">{selectedJournalStudent.jenis_perusahaan}</strong> • Status: <strong className="text-emerald-500">100% Balanced</strong>
                  </p>
                </div>

                <button
                  onClick={() => setSelectedJournalStudent(null)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Internal Tabs */}
              <div className="flex gap-2 pt-3">
                <button
                  onClick={() => setModalTab('jurnal')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${modalTab === 'jurnal'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                >
                  Jurnal Umum
                </button>
                <button
                  onClick={() => setModalTab('laporan')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${modalTab === 'laporan'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                >
                  Laporan Keuangan
                </button>
              </div>

              {/* Modal Content - Jurnal Tab */}
              {modalTab === 'jurnal' && (
                <div className="overflow-y-auto my-4 flex-1 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Tanggal</th>
                        <th className="py-3 px-4">Keterangan / Nama Akun</th>
                        <th className="py-3 px-4 text-center">Ref</th>
                        <th className="py-3 px-4 text-right">Debit (Rp)</th>
                        <th className="py-3 px-4 text-right">Kredit (Rp)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900 font-medium">
                      {(selectedJournalStudent.jurnal_json || []).map((row: any, i: number) => {
                        const isKredit = row.kredit > 0 && row.debit === 0;
                        return (
                          <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="py-2.5 px-4 font-mono text-slate-600 dark:text-slate-400">{row.tanggal}</td>
                            <td className={`py-2.5 px-4 font-semibold text-slate-900 dark:text-white ${isKredit ? 'pl-8 text-slate-500 dark:text-slate-400' : ''}`}>
                              {row.keterangan}
                            </td>
                            <td className="py-2.5 px-4 text-center font-mono text-slate-500">{row.ref}</td>
                            <td className="py-2.5 px-4 text-right font-bold font-mono text-emerald-600 dark:text-emerald-400">
                              {(row.debit || 0) > 0 ? `Rp ${row.debit.toLocaleString('id-ID')}` : '-'}
                            </td>
                            <td className="py-2.5 px-4 text-right font-bold font-mono text-cyan-600 dark:text-cyan-400">
                              {(row.kredit || 0) > 0 ? `Rp ${row.kredit.toLocaleString('id-ID')}` : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100 dark:bg-slate-800 font-black text-slate-900 dark:text-white border-t border-slate-300 dark:border-slate-700">
                        <td colSpan={3} className="py-3 px-4 uppercase">Total</td>
                        <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-mono">
                          Rp {(selectedJournalStudent.total_debit || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-right text-cyan-600 dark:text-cyan-400 font-mono">
                          Rp {(selectedJournalStudent.total_kredit || 0).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {/* Modal Content - Laporan Keuangan Tab */}
              {modalTab === 'laporan' && (
                <div className="overflow-y-auto my-4 flex-1 space-y-4">
                  {selectedJournalStudent.laporan_keuangan_json ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 block border-b pb-1">
                          Laporan Laba Rugi
                        </span>
                        <div className="flex justify-between font-mono">
                          <span>Total Pendapatan:</span>
                          <strong>Rp {(selectedJournalStudent.laporan_keuangan_json.totalPendapatan || 0).toLocaleString('id-ID')}</strong>
                        </div>
                        <div className="flex justify-between font-mono">
                          <span>Total Beban:</span>
                          <strong>(Rp {(selectedJournalStudent.laporan_keuangan_json.totalBeban || 0).toLocaleString('id-ID')})</strong>
                        </div>
                        <div className="flex justify-between font-mono font-bold pt-1 border-t text-emerald-500">
                          <span>Laba Bersih:</span>
                          <span>Rp {(selectedJournalStudent.laporan_keuangan_json.labaBersih || 0).toLocaleString('id-ID')}</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                        <span className="font-bold text-cyan-600 dark:text-cyan-400 block border-b pb-1">
                          Posisi Neraca Keuangan
                        </span>
                        <div className="flex justify-between font-mono">
                          <span>Total Aset (Aktiva):</span>
                          <strong className="text-emerald-500">Rp {(selectedJournalStudent.laporan_keuangan_json.totalAset || 0).toLocaleString('id-ID')}</strong>
                        </div>
                        <div className="flex justify-between font-mono">
                          <span>Total Pasiva (Utang+Modal):</span>
                          <strong className="text-cyan-500">Rp {(selectedJournalStudent.laporan_keuangan_json.totalPasiva || 0).toLocaleString('id-ID')}</strong>
                        </div>
                        <div className="flex justify-between font-mono font-bold pt-1 border-t text-emerald-500">
                          <span>Status:</span>
                          <span>✓ 100% BALANCE</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      Laporan keuangan tersusun bersama berkas jurnal siswa.
                    </div>
                  )}
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> 7 Tahapan Siklus Terverifikasi
                </span>

                <button
                  onClick={() => setSelectedJournalStudent(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Tutup Rincian
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL TAMBAH MATERI */}
      {showMateriModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">

            <h2 className="text-xl font-bold mb-4">
              Tambah Materi
            </h2>

            <input
              type="text"
              value={judulMateri}
              onChange={(e) => setJudulMateri(e.target.value)}
              placeholder="Judul Materi"
              className="w-full border p-2 rounded mb-3"
            />

            <input
              value={nomorBukti}
              onChange={(e) => setNomorBukti(e.target.value)}
              placeholder="Nomor Bukti (BKM-01)"
              className="w-full border p-2 rounded mb-3"
            />

            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />

            <input
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              placeholder="Nominal"
              className="w-full border p-2 rounded mb-3"
            />

            <textarea
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Keterangan Transaksi"
              className="w-full border p-2 rounded mb-3"
            />

            <input
              value={akunDebit}
              onChange={(e) => setAkunDebit(e.target.value)}
              placeholder="Akun Debit"
              className="w-full border p-2 rounded mb-3"
            />

            <input
              value={akunKredit}
              onChange={(e) => setAkunKredit(e.target.value)}
              placeholder="Akun Kredit"
              className="w-full border p-2 rounded mb-3"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setShowMateriModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>

              <button
                onClick={simpanMateri}
                className="px-4 py-2 bg-emerald-600 text-white rounded"
              >
                Simpan
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
