import type { ReactNode } from "react";

export interface ModalProps {
  isOpen: boolean;
  closeOnOverlay?: boolean;
  className?: string;
  children: ReactNode;
  onClose: () => void;
}
