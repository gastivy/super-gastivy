import Icon from "@components/base/Icon";
import { SIDEBAR_MENU } from "@constants/sidebar";
import { useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { SubMenu } from "./SubMenu";
import { cn } from "@libs/classnames";

const BottomBar = () => {
  const router = useRouterState();
  const [selectMenu, setSelectMenu] = useState("");

  return (
    <div className="relative">
      <div className="hidden fixed bottom-5 left-5 right-5 bg-shark-950 p-4 rounded-xl max-[60rem]:flex gap-3 max-[36rem]:bottom-4 max-[36rem]:left-4 max-[36rem]:right-4 max-[25rem]:bottom-3 max-[25rem]:left-3 max-[25rem]:right-3">
        {SIDEBAR_MENU.map((item, index) => {
          const isActive =
            router.location.pathname.split("/")[1] === item.path.split("/")[1];
          return (
            <div
              key={index}
              className={cn(
                "w-full flex justify-center items-center gap-2 p-2 rounded-lg",
                isActive ? "bg-green-yellow-400" : "bg-transparent"
              )}
              onClick={() => setSelectMenu(item.name)}
            >
              <Icon
                name={item.icon}
                size={20}
                className={isActive ? "text-shark-950" : "text-white"}
              />
              <div
                className={cn("text-shark-950 text-xs font-medium", {
                  "text-white": !isActive,
                })}
              >
                {item.name}
              </div>
            </div>
          );
        })}
      </div>

      <SubMenu menu={selectMenu} onClose={() => setSelectMenu("")} />
    </div>
  );
};

export default BottomBar;
