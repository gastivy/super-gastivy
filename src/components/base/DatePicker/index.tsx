import React, { useMemo } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import useDisclosure from "@hooks/useDisclosure";
import InputText from "@components/base/InputText";
import Icon from "@components/base/Icon";
import useClickOutside from "@hooks/useClickOutside";
import type { DatePickerRangeProps } from "./DatePicker.types";
import "react-day-picker/dist/style.css";
import "./DatePicker.scss";
import { cn } from "@libs/classnames";

const DatePicker: React.FC<DatePickerRangeProps> = ({
  label,
  error,
  wrapperClassName,
  onBlur,
  onSelect,
  ...props
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ open: false });

  const displayValue = useMemo(
    () => (props.value ? format(props.value, "dd-MMM-yyyy") : ""),
    [props.value]
  );

  const handleBlur = () => {
    onBlur?.();
    onClose();
  };

  const dropdownRef = useClickOutside(handleBlur);

  return (
    <div
      className={cn("w-full flex flex-col gap-2", wrapperClassName)}
      ref={dropdownRef}
    >
      {label && (
        <span className="text-sm font-medium text-shark-700">{label}</span>
      )}

      <div className="w-full relative flex">
        <InputText
          type="text"
          shape="semi-rounded"
          placeholder="Select date range"
          size="regular"
          value={displayValue}
          error={error}
          prefix={<Icon name="Calendar-outline" size={18} />}
          readOnly
          onClick={onOpen}
        />

        {isOpen && (
          <div className="flex gap-4 absolute left-0 top-12 z-20 rounded-lg bg-white p-4 shadow-lg shadow-gray-400/50">
            <DayPicker
              mode="single"
              selected={props.value}
              numberOfMonths={1}
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
              onSelect={onSelect}
              {...props}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePicker;
