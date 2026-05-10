import Button from "@components/base/Button";
import Dropdown from "@components/base/Dropdown";
import type { DropdownOption } from "@components/base/Dropdown/Dropdown.types";

import useDisclosure from "@hooks/useDisclosure";
import DexieDB from "@libs/dexieDB";
import type { ActivitiesDexieStore } from "@modules/activity/activity-log/models/dexie";
import { useGetListCategory } from "@modules/activity/categories/hooks/useCategory";
import React, { useMemo } from "react";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import { cn } from "@libs/classnames";
import ModalConfirm from "@components/base/ModalConfirm";
import { IconCircleCheckFilled } from "@tabler/icons-react";

interface TimerControllerProps {
  isStarted: boolean;
  isLoadingCreate: boolean
  formatted: string;
  seconds: number;
  currentActivity: ActivitiesDexieStore;
  onChangeTimer: () => void;
  onFinishActivity: () => void;
}

export const TimerController: React.FC<TimerControllerProps> = ({
  isStarted,
  isLoadingCreate,
  formatted,
  seconds,
  currentActivity,
  onChangeTimer,
  onFinishActivity,
}) => {
  const { data, isLoading } = useGetListCategory();
  const { isOpen, onClose, onOpen } = useDisclosure({ open: false });
  const hasData = currentActivity?.data?.length > 0;
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

  return (
    <>
      <ModalConfirm
        isOpen={isOpen}
        description="Are you sure you want to cancel this activity?"
        onClose={onClose}
        onConfirm={handleCancelActivity}
      />

      <div className="w-[60%] max-[720px]:h-[calc(100dvh-190px)] bg-white max-[720px]:w-full py-8 rounded-xl flex flex-col items-center gap-12 border border-shark-700/10">
        <div className="flex flex-col justify-center items-center gap-6">
          <Dropdown
            value={currentActivity?.id}
            isLoading={isLoading}
            disabled={currentActivity?.data.length > 0}
            options={categoryOptions}
            onSelect={handleSelect}
          />
          <div className="flex w-64">
            <CircularProgressbarWithChildren
              value={((seconds % 60) / 60) * 100}
              strokeWidth={3}
              styles={buildStyles({
                textColor: "red",
                pathColor: "#bbf246",
                trailColor: "#e2e9eb",
              })}
            >
              <div className="flex text-4xl">{formatted}</div>
            </CircularProgressbarWithChildren>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex justify-center items-center rounded-full bg-limed-spruce-900 hover:bg-limed-spruce-950 w-8.5 h-8.5 cursor-pointer",
              (isStarted || isLoadingCreate || !hasData) &&
                "bg-limed-spruce-900/40 cursor-not-allowed hover:bg-limed-spruce-900/40"
            )}
            onClick={() => !isStarted && !isLoadingCreate && hasData && onOpen()}
          >
            <Icon name="Close-solid" size={18} className="text-white" />
          </div>
          <Button
            shape="pill"
            className="w-20 h-20"
            disabled={!currentActivity?.id || isLoadingCreate}
            onClick={onChangeTimer}
          >
            <Icon name={isStarted ? "Pause-solid" : "Play-solid"} size={48} />
          </Button>
          <div
            className={cn(
              "flex justify-center items-center rounded-full bg-limed-spruce-900 hover:bg-limed-spruce-950 w-8.5 h-8.5 cursor-pointer",
              (isStarted || isLoadingCreate || !hasData) &&
                "bg-limed-spruce-900/40 cursor-not-allowed hover:bg-limed-spruce-900/40"
            )}
            onClick={handleFinishActivity}
          >
            <IconCircleCheckFilled size={18} className="text-white" />
          </div>
        </div>
      </div>
    </>
  );
};
