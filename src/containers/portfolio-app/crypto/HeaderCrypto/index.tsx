import type React from "react";
import { useCallback, useRef } from "react";

import { IconDownloadFilled, IconUpload } from "@tabler/icons-react";

import Button from "@components/base/Button";
import type { PortfolioGroup } from "@modules/portfolio/models/types";
import type { PortfolioItem } from "@modules/portfolio/models/types";
import {
  exportPortfolioToXlsx,
  importPortfolioFromXlsx,
} from "@modules/portfolio/services/xlsx";

interface HeaderCryptoProps {
  currency: "usd" | "idr";
  setCurrency: (currency: "usd" | "idr") => void;
  portfolioItems: PortfolioItem[];
  groups: PortfolioGroup[];
  priceData?:
    | {
        usd?: Map<
          string,
          { currentPrice: number; priceChange24h: number; image?: string }
        >;
        idr?: Map<
          string,
          { currentPrice: number; priceChange24h: number; image?: string }
        >;
      }
    | undefined;
  addGroupMutation: {
    mutateAsync: (group: {
      name: string;
      createdAt: string;
    }) => Promise<PortfolioGroup>;
  };
  addMutation: {
    mutate: (item: Omit<PortfolioItem, "id">) => void;
  };
  setImportError: (error: string | null) => void;
}

const HeaderCrypto: React.FC<HeaderCryptoProps> = ({
  currency,
  setCurrency,
  portfolioItems,
  groups,
  priceData,
  addGroupMutation,
  addMutation,
  setImportError,
}) => {
  const importRef = useRef<HTMLInputElement>(null);

  const handleExport = useCallback(() => {
    if (portfolioItems.length === 0) return;
    exportPortfolioToXlsx(
      portfolioItems,
      groups,
      priceData?.usd,
      `portfolio-${new Date().toISOString().slice(0, 10)}`
    );
  }, [portfolioItems, groups, priceData]);

  const handleImport = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setImportError(null);

      const result = await importPortfolioFromXlsx(file);

      if (result.errors.length > 0) {
        setImportError(result.errors.join("; "));
      }

      if (result.items.length > 0) {
        // Create groups that don't exist yet
        const existingGroupNames = new Map(
          groups.map((g) => [g.name.toLowerCase(), g.id!])
        );
        const groupNameToId = new Map<string, number>(existingGroupNames);

        for (const groupName of result.groupNames) {
          const lowerName = groupName.toLowerCase();
          if (!groupNameToId.has(lowerName)) {
            const newGroup = await addGroupMutation.mutateAsync({
              name: groupName,
              createdAt: new Date().toISOString(),
            });
            groupNameToId.set(lowerName, newGroup.id!);
          }
        }

        // Add items with resolved groupIds
        result.items.forEach((item) => {
          const extendedItem = item as Omit<PortfolioItem, "id"> & {
            _groupName: string;
          };
          const groupId =
            groupNameToId.get(
              (extendedItem._groupName || "Default").toLowerCase()
            ) || 1;

          addMutation.mutate({
            ...item,
            groupId,
          });
        });
      }

      if (importRef.current) {
        importRef.current.value = "";
      }
    },
    [groups, addGroupMutation, addMutation, setImportError]
  );

  return (
    <div className="flex justify-between items-center bg-white p-6 max-[960px]:p-4 sticky top-0 max-[960px]:top-4 z-10 rounded-lg max-[960px]:shadow-xl shadow-zinc-800/10">
      <div className="text-lg text-slate-700 font-medium">
        Portfolio Overview
      </div>
      <div className="flex items-center gap-2">
        {/* Currency Toggle */}
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => setCurrency(currency === "usd" ? "idr" : "usd")}
        >
          <span
            className={
              currency === "usd" ? "text-slate-700 font-bold" : "text-gray-400"
            }
          >
            USD
          </span>
          <span className="text-gray-300">/</span>
          <span
            className={
              currency === "idr" ? "text-slate-700 font-bold" : "text-gray-400"
            }
          >
            IDR
          </span>
        </button>

        <div className="w-px h-5 bg-gray-200" />

        <input
          ref={importRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleImport}
        />
        <Button
          variant="outline"
          size="small"
          onClick={() => importRef.current?.click()}
        >
          <IconUpload stroke={2} size={16} />
          <span className="ml-1">Import</span>
        </Button>
        <Button
          variant="outline"
          size="small"
          disabled={portfolioItems.length === 0}
          onClick={handleExport}
        >
          <IconDownloadFilled size={16} />
          <span className="ml-1">Export</span>
        </Button>
      </div>
    </div>
  );
};

export default HeaderCrypto;