import Button from "@components/base/Button";
import Modal from "@components/base/Modal";
import type React from "react";

interface ModalConfirmProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  isOpen,
  title,
  description,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      closeOnOverlay
      className="w-md min-h-40 px-4 py-5"
      onClose={onClose}
    >
      <div className="min-h-36 flex flex-col justify-around items-center gap-10">
        <div className="flex flex-col gap-4">
          {title && (
            <div className="text-center text-xl text-limed-spruce-800 font-medium">
              {title}
            </div>
          )}
          {description && (
            <div className="text-center text-sm text-shark-700">
              {description}
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <Button
            shape="semi-round"
            className="w-30 shadow-md shadow-green-yellow-400/70"
            onClick={onConfirm}
          >
            Yes
          </Button>
          <Button
            shape="semi-round"
            variant="secondary"
            className="w-30"
            onClick={onClose}
          >
            No
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirm;
