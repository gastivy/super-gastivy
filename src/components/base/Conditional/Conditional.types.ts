import type { PropsWithChildren, ReactNode } from "react";

export interface ConditionalProps extends PropsWithChildren {
  if: boolean;
  reject?: ReactNode;
}
