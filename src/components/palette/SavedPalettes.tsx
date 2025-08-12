import React, { useEffect, useState } from "react";

interface SavedPalettesProps {
  onApply: (colors: string[]) => void;
}

interface SavedEntry { id: string; colors: string[]; createdAt: number }

const SavedPalettes: React.FC<SavedPalettesProps> = ({ onApply }) => {
  const [items, setItems] = useState<SavedEntry[]>([]);

  useEffect(() => {
    const key = 'savedPalettes';
    const existing = JSON.parse(localStorage.getItem(key) || '[]') as SavedEntry[];
    setItems(existing);
  }, []);

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <svg width="120" height="80" viewBox="0 0 120 80" className="mb-4 opacity-70">
          <defs>
            <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--gradient-start))" />
              <stop offset="100%" stopColor="hsl(var(--gradient-end))" />
            </linearGradient>
          </defs>
          <rect x="10" y="20" width="20" height="40" rx="6" fill="url(#g)" />
          <rect x="36" y="12" width="20" height="56" rx="6" fill="url(#g)" opacity="0.8" />
          <rect x="62" y="26" width="20" height="42" rx="6" fill="url(#g)" opacity="0.6" />
          <rect x="88" y="18" width="20" height="50" rx="6" fill="url(#g)" opacity="0.7" />
        </svg>
        <p className="text-sm text-muted-foreground">No saved palettes yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {items.map((p) => (
        <button
          key={p.id}
          onClick={() => onApply(p.colors)}
          className="p-3 rounded-md text-left transition-transform duration-150 active:scale-95 border bg-card/40 supports-[backdrop-filter]:bg-card/30 backdrop-blur hover:outline outline-1 outline-ring/30"
        >
          <div className="grid grid-cols-5 gap-1 mb-2">
            {p.colors.map((c, i) => (
              <div key={i} className="h-8 rounded-sm" style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {p.colors[0]?.toUpperCase()}
          </div>
        </button>
      ))}
    </div>
  );
};

export default SavedPalettes;
