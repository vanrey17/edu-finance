'use client';

import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  endValue: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function AnimatedCounter({
  endValue,
  prefix = 'Rp ',
  suffix = '',
  className = '',
}: AnimatedCounterProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setCurrent(0);
    if (endValue === 0) return;

    const duration = 800; // ms
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = endValue / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      if (step >= steps) {
        setCurrent(endValue);
        clearInterval(interval);
      } else {
        setCurrent(Math.round(increment * step));
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [endValue]);

  return (
    <span className={className}>
      {prefix}
      {current.toLocaleString('id-ID')}
      {suffix}
    </span>
  );
}
