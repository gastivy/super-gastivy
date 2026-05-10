import type React from "react";

import Drawer from "@components/base/Drawer";
import Each from "@components/base/Each";

type Option = {
  title: string;
  key: string;
  onClick: () => void;
};

interface OptionsDrawerProps {
  isOpen: boolean;
  options: Option[];
  onClose: () => void;
}

export const OptionsDrawer: React.FC<OptionsDrawerProps> = ({
  isOpen,
  options,
  onClose,
}) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        <Each
          of={options}
          render={(option) => (
            <div
              key={option.key}
              className="py-2"
              onClick={() => option.onClick()}
            >
              {option.title}
            </div>
          )}
        />
      </div>
    </Drawer>
  );
};
