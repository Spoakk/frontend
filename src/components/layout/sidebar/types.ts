export type ToolItem = {
  key: string;
  href: string;
  icon: React.ReactNode;
};

export type FavToggleFn = (key: string, e: React.MouseEvent) => void;
