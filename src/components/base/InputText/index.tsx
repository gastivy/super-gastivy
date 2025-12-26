import React, { useEffect, useState } from "react";
import { inputVariants } from "./InputText.variants";
import type { InputTextProps } from "./InputText.types";
import { cn } from "@libs/classnames";

const InputText: React.FC<InputTextProps> = ({
  size,
  shape,
  prefix,
  suffix,
  error,
  className,
  label,
  value = "",
  inputMode,
  wrapperClassName,
  onChange,
  onChangeInput,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.currentTarget.value;
    if (inputMode === "numeric") {
      val = val.replace(/\D/g, "");
    }
    setInputValue(val);
    onChange?.(e);
    onChangeInput?.(val);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);
  return (
    <div className={cn("flex flex-col gap-2 w-full", wrapperClassName)}>
      {label && (
        <span className="text-sm font-medium text-shark-700">{label}</span>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <div className="flex justify-center items-center absolute left-3 text-gray-500 pointer-events-none">
            {prefix}
          </div>
        )}

        <input
          value={inputValue}
          className={inputVariants({
            size,
            shape,
            hasPrefix: Boolean(prefix),
            hasSuffix: Boolean(suffix),
            error: Boolean(error),
            hasValue: !error && Boolean(inputValue),
            className,
          })}
          onChange={handleOnChange}
          {...props}
        />

        {suffix && (
          <span className="absolute right-3 text-gray-500 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default InputText;
