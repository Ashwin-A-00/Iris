import React from 'react';
import PaletteGenerator from '@/components/palette/PaletteGenerator';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <header className="w-full pt-16 pb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-[hsl(var(--text-primary))] animate-fade-in">
          Color Palette Generator
        </h1>
      </header>

      <main className="w-full px-4 md:px-8 pb-28 md:pb-16">
        <PaletteGenerator />
      </main>
    </div>
  );
};

export default Index;
