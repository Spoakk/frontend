"use client";

import { useCommandPalette } from "@/hooks/useCommandPalette";
import CommandPalette from "@/components/ui/CommandPalette";

export function CommandPaletteWrapper() {
  const { isOpen, setIsOpen, recentSearches, addRecentSearch, clearRecentSearches } = useCommandPalette();

  return (
    <CommandPalette
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      recentSearches={recentSearches}
      onAddRecent={addRecentSearch}
      onClearRecent={clearRecentSearches}
    />
  );
}
