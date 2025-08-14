import React from "react";

interface PreviewPaneProps {
  colors: string[];
  mode?: 'light' | 'dark';
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ colors, mode = 'light' }) => {
  const primary = colors[1] || "#FF6F61";
  const secondary = colors[2] || "#A0AEC0";
  const accent = colors[3] || "#E2F0FB";
  const background = colors[0] || "#FDE2E4";
  
  const isDark = mode === 'dark';

  return (
    <aside className="w-full h-full animate-slide-in-right">
      <div className="rounded border bg-card/20 supports-[backdrop-filter]:bg-card/10 backdrop-blur-xl p-8 h-full transition-all duration-300 space-y-6">
        
        {/* Header Section */}
        <div 
          className="rounded border p-6 transition-all duration-300 relative overflow-hidden"
          style={{ 
            background: isDark 
              ? `linear-gradient(135deg, #111 0%, #1f1f1f 50%, #2a2a2a 100%)`
              : `linear-gradient(135deg, ${background} 0%, ${colors[4] || '#E2F0FB'} 100%)`,
            borderColor: primary + '20'
          }}
        >
          <div className="relative z-10">
            <h2 className="text-lg font-mono font-medium mb-1" style={{ color: isDark ? '#f5f5f5' : '#1a1a1a' }}>
              interface preview
            </h2>
            <p className="text-sm font-mono opacity-70" style={{ color: isDark ? '#e5e5e5' : '#4a4a4a' }}>
              your palette in action
            </p>
          </div>
        </div>

        {/* Interactive Elements */}
        <div className="space-y-4">
          <button
            className="w-full h-12 rounded border font-mono text-sm font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            style={{ 
              backgroundColor: primary,
              color: isDark ? '#ffffff' : '#000000',
              borderColor: primary
            }}
          >
            primary.action()
          </button>

          <button
            className="w-full h-10 rounded border font-mono text-sm transition-all duration-300 hover:scale-[1.01]"
            style={{ 
              backgroundColor: 'transparent',
              color: isDark ? '#f5f5f5' : '#1a1a1a',
              borderColor: secondary
            }}
          >
            secondary.btn
          </button>
        </div>

        {/* Card Component */}
        <div 
          className="rounded border p-6 transition-all duration-300"
          style={{ 
            backgroundColor: isDark ? '#ffffff08' : '#ffffff60',
            borderColor: accent + '40'
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-mono text-sm font-medium" style={{ color: isDark ? '#f5f5f5' : '#1a1a1a' }}>
              component.card
            </h3>
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: accent }}
            />
          </div>
          <p className="text-xs font-mono opacity-60 leading-relaxed" style={{ color: isDark ? '#d1d5db' : '#6a6a6a' }}>
            your color.palette determines the visual hierarchy and mood of every interface element
          </p>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-3 gap-3">
          {colors.slice(0, 3).map((color, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full border"
                style={{ backgroundColor: color, borderColor: color + '60' }}
              />
              <span className="text-xs font-mono opacity-50" style={{ color: isDark ? '#d1d5db' : '#6a6a6a' }}>
                {['pri', 'sec', 'acc'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default PreviewPane;
