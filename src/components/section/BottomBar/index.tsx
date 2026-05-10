import { useState } from "react";

import { useRouterState } from "@tanstack/react-router";

import Each from "@components/base/Each";
import { SIDEBAR_MENU } from "@constants/sidebar";
import { cn } from "@libs/classnames";

import { SubMenu } from "./SubMenu";

const BottomBar = () => {
  const router = useRouterState();
  const [selectMenu, setSelectMenu] = useState("");

  return (
    <div className="relative">
      <div className="hidden fixed z-1 bottom-4 left-5 right-5 bg-shark-950 p-4 rounded-xl max-[60rem]:flex gap-3 max-[36rem]:left-4 max-[36rem]:right-4 max-[25rem]:left-3 max-[25rem]:right-3 shadow-lg shadow-shark-950/30">
        <Each
          of={SIDEBAR_MENU}
          render={(menu, index) => {
            const isActive =
              router.location.pathname.split("/")[1] ===
              menu.path.split("/")[1];
            return (
              <div
                key={index}
                className={cn(
                  "w-full flex justify-center items-center gap-2 p-2 rounded-lg",
                  isActive ? "bg-green-yellow-400" : "bg-transparent"
                )}
                onClick={() => setSelectMenu(menu.name)}
              >
                {(() => {
                  const TablerIcon = menu.icon;
                  return (
                    <TablerIcon
                      size={20}
                      className={isActive ? "text-shark-950" : "text-white"}
                    />
                  );
                })()}
                <div
                  className={cn("text-shark-950 text-xs font-medium", {
                    "text-white": !isActive,
                  })}
                >
                  {menu.name}
                </div>
              </div>
            );
          }}
        />
      </div>

      <SubMenu menu={selectMenu} onClose={() => setSelectMenu("")} />
    </div>
  );
};

export default BottomBar;
