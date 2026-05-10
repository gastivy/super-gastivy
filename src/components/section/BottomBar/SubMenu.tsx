import Each from "@components/base/Each";

import { SIDEBAR_MENU } from "@constants/sidebar";
import { cn } from "@libs/classnames";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import type React from "react";

interface Props {
  menu: string;
  onClose: () => void;
}

export const SubMenu: React.FC<Props> = ({ menu, onClose }) => {
  const router = useRouterState();
  const navigate = useNavigate();
  const submenu =
    SIDEBAR_MENU.find((item) => item.name === menu)?.children || [];
  return (
    <div className="hidden max-[60rem]:flex">
      <div
        className={`
          fixed inset-0 bg-black/40 z-10
          transition-opacity duration-300
          ${menu ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
      />
      <div
        className={`
          fixed bottom-2 left-2 right-2
          bg-shark-950 p-5 rounded-xl z-10
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
                  isActive ? "bg-green-yellow-400" : "bg-transparent"
                )}
                key={index}
                onClick={() => navigate({ to: item.path })}
              >
                <Icon
                  name={item.icon}
                  className={isActive ? "text-shark-950" : "text-white"}
                  size={18}
                />
                <div
                  className={cn(
                    "text-shark-950 text-xs font-medium",
                    isActive ? "text-shark-950" : "text-white"
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
