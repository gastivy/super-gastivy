import type React from "react";
import { useMemo } from "react";

import { IconCheck, IconChevronDown } from "@tabler/icons-react";

import useDisclosure from "@hooks/useDisclosure";
import { cn } from "@libs/classnames";

import Each from "../Each";

import type { DropdownProps } from "./Dropdown.types";

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
      <div className="text-slate-400">{label || placeholder}</div>
      <IconChevronDown className="text-slate-400" />

      {isOpen && (
        <div className="w-full min-w-max absolute z-1 top-10 left-0 flex flex-col bg-white dark:bg-zinc-900 max-h-50 overflow-y-auto shadow-xl rounded-lg">
          <Each
            of={options}
            render={(option, index) => (
              <div
                key={index}
                className={cn(
                  "flex justify-between items-center gap-4 p-2 cursor-pointer hover:bg-gray-100/70 dark:hover:bg-zinc-800",
                  option.value === value && "bg-brand-100 hover:bg-brand-100"
                )}
                onClick={() => onSelect(option.value, option)}
              >
                <div className="text-xs text-slate-700 dark:text-slate-100">
                  {option.label}
                </div>

                {option.value === value && (
                  <IconCheck size={14} className="text-brand-500" />
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
