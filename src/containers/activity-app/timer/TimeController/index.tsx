import React, { useMemo } from "react";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";

import {
  IconAlertCircle,
  IconCheck,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconXFilled,
} from "@tabler/icons-react";

import Button from "@components/base/Button";
import Dropdown from "@components/base/Dropdown";
import type { DropdownOption } from "@components/base/Dropdown/Dropdown.types";
import ModalConfirm from "@components/base/ModalConfirm";
import { Tabs, TabsList, TabsTrigger } from "@components/base/Tabs";
import useDisclosure from "@hooks/useDisclosure";
import { cn } from "@libs/classnames";
import DexieDB from "@libs/dexieDB";
import type {
  ActivitiesDexieStore,
  TimerType,
} from "@modules/activity/activity-log/models/dexie";
import { useGetListCategory } from "@modules/activity/categories/hooks/useCategory";

interface TimerControllerProps {
  timerType: TimerType;
  pomodoroDuration: number;
  isStarted: boolean;
  isLoadingCreate: boolean;
  formatted: string;
  seconds: number;
  progress?: number;
  currentActivity: ActivitiesDexieStore;
  isAlarmPlaying: boolean;
  onTimerTypeChange: (type: TimerType) => void;
  onPomodoroDurationChange: (duration: number) => void;
  onChangeTimer: () => void;
  onFinishActivity: () => void;
  onStopAlarm: () => void;
}

export const TimerController: React.FC<TimerControllerProps> = ({
  timerType,
  pomodoroDuration,
  isStarted,
  isLoadingCreate,
  formatted,
  seconds,
  progress,
  isAlarmPlaying,
  currentActivity,
  onChangeTimer,
  onTimerTypeChange,
  onPomodoroDurationChange,
  onFinishActivity,
  onStopAlarm,
}) => {
  const { data, isLoading } = useGetListCategory();
  const { isOpen, onClose, onOpen } = useDisclosure({ open: false });
  const hasData = currentActivity?.data?.length > 0;
  const canEditPomodoro = !isStarted && !isLoadingCreate && !hasData;
  const isTimerZero = timerType === "pomodoro" && pomodoroDuration === 0;
  const isButtonsDisabled =
    isTimerZero || (timerType === "pomodoro" && isAlarmPlaying);

  const categoryOptions =
    useMemo(
      () =>
        data?.data?.map((category) => ({
          ...category,
          label: category.name,
          value: category.id,
        })),
      [data?.data]
    ) || [];

  const handleSelect = async (id: string | number, option: DropdownOption) => {
    await DexieDB.activities.clear();
    await DexieDB.activities.put({
      id: String(id) || "",
      name: String(option.name) || "",
      data: [],
    });
  };

  const handleCancelActivity = async () => {
    if ((isStarted || isLoadingCreate) && !hasData) return;
    await DexieDB.activities.clear();
    onClose();
  };

  const handleFinishActivity = () => {
    if (isStarted || isLoadingCreate || !hasData) return;
    onFinishActivity();
  };

  const durationHours = Math.floor(pomodoroDuration / 3600);
  const durationMinutes = Math.floor((pomodoroDuration % 3600) / 60);
  const durationSeconds = pomodoroDuration % 60;

  const handleDurationHoursChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      onPomodoroDurationChange(
        value * 3600 + durationMinutes * 60 + durationSeconds
      );
    }
  };

  const handleDurationMinutesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= 59) {
      onPomodoroDurationChange(
        durationHours * 3600 + value * 60 + durationSeconds
      );
    }
  };

  const handleDurationSecondsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= 59) {
      onPomodoroDurationChange(
        durationHours * 3600 + durationMinutes * 60 + value
      );
    }
  };

  const isPomodoroEditable =
    timerType === "pomodoro" && canEditPomodoro && !isStarted;

  return (
    <>
      <ModalConfirm
        isOpen={isOpen}
        description="Are you sure you want to cancel this activity?"
        onClose={onClose}
        onConfirm={handleCancelActivity}
      />

      <div className="w-[60%] max-[720px]:h-[calc(100dvh-190px)] bg-white max-[720px]:w-full py-8 rounded-xl flex flex-col items-center gap-8 border border-zinc-700/10">
        {/* Tabs: Stopwatch / Pomodoro */}
        <Tabs
          value={timerType}
          onValueChange={(val: string) => onTimerTypeChange(val as TimerType)}
          className="items-center gap-0"
        >
          <TabsList>
            <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
            <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col justify-center items-center gap-6">
          {/* Dropdown Category Activity */}
          <Dropdown
            value={currentActivity?.id}
            isLoading={isLoading}
            disabled={currentActivity?.data.length > 0}
            options={categoryOptions}
            onSelect={handleSelect}
          />
          <div className="flex w-64">
            <CircularProgressbarWithChildren
              value={progress != null ? progress : ((seconds % 60) / 60) * 100}
              strokeWidth={3}
              styles={buildStyles({
                textColor: "red",
                pathColor: "#bbf246",
                trailColor: "#e2e9eb",
              })}
            >
              {isPomodoroEditable ? (
                <div className="flex items-baseline text-4xl">
                  <input
                    type="number"
                    min={0}
                    value={String(durationHours).padStart(2, "0")}
                    onChange={handleDurationHoursChange}
                    className="w-12 text-center text-4xl bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={String(durationMinutes).padStart(2, "0")}
                    onChange={handleDurationMinutesChange}
                    className="w-12 text-center text-4xl bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={String(durationSeconds).padStart(2, "0")}
                    onChange={handleDurationSecondsChange}
                    className="w-12 text-center text-4xl bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              ) : (
                <div className="flex text-4xl">{formatted}</div>
              )}
            </CircularProgressbarWithChildren>
          </div>
        </div>
        {/* Stop Alarm Button */}
        {isAlarmPlaying && (
          <Button
            variant="outline"
            className="flex items-center gap-2 border-red-400 text-red-600 hover:bg-red-50"
            onClick={onStopAlarm}
          >
            <IconAlertCircle size={18} />
            Stop Alarm
          </Button>
        )}

        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex justify-center items-center rounded-full bg-zinc-900 hover:bg-zinc-950 w-8.5 h-8.5 cursor-pointer",
              (isStarted || isLoadingCreate || !hasData || isButtonsDisabled) &&
                "bg-zinc-900/40 cursor-not-allowed hover:bg-zinc-900/40"
            )}
            onClick={() =>
              !isStarted &&
              !isLoadingCreate &&
              hasData &&
              !isButtonsDisabled &&
              onOpen()
            }
          >
            <IconXFilled size={18} className="text-white" />
          </div>
          <Button
            shape="pill"
            className="w-20 h-20"
            disabled={
              !currentActivity?.id || isLoadingCreate || isButtonsDisabled
            }
            onClick={onChangeTimer}
          >
            {isStarted ? (
              <IconPlayerPauseFilled size={48} className="text-zinc-800" />
            ) : (
              <IconPlayerPlayFilled size={48} className="text-zinc-800" />
            )}
          </Button>
          <div
            className={cn(
              "flex justify-center items-center rounded-full bg-zinc-900 hover:bg-zinc-950 w-8.5 h-8.5 cursor-pointer",
              (isStarted || isLoadingCreate || !hasData || isButtonsDisabled) &&
                "bg-zinc-900/40 cursor-not-allowed hover:bg-zinc-900/40"
            )}
            onClick={() => {
              if (isStarted || isLoadingCreate || !hasData || isButtonsDisabled)
                return;
              handleFinishActivity();
            }}
          >
            <IconCheck stroke={2} size={18} className="text-white" />
          </div>
        </div>
      </div>
    </>
  );
};
