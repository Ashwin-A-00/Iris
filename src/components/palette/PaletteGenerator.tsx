import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SwatchCard from "./SwatchCard";
import { Button } from "@/components/ui/button";
import PreviewPane from "./PreviewPane";
import { toPng } from "html-to-image";

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
  const [preview, setPreview] = useState(false);
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
      window.setTimeout(() => setAnimState('idle'), 500);
    }, 250);
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

  const exportPng = async () => {
    const node = paletteRef.current;
    if (!node) return;
    const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2, backgroundColor: 'white' });
    const link = document.createElement('a');
    link.download = 'palette.png';
    link.href = dataUrl;
    link.click();
  };

  const gridClass = preview ? 'grid-cols-1 lg:grid-cols-2 gap-8' : 'grid-cols-1';

  return (
    <section className="w-full">
      <div className={`grid ${gridClass} items-start`}>
        <div>
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
                />)
              )}
            </div>
          </div>

          <div className="mt-8 hidden md:flex items-center justify-center gap-3">
            <Button variant="cta" size="xl" onClick={generate} aria-label="Generate Palette">
              Generate Palette
            </Button>
            <Button variant="secondary" size="lg" className="rounded-full" onClick={() => setPreview(p => !p)} aria-label="Toggle Preview">
              {preview ? 'Hide Preview' : 'Preview'}
            </Button>
            <Button variant="outline" size="lg" className="rounded-full" onClick={exportPng} aria-label="Export as PNG">
              Export PNG
            </Button>
          </div>
        </div>

        {preview && (
          <div className="hidden lg:block h-full">
            <PreviewPane colors={colors} />
          </div>
        )}
      </div>

      {/* Mobile sticky bar */}
      <div className="md:hidden fixed inset-x-0 bottom-0 p-4">
        <div className="mx-auto max-w-3xl rounded-full backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/80 border shadow-card flex items-center gap-2 p-2">
          <Button variant="cta" size="xl" onClick={generate} className="flex-1" aria-label="Generate Palette">
            Generate
          </Button>
          <Button variant="secondary" size="lg" className="rounded-full flex-1" onClick={() => setPreview(p => !p)} aria-label="Toggle Preview">
            {preview ? 'Hide' : 'Preview'}
          </Button>
          <Button variant="outline" size="lg" className="rounded-full" onClick={exportPng} aria-label="Export as PNG">
            PNG
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PaletteGenerator;
