import React from "react";

interface PreviewPaneProps {
  colors: string[];
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ colors }) => {

  return (
    <aside className="w-full h-full animate-fade-in">
      <div className="rounded-lg border bg-card/5 supports-[backdrop-filter]:bg-card/3 backdrop-blur-xl p-4 h-full transition-all duration-500 space-y-4">
        
        {/* Color Palette Display */}
        <div className="space-y-2">
          <h2 className="text-sm font-mono font-medium text-[hsl(var(--text-primary))]" style={{ opacity: 1, fontWeight: '600' }}>
            Palette.preview
          </h2>
          <div className="grid grid-cols-5 gap-2 h-12">
            {colors.map((color, i) => (
              <div 
                key={i}
                className="rounded-lg border border-white/10 relative overflow-hidden group transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: color }}
              >
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-xs font-mono text-white/90 font-medium">
                    {i + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modern Interface Preview */}
        <div 
          className="rounded-lg border p-4 transition-all duration-500 relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${colors[0]}15 0%, ${colors[4] || colors[0]}10 100%)`,
            borderColor: colors[1] + '20'
          }}
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-medium text-[hsl(var(--text-primary))]" style={{ fontWeight: '600' }}>
                ui.component
              </h3>
              <div className="flex items-center gap-1">
                {colors.slice(0, 3).map((color, i) => (
                  <div 
                    key={i}
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Primary Action */}
            <button
              className="w-full h-8 rounded-lg font-mono text-xs font-medium transition-all duration-300 hover:scale-[1.02] border"
              style={{ 
                backgroundColor: colors[1],
                color: '#ffffff',
                borderColor: colors[1]
              }}
            >
              execute({colors[1]?.slice(1, 4)})
            </button>

            {/* Secondary Elements */}
            <div className="grid grid-cols-2 gap-2">
              <div 
                className="h-6 rounded-lg border flex items-center justify-center transition-all duration-300 hover:scale-[1.01]"
                style={{ 
                  backgroundColor: colors[2] + '20',
                  borderColor: colors[2] + '40'
                }}
              >
                <span className="text-xs font-mono font-semibold text-[hsl(var(--text-primary))]" style={{ fontWeight: '600' }}>
                  {colors[2]?.slice(1, 4)}
                </span>
              </div>
              <div 
                className="h-6 rounded-lg border flex items-center justify-center transition-all duration-300 hover:scale-[1.01]"
                style={{ 
                  backgroundColor: colors[3] + '20',
                  borderColor: colors[3] + '40'
                }}
              >
                <span className="text-xs font-mono font-semibold text-[hsl(var(--text-primary))]" style={{ fontWeight: '600' }}>
                  {colors[3]?.slice(1, 4)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Color Code Display */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono text-[hsl(var(--text-primary))]" style={{ opacity: 1, fontWeight: '600' }}>
            hex.values
          </h4>
          <div className="grid grid-cols-1 gap-1">
            {colors.slice(0, 3).map((color, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded border border-white/5">
                <div 
                  className="w-4 h-4 rounded border border-white/20"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs font-mono text-[hsl(var(--text-primary))]" style={{ opacity: 1, fontWeight: '600' }}>
                  {color.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Indicator */}
        <div 
          className="rounded-lg p-4 border"
          style={{ 
            backgroundColor: colors[4] + '10',
            borderColor: colors[4] + '30'
          }}
        >
          <p className="text-xs font-mono leading-relaxed text-[hsl(var(--text-primary))]" style={{ opacity: 1, fontWeight: '600' }}>
            live.rendering your palette across interface elements with real-time color.mapping
          </p>
        </div>
      </div>
    </aside>
  );
};

export default PreviewPane;
