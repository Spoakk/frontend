export interface SearchItem {
  id: string;
  title: string;
  description?: string;
  href: string;
  category: "tool" | "page" | "doc";
  keywords?: string[];
  icon?: React.ReactNode;
}

export function fuzzySearch(items: SearchItem[], query: string): SearchItem[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const queryChars = lowerQuery.split("");

  const scored = items
    .map((item) => {
      const titleLower = item.title.toLowerCase();
      const descLower = item.description?.toLowerCase() || "";
      const keywordsLower = item.keywords?.join(" ").toLowerCase() || "";
      const combined = `${titleLower} ${descLower} ${keywordsLower}`;

      if (titleLower.includes(lowerQuery)) {
        return { item, score: 100 };
      }

      if (combined.includes(lowerQuery)) {
        return { item, score: 80 };
      }

      let score = 0;
      let lastIndex = -1;
      let consecutiveMatches = 0;

      for (const char of queryChars) {
        const index = combined.indexOf(char, lastIndex + 1);
        if (index === -1) return null;

        if (index === lastIndex + 1) {
          consecutiveMatches++;
          score += 5 + consecutiveMatches;
        } else {
          consecutiveMatches = 0;
          score += 1;
        }

        lastIndex = index;
      }

      if (titleLower.startsWith(lowerQuery[0])) {
        score += 20;
      }

      return { item, score };
    })
    .filter((result): result is { item: SearchItem; score: number } => result !== null)
    .sort((a, b) => b.score - a.score);

  return scored.map((s) => s.item);
}
