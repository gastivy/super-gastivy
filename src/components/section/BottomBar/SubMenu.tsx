import type React from "react";

import { useNavigate, useRouterState } from "@tanstack/react-router";

import Each from "@components/base/Each";
import { SIDEBAR_MENU } from "@constants/sidebar";
import { cn } from "@libs/classnames";

interface Props {
  menu: string;
  onClose: () => void;
}

export const SubMenu: React.FC<Props> = ({ menu, onClose }) => {
  const router = useRouterState();
  const navigate = useNavigate();
  const submenu =
    SIDEBAR_MENU.find((item) => item.name === menu)?.children || [];

  const handleClickMenu = (path: string) => {
    navigate({ to: path });
    onClose();
  };
  return (
    <div className="hidden max-[60rem]:flex">
      <div
        className={`
          fixed inset-0 bg-black/40 backdrop-blur-sm z-10
          transition-opacity duration-300
          ${menu ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
      />
      <div
        className={`
          fixed bottom-1 left-1 right-1
          bg-zinc-900 dark:bg-zinc-800 p-5 rounded-xl z-10
          grid grid-cols-4 max-[27rem]:grid-cols-3 gap-4
          transition-transform duration-500 ease
          ${menu ? "translate-y-0" : "invisible translate-y-[120%]"}
        `}
      >
        <Each
          of={submenu}
          render={(item, index) => {
            const isActive = router.location.pathname === item.path;
            return (
              <div
                className={cn(
                  "flex flex-col items-center gap-2 p-2 rounded-lg",
                  isActive ? "bg-brand-400" : "bg-transparent"
                )}
                key={index}
                onClick={() => handleClickMenu(item.path)}
              >
                {(() => {
                  const TablerIcon = item.icon;
                  return (
                    <TablerIcon
                      className={isActive ? "text-zinc-900" : "text-slate-200"}
                      size={18}
                    />
                  );
                })()}
                <div
                  className={cn(
                    "text-xs font-medium",
                    isActive ? "text-zinc-900" : "text-slate-200"
                  )}
                >
                  {item.name}
                </div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};
