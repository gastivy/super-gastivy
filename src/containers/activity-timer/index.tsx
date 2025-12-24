import React from "react";

import "react-circular-progressbar/dist/styles.css";
import { useTimerActivity } from "@modules/activity/overview/useTimerActivity";
import { LogActivity } from "./LogActivity";
import { TimerController } from "./TimeController";
import Icon from "@components/base/Icon";
import { useNavigate } from "@tanstack/react-router";
import { routes } from "@constants/routes";

const TimerActivityContainer: React.FC = () => {
  const navigate = useNavigate();
  const {
    seconds,
    formatted,
    currentActivity,
    isStarted,
    handleTimer,
    handleFinishActivity,
  } = useTimerActivity();

  return (
    <div className="relative flex flex-col gap-5">
      <div className="fixed z-10 top-4 left-77 max-[960px]:left-5 right-5 flex items-center gap-4 bg-white p-5 rounded-lg shadow-lg shadow-shark-700/10 max-[720px]:p-4">
        <Icon
          name="Arrow-Left-outline"
          size={28}
          className="text-shark-700 cursor-pointer"
          onClick={() => navigate({ to: routes.activity.overview.path })}
        />
        <div className="text-shark-700 font-medium text-lg">Timer</div>
      </div>

      <div className="min-[960px]:h-[calc(100dvh-112px)] min-[720px]:h-[calc(100dvh-200px)] max-[720px]:mb-24 flex max-[720px]:flex-col gap-4 rounded-lg mt-20">
        <TimerController
          isStarted={isStarted || false}
          seconds={seconds}
          formatted={formatted}
          currentActivity={currentActivity}
          onChangeTimer={handleTimer}
          onFinishActivity={handleFinishActivity}
        />
        <LogActivity data={currentActivity?.data || []} />
      </div>
    </div>
  );
};

export default TimerActivityContainer;
