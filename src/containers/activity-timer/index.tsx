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
    <div className="h-[calc(100dvh-32px)] flex max-[720px]:flex-col max-[720px]:gap-6 gap-4 px-4 max-[720px]:bg-white rounded-lg max-[720px]:h-[calc(100dvh-110px)]">
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
