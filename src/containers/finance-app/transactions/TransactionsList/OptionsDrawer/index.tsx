import Drawer from "@components/base/Drawer";
import type { DrawerProps } from "@components/base/Drawer/Drawer.types";
import Each from "@components/base/Each";
import type React from "react";

interface Options {
  label: string;
  onClick: () => void;
}

interface OptionsDrawerProps extends Omit<DrawerProps, "children"> {
  options: Options[];
}

export const OptionsDrawer: React.FC<OptionsDrawerProps> = ({
  options,
  ...props
}) => {
  return (
    <Drawer {...props} className="p-4">
      <div className="flex flex-col">
        <Each
          of={options}
          render={(option, index) => (
            <div key={index} className="text-sm py-2" onClick={option.onClick}>
              {option.label}
            </div>
          )}
        />
      </div>
    </Drawer>
  );
};
