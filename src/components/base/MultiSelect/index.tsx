import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { multiSelectVariants } from "./MultiSelect.variants";
import type { MultiSelectProps, Option } from "./MultiSelect.types";
import Each from "../Each";
import { cn } from "@libs/classnames";
import Icon from "../Icon";
import useDisclosure from "@hooks/useDisclosure";
import useClickOutside from "@hooks/useClickOutside";
import Conditional from "../Conditional";

export default function MultiSelect({
  options,
  value = [],
  onSelect,
  placeholder = "Select",
  error = "",
  size = "regular",
  shape = "semi-rounded",
  prefix,
  suffix,
}: MultiSelectProps) {
  const { isOpen, onClose, onOpen } = useDisclosure({ open: false });
  const multiSelectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const wrapperRef = useClickOutside(onClose);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(0);

  const selectedOptions = useMemo<Option[]>(() => {
    return value
      .map((v) => options.find((opt) => opt.value === v))
      .filter(Boolean) as Option[];
  }, [options, value]);

  const sizeIcon = useMemo(() => {
    if (size === "large") return 24;
    if (size === "regular") return 20;
    if (size === "small") return 16;
  }, [size]);

  const toggleOption = (opt: Option) => {
    const exists = value.includes(opt.value);

    const nextValue = exists
      ? value.filter((v) => v !== opt.value)
      : [...value, opt.value];

    onSelect?.(nextValue, opt);
  };

  const handleFocus = () => {
    onOpen();
    inputRef.current?.focus();
  };

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  useLayoutEffect(() => {
    if (!multiSelectRef.current) return;

    const wrapperWidth = multiSelectRef.current.offsetWidth - 50;
    let total = 0;
    let count = 0;

    for (let i = 0; i < selectedOptions.length; i++) {
      const el = tagRefs.current[i];
      if (!el) continue;

      total += el.offsetWidth + 8;
      if (total <= wrapperWidth) count++;
      else break;
    }

    setVisibleCount(count);
  }, [selectedOptions]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div
        ref={multiSelectRef}
        className={multiSelectVariants({
          size,
          shape,
          error: Boolean(error),
          hasPrefix: Boolean(prefix),
          hasSuffix: Boolean(suffix),
        })}
        onClick={handleFocus}
      >
        <div className="absolute left-0 right-0 overflow-x-hidden invisible flex">
          <Each
            of={selectedOptions}
            render={(item, i) => (
              <span
                key={item.value}
                ref={(el) => {
                  tagRefs.current[i] = el;
                }}
                className="px-2 py-1 text-sm border rounded whitespace-nowrap"
              >
                {item.label}
              </span>
            )}
          />
        </div>

        {/* visible tags */}
        <Each
          of={selectedOptions.slice(0, visibleCount)}
          render={(item) => (
            <span
              key={item.value}
              className="flex items-center gap-1.5 bg-green-yellow-400 px-1.5 py-0.5 rounded whitespace-nowrap"
            >
              <div className="text-limed-spruce-900 text-[10px]">
                {item.label}
              </div>
              <Icon
                name="Close-solid"
                size={10}
                className="text-limed-spruce-600 cursor-pointer"
                onClick={() => toggleOption(item)}
              />
            </span>
          )}
        />

        {selectedOptions.length > visibleCount && (
          <span className="text-xs text-gray-500 whitespace-nowrap">
            +{selectedOptions.length - visibleCount}
          </span>
        )}

        {/* search input */}
        <input
          ref={inputRef}
          className={cn(
            "w-full outline-none bg-transparent text-sm",
            size === "small" && "h-4"
          )}
          value={search}
          placeholder={selectedOptions.length === 0 ? placeholder : ""}
          onFocus={handleFocus}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Conditional if={selectedOptions.length === 0}>
          <Icon
            name="Down-outline"
            size={sizeIcon}
            className="min-w-6 text-limed-spruce-300"
          />
        </Conditional>
      </div>

      {/* dropdown */}
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white rounded shadow max-h-60 overflow-auto z-10">
          {filtered.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-400">
              Tidak ada hasil
            </div>
          )}

          <Each
            of={filtered}
            render={(opt) => {
              const selected = value.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  onClick={() => toggleOption(opt)}
                  className={cn(
                    "flex justify-between items-center gap-2 px-3 py-2 cursor-pointer  hover:bg-green-yellow-100",
                    selected ? "font-medium" : ""
                  )}
                >
                  <div className="text-limed-spruce-900 text-sm">
                    {opt.label}
                  </div>
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
  );
}
