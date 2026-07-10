import { IconDownloadFilled, IconUpload } from "@tabler/icons-react";

import Button from "@components/base/Button";

import type { StockPortfolioHeaderProps } from "./types";

const StockPortfolioHeader = ({
  currency,
  onCurrencyToggle,
  importRef,
  onImport,
  onExport,
  isExportDisabled,
}: StockPortfolioHeaderProps) => {
  return (
    <div className="flex max-[576px]:flex-col max-[576px]:items-start max-[576px]:gap-4 justify-between items-center bg-white p-6 max-[960px]:p-4 sticky top-0 max-[960px]:top-4 z-10 rounded-lg max-[960px]:shadow-xl shadow-zinc-800/10">
      <div className="text-lg text-slate-700 font-medium">Stock Portfolio</div>
      <div className="flex max-[360px]:flex-col max-[360px]:items-start items-center gap-2">
        {/* Currency Toggle */}
        <button
          onClick={onCurrencyToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer transition-colors"
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

        <div className="w-px h-5 bg-gray-200 max-[360px]:hidden" />

        <input
          ref={importRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={onImport}
        />

        <div className="flex gap-4">
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
            onClick={onExport}
            disabled={isExportDisabled}
          >
            <IconDownloadFilled size={16} />
            <span className="ml-1">Export</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StockPortfolioHeader;
