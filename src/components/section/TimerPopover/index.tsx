import Button from "@components/base/Button";
import Icon from "@components/base/Icon";
import { routes } from "@constants/routes";
import { useTimerActivity } from "@modules/activity/overview/useTimerActivity";
import { useRouterState } from "@tanstack/react-router";

const TimerPopover = () => {
  const routerState = useRouterState();
  const {
    name,
    currentActivity,
    isStarted,
    isLoadingCreate,
    formatted,
    handleTimer,
    handleFinishActivity,
  } = useTimerActivity();

  if (
    !name ||
    routerState.location.pathname === routes.activity.timer.path ||
    currentActivity?.data?.length === 0
  )
    return;
  return (
    <div className="fixed z-2 top-6 right-6 max-[768px]:left-6 flex justify-between gap-5 items-center bg-white shadow-xl shadow-shark-400/20 min-[768px]:w-100 p-3 rounded-xl border border-shark-400/10">
      <div className="flex items-center gap-3">
        <div className="flex justify-center items-center bg-green-yellow-400 hover:bg-green-yellow-500 p-2 rounded-full cursor-pointer transition-all duration-300 ease-out">
          <Icon
            name={isStarted ? "Pause-solid" : "Play-solid"}
            className="text-limed-spruce-800"
            size={26}
            onClick={handleTimer}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-medium text-shark-700">{name}</div>
          <div className="text-md text-shark-700">{formatted}</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          shape="semi-round"
          disabled={isStarted || isLoadingCreate}
          onClick={handleFinishActivity}
        >
          Done
        </Button>
      </div>
    </div>
  );
};

export default TimerPopover;
