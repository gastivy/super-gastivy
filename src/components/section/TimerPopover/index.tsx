import {
  IconAlertCircle,
  IconGripVertical,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconX,
} from "@tabler/icons-react";
import { useRouterState } from "@tanstack/react-router";

import Button from "@components/base/Button";
import Conditional from "@components/base/Conditional";
import ModalConfirm from "@components/base/ModalConfirm";
import { routes } from "@constants/routes";
import useDisclosure from "@hooks/useDisclosure";
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
    isAlarmPlaying,
    handleTimer,
    handleFinishActivity,
    handleCancelActivity,
    handleStopAlarm,
  } = useTimerActivity();

  const { position, handlers, ref } = useDrag();
  const {
    isOpen: isCancelModalOpen,
    onOpen: onCancelModalOpen,
    onClose: onCancelModalClose,
  } = useDisclosure({ open: false });

  const isTimerPage =
    routerState.location.pathname === routes.activity.timer.path;
  const hasActivity = currentActivity?.data?.length > 0;
  const shouldHide = !name || hasActivity === false;

  // Normal timer popover: hide on timer page or when no activity
  if (shouldHide || isTimerPage) return;

  return (
    <>
      <ModalConfirm
        isOpen={isCancelModalOpen}
        description="Are you sure you want to cancel this activity?"
        onClose={onCancelModalClose}
        onConfirm={() => {
          handleCancelActivity();
          onCancelModalClose();
        }}
      />
      <div
        ref={ref}
        className="fixed z-20 flex justify-between gap-2 items-center bg-white shadow-xl shadow-shark-400/20 min-[768px]:w-100 p-3 rounded-xl border border-shark-400/10 select-none"
        style={{
          left: position.x >= 0 ? position.x : undefined,
          top: position.y >= 0 ? position.y : undefined,
          right: position.x < 0 ? 24 : undefined,
        }}
      >
        <Conditional if={isAlarmPlaying}>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center cursor-grab active:cursor-grabbing text-shark-300 hover:text-shark-500 transition-colors touch-none"
              {...handlers}
            >
              <IconGripVertical size={20} />
            </div>
            <IconAlertCircle size={22} className="text-red-500 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <div className="font-medium text-shark-700 text-sm">
                Timer Selesai!
              </div>
              <div className="text-xs text-shark-500">{name}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Button
              size="small"
              variant="outline"
              className="flex items-center gap-1.5 border-red-400 text-red-600 hover:bg-red-50"
              onClick={handleStopAlarm}
            >
              <IconAlertCircle size={14} />
              Stop Alarm
            </Button>
          </div>
        </Conditional>

        <Conditional if={!isAlarmPlaying}>
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
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full text-shark-400 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
              onClick={onCancelModalOpen}
            >
              <IconX size={18} />
            </div>
            <Button
              shape="semi-round"
              disabled={isStarted || isLoadingCreate}
              onClick={handleFinishActivity}
            >
              Done
            </Button>
          </div>
        </Conditional>
      </div>
    </>
  );
};

export default TimerPopover;
