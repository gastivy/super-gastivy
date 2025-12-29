import type { ReactNode } from "react";

export interface InfiniteScrollProps {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  children: ReactNode;
  className?: string;
  onNextPage: () => void;
}
