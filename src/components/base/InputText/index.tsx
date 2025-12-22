import React, { useEffect, useState } from "react";
import { inputVariants } from "./InputText.variants";
import type { InputTextProps } from "./InputText.types";

const InputText: React.FC<InputTextProps> = ({
  size,
  shape,
  prefix,
  suffix,
  error,
  className,
  label,
  value = "",
  onChange,
  onChangeInput,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget?.value);
    onChange?.(e);
    onChangeInput?.(e.currentTarget?.value);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);
  return (
    <div className="flex flex-col gap-1 w-full">
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
          type="text"
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
