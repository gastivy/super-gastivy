import Icon from "@components/base/Icon";
import { routes } from "@constants/routes";
import { SIDEBAR_MENU } from "@constants/sidebar";
import { cn } from "@libs/classnames";
import { useLogout } from "@modules/auth/hooks/useAuth";
import { useNavigate, useRouterState } from "@tanstack/react-router";

const Sidebar = () => {
  const navigate = useNavigate();
  const router = useRouterState();
  const { mutate: logout } = useLogout({
    onSuccess: () => {
      navigate({ to: routes.login.path });
    },
  });
  return (
    <aside className="h-screen w-72 flex bg-white rounded-r-2xl max-[60rem]:hidden">
      <div className="flex flex-col justify-between gap-3 border-r border-gray-200 p-3">
        <div className="flex flex-col gap-3">
          {SIDEBAR_MENU.map((item) => {
            const isActive = router.location.pathname.includes(item.path || "");
            return (
              <div
                className={cn(
                  "flex justify-between items-center cursor-pointer p-3 rounded-lg",
                  isActive
                    ? "bg-green-yellow-400"
                    : "hover:bg-green-yellow-400/50"
                )}
                key={item.path}
                onClick={() => navigate({ to: item.path })}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  className={
                    isActive
                      ? "text-limed-spruce-900"
                      : "text-shark-700 hover:text-limed-spruce-900"
                  }
                />
              </div>
            );
          })}
        </div>

        <div
          className={
            "flex justify-between items-center cursor-pointer p-3 rounded-lg hover:bg-shark-200/50"
          }
          onClick={() => logout()}
        >
          <Icon
            name="Logout-solid"
            size={20}
            className="text-shark-700 hover:text-limed-spruce-900"
          />
        </div>
      </div>
      <div className="w-full flex flex-col gap-4 p-3">
        <div className="capitalize font-medium text-lg limed-spruce-900">
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
                  "highlight-slide w-full flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md transition-all duration-300 ease-out hover:bg-green-yellow-400/40",
                  {
                    active: isActive,
                  }
                )}
                onClick={() => navigate({ to: child.path })}
              >
                <Icon
                  name={child.icon}
                  size={20}
                  className={
                    isActive
                      ? "text-limed-spruce-900"
                      : "text-shark-700 hover:text-limed-spruce-900"
                  }
                />
                <div
                  className={cn(
                    "text-sm",
                    isActive
                      ? "text-limed-spruce-900"
                      : "text-shark-700 hover:text-limed-spruce-900"
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
