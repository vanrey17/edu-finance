'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
  BookOpen,
  Book,
  TrendingUp,
  BarChart3,
  PieChart,
  GraduationCap,
  School,
  Ruler,
  Sun,
  SunMedium,
  Calculator,
  Coins,
  Receipt,
  Wallet,
  FileSpreadsheet,
  Scale,
} from 'lucide-react';

/* ── Standalone Floating Icon Definitions (Buku, Grafik, Pelajar, Mistar, Matahari, Akuntan) ── */
interface FloatingItem {
  id: string;
  name: string;
  category: 'buku' | 'grafik' | 'pelajar' | 'mistar' | 'matahari' | 'akuntan';
  icon: React.ElementType;
  emoji: string;
  position: { top: string; left?: string; right?: string };
  iconColor: string;
  glowColor: string;
  duration: number;
  yOffset: number;
  xOffset: number;
  rotateDeg: number;
  desktopSize: number;
  mobileSize: number;
}

const floatingIconsList: FloatingItem[] = [
  // ☀️ MATAHARI (Sun)
  {
    id: 'sun-1',
    name: 'Matahari',
    category: 'matahari',
    icon: Sun,
    emoji: '☀️',
    position: { top: '6%', right: '7%' },
    iconColor: 'text-amber-500/70 dark:text-amber-400/70 hover:text-amber-500',
    glowColor: 'drop-shadow-[0_0_12px_rgba(245,158,11,0.25)]',
    duration: 6.5,
    yOffset: -18,
    xOffset: 8,
    rotateDeg: 45,
    desktopSize: 38,
    mobileSize: 26,
  },
  {
    id: 'sun-2',
    name: 'Matahari Cerah',
    category: 'matahari',
    icon: SunMedium,
    emoji: '🌞',
    position: { top: '78%', left: '6%' },
    iconColor: 'text-yellow-500/35 dark:text-yellow-400/35 hover:text-yellow-500/70',
    glowColor: 'drop-shadow-[0_0_12px_rgba(234,179,8,0.25)]',
    duration: 7.2,
    yOffset: 20,
    xOffset: -10,
    rotateDeg: -30,
    desktopSize: 34,
    mobileSize: 24,
  },

  // 🎓 PELAJAR (Student / Education)
  {
    id: 'student-1',
    name: 'Pelajar',
    category: 'pelajar',
    icon: GraduationCap,
    emoji: '🎓',
    position: { top: '12%', left: '5%' },
    iconColor: 'text-indigo-500/70 dark:text-indigo-400/70 hover:text-indigo-500',
    glowColor: 'drop-shadow-[0_0_12px_rgba(99,102,241,0.25)]',
    duration: 5.8,
    yOffset: -20,
    xOffset: -6,
    rotateDeg: -18,
    desktopSize: 42,
    mobileSize: 28,
  },
  {
    id: 'student-2',
    name: 'Sekolah',
    category: 'pelajar',
    icon: School,
    emoji: '🎒',
    position: { top: '62%', right: '5%' },
    iconColor: 'text-violet-500/35 dark:text-violet-400/35 hover:text-violet-500/70',
    glowColor: 'drop-shadow-[0_0_12px_rgba(139,92,246,0.25)]',
    duration: 6.8,
    yOffset: 18,
    xOffset: 12,
    rotateDeg: 15,
    desktopSize: 34,
    mobileSize: 24,
  },

  // 📚 BUKU (Book / Notebook)
  {
    id: 'book-1',
    name: 'Buku',
    category: 'buku',
    icon: BookOpen,
    emoji: '📚',
    position: { top: '24%', left: '8%' },
    iconColor: 'text-teal-500/40 dark:text-teal-400/40 hover:text-teal-500/70',
    glowColor: 'drop-shadow-[0_0_12px_rgba(20,184,166,0.25)]',
    duration: 6.0,
    yOffset: -16,
    xOffset: 10,
    rotateDeg: 20,
    desktopSize: 38,
    mobileSize: 26,
  },
  {
    id: 'book-2',
    name: 'Buku Cetak',
    category: 'buku',
    icon: Book,
    emoji: '📖',
    position: { top: '84%', right: '12%' },
    iconColor: 'text-cyan-500/35 dark:text-cyan-400/35 hover:text-cyan-500/70',
    glowColor: 'drop-shadow-[0_0_12px_rgba(6,182,212,0.25)]',
    duration: 5.4,
    yOffset: 22,
    xOffset: -8,
    rotateDeg: -15,
    desktopSize: 34,
    mobileSize: 24,
  },

  // 📊 GRAFIK (Graph / Chart)
  {
    id: 'chart-1',
    name: 'Grafik Pertumbuhan',
    category: 'grafik',
    icon: TrendingUp,
    emoji: '📈',
    position: { top: '18%', right: '10%' },
    iconColor: 'text-emerald-600/70 dark:text-emerald-400/40 hover:text-emerald-500/70',
    glowColor: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.25)]',
    duration: 5.2,
    yOffset: 20,
    xOffset: -12,
    rotateDeg: -12,
    desktopSize: 40,
    mobileSize: 28,
  },
  {
    id: 'chart-2',
    name: 'Diagram Batang',
    category: 'grafik',
    icon: BarChart3,
    emoji: '📊',
    position: { top: '46%', left: '4%' },
    iconColor: 'text-emerald-500/35 dark:text-emerald-300/35 hover:text-emerald-500/70',
    glowColor: 'drop-shadow-[0_0_12px_rgba(52,211,153,0.25)]',
    duration: 6.6,
    yOffset: -22,
    xOffset: 6,
    rotateDeg: 18,
    desktopSize: 34,
    mobileSize: 24,
  },
  {
    id: 'chart-3',
    name: 'Grafik Pie',
    category: 'grafik',
    icon: PieChart,
    emoji: '🥧',
    position: { top: '72%', left: '16%' },
    iconColor: 'text-teal-500/35 dark:text-teal-300/35 hover:text-teal-500/70',
    glowColor: 'drop-shadow-[0_0_12px_rgba(45,212,191,0.25)]',
    duration: 7.0,
    yOffset: -16,
    xOffset: 12,
    rotateDeg: -22,
    desktopSize: 32,
    mobileSize: 22,
  },

  // 📏 MISTAR (Ruler / Measure)
  {
    id: 'ruler-1',
    name: 'Mistar Ukur',
    category: 'mistar',
    icon: Ruler,
    emoji: '📏',
    position: { top: '36%', right: '6%' },
    iconColor: 'text-sky-500/40 dark:text-sky-400/40 hover:text-sky-500/70',
    glowColor: 'drop-shadow-[0_0_12px_rgba(14,165,233,0.25)]',
    duration: 6.3,
    yOffset: -22,
    xOffset: -8,
    rotateDeg: 35,
    desktopSize: 40,
    mobileSize: 26,
  },
  {
    id: 'ruler-2',
    name: 'Mistar Segitiga',
    category: 'mistar',
    icon: Ruler,
    emoji: '📐',
    position: { top: '60%', left: '10%' },
    iconColor: 'text-blue-500/35 dark:text-blue-400/35 hover:text-blue-500/70',
    glowColor: 'drop-shadow-[0_0_12px_rgba(59,130,246,0.25)]',
    duration: 5.7,
    yOffset: 18,
    xOffset: 10,
    rotateDeg: -40,
    desktopSize: 34,
    mobileSize: 24,
  },

  // 🧮 AKUNTAN (Accountant / Calculator / Finance)
  {
    id: 'accountant-1',
    name: 'Kalkulator Akuntansi',
    category: 'akuntan',
    icon: Calculator,
    emoji: '🧮',
    position: { top: '32%', left: '6%' },
    iconColor: 'text-cyan-500/40 dark:text-cyan-300/40 hover:text-cyan-500/70',
    glowColor: 'drop-shadow-[0_0_12px_rgba(6,182,212,0.25)]',
    duration: 5.5,
    yOffset: 18,
    xOffset: -12,
    rotateDeg: 14,
    desktopSize: 40,
    mobileSize: 28,
  },
  {
    id: 'accountant-2',
    name: 'Koin Keuangan',
    category: 'akuntan',
    icon: Coins,
    emoji: '💰',
    position: { top: '50%', right: '14%' },
    iconColor: 'text-amber-500/40 dark:text-amber-400/40 hover:text-amber-500/70',
    glowColor: 'drop-shadow-[0_0_12px_rgba(245,158,11,0.25)]',
    duration: 6.1,
    yOffset: -18,
    xOffset: 8,
    rotateDeg: -20,
    desktopSize: 36,
    mobileSize: 24,
  },
  {
    id: 'accountant-3',
    name: 'Struk Transaksi',
    category: 'akuntan',
    icon: Receipt,
    emoji: '🧾',
    position: { top: '74%', right: '22%' },
    iconColor: 'text-emerald-500/35 dark:text-emerald-400/35 hover:text-emerald-500/70',
    glowColor: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.25)]',
    duration: 6.9,
    yOffset: 24,
    xOffset: -10,
    rotateDeg: 16,
    desktopSize: 34,
    mobileSize: 22,
  },
  {
    id: 'accountant-4',
    name: 'Jurnal Akuntansi Excel',
    category: 'akuntan',
    icon: FileSpreadsheet,
    emoji: '📋',
    position: { top: '88%', left: '30%' },
    iconColor: 'text-teal-500/35 dark:text-teal-300/35 hover:text-teal-500/70',
    glowColor: 'drop-shadow-[0_0_12px_rgba(20,184,166,0.25)]',
    duration: 7.5,
    yOffset: -18,
    xOffset: 14,
    rotateDeg: -15,
    desktopSize: 32,
    mobileSize: 22,
  },
  {
    id: 'accountant-5',
    name: 'Neraca Akuntansi',
    category: 'akuntan',
    icon: Scale,
    emoji: '⚖️',
    position: { top: '42%', right: '26%' },
    iconColor: 'text-indigo-500/35 dark:text-indigo-300/35 hover:text-indigo-500/70',
    glowColor: 'drop-shadow-[0_0_12px_rgba(99,102,241,0.25)]',
    duration: 6.4,
    yOffset: 20,
    xOffset: -8,
    rotateDeg: -25,
    desktopSize: 34,
    mobileSize: 24,
  },
  {
    id: 'accountant-6',
    name: 'Dompet',
    category: 'akuntan',
    icon: Wallet,
    emoji: '💳',
    position: { top: '14%', left: '34%' },
    iconColor: 'text-slate-500/30 dark:text-slate-400/30 hover:text-slate-500/60',
    glowColor: 'drop-shadow-[0_0_12px_rgba(148,163,184,0.2)]',
    duration: 8.0,
    yOffset: -14,
    xOffset: 6,
    rotateDeg: 12,
    desktopSize: 32,
    mobileSize: 22,
  },
];

/* ── Floating Dust Particles ── */
const particleList = Array.from({ length: 16 }).map((_, i) => ({
  id: i,
  size: (i % 3) + 2,
  left: `${(i * 17) % 95 + 2}%`,
  top: `${(i * 23) % 90 + 5}%`,
  duration: 4 + (i % 5),
  delay: (i * 0.4) % 3,
  opacity: 0.12 + (i % 4) * 0.06,
}));

export function InteractiveBackground() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Mouse coordinate values
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  // Smooth springs for cursor spotlight movement
  const springConfig = { damping: 30, stiffness: 140, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">

      {/* ── 1. MOUSE FOLLOW SPOTLIGHT / GLOW AURA ────────────────── */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className={`absolute rounded-full bg-gradient-to-tr from-emerald-500/12 via-teal-400/10 to-amber-400/12 dark:from-emerald-500/20 dark:via-cyan-400/15 dark:to-amber-300/15 transition-opacity duration-500 ${isMobile ? 'w-[260px] h-[260px] blur-[60px]' : 'w-[480px] h-[480px] blur-[100px]'
          }`}
      />

      {/* Ambient background soft static glow spots */}
      <div className="absolute top-[10%] left-[8%] w-80 h-80 sm:w-[420px] sm:h-[420px] bg-emerald-500/8 dark:bg-emerald-500/12 rounded-full blur-[110px] sm:blur-[140px]" />
      <div className="absolute top-[45%] right-[5%] w-80 h-80 sm:w-[400px] sm:h-[400px] bg-amber-500/8 dark:bg-amber-400/10 rounded-full blur-[110px] sm:blur-[140px]" />
      <div className="absolute bottom-[10%] left-[20%] w-80 h-80 sm:w-[450px] sm:h-[450px] bg-cyan-500/8 dark:bg-cyan-500/12 rounded-full blur-[110px] sm:blur-[140px]" />

      {/* ── 2. FLOATING SUN DUST PARTICLES ───────────────────────── */}
      {particleList.map((p) => (
        <motion.div
          key={`particle-${p.id}`}
          initial={{ y: 0, opacity: p.opacity }}
          animate={{
            y: [-12, 12, -12],
            x: [-6, 6, -6],
            opacity: [p.opacity, p.opacity * 1.6, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
          className="absolute rounded-full bg-emerald-400/30 dark:bg-teal-300/30 blur-[0.5px]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
        />
      ))}

      {/* ── 3. STANDALONE FLOATING ICONS (In-Place Floating, No Falling, No Big Boxes) ── */}
      {floatingIconsList.map((item, index) => {
        const IconComponent = item.icon;
        const size = isMobile ? item.mobileSize : item.desktopSize;

        // Reduce count on small screens to prevent cluttering
        if (isMobile && index >= 8) return null;

        return (
          <motion.div
            key={item.id}
            initial={{ y: 0, x: 0, rotate: 0, scale: 0.95 }}
            animate={{
              y: [0, isMobile ? item.yOffset * 0.5 : item.yOffset, 0],
              x: [0, isMobile ? item.xOffset * 0.5 : item.xOffset, 0],
              rotate: [0, item.rotateDeg, 0],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
              delay: (index * 0.3) % 2,
            }}
            className="absolute flex items-center gap-1.5 p-2 transition-transform duration-300 hover:scale-125"
            style={{
              ...item.position,
            }}
          >
            <div className={`p-1.5 rounded-xl transition-colors duration-300 ${item.glowColor}`}>
              <IconComponent size={size} className={`${item.iconColor} filter transition-colors duration-300`} />
            </div>

            {/* Subtle Emoticon Accent */}
            <span className="text-xs sm:text-sm leading-none opacity-60">
              {item.emoji}
            </span>
          </motion.div>
        );
      })}

    </div>
  );
}

export default InteractiveBackground;
