import React, { useEffect, useMemo, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Lock, Unlock } from "lucide-react";

interface SwatchCardProps {
  color: string; // hex
  index: number;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDrop: (from: number, to: number) => void;
  animState?: 'idle' | 'out' | 'in';
  locked: boolean;
  onToggleLock: (index: number) => void;
  animationDelay?: number; // ms for stagger
}

const hexToRgb = (hex: string) => {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

const SwatchCard: React.FC<SwatchCardProps> = ({
  color,
  index,
  onDragStart,
  onDragEnter,
  onDrop,
  animState = 'idle',
  locked,
  onToggleLock,
  animationDelay,
}) => {
  const [copied, setCopied] = useState<null | 'hex' | 'rgb'>(null);
  const [dragging, setDragging] = useState(false);
  const [rippleKey, setRippleKey] = useState(0);
  const [lockAnimKey, setLockAnimKey] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); }, []);

  const { r, g, b } = hexToRgb(color);
  const rgbString = `rgb(${r}, ${g}, ${b})`;

  const playPop = useMemo(() => {
    return () => {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const o = ctx.createOscillator();
        const gNode = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(880, ctx.currentTime);
        gNode.gain.setValueAtTime(0.0001, ctx.currentTime);
        gNode.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
        gNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
        o.connect(gNode);
        gNode.connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 0.09);
      } catch {}
    }
  }, []);

  const handleCopy = (text: string, which: 'hex' | 'rgb') => {
    navigator.clipboard.writeText(text);
    setCopied(which);
    playPop();
    setRippleKey(Date.now());
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(null), 1500);
  };

  const handleToggleLock = () => {
    setLockAnimKey(Date.now());
    onToggleLock(index);
  };

  const animClass = animState === 'out' ? 'animate-fade-out' : animState === 'in' ? 'animate-fade-in' : '';

  return (
    <div
      className={`swatch-card flex flex-col items-center p-3 select-none ${dragging ? 'scale-[1.02] shadow-card-hover' : ''} ${animClass}`}
      style={animState === 'in' && animationDelay ? { animationDelay: `${animationDelay}ms` } : undefined}
      draggable
      onDragStart={() => { setDragging(true); onDragStart(index); }}
      onDragEnter={(e) => { e.preventDefault(); onDragEnter(index); }}
      onDragOver={(e) => e.preventDefault()}
      onDragEnd={() => setDragging(false)}
      onDrop={() => { setDragging(false); onDrop(-1, index); }}
      role="listitem"
      aria-label={`Color swatch ${color}`}
    >
      <div className="w-full rounded-md h-[220px] md:h-[380px] relative overflow-hidden" style={{ backgroundColor: color }}>
        {/* Lock toggle */}
        <div className="absolute top-2 right-2">
          <div className="relative group">
            <button
              aria-label={locked ? 'Unlock this color' : 'Lock this color'}
              onClick={handleToggleLock}
              className="rounded-full p-2 bg-popover/60 supports-[backdrop-filter]:bg-popover/40 backdrop-blur border border-border/60 hover:shadow-md transition-all duration-200 active:scale-95 hover:-translate-y-0.5"
            >
              {locked ? (
                <Lock className={`text-[hsl(var(--text-primary))] ${lockAnimKey ? 'lock-anim' : ''}`} size={16} />
              ) : (
                <Unlock className={`text-[hsl(var(--text-primary))] ${lockAnimKey ? 'lock-anim' : ''}`} size={16} />
              )}
            </button>
            <div className="floating-tooltip -bottom-8 left-1/2 -translate-x-1/2 group-hover:opacity-100 group-hover:translate-y-0">
              {locked ? 'unlock' : 'lock'}
            </div>
          </div>
        </div>

        {/* Ripple on copy */}
        {rippleKey !== 0 && (
          <span key={rippleKey} className="pointer-events-none absolute inset-0">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] rounded-full bg-foreground/20 ripple-anim" />
          </span>
        )}
      </div>

      <div className="mt-4 w-full text-center relative">
        <div className="flex flex-col items-center gap-0.5">
          <span className="code-clickable font-mono text-sm" onClick={() => handleCopy(color.toUpperCase(), 'hex')}>
            {color.toUpperCase()}
          </span>
          <span className="code-clickable font-mono text-xs opacity-60" onClick={() => handleCopy(rgbString, 'rgb')}>
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
