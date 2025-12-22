import type { CSSProperties } from "react";

export interface EmptyStateProps {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  src: string;
  title?: string;
  description?: string;
  className?: string;
}
