import React, { useEffect, useState } from "react";

import { cn } from "@libs/classnames";
import { clamp } from "@libs/common";

import type { InputTextProps } from "./InputText.types";
import { inputVariants } from "./InputText.variants";

const InputText: React.FC<InputTextProps> = ({
  size,
  shape,
  prefix,
  suffix,
  error,
  className,
  label,
  value = "",
  type,
  inputMode,
  wrapperClassName,
  onChange,
  onChangeInput,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);

  const formatNumber = (value: string, locale = "id") => {
    if (!value) return "";
    const parsed = Number(value);
    if (isNaN(parsed)) return "";
    return new Intl.NumberFormat(locale).format(parsed);
  };

  const unformatNumber = (value: string) => {
    return value.replace(/[^\d]/g, "");
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.currentTarget.value;

    if (inputMode === "numeric" || type === "number") {
      const rawNumber = unformatNumber(val);
      val = val.replace(/\D/g, "");

      if (props.max || props.min) {
        val = String(
          clamp(Number(rawNumber), Number(props.min), Number(props.max))
        );
        setInputValue(formatNumber(val));
        onChange?.(e);
        onChangeInput?.(val);
        return;
      }

      onChange?.(e);
      onChangeInput?.(val);

      // tampilkan versi locale
      setInputValue(formatNumber(rawNumber));
      return;
    }

    setInputValue(val);
    onChange?.(e);
    onChangeInput?.(val);
  };

  useEffect(() => {
    if (type === "number") {
      setInputValue(formatNumber(String(value)));
    } else {
      setInputValue(value);
    }
  }, [value, type]);
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

      {error && typeof error === "string" && (
        <p className="text-red-500 text-xs">{error}</p>
      )}
    </div>
  );
};

export default InputText;
