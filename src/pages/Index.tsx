import React from 'react';
import PaletteGenerator from '@/components/palette/PaletteGenerator';

const Index = () => {

  return (
    <div className="min-h-screen flex flex-col items-center">
      <header className="w-full pt-16 pb-10">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl text-center font-mono font-medium text-[hsl(var(--text-primary))] animate-fade-in">
            palette.generator
          </h1>
        </div>
      </header>

      <main className="w-full px-4 md:px-8 pb-16">
        <PaletteGenerator />
      </main>
    </div>
  );
};

export default Index;
