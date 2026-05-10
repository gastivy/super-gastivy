import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";

import useClickOutside from "@hooks/useClickOutside";
import useDisclosure from "@hooks/useDisclosure";
import { dateTime } from "@libs/dateTime";
import type { LogActivity } from "@modules/activity/activity-log/models";
import type React from "react";
import { OptionsDrawer } from "../OptionsDrawer";
import { useDisplayWidth } from "@hooks/useDisplayWidth";
import { useDeleteActivity } from "@modules/activity/activity-log/hooks/useActivity";
import { useQueryClient } from "@tanstack/react-query";
import { ModalConfirmDelete } from "../ModalConfirmDelete";
import { useNavigate } from "@tanstack/react-router";
import { routes } from "@constants/routes";
import { useCallback } from "react";
import { IconClockHour5, IconDots, IconFlameFilled } from "@tabler/icons-react";

interface CardActivityLogProps {
  log: LogActivity;
}

export const CardActivityLog: React.FC<CardActivityLogProps> = ({ log }) => {
  const navigate = useNavigate();
  const { widthScreen } = useDisplayWidth();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure({ open: false });
  const confirmModalDelete = useDisclosure({ open: false });

  const handleClose = useCallback(onClose, []);
  const optionsRef = useClickOutside(handleClose);

  const { mutate, isPending } = useDeleteActivity({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["infinity-activities"] });
      confirmModalDelete.onClose();
    },
  });

  const handleOpenOptions = () => {
    if (widthScreen < 720) return onOpen();
  };

  const handleDelete = () => {
    mutate(log.id);
  };

  const options = [
    {
      title: "Edit",
      key: "edit",
      onClick: () => {
        navigate({
          to: routes.activity.activityLog.path,
          state: (prev) => ({ ...prev, form: { ...log } }),
        });
      },
    },
    {
      title: "Delete",
      key: "delete",
      onClick: () => {
        confirmModalDelete.onOpen();
      },
    },
  ];

  return (
    <>
      {/* Drawer Options */}
      <Conditional if={widthScreen < 720}>
        <OptionsDrawer isOpen={isOpen} options={options} onClose={onClose} />
      </Conditional>

      {/* Confirm Delete */}
      <ModalConfirmDelete
        isOpen={confirmModalDelete.isOpen}
        isLoading={isPending}
        logActivity={log}
        onConfirm={handleDelete}
        onClose={confirmModalDelete.onClose}
      />

      <div
        className="relative flex items-center gap-5 border-b border-gray-200 py-4"
        onClick={handleOpenOptions}
      >
        <div className="flex basis-[50%] gap-5 max-[720px]:flex-col max-[720px]:gap-1">
          <div className="flex basis-[60%]">{log.category_name}</div>
          <div className="flex basis-[40%] items-center gap-1">
            {log.is_done ? (
              <IconFlameFilled className="text-green-yellow-500" size={16} />
            ): (
              <IconClockHour5 className="text-gray-400" size={16} />
            )}
            <div className="text-shark-700">
              {log.is_done ? "Done" : "Pause"}
            </div>
          </div>
        </div>
        <div className="flex basis-[50%] gap-5 max-[720px]:flex-col max-[720px]:gap-1">
          <div className="flex basis-1/2 text-shark-700 max-[720px]:justify-end">
            {dateTime.getRangeTime(
              String(log.start_date),
              String(log.end_date)
            )}
          </div>
          <div className="flex basis-1/2 text-shark-700 max-[720px]:justify-end">
            {dateTime.convertSecondsToTimeFormat(log.seconds)}
          </div>
        </div>

        <Conditional if={widthScreen >= 720}>
          <div
            ref={optionsRef}
            className="min-w-6 max-[720px]:hidden flex justify-end cursor-pointer"
          >
            <IconDots
              stroke={2}
              className="text-gray-400"
              onClick={onOpen}
            />

            <Conditional if={isOpen}>
              <div className="w-40 absolute z-1 top-12 right-0 flex flex-col bg-white border border-shark-400/30 rounded-lg overflow-hidden">
                <Each
                  of={options}
                  render={(option) => (
                    <div
                      key={option.key}
                      className="px-3 py-2 hover:bg-green-yellow-100"
                      onClick={option.onClick}
                    >
                      {option.title}
                    </div>
                  )}
                />
              </div>
            </Conditional>
          </div>
        </Conditional>
      </div>
    </>
  );
};
