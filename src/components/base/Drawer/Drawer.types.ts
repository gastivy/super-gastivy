import type React from "react";

export interface DrawerProps {
  isOpen: boolean;
  isFullHeight?: boolean;
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
}
