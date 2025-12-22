import React, { useState } from "react";
import { format } from "date-fns";
import { DayPicker, type DateRange } from "react-day-picker";
import useDisclosure from "@hooks/useDisclosure";
import "react-day-picker/dist/style.css";
import "./DatePicker.scss";
import InputText from "../InputText";
import Icon from "../Icon";
import useClickOutside from "@hooks/useClickOutside";
import type { DatePickerRangeProps, ShortcutDate } from "./DatePicker.types";
import Each from "../Each";
import { shortcutDate } from "./DatePicker.constants";
import { cn } from "@libs/classnames";

const DatePicker: React.FC<DatePickerRangeProps> = ({
  mode = "range",
  showShortcut,
  onBlur,
  onSelect,
  ...props
}) => {
  const [currentShortcut, setCurrentShortcut] = useState<
    ShortcutDate | undefined
  >(shortcutDate[0]);
  const { isOpen, onOpen, onClose } = useDisclosure({ open: false });

  const displayValue = (() => {
    if (props.selected?.from) {
      return props.selected.to
        ? `${format(props.selected.from, "dd-MMM-yyyy")} → ${format(props.selected.to, "dd-MMM-yyyy")}`
        : format(props.selected.from, "dd-MMM-yyyy");
    }
    return "";
  })();

  const handleBlur = () => {
    onBlur?.();
    onClose();
  };

  const handleSelect = (option: ShortcutDate) => {
    setCurrentShortcut(option);
    onSelect?.({
      from: option.range.start_date,
      to: option.range.end_date,
    });
  };

  const handleSelectDate = (date: DateRange | undefined) => {
    setCurrentShortcut(undefined);
    onSelect?.(date);
  };

  const dropdownRef = useClickOutside(handleBlur);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <InputText
        type="text"
        shape="semi-rounded"
        placeholder="Select date range"
        size="regular"
        value={displayValue}
        prefix={<Icon name="Calendar-outline" size={18} />}
        readOnly
        onClick={onOpen}
      />

      {isOpen && (
        <div className="flex gap-4 absolute left-0 top-12 z-20 rounded-lg bg-white p-4 shadow-lg shadow-gray-400/50">
          <DayPicker
            mode={mode}
            numberOfMonths={2}
            showOutsideDays
            components={{
              PreviousMonthButton: (props) => (
                <button {...props}>
                  <div className="flex justify-center items-center w-6 h-6 bg-white shadow rounded-full">
                    <Icon
                      name="Left-outline"
                      className="text-gray-400"
                      size={18}
                    />
                  </div>
                </button>
              ),
              NextMonthButton: (props) => (
                <button {...props}>
                  <div className="flex justify-center items-center w-6 h-6 bg-white shadow rounded-full">
                    <Icon
                      name="Right-outline"
                      className="text-gray-400"
                      size={20}
                    />
                  </div>
                </button>
              ),
            }}
            onSelect={(val) => handleSelectDate?.(val)}
            {...props}
          />

          {showShortcut && (
            <div className="max-h-70 overflow-y-auto w-40 flex flex-col gap-1 pl-4 border-l border-shark-400">
              <Each
                of={shortcutDate}
                render={(option) => {
                  const isActive = currentShortcut?.value === option.value;
                  return (
                    <div
                      className={cn(
                        "w-full px-3 py-1.5 rounded text-sm cursor-pointer",
                        isActive
                          ? "bg-green-yellow-400 font-medium hover:bg-green-yellow-400"
                          : "hover:bg-green-yellow-400/30"
                      )}
                      onClick={() => handleSelect(option)}
                      key={option.value}
                    >
                      {option.name}
                    </div>
                  );
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
