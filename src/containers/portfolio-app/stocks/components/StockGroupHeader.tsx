import { useState } from "react";

import {
  IconCheck,
  IconChevronDown,
  IconEdit,
  IconTrash,
  IconXFilled,
} from "@tabler/icons-react";

import Conditional from "@components/base/Conditional";
import { formatter } from "@libs/formatter";

import type { StockGroupHeaderProps } from "./types";

const StockGroupHeader = ({
  group,
  groupTotal,
  currency,
  isCollapsed,
  onToggleCollapse,
  onDeleteGroup,
  onUpdateGroup,
}: StockGroupHeaderProps) => {
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editingGroupName, setEditingGroupName] = useState("");

  const startEditGroup = () => {
    setEditingGroupId(group.id ?? null);
    setEditingGroupName(group.name);
  };

  const saveEditGroup = () => {
    if (editingGroupId === null || !editingGroupName.trim()) return;
    onUpdateGroup({
      id: editingGroupId,
      name: editingGroupName.trim(),
    });
    setEditingGroupId(null);
    setEditingGroupName("");
  };

  const cancelEditGroup = () => {
    setEditingGroupId(null);
    setEditingGroupName("");
  };

  return (
    <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
      <div className="flex flex-col">
        <Conditional if={editingGroupId === group.id}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editingGroupName}
              onChange={(e) => setEditingGroupName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEditGroup();
                if (e.key === "Escape") cancelEditGroup();
              }}
              autoFocus
              className="text-md font-semibold text-slate-700 border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:border-brand-400"
            />
            <button
              onClick={saveEditGroup}
              className="text-green-600 hover:text-green-700 cursor-pointer"
              title="Save"
            >
              <IconCheck stroke={2} size={16} />
            </button>
            <button
              onClick={cancelEditGroup}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
              title="Cancel"
            >
              <IconXFilled size={14} />
            </button>
          </div>
        </Conditional>
        <Conditional if={editingGroupId !== group.id}>
          <div className="flex items-center gap-2">
            <h3 className="text-md font-semibold text-slate-700">
              {group.name}
            </h3>
            <button
              onClick={startEditGroup}
              className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              title="Edit group name"
            >
              <IconEdit stroke={2} size={14} />
            </button>
          </div>
        </Conditional>
        <span className="text-xs text-gray-500">
          {formatter.currency(groupTotal, { currency })}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggleCollapse(group.id!)}
          className="text-gray-400 hover:text-gray-600 cursor-pointer transition-transform duration-200"
          title={isCollapsed ? "Expand" : "Collapse"}
          style={{
            transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
          }}
        >
          <IconChevronDown size={18} />
        </button>
        <button
          onClick={() => onDeleteGroup(group.id!)}
          className="text-red-400 hover:text-red-600 cursor-pointer transition-colors"
          title="Delete group and all its items"
        >
          <IconTrash stroke={2} size={18} />
        </button>
      </div>
    </div>
  );
};

export default StockGroupHeader;
