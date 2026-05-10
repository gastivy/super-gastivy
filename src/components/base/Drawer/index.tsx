import React, { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

import useClickOutside from "@hooks/useClickOutside";
import { cn } from "@libs/classnames";

import type { DrawerProps } from "./Drawer.types";

const Drawer: React.FC<DrawerProps> = ({
  children,
  isOpen,
  isFullHeight = false,
  className,
  onClose,
}) => {
  const handleClose = useCallback(() => onClose(), []);
  const drawerRef = useClickOutside(handleClose);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.removeProperty("overflow-y");
    }

    return () => {
      document.body.style.removeProperty("overflow-y");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bottom-0 z-10">
      {/* overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0"
        )}
      />

      {/* drawer */}
      <div
        ref={drawerRef}
        className={cn(
          "absolute right-0 left-0 bottom-0 w-full rounded-t-2xl bg-white shadow-xl transition-transform duration-300 ease-out",
          isFullHeight ? "h-full" : "h-auto",
          isOpen ? "translate-y-0" : "translate-y-full",
          className
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Drawer;
