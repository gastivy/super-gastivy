import { useState } from "react";

import { IconChevronDown, IconLayoutDashboard } from "@tabler/icons-react";
import { useNavigate, useRouterState } from "@tanstack/react-router";

import Conditional from "@components/base/Conditional";
import { SIDEBAR_MENU } from "@constants/sidebar";
import { cn } from "@libs/classnames";

import { SubMenu } from "./SubMenu";

const MORE_ITEMS = SIDEBAR_MENU.slice(2); // Portfolio, Journal, Settings

const BottomBar = () => {
  const router = useRouterState();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectMenu, setSelectMenu] = useState("");

  const isMoreActive = MORE_ITEMS.some(
    (menu) => router.location.pathname.split("/")[1] === menu.path.split("/")[1]
  );

  const handleMenuClick = (menu: (typeof SIDEBAR_MENU)[number]) => {
    if (menu.children.length > 0) {
      setSelectMenu(menu.name);
    } else {
      navigate({ to: menu.path });
    }
  };

  return (
    <>
      <div
        className={cn(
          "hidden fixed z-1 bottom-1 left-1 right-1 bg-zinc-900 dark:bg-zinc-800 p-4 rounded-2xl max-[60rem]:flex max-[60rem]:flex-col gap-3 shadow-lg shadow-zinc-950/30 transition-all duration-300"
        )}
      >
        {/* Main row - always visible */}
        <div className="grid grid-cols-3 gap-3">
          {SIDEBAR_MENU.slice(0, isExpanded ? 99 : 2).map((menu) => {
            const isActive =
              router.location.pathname.split("/")[1] ===
              menu.path.split("/")[1];
            const TablerIcon = menu.icon;
            return (
              <div
                key={menu.name}
                className={cn(
                  "w-full flex justify-center items-center gap-2 p-2 rounded-lg cursor-pointer max-[380px]:flex-col",
                  isActive ? "bg-brand-400" : "bg-transparent"
                )}
                onClick={() => handleMenuClick(menu)}
              >
                <TablerIcon
                  size={20}
                  className={isActive ? "text-zinc-900" : "text-slate-200"}
                />
                <div
                  className={cn("text-zinc-900 text-xs font-medium", {
                    "text-slate-200": !isActive,
                  })}
                >
                  {menu.name}
                </div>
              </div>
            );
          })}

          {/* More button - hidden when expanded */}
          {!isExpanded && (
            <div
              className={cn(
                "w-full flex justify-center items-center gap-2 p-2 rounded-lg cursor-pointer max-[380px]:flex-col",
                isMoreActive ? "bg-brand-400" : "bg-transparent"
              )}
              onClick={() => setIsExpanded(true)}
            >
              <IconLayoutDashboard
                stroke={2}
                size={20}
                className={isMoreActive ? "text-zinc-900" : "text-slate-200"}
              />
              <div
                className={cn("text-zinc-900 text-xs font-medium", {
                  "text-slate-200": !isMoreActive,
                })}
              >
                More
              </div>
            </div>
          )}
        </div>

        <Conditional if={isExpanded}>
          <div
            className={cn(
              "grid grid-cols-3 gap-3 overflow-hidden transition-all duration-300 ease-in-out",
              isExpanded
                ? "max-h-40 opacity-100 mt-0"
                : "max-h-0 opacity-0 mt-0"
            )}
          >
            <div
              className="col-span-3 flex justify-center items-center gap-1 pt-1 cursor-pointer"
              onClick={() => setIsExpanded(false)}
            >
              <IconChevronDown size={14} className="text-slate-200" />
              <div className="text-slate-200 text-xs font-medium">Less</div>
            </div>
          </div>
        </Conditional>
      </div>

      <SubMenu menu={selectMenu} onClose={() => setSelectMenu("")} />
    </>
  );
};

export default BottomBar;
