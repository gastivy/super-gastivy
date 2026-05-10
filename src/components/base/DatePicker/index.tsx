import React, { useMemo } from "react";
import { DayPicker } from "react-day-picker";
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { format } from "date-fns";
import useDisclosure from "@hooks/useDisclosure";
import InputText from "@components/base/InputText";
import useClickOutside from "@hooks/useClickOutside";
import type { DatePickerRangeProps } from "./DatePicker.types";
import { cn } from "@libs/classnames";
import "react-day-picker/dist/style.css";
import styles from "./DatePicker.module.scss";

const DatePicker: React.FC<DatePickerRangeProps> = ({
  label,
  error,
  wrapperClassName,
  placeholder = "Select date",
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
          placeholder={placeholder}
          size="regular"
          value={displayValue}
          error={error}
          prefix={<IconCalendar size={18} />}
          readOnly
          onClick={onOpen}
        />

        {isOpen && (
          <div className="flex gap-4 absolute left-0 top-12 z-20 rounded-lg bg-white p-4 shadow-lg shadow-gray-400/50">
            <DayPicker
              className={styles["single-rdp"]}
              mode="single"
              selected={props.value}
              numberOfMonths={1}
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
