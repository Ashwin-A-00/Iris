import React, { useState } from 'react';
import PaletteGenerator from '@/components/palette/PaletteGenerator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import SavedPalettes from '@/components/palette/SavedPalettes';

const Index = () => {
  const [savedOpen, setSavedOpen] = useState(false);
  const [appliedPalette, setAppliedPalette] = useState<string[] | undefined>(undefined);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <header className="w-full pt-8 pb-6">
        <div className="container mx-auto relative">
          <h1 className="text-xl md:text-2xl text-center font-mono font-medium text-[hsl(var(--text-primary))] animate-fade-in">
            Iris
          </h1>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <ThemeToggle />
            <Dialog open={savedOpen} onOpenChange={setSavedOpen}>
              <DialogTrigger asChild>
                <Button aria-label="Open saved palettes" variant="ghost" size="icon" className="rounded-md">
                  <Bookmark />
                </Button>
              </DialogTrigger>
            <DialogContent className="rounded-md border bg-popover/30 supports-[backdrop-filter]:bg-popover/20 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle>Saved Palettes</DialogTitle>
              </DialogHeader>
              <SavedPalettes onApply={(colors) => { setAppliedPalette(colors); setSavedOpen(false); }} />
            </DialogContent>
          </Dialog>
          </div>
        </div>
      </header>

      <main className="w-full px-4 md:px-6 pb-16 md:pb-12">
        <PaletteGenerator appliedPalette={appliedPalette} />
      </main>
    </div>
  );
};

export default Index;
