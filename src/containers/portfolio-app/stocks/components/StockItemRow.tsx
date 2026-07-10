import { useState } from "react";

import {
  IconCheck,
  IconEdit,
  IconTrash,
  IconXFilled,
} from "@tabler/icons-react";

import Conditional from "@components/base/Conditional";
import { formatter } from "@libs/formatter";

import type { StockItemRowProps } from "./types";

const StockItemRow = ({
  item,
  quote,
  currency,
  convertPrice,
  onDelete,
  onUpdateItem,
}: StockItemRowProps) => {
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingItemShares, setEditingItemShares] = useState("");

  const nativePrice = quote?.regularMarketPrice || 0;
  const convertedPrice = convertPrice(item.symbol, nativePrice);
  const priceChange = quote?.regularMarketChangePercent || 0;
  const totalItemValue = item.shares * convertedPrice;

  const startEditItem = () => {
    setEditingItemId(item.id ?? null);
    setEditingItemShares(String(item.shares));
  };

  const saveEditItem = () => {
    if (
      editingItemId === null ||
      !editingItemShares ||
      Number(editingItemShares) <= 0
    )
      return;
    onUpdateItem({
      id: editingItemId,
      shares: Number(editingItemShares),
    });
    setEditingItemId(null);
    setEditingItemShares("");
  };

  const cancelEditItem = () => {
    setEditingItemId(null);
    setEditingItemShares("");
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-brand-400/30 flex items-center justify-center text-xs font-bold text-slate-700">
          {item.symbol.charAt(0)}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-700">
            {item.symbol}
          </span>
          <span className="text-xs text-gray-500">{item.name}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-slate-700">
            {formatter.currency(totalItemValue, {
              currency,
            })}
          </span>
          <div className="flex items-center gap-2">
            <Conditional if={editingItemId === item.id}>
              <input
                type="text"
                inputMode="decimal"
                value={editingItemShares}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.]/g, "");
                  const parts = val.split(".");
                  if (parts.length <= 2) setEditingItemShares(val);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEditItem();
                  if (e.key === "Escape") cancelEditItem();
                }}
                autoFocus
                className="w-20 text-xs text-right border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-brand-400"
              />
              <button
                onClick={saveEditItem}
                className="text-green-600 hover:text-green-700 cursor-pointer"
                title="Save"
              >
                <IconCheck stroke={2} size={14} />
              </button>
              <button
                onClick={cancelEditItem}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                title="Cancel"
              >
                <IconXFilled size={12} />
              </button>
            </Conditional>
            <Conditional if={editingItemId !== item.id}>
              <span className="text-xs text-gray-500">
                {item.shares} ×{" "}
                {formatter.currency(convertedPrice, {
                  currency,
                })}
              </span>
              <button
                onClick={startEditItem}
                className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                title="Edit shares"
              >
                <IconEdit stroke={2} size={12} />
              </button>
            </Conditional>
            <span
              className={`text-xs font-medium ${
                priceChange >= 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {priceChange >= 0 ? "+" : ""}
              {priceChange.toFixed(2)}%
            </span>
          </div>
        </div>

        <button
          onClick={() => onDelete(item.id!)}
          className="ml-3 text-red-400 hover:text-red-600 cursor-pointer transition-colors"
          title="Remove from portfolio"
        >
          <IconTrash stroke={2} size={18} />
        </button>
      </div>
    </div>
  );
};

export default StockItemRow;
