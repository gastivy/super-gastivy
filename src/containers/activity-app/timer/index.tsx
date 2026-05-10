import React from "react";

import { useTimerActivity } from "@modules/activity/overview/useTimerActivity";

import { LogActivity } from "./LogActivity";
import { TimerController } from "./TimeController";

import "react-circular-progressbar/dist/styles.css";

const TimerActivityContainer: React.FC = () => {
  const {
    seconds,
    formatted,
    currentActivity,
    isStarted,
    isLoadingCreate,
    handleTimer,
    handleFinishActivity,
  } = useTimerActivity();

  return (
    <div className="flex flex-col gap-4 max-[960px]:gap-8">
      <div className="max-[960px]:sticky z-10 top-4 left-77 max-[960px]:left-5 right-5 flex items-center gap-4 bg-white p-6 rounded-lg max-[960px]:shadow-lg shadow-shark-700/10 max-[720px]:p-4">
        <div className="text-shark-700 font-medium text-lg">Timer</div>
      </div>

      <div className="h-[calc(100dvh-124px)] max-[720px]:pb-24 max-[960px]:h-[calc(100dvh-200px)] max-[720px]:h-full flex max-[720px]:flex-col gap-4 rounded-lg">
        <TimerController
          isStarted={isStarted || false}
          isLoadingCreate={isLoadingCreate}
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
