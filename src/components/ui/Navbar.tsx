'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Sparkles, Calculator, BookOpen, Menu, X, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    // Check initial theme from document or localStorage
    const savedTheme = localStorage.getItem('edu-theme');
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('edu-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('edu-theme', 'light');
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md border-b ${
        scrolled
          ? 'bg-slate-900/90 dark:bg-slate-950/90 border-slate-700/60 dark:border-slate-800 shadow-xl'
          : 'bg-white/80 dark:bg-slate-950/80 border-slate-200/80 dark:border-slate-800/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Brand */}
        <a href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
                EduFinance
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50">
                Hub
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-1">
              SMA Negeri 14 Palembang
            </p>
          </div>
        </a>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center gap-2 font-medium text-sm">
          <a
            href="/#simulasi-pajak"
            className="px-3.5 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-center gap-1.5"
          >
            <Calculator className="w-4 h-4 text-emerald-500" />
            Simulasi Pajak
          </a>
          <a
            href="/#siklus-akuntansi"
            className="px-3.5 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-center gap-1.5 font-bold"
          >
            <BookOpen className="w-4 h-4 text-cyan-500" />
            Laboratorium Siklus Akuntansi & Buku Kerja
          </a>
        </nav>

        {/* Right Actions: Admin Link & Theme Toggle */}
        <div className="flex items-center gap-3">
          <a
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Dashboard Guru
          </a>

          {/* Theme Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors shadow-sm cursor-pointer"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isDark ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5 text-amber-400"
                >
                  <Sun className="w-5 h-5 fill-amber-400/20" />
                  <span className="hidden lg:inline-block text-xs font-semibold text-slate-300">
                    Mode Terang
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5 text-indigo-600"
                >
                  <Moon className="w-5 h-5 fill-indigo-600/20" />
                  <span className="hidden lg:inline-block text-xs font-semibold text-slate-700">
                    Mode Gelap
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg px-4 py-4 space-y-2"
          >
            <a
              href="/#simulasi-pajak"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium"
            >
              <Calculator className="w-5 h-5 text-emerald-500" />
              Simulasi Pajak Terpadu
            </a>
            <a
              href="/#siklus-akuntansi"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold"
            >
              <BookOpen className="w-5 h-5 text-cyan-500" />
              Laboratorium Siklus Akuntansi & Buku Kerja
            </a>
            <a
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-bold"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Dashboard Guru & CMS Admin
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
