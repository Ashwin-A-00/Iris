import React, { useCallback, useEffect, useRef, useState } from "react";
import SwatchCard from "./SwatchCard";

const hslToHex = (h: number, s: number, l: number) => {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  const to255 = (n: number) => Math.round((n + m) * 255);
  const rr = to255(r), gg = to255(g), bb = to255(b);
  return `#${[rr, gg, bb].map(v => v.toString(16).padStart(2, '0')).join('')}`;
};

const randomPastelPalette = (): string[] => {
  const base = Math.floor(Math.random() * 360);
  const offsets = [0, 25, 50, 200, 310];
  return offsets.map((off, i) => {
    const h = (base + off) % 360;
    const s = 65 + (i % 2) * 5;  // 65–70
    const l = 85 - (i % 3) * 3;  // 85, 82, 79
    return hslToHex(h, s, l);
  });
};

const PaletteGenerator: React.FC = () => {
  const [colors, setColors] = useState<string[]>(() => randomPastelPalette());
  const [animState, setAnimState] = useState<'idle' | 'out' | 'in'>('in');
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); generate(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const generate = useCallback(() => {
    setAnimState('out');
    window.setTimeout(() => {
      setColors(randomPastelPalette());
      setAnimState('in');
      window.setTimeout(() => setAnimState('idle'), 300);
    }, 150);
  }, []);

  const onDragStart = (index: number) => setDragFrom(index);
  const onDragEnter = (index: number) => {
    if (dragFrom === null || dragFrom === index) return;
  };
  const onDrop = (_: number, to: number) => {
    if (dragFrom === null || dragFrom === to) return;
    setColors(prev => {
      const next = [...prev];
      const [moved] = next.splice(dragFrom, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDragFrom(null);
  };

  return (
    <section className="w-full">
      <div className="mx-auto max-w-6xl">
        <div ref={paletteRef} className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6" role="list" aria-label="Color palette">
          {colors.map((c, i) => (
            <SwatchCard
              key={`${c}-${i}`}
              color={c}
              index={i}
              onDragStart={onDragStart}
              onDragEnter={onDragEnter}
              onDrop={onDrop}
              animState={animState}
              locked={false}
              onToggleLock={() => {}}
              animationDelay={i * 50}
            />)
          )}
        </div>
      </div>
    </section>
  );
};

export default PaletteGenerator;