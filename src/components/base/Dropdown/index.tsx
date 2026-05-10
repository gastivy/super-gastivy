import type React from "react";
import type { DropdownProps } from "./Dropdown.types";
import Each from "../Each";
import useDisclosure from "@hooks/useDisclosure";
import { useMemo } from "react";
import { cn } from "@libs/classnames";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";

const Dropdown: React.FC<DropdownProps> = ({
  value,
  placeholder = "Select",
  isLoading,
  options,
  className,
  disabled,
  onSelect,
}) => {
  const { isOpen, onToggle } = useDisclosure({ open: false });
  const label = useMemo(
    () => options.find((item) => item.value === value)?.label || "",
    [value, options]
  );

  const handleClick = () => {
    if (disabled) return;
    onToggle();
  };

  if (isLoading)
    return <div className="animate-pulse bg-gray-200 rounded-lg w-40 h-6" />;
  return (
    <div
      className={cn(
        "relative flex justify-between items-center gap-2 rounded py-1 px-2",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      <div className="text-limed-spruce-400">{label || placeholder}</div>
      <IconChevronDown className="text-limed-spruce-300" />

      {isOpen && (
        <div className="w-full min-w-max absolute z-1 top-10 left-0 flex flex-col bg-white max-h-50 overflow-y-auto shadow-xl rounded-lg">
          <Each
            of={options}
            render={(option, index) => (
              <div
                key={index}
                className={cn(
                  "flex justify-between items-center gap-4 p-2 cursor-pointer hover:bg-gray-100/70",
                  option.value === value &&
                    "bg-green-yellow-100 hover:bg-green-yellow-100"
                )}
                onClick={() => onSelect(option.value, option)}
              >
                <div className="text-xs text-limed-spruce-700">
                  {option.label}
                </div>

                {option.value === value && (
                  <IconCheck
                    size={14}
                    className="text-green-yellow-500"
                  />
                )}
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default Dropdown;
