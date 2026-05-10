import React, { useState } from "react";
import { format } from "date-fns";
import { DayPicker, type DateRange } from "react-day-picker";
import useDisclosure from "@hooks/useDisclosure";
import InputText from "../InputText";
import useClickOutside from "@hooks/useClickOutside";
import type {
  DatePickerRangeProps,
  ShortcutDate,
} from "./DatePickerRange.types";
import Each from "../Each";
import { shortcutDate } from "./DatePickerRange.constants";
import { cn } from "@libs/classnames";
import "react-day-picker/dist/style.css";
import "./DatePickerRange.scss";
import { IconCalendar, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

const DatePickerRange: React.FC<DatePickerRangeProps> = ({
  mode = "range",
  showShortcut,
  selected,
  label,
  onBlur,
  onSelect,
  ...props
}) => {
  const [currentShortcut, setCurrentShortcut] = useState<
    ShortcutDate | undefined
  >(shortcutDate[0]);
  const [value, setValue] = useState<DateRange | undefined>(selected);
  const { isOpen, onOpen, onClose } = useDisclosure({ open: false });

  const displayValue = (() => {
    if (selected?.from) {
      return selected.to
        ? `${format(selected.from, "dd-MMM-yyyy")} → ${format(selected.to, "dd-MMM-yyyy")}`
        : format(selected.from, "dd-MMM-yyyy");
    }
    return "";
  })();

  const handleBlur = () => {
    onBlur?.();
    onClose();
    onSelect?.(value);
  };

  const handleSelect = (option: ShortcutDate) => {
    setCurrentShortcut(option);
    setValue({
      from: option.range.start_date,
      to: option.range.end_date,
    });
  };

  const handleSelectDate = (date: DateRange | undefined) => {
    setCurrentShortcut(undefined);
    setValue?.(date);
  };

  const dropdownRef = useClickOutside(handleBlur);

  return (
    <div className="relative w-full flex flex-col gap-2" ref={dropdownRef}>
      {label && (
        <span className="text-sm font-medium text-shark-700">{label}</span>
      )}

      <InputText
        type="text"
        shape="semi-rounded"
        placeholder="Select date range"
        size="regular"
        value={displayValue}
        prefix={<IconCalendar size={18} />}
        readOnly
        onClick={onOpen}
      />

      {isOpen && (
        <div className="flex gap-4 absolute left-0 top-12 z-20 rounded-lg bg-white p-4 shadow-lg shadow-gray-400/50">
          <DayPicker
            mode={mode}
            selected={value}
            numberOfMonths={2}
            showOutsideDays
            components={{
              PreviousMonthButton: (props) => (
                <button {...props}>
                  <div className="flex justify-center items-center w-6 h-6 bg-white shadow rounded-full">
                    <IconChevronLeft
                      className="text-gray-400"
                      size={18}
                    />
                  </div>
                </button>
              ),
              NextMonthButton: (props) => (
                <button {...props}>
                  <div className="flex justify-center items-center w-6 h-6 bg-white shadow rounded-full">
                    <IconChevronRight
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

export default DatePickerRange;
