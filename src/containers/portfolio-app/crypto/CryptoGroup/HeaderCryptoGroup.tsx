import {
  IconCheck,
  IconChevronDown,
  IconEdit,
  IconTrash,
  IconXFilled,
} from "@tabler/icons-react";

import Conditional from "@components/base/Conditional";
import { formatter } from "@libs/formatter";
import { useCryptoPortfolioActions } from "@modules/portfolio/hooks/useCryptoPortfolioActions";
import type { PortfolioGroup } from "@modules/portfolio/models/types";

interface HeaderCryptoGroupProps {
  group: PortfolioGroup;
  groupTotal: number;
  currency: "usd" | "idr";
}

const HeaderCryptoGroup = ({
  group,
  groupTotal,
  currency,
}: HeaderCryptoGroupProps) => {
  const {
    collapsedGroups,
    toggleCollapse,
    editingGroupId,
    editingGroupName,
    setEditingGroupName,
    startEditGroup,
    saveEditGroup,
    cancelEditGroup,
    handleDeleteGroup,
  } = useCryptoPortfolioActions();

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
              onClick={() => startEditGroup(group)}
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
          onClick={() => toggleCollapse(group.id!)}
          className="text-gray-400 hover:text-gray-600 cursor-pointer transition-transform duration-200"
          title={collapsedGroups.has(group.id!) ? "Expand" : "Collapse"}
          style={{
            transform: collapsedGroups.has(group.id!)
              ? "rotate(-90deg)"
              : "rotate(0deg)",
          }}
        >
          <IconChevronDown size={18} />
        </button>
        <button
          onClick={() => handleDeleteGroup(group.id!)}
          className="text-red-400 hover:text-red-600 cursor-pointer transition-colors"
          title="Delete group and all its items"
        >
          <IconTrash stroke={2} size={18} />
        </button>
      </div>
    </div>
  );
};

export default HeaderCryptoGroup;
