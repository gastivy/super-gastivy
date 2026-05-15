import Conditional from "@components/base/Conditional";
import type { CashPortfolioItem } from "@modules/portfolio/models/cashTypes";
import type { GoldItem } from "@modules/portfolio/models/goldTypes";
import type { StockItem } from "@modules/portfolio/models/stockTypes";
import type { PortfolioItem } from "@modules/portfolio/models/types";

interface AllocationProps {
  cashTotal: number;
  cryptoTotal: number;
  goldTotal: number;
  grandTotal: number;
  stockTotal: number;
  cryptoItems: PortfolioItem[];
  stockItems: StockItem[];
  goldItems: GoldItem[];
  cashItems: CashPortfolioItem[];
}

const Allocation: React.FC<AllocationProps> = ({
  cashTotal,
  cryptoTotal,
  goldTotal,
  grandTotal,
  stockTotal,
  cryptoItems,
  stockItems,
  goldItems,
  cashItems,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="text-sm text-gray-500 mb-3">Allocation</div>
      <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
        <Conditional if={cryptoTotal > 0}>
          <div
            className="bg-orange-400 transition-all duration-500"
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
        <Conditional if={goldTotal > 0}>
          <div
            className="bg-yellow-400 transition-all duration-500"
            style={{
              width: `${(goldTotal / grandTotal) * 100}%`,
            }}
          />
        </Conditional>
        <Conditional if={cashTotal > 0}>
          <div
            className="bg-green-400 transition-all duration-500"
            style={{
              width: `${(cashTotal / grandTotal) * 100}%`,
            }}
          />
        </Conditional>
      </div>
      <div className="flex items-center gap-4 mt-2">
        <Conditional if={cryptoItems.length > 0}>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
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
        <Conditional if={goldItems.length > 0}>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="text-xs text-gray-600">
              Gold {((goldTotal / grandTotal) * 100).toFixed(1)}%
            </span>
          </div>
        </Conditional>
        <Conditional if={cashItems.length > 0}>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="text-xs text-gray-600">
              Cash {((cashTotal / grandTotal) * 100).toFixed(1)}%
            </span>
          </div>
        </Conditional>
      </div>
    </div>
  );
};

export default Allocation;
