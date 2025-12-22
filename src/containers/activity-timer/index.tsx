import React from "react";

import "react-circular-progressbar/dist/styles.css";
import { useTimerActivity } from "@modules/activity/overview/useTimerActivity";
import { LogActivity } from "./LogActivity";
import { TimerController } from "./TimeController";

const TimerActivityContainer: React.FC = () => {
  const {
    seconds,
    formatted,
    currentActivity,
    isStarted,
    handleTimer,
    handleFinishActivity,
  } = useTimerActivity();

  return (
    <div className="h-[calc(100dvh-32px)] flex max-[720px]:flex-col gap-12 py-8 px-4 bg-white rounded-lg">
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
  );
};

export default TimerActivityContainer;
