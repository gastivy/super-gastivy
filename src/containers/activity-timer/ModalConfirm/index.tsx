import Button from "@components/base/Button";
import Modal from "@components/base/Modal";
import type React from "react";

interface ModalConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ModalConfirm: React.FC<ModalConfirmProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      closeOnOverlay
      className="w-md h-40 p-4"
      onClose={onClose}
    >
      <div className="h-full flex flex-col justify-center items-center gap-10">
        <div className="text-center">
          Are you sure you want to cancel this activity?
        </div>
        <div className="flex gap-4">
          <Button
            shape="semi-round"
            variant="secondary"
            className="w-30"
            onClick={onClose}
          >
            No
          </Button>
          <Button
            shape="semi-round"
            className="w-30 shadow-md shadow-green-yellow-400/70"
            onClick={onConfirm}
          >
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  );
};
