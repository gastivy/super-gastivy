import { IconLogout } from "@tabler/icons-react";
import { useNavigate, useRouterState } from "@tanstack/react-router";

import { routes } from "@constants/routes";
import { SIDEBAR_MENU } from "@constants/sidebar";
import { cn } from "@libs/classnames";
import { useLogout } from "@modules/auth/hooks/useAuth";

const Sidebar = () => {
  const navigate = useNavigate();
  const router = useRouterState();
  const { mutate: logout } = useLogout({
    onSuccess: () => {
      navigate({ to: routes.login.path });
    },
  });
  return (
    <aside className="h-screen w-72 flex bg-white dark:bg-zinc-900 rounded-r-2xl max-[60rem]:hidden">
      <div className="flex flex-col justify-between gap-3 border-r border-zinc-200 dark:border-zinc-800 p-3">
        <div className="flex flex-col gap-3">
          {SIDEBAR_MENU.map((item) => {
            const isActive = router.location.pathname.includes(item.path || "");
            return (
              <div
                className={cn(
                  "flex justify-between items-center cursor-pointer p-3 rounded-lg",
                  isActive ? "bg-brand-400" : "hover:bg-brand-400/50"
                )}
                key={item.path}
                onClick={() => navigate({ to: item.path })}
              >
                {(() => {
                  const TablerIcon = item.icon;
                  return (
                    <TablerIcon
                      size={20}
                      className={
                        isActive
                          ? "text-zinc-900"
                          : "text-slate-600 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                      }
                    />
                  );
                })()}
              </div>
            );
          })}
        </div>

        <div
          className={
            "flex justify-between items-center cursor-pointer p-3 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-800"
          }
          onClick={() => logout()}
        >
          <IconLogout
            size={20}
            className="text-slate-600 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          />
        </div>
      </div>
      <div className="w-full flex flex-col gap-4 p-3">
        <div className="capitalize font-medium text-lg text-slate-900 dark:text-slate-100">
          {router.location.pathname.split("/")[1]}
        </div>
        <div className="flex flex-col gap-2">
          {SIDEBAR_MENU.find(
            (item) =>
              item.path.split("/")[1] === router.location.pathname.split("/")[1]
          )?.children?.map((child) => {
            const isActive = router.location.pathname === (child.path || "");
            return (
              <div
                key={child.path}
                className={cn(
                  "highlight-slide w-full flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md transition-all duration-300 ease-out hover:bg-brand-400/40",
                  {
                    active: isActive,
                  }
                )}
                onClick={() => navigate({ to: child.path })}
              >
                {(() => {
                  const TablerIcon = child.icon;
                  return (
                    <TablerIcon
                      size={20}
                      className={
                        isActive
                          ? "text-zinc-900"
                          : "text-slate-600 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                      }
                    />
                  );
                })()}
                <div
                  className={cn(
                    "text-sm",
                    isActive
                      ? "text-zinc-900"
                      : "text-slate-600 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  )}
                >
                  {child.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
