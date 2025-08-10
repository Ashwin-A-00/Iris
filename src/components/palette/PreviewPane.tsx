import React from "react";

interface PreviewPaneProps {
  colors: string[];
  mode?: 'light' | 'dark';
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ colors, mode = 'light' }) => {
  const primary = colors[1] || "#FF6F61";
  const bgLight = `linear-gradient(180deg, ${colors[0] || '#FDE2E4'} 0%, ${colors[4] || '#E2F0FB'} 100%)`;
  const bgDark = 'linear-gradient(180deg, #111 0%, #1f1f1f 100%)';
  const muted = colors[3] || "#A0AEC0";

  const isDark = mode === 'dark';

  return (
    <aside className="w-full h-full p-6 animate-slide-in-right">
      <div className="swatch-card p-6 h-full transition-colors duration-300" style={{ background: isDark ? '#0b0b0b' : 'hsl(var(--card))' }}>
        <div
          className="rounded-xl p-8 mb-6 transition-all duration-300"
          style={{ background: isDark ? bgDark : bgLight }}
        >
          <h2 className="text-2xl font-heading font-bold mb-2" style={{ color: isDark ? '#f5f5f5' : 'hsl(var(--text-primary))' }}>
            UI Preview
          </h2>
          <p className="text-base" style={{ color: isDark ? '#e5e5e5' : 'hsl(var(--text-primary))' }}>
            See how your palette feels on a simple interface.
          </p>
        </div>

        <div className="space-y-4">
          <button
            className="w-full h-12 rounded-full text-white font-semibold shadow-brand transition-transform duration-200 hover:-translate-y-0.5"
            style={{ backgroundColor: primary }}
          >
            Primary Action
          </button>

          <div className="rounded-xl p-6 border transition-colors duration-300" style={{ backgroundColor: isDark ? '#ffffff10' : '#ffffffa6' }}>
            <h3 className="font-heading font-semibold mb-2" style={{ color: isDark ? '#f5f5f5' : 'hsl(var(--text-primary))' }}>Card Title</h3>
            <p className="text-sm" style={{ color: isDark ? '#d1d5db' : muted }}>
              This card uses your palette for accents and backgrounds. Adjust the colors to explore different moods.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default PreviewPane;
