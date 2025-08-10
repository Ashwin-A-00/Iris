import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SwatchCard from "./SwatchCard";
import { Button } from "@/components/ui/button";
import PreviewPane from "./PreviewPane";
import { toPng } from "html-to-image";
import { toast } from "@/components/ui/use-toast";
import { Sun, Moon } from "lucide-react";

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

const hexToHsl = (hex: string) => {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
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

type Harmony = 'random' | 'analogous' | 'complementary' | 'triadic' | 'monochromatic';

interface PaletteGeneratorProps { appliedPalette?: string[] }

const PaletteGenerator: React.FC<PaletteGeneratorProps> = ({ appliedPalette }) => {
  const [colors, setColors] = useState<string[]>(() => randomPastelPalette());
  const [animState, setAnimState] = useState<'idle' | 'out' | 'in'>('in');
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [preview, setPreview] = useState(false);
  const [previewDark, setPreviewDark] = useState(false);
  const [locked, setLocked] = useState<boolean[]>([false, false, false, false, false]);
  const [harmony, setHarmony] = useState<Harmony>('random');
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); generate(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [harmony, locked, colors]);

  useEffect(() => {
    if (appliedPalette && appliedPalette.length === 5) {
      setAnimState('out');
      window.setTimeout(() => {
        setColors(appliedPalette);
        setLocked([false, false, false, false, false]);
        setAnimState('in');
        window.setTimeout(() => setAnimState('idle'), 200);
      }, 200);
    }
  }, [appliedPalette]);

  const generateByHarmony = useCallback((rule: Harmony, baseHue?: number): string[] => {
    const base = baseHue ?? hexToHsl(colors.find((_, i) => !locked[i]) ?? colors[0]).h;
    const sat = 68; // pastel
    const light = 82;
    const offsets: number[] = (() => {
      switch (rule) {
        case 'analogous': return [-30, -15, 0, 15, 30];
        case 'complementary': return [0, 180, -20, 160, 200];
        case 'triadic': return [0, 120, 240, 30, 210];
        case 'monochromatic': return [0, 0, 0, 0, 0];
        default: return [0, 25, 50, 200, 310];
      }
    })();

    return offsets.map((off, i) => {
      if (rule === 'monochromatic') {
        const l = [86, 82, 78, 84, 80][i] ?? light;
        return hslToHex(base, sat, l);
      }
      const h = (base + off + 360) % 360;
      const l = [86, 82, 78, 84, 80][i] ?? light;
      return hslToHex(h, sat, l);
    });
  }, [colors, locked]);

  const generate = useCallback((overrideRule?: Harmony) => {
    const rule = overrideRule ?? harmony;
    setAnimState('out');
    window.setTimeout(() => {
      const fresh = rule === 'random' ? randomPastelPalette() : generateByHarmony(rule);
      setColors(prev => prev.map((c, i) => (locked[i] ? c : fresh[i])));
      setAnimState('in');
      window.setTimeout(() => setAnimState('idle'), 500);
    }, 250);
  }, [harmony, locked, generateByHarmony]);

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
    setLocked(prev => {
      const next = [...prev];
      const [moved] = next.splice(dragFrom, 1);
      next.splice(to, 0, moved);
      return next;
    })
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

  const toggleLock = (index: number) => setLocked(prev => prev.map((v, i) => i === index ? !v : v));

  const savePalette = () => {
    const key = 'savedPalettes';
    const existing = JSON.parse(localStorage.getItem(key) || '[]') as { id: string, colors: string[], createdAt: number }[];
    const entry = { id: Date.now().toString(), colors, createdAt: Date.now() };
    const next = [entry, ...existing].slice(0, 60);
    localStorage.setItem(key, JSON.stringify(next));
    const t = toast({ title: 'Palette saved!' });
    window.setTimeout(() => t.dismiss(), 2000);
  };

  const gridClass = preview ? 'grid-cols-1 lg:grid-cols-2 gap-8' : 'grid-cols-1';

  const harmonyOptions: { key: Harmony, label: string }[] = [
    { key: 'analogous', label: 'Analogous' },
    { key: 'complementary', label: 'Complementary' },
    { key: 'triadic', label: 'Triadic' },
    { key: 'monochromatic', label: 'Monochromatic' },
  ];

  return (
    <section className="w-full">
      <div className={`grid ${gridClass} items-start`}>
        <div>
          <div className="mx-auto max-w-6xl">
            {/* Harmony selector */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {harmonyOptions.map((opt) => (
                <Button
                  key={opt.key}
                  variant={harmony === opt.key ? 'secondary' : 'outline'}
                  size="sm"
                  className={harmony === opt.key ? 'rounded-full bg-secondary/70' : 'rounded-full'}
                  onClick={() => { setHarmony(opt.key); generate(opt.key); }}
                  aria-label={`${opt.label} harmony`}
                >
                  {opt.label}
                </Button>
              ))}
            </div>

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
                  locked={locked[i]}
                  onToggleLock={toggleLock}
                  animationDelay={i * 50}
                />)
              )}
            </div>
          </div>

          <div className="mt-8 hidden md:flex items-center justify-center gap-3">
            <Button variant="cta" size="xl" onClick={() => generate()} aria-label="Generate Palette">
              Generate Palette
            </Button>
            <Button variant="secondary" size="lg" className="rounded-full" onClick={() => setPreview(p => !p)} aria-label="Toggle Preview">
              {preview ? 'Hide Preview' : 'Preview'}
            </Button>
            {preview && (
              <Button variant="outline" size="lg" className="rounded-full" onClick={() => setPreviewDark(d => !d)} aria-label="Toggle preview mode">
                {previewDark ? <Sun size={18} /> : <Moon size={18} />} {previewDark ? 'Light' : 'Dark'}
              </Button>
            )}
            <Button variant="outline" size="lg" className="rounded-full" onClick={exportPng} aria-label="Export as PNG">
              Export PNG
            </Button>
            <Button variant="secondary" size="lg" className="rounded-full" onClick={savePalette} aria-label="Save palette">
              Save
            </Button>
          </div>
        </div>

        {preview && (
          <div className="hidden lg:block h-full">
            <PreviewPane colors={colors} mode={previewDark ? 'dark' : 'light'} />
          </div>
        )}
      </div>

      {/* Mobile sticky bar */}
      <div className="md:hidden fixed inset-x-0 bottom-0 p-4">
        <div className="mx-auto max-w-3xl rounded-full backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/80 border shadow-card flex items-center gap-2 p-2">
          <Button variant="cta" size="xl" onClick={() => generate()} className="flex-1" aria-label="Generate Palette">
            Generate
          </Button>
          <Button variant="secondary" size="lg" className="rounded-full flex-1" onClick={() => setPreview(p => !p)} aria-label="Toggle Preview">
            {preview ? 'Hide' : 'Preview'}
          </Button>
          <Button variant="outline" size="lg" className="rounded-full" onClick={exportPng} aria-label="Export as PNG">
            PNG
          </Button>
          <Button variant="outline" size="lg" className="rounded-full" onClick={savePalette} aria-label="Save palette">
            Save
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PaletteGenerator;
