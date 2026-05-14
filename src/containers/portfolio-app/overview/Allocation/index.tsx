import Conditional from "@components/base/Conditional";
import type { StockItem } from "@modules/portfolio/models/stockTypes";
import type { PortfolioItem } from "@modules/portfolio/models/types";

interface AllocationProps {
  cryptoTotal: number;
  grandTotal: number;
  stockTotal: number;
  cryptoItems: PortfolioItem[];
  stockItems: StockItem[];
}

const Allocation: React.FC<AllocationProps> = ({
  cryptoTotal,
  grandTotal,
  stockTotal,
  cryptoItems,
  stockItems,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="text-sm text-gray-500 mb-3">Allocation</div>
      <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
        <Conditional if={cryptoTotal > 0}>
          <div
            className="bg-yellow-400 transition-all duration-500"
            style={{
              width: `${(cryptoTotal / grandTotal) * 100}%`,
            }}
          />
        </Conditional>
        <Conditional if={stockTotal > 0}>
          <div
            className="bg-blue-400 transition-all duration-500"
            style={{
              width: `${(stockTotal / grandTotal) * 100}%`,
            }}
          />
        </Conditional>
      </div>
      <div className="flex items-center gap-4 mt-2">
        <Conditional if={cryptoItems.length > 0}>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="text-xs text-gray-600">
              Crypto {((cryptoTotal / grandTotal) * 100).toFixed(1)}%
            </span>
          </div>
        </Conditional>
        <Conditional if={stockItems.length > 0}>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <span className="text-xs text-gray-600">
              Stocks {((stockTotal / grandTotal) * 100).toFixed(1)}%
            </span>
          </div>
        </Conditional>
      </div>
    </div>
  );
};

export default Allocation;
