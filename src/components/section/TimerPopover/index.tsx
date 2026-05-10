import {
  IconGripVertical,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";
import { useRouterState } from "@tanstack/react-router";

import Button from "@components/base/Button";
import { routes } from "@constants/routes";
import useDrag from "@hooks/useDrag";
import { useTimerActivity } from "@modules/activity/overview/useTimerActivity";

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

  const { position, handlers, ref } = useDrag();

  if (
    !name ||
    routerState.location.pathname === routes.activity.timer.path ||
    currentActivity?.data?.length === 0
  )
    return;
  return (
    <div
      ref={ref}
      className="fixed z-20 flex justify-between gap-2 items-center bg-white shadow-xl shadow-shark-400/20 min-[768px]:w-100 p-3 rounded-xl border border-shark-400/10 select-none"
      style={{
        left: position.x >= 0 ? position.x : undefined,
        top: position.y >= 0 ? position.y : undefined,
        right: position.x < 0 ? 24 : undefined,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center cursor-grab active:cursor-grabbing text-shark-300 hover:text-shark-500 transition-colors touch-none"
          {...handlers}
        >
          <IconGripVertical size={20} />
        </div>
        <div className="flex justify-center items-center bg-green-yellow-400 hover:bg-green-yellow-500 p-2 rounded-full cursor-pointer transition-all duration-300 ease-out">
          {isStarted ? (
            <IconPlayerPauseFilled
              size={26}
              className="text-limed-spruce-800"
              onClick={handleTimer}
            />
          ) : (
            <IconPlayerPlayFilled
              size={26}
              className="text-limed-spruce-800"
              onClick={handleTimer}
            />
          )}
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
