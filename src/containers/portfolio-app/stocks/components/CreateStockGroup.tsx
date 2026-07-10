import { IconPlusFilled } from "@tabler/icons-react";

import Button from "@components/base/Button";
import InputText from "@components/base/InputText";

import type { CreateStockGroupProps } from "./types";

const CreateStockGroup = ({
  groupName,
  onGroupNameChange,
  onCreate,
  isCreating,
}: CreateStockGroupProps) => {
  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-md font-medium text-slate-700 mb-4">
        Create Stock Group
      </h3>
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <InputText
            label="Group Name"
            placeholder="e.g. Tech Stocks, Dividend Stocks"
            value={groupName}
            onChangeInput={(val) => onGroupNameChange(val)}
          />
        </div>
        <Button
          onClick={onCreate}
          isLoading={isCreating}
          disabled={!groupName.trim()}
        >
          <IconPlusFilled size={16} />
          <span className="ml-1">Create Group</span>
        </Button>
      </div>
    </div>
  );
};

export default CreateStockGroup;
