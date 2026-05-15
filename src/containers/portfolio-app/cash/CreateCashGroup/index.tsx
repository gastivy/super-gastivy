import { useState } from "react";

import { IconPlusFilled } from "@tabler/icons-react";

import Button from "@components/base/Button";
import { useAddCashGroup } from "@modules/portfolio/hooks/useCashGroup";

const CreateCashGroup = () => {
  const [newGroupName, setNewGroupName] = useState("");
  const addGroupMutation = useAddCashGroup();

  const handleCreateGroup = () => {
    const trimmed = newGroupName.trim();
    if (!trimmed) return;

    addGroupMutation.mutate(
      { name: trimmed, createdAt: new Date().toISOString() },
      {
        onSuccess: () => {
          setNewGroupName("");
        },
      }
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-md font-medium text-slate-700 mb-4">
        Create Cash Group
      </h3>
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <input
            type="text"
            placeholder="e.g. Bank, Cash on Hand"
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-400"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateGroup();
            }}
          />
        </div>
        <Button
          isLoading={addGroupMutation.isPending}
          disabled={!newGroupName.trim()}
          onClick={handleCreateGroup}
        >
          <IconPlusFilled size={16} />
          <span className="ml-1">Create Group</span>
        </Button>
      </div>
    </div>
  );
};

export default CreateCashGroup;
