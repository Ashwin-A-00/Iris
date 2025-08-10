import React, { useEffect, useRef, useState } from "react";

interface SwatchCardProps {
  color: string; // hex
  index: number;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDrop: (from: number, to: number) => void;
  animState?: 'idle' | 'out' | 'in';
}

const hexToRgb = (hex: string) => {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

const SwatchCard: React.FC<SwatchCardProps> = ({ color, index, onDragStart, onDragEnter, onDrop, animState = 'idle' }) => {
  const [copied, setCopied] = useState<null | 'hex' | 'rgb'>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); }, []);

  const { r, g, b } = hexToRgb(color);
  const rgbString = `rgb(${r}, ${g}, ${b})`;

  const handleCopy = (text: string, which: 'hex' | 'rgb') => {
    navigator.clipboard.writeText(text);
    setCopied(which);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(null), 1500);
  };

  const animClass = animState === 'out' ? 'animate-fade-out' : animState === 'in' ? 'animate-fade-in' : '';

  return (
    <div
      className={`swatch-card flex flex-col items-center p-4 select-none ${animClass}`}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnter={(e) => { e.preventDefault(); onDragEnter(index); }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(-1, index)}
      role="listitem"
      aria-label={`Color swatch ${color}`}
    >
      <div className="w-full rounded-xl h-[220px] md:h-[380px]" style={{ backgroundColor: color }} />

      <div className="mt-4 w-full text-center relative">
        <div className="flex flex-col items-center gap-2">
          <span className="code-clickable" onClick={() => handleCopy(color.toUpperCase(), 'hex')}>
            {color.toUpperCase()}
          </span>
          <span className="code-clickable" onClick={() => handleCopy(rgbString, 'rgb')}>
            {rgbString}
          </span>
        </div>

        {copied && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 tooltip-bubble animate-[fade-in_0.2s_ease-out,fade-out_0.3s_ease-out_1.2s_forwards]">
            Copied!
          </div>
        )}
      </div>
    </div>
  );
};

export default SwatchCard;
