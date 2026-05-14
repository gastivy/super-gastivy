import type React from "react";

import { IconClockBolt, IconClockHour5 } from "@tabler/icons-react";

import Button from "@components/base/Button";
import Modal from "@components/base/Modal";
import { cn } from "@libs/classnames";
import { dateTime } from "@libs/dateTime";
import type { LogActivity } from "@modules/activity/activity-log/models";

interface ModalConfirmDeleteProps {
  isOpen: boolean;
  isLoading: boolean;
  logActivity: LogActivity;
  onClose: () => void;
  onConfirm: () => void;
}

export const ModalConfirmDelete: React.FC<ModalConfirmDeleteProps> = ({
  isOpen,
  isLoading,
  logActivity,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      isLoading={isLoading}
      closeOnOverlay
      className="w-md min-h-40 px-4 py-5"
      onClose={onClose}
    >
      <div className="min-h-36 flex flex-col justify-around items-center gap-10">
        <div className="flex flex-col gap-4">
          <div className="text-slate-800 text-center">
            Are you sure you want to delete <b>{logActivity.category_name}?</b>
          </div>
          <div className="text-slate-800 text-center text-sm">
            This activity will be permanently deleted. This action cannot be
            undone.
          </div>

          <div className="grid grid-cols-2 gap-y-2">
            <div className="text-slate-800 text-sm">Date</div>
            <div className="text-slate-800 text-sm">
              :{" "}
              {dateTime.getDate(
                logActivity.start_date
                  ? new Date(String(logActivity.start_date))
                  : new Date(),
                "en-GB",
                {
                  dateStyle: "long",
                }
              )}
            </div>
            <div className="text-slate-800 text-sm">State</div>
            <div className="flex items-center gap-1 text-slate-800 text-sm">
              :{" "}
              {logActivity.is_done ? (
                <IconClockBolt
                  stroke={2}
                  size={14}
                  className="text-brand-500"
                />
              ) : (
                <IconClockHour5
                  stroke={2}
                  size={14}
                  className="text-slate-800"
                />
              )}
              <div className="text-slate-800 text-sm">
                {logActivity.is_done ? "Done" : "Pause"}
              </div>
            </div>
            <div className="text-slate-800 text-sm">Time</div>
            <div className="text-slate-800 text-sm">
              :{" "}
              {dateTime.getRangeTime(
                String(logActivity.start_date),
                String(logActivity.end_date)
              )}
            </div>
            <div className="text-slate-800 text-sm">Seconds</div>
            <div className="text-slate-800 text-sm">
              : {dateTime.convertSecondsToTimeFormat(logActivity.seconds)}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            shape="semi-round"
            className={cn(
              "w-30",
              !isLoading && "shadow-md shadow-brand-400/70"
            )}
            isLoading={isLoading}
            disabled={isLoading}
            onClick={onConfirm}
          >
            Yes
          </Button>
          <Button
            shape="semi-round"
            variant="secondary"
            className="w-30"
            disabled={isLoading}
            onClick={onClose}
          >
            No
          </Button>
        </div>
      </div>
    </Modal>
  );
};
