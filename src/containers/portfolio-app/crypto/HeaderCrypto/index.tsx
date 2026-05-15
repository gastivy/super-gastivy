import type React from "react";

import { IconDownloadFilled } from "@tabler/icons-react";

import Button from "@components/base/Button";
import { useCryptoPortfolioActions } from "@modules/portfolio/hooks/useCryptoPortfolioActions";

interface HeaderCryptoProps {
  currency: "usd" | "idr";
  setCurrency: (currency: "usd" | "idr") => void;
}

const HeaderCrypto: React.FC<HeaderCryptoProps> = ({
  currency,
  setCurrency,
}) => {
  const { portfolioItems } = useCryptoPortfolioActions();

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

        <Button
          variant="outline"
          size="small"
          disabled={portfolioItems.length === 0}
        >
          <IconDownloadFilled size={16} />
          <span className="ml-1">Export</span>
        </Button>
      </div>
    </div>
  );
};

export default HeaderCrypto;
