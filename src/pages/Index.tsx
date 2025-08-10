import React, { useState } from 'react';
import PaletteGenerator from '@/components/palette/PaletteGenerator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import SavedPalettes from '@/components/palette/SavedPalettes';

const Index = () => {
  const [savedOpen, setSavedOpen] = useState(false);
  const [appliedPalette, setAppliedPalette] = useState<string[] | undefined>(undefined);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <header className="w-full pt-16 pb-10">
        <div className="container mx-auto relative">
          <h1 className="text-4xl md:text-5xl text-center font-heading font-bold text-[hsl(var(--text-primary))] animate-fade-in">
            Color Palette Generator
          </h1>
          <Dialog open={savedOpen} onOpenChange={setSavedOpen}>
            <DialogTrigger asChild>
              <Button aria-label="Open saved palettes" variant="outline" size="icon" className="rounded-full absolute right-4 top-1/2 -translate-y-1/2">
                <Bookmark />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Saved Palettes</DialogTitle>
              </DialogHeader>
              <SavedPalettes onApply={(colors) => { setAppliedPalette(colors); setSavedOpen(false); }} />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="w-full px-4 md:px-8 pb-28 md:pb-16">
        <PaletteGenerator appliedPalette={appliedPalette} />
      </main>
    </div>
  );
};

export default Index;
