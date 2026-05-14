import React, { useEffect, useState } from "react";

import { IconEye, IconEyeOff } from "@tabler/icons-react";

import useDisclosure from "@hooks/useDisclosure";
import { cn } from "@libs/classnames";

import type { InputPasswordProps } from "./InputPassword.types";
import { inputVariants } from "./InputPassword.variants";

const InputPassword: React.FC<InputPasswordProps> = ({
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
  const { isOpen, onToggle } = useDisclosure({ open: false });

  const sizeIcon = (() => {
    if (size === "small") return "top-1 right-3";
    if (size === "regular") return "top-2 right-3";
    if (size === "large") return "top-2.5 right-3";
  })();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget?.value);
    onChange?.(e);
    onChangeInput?.(e.currentTarget?.value);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <span className="text-sm font-medium text-slate-700">{label}</span>
      )}
      <div className="relative flex items-center">
        <input
          type={isOpen ? "tex" : "password"}
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

        {isOpen ? (
          <IconEye
            size={size === "large" ? 24 : 18}
            className={cn("text-gray-400 absolute cursor-pointer", sizeIcon)}
            onClick={onToggle}
          />
        ) : (
          <IconEyeOff
            size={size === "large" ? 24 : 18}
            className={cn("text-gray-400 absolute cursor-pointer", sizeIcon)}
            onClick={onToggle}
          />
        )}
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default InputPassword;
