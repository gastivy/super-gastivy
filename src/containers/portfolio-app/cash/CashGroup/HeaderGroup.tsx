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
import {
  useDeleteCashGroup,
  useUpdateCashGroup,
} from "@modules/portfolio/hooks/useCashGroup";
import type { CurrencyCode } from "@modules/portfolio/hooks/useCryptoPrices";
import type { CashGroup } from "@modules/portfolio/models/cashTypes";

interface HeaderGroupProps {
  group: CashGroup;
  groupTotal: number;
  currency: CurrencyCode;
  collapsedGroups: Set<number>;
  convertBalance: (idrBalance: number) => number;
  toggleCollapse: (groupId: number) => void;
}

const HeaderGroup: React.FC<HeaderGroupProps> = ({
  group,
  groupTotal,
  currency,
  collapsedGroups,
  convertBalance,
  toggleCollapse,
}) => {
  const updateGroupMutation = useUpdateCashGroup();
  const deleteGroupMutation = useDeleteCashGroup();

  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editingGroupName, setEditingGroupName] = useState("");

  const saveEditGroup = () => {
    if (editingGroupId === null || !editingGroupName.trim()) return;
    updateGroupMutation.mutate({
      id: editingGroupId,
      name: editingGroupName.trim(),
    });
    setEditingGroupId(null);
    setEditingGroupName("");
  };

  const handleDeleteGroup = (id: number) => {
    deleteGroupMutation.mutate(id);
  };

  const startEditGroup = (group: { id?: number; name: string }) => {
    setEditingGroupId(group.id ?? null);
    setEditingGroupName(group.name);
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
              autoFocus
              className="text-md font-semibold text-slate-700 border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:border-brand-400"
              onChange={(e) => setEditingGroupName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEditGroup();
                if (e.key === "Escape") cancelEditGroup();
              }}
            />
            <button
              onClick={saveEditGroup}
              className="text-green-600 hover:text-green-700 cursor-pointer"
              title="Save"
            >
              <IconCheck stroke={2} size={16} />
            </button>
            <button
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
              title="Cancel"
              onClick={cancelEditGroup}
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
          {formatter.currency(convertBalance(groupTotal), {
            currency,
          })}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="text-gray-400 hover:text-gray-600 cursor-pointer transition-transform duration-200"
          title={collapsedGroups.has(group.id!) ? "Expand" : "Collapse"}
          style={{
            transform: collapsedGroups.has(group.id!)
              ? "rotate(-90deg)"
              : "rotate(0deg)",
          }}
          onClick={() => toggleCollapse(group.id!)}
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

export default HeaderGroup;
