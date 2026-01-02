import { useMemo, useRef, useState } from "react";
import type { SelectProps, Option } from "./Select.types";
import Each from "../Each";
import { cn } from "@libs/classnames";
import Icon from "../Icon";
import useDisclosure from "@hooks/useDisclosure";
import useClickOutside from "@hooks/useClickOutside";
import { selectVariants } from "./Select.variants";

const Select = ({
  label,
  options,
  value = "",
  placeholder = "Select",
  error = "",
  size = "regular",
  shape = "semi-rounded",
  prefix,
  suffix,
  className,
  wrapperClassName,
  onSelect,
}: SelectProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ open: false });
  const wrapperRef = useClickOutside(onClose);
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");

  /** selected option */
  const selectedOption = useMemo<Option | undefined>(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  const sizeIcon = useMemo(() => {
    if (size === "large") return 24;
    if (size === "regular") return 20;
    return 16;
  }, [size]);

  const filtered = useMemo(
    () =>
      options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
      ),
    [options, search]
  );

  const handleSelect = (opt: Option) => {
    onSelect(opt.value, opt);
    setSearch("");
    onClose();
  };

  return (
    <div
      ref={wrapperRef}
      className={cn("w-full flex flex-col gap-2", wrapperClassName)}
    >
      {label && (
        <span className="text-sm font-medium text-shark-700">{label}</span>
      )}

      <div className="relative">
        <div
          className={selectVariants({
            size,
            shape,
            error: Boolean(error),
            hasPrefix: Boolean(prefix),
            hasSuffix: Boolean(suffix),
            className,
          })}
          onClick={() => {
            onOpen();
            inputRef.current?.focus();
          }}
        >
          {/* value / input */}
          <input
            ref={inputRef}
            className="w-full outline-none bg-transparent text-sm cursor-pointer"
            value={isOpen ? search : selectedOption?.label || ""}
            placeholder={placeholder}
            readOnly={!isOpen}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Icon
            name="Down-outline"
            size={sizeIcon}
            className={cn(
              "transition-transform text-limed-spruce-300",
              isOpen && "rotate-180"
            )}
          />
        </div>

        {/* dropdown */}
        {isOpen && (
          <div className="absolute top-8 mt-1 w-full bg-white rounded shadow max-h-60 overflow-auto z-10">
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-400">
                Tidak ada hasil
              </div>
            )}

            <Each
              of={filtered}
              render={(opt) => {
                const selected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt)}
                    className={cn(
                      "flex justify-between items-center px-3 py-2 cursor-pointer hover:bg-green-yellow-100",
                      selected && "font-medium"
                    )}
                  >
                    <span className="text-sm text-limed-spruce-900">
                      {opt.label}
                    </span>
                    {selected && (
                      <Icon
                        name="Check-solid"
                        size={16}
                        className="text-green-yellow-500"
                      />
                    )}
                  </div>
                );
              }}
            />
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default Select;
