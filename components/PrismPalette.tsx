import React, { useState } from 'react';

/**
 * PrismPalette Component
 * 
 * A neumorphic, mobile-responsive UI for color palette generation.
 * 
 * README:
 * To change the color theme, modify the CSS variables in the `colorTokens` object below.
 * The shadows are calculated based on the `--base` and `--background` lightness.
 * Ensure `--light-shadow` is lighter than base, and `--dark-shadow` is darker.
 */

const PrismPalette: React.FC = () => {
  // CSS Variables for the theme
  const colorTokens = {
    '--base': '#e2e8f0',
    '--background': '#e7e9eb',
    '--light-shadow': '#fafafa',
    '--dark-shadow': '#bbc2ca',
    '--highlight': '#edf2f7',
    '--text-primary': '#2d3748',
    '--text-secondary': '#4a5568',
  } as React.CSSProperties;

  // Inline styles for neumorphic shadows
  const styles = {
    raisedLight: {
      boxShadow: '6px 6px 12px var(--dark-shadow), -6px -6px 12px var(--light-shadow)',
      background: 'var(--base)',
    },
    raisedDark: {
      boxShadow: '8px 8px 16px var(--dark-shadow), -8px -8px 16px var(--light-shadow)',
      background: 'var(--text-primary)',
    },
    inset: {
      boxShadow: 'inset 4px 4px 8px var(--dark-shadow), inset -4px -4px 8px var(--light-shadow)',
    },
    card: {
      boxShadow: '10px 10px 20px var(--dark-shadow), -10px -10px 20px var(--light-shadow)',
      background: 'linear-gradient(145deg, #f2f6fa, #dbe0e6)', // Subtle internal gradient
    },
    // "Inset highlight" for light pills as requested
    pillHighlight: {
        borderTop: '1px solid rgba(255,255,255,0.6)',
        borderLeft: '1px solid rgba(255,255,255,0.6)',
    }
  };

  const [colors, setColors] = useState([
    { hex: '#FF6B6B', name: 'Coral Red' },
    { hex: '#4ECDC4', name: 'Turquoise' },
    { hex: '#FFE66D', name: 'Mustard' },
    { hex: '#1A535C', name: 'Deep Sea' },
    { hex: '#FF9F1C', name: 'Tangerine' },
    { hex: '#2B2D42', name: 'Midnight' },
  ]);

  const generateRandom = () => {
    const newColors = colors.map((c) => ({
      ...c,
      hex: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
    }));
    setColors(newColors);
  };

  return (
    <div 
        style={colorTokens} 
        className="min-h-screen w-full flex items-center justify-center bg-gray-200 p-4 font-sans text-[var(--text-primary)]"
    >
      {/* Mobile Container */}
      <div className="w-full max-w-[420px] bg-[var(--background)] sm:rounded-[40px] sm:border-[12px] sm:border-gray-800 overflow-hidden relative flex flex-col p-8 shadow-2xl min-h-[800px] h-full sm:h-auto">
        
        {/* Header */}
        <header className="mb-8 mt-2">
          <div className="flex justify-between items-start">
            <div>
                <h1 className="text-4xl font-black tracking-tight mb-1">Prism</h1>
                <p className="text-[var(--text-secondary)] font-medium text-sm tracking-wide opacity-80">
                    UI Color Generator
                </p>
            </div>
            {/* Simple Menu Icon SVG */}
            <button className="p-2 opacity-60 hover:opacity-100 transition-opacity">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </header>

        {/* Controls */}
        <div className="flex flex-col gap-5 mb-10">
          {/* Light Pill Button */}
          <button
            aria-label="Pick a specific color"
            className="group h-16 rounded-full w-full flex items-center justify-between px-6 transition-all active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-secondary)]"
            style={{ ...styles.raisedLight, ...styles.pillHighlight }}
          >
            <span className="font-bold text-[var(--text-primary)] ml-2">Pick Color</span>
            <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-400 to-cyan-300 shadow-inner flex items-center justify-center">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            </span>
          </button>

          {/* Dark Pill Button */}
          <button
            onClick={generateRandom}
            aria-label="Generate random palette"
            className="h-16 rounded-full w-full flex items-center justify-center text-[var(--background)] font-bold text-lg transition-transform active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            style={styles.raisedDark}
          >
            <span className="flex items-center gap-2 tracking-wide">
              Generate Random
            </span>
          </button>
        </div>

        {/* Display Card */}
        <div 
            className="flex-grow w-full rounded-3xl p-6 mb-4 relative"
            style={styles.card}
        >
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                {colors.map((color, idx) => (
                    <div key={idx} className="flex flex-col items-center group cursor-pointer">
                        {/* Chip */}
                        <div 
                            className="w-full aspect-[1/1] rounded-2xl mb-3 border-[3px] border-[var(--base)] transition-transform group-hover:scale-105 relative overflow-hidden"
                            style={{ backgroundColor: color.hex, ...styles.inset }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                        </div>
                        {/* Labels */}
                        <div className="text-center w-full">
                            <p className="text-xs font-bold text-[var(--text-primary)] opacity-90 truncate w-full">{color.name}</p>
                            <p className="text-[10px] font-mono text-[var(--text-secondary)] opacity-70 uppercase tracking-widest mt-0.5">{color.hex}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-4 text-center">
             <p className="text-[10px] text-[var(--text-secondary)] font-bold tracking-[0.2em] opacity-40 uppercase">
                Prism v2.0 • Design System
             </p>
             <div className="w-32 h-1.5 bg-[var(--text-primary)] rounded-full mx-auto mt-6 opacity-10"></div>
        </footer>

      </div>
    </div>
  );
};

export default PrismPalette;
