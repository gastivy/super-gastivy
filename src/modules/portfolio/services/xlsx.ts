import * as XLSX from "xlsx";

import type { PortfolioGroup, PortfolioItem } from "../models/types";

export const exportPortfolioToXlsx = (
  items: PortfolioItem[],
  groups: PortfolioGroup[],
  priceMap?: Map<string, { currentPrice: number; priceChange24h: number }>,
  filename = "portfolio"
) => {
  const groupMap = new Map(groups.map((g) => [g.id, g.name]));

  const headerRow: string[] = [
    "Group",
    "Coin",
    "Symbol",
    "CoinId",
    "Amount",
    "AddedAt",
    "Current Price (USD)",
    "24h Change (%)",
  ];

  const dataRows = items.map((item) => {
    const priceData = priceMap?.get(item.coinId);
    return [
      groupMap.get(item.groupId) ?? "Unknown",
      item.name,
      item.symbol,
      item.coinId,
      item.amount,
      item.createdAt,
      priceData?.currentPrice ?? 0,
      priceData?.priceChange24h ?? 0,
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows]);
  ws["!cols"] = [
    { wch: 16 }, // Group
    { wch: 20 }, // Coin
    { wch: 10 }, // Symbol
    { wch: 25 }, // CoinId
    { wch: 15 }, // Amount
    { wch: 22 }, // AddedAt
    { wch: 18 }, // Current Price
    { wch: 16 }, // 24h Change
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Portfolio");
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export interface ImportResult {
  success: boolean;
  items: Omit<PortfolioItem, "id">[];
  groupNames: string[];
  errors: string[];
}

export const importPortfolioFromXlsx = (file: File): Promise<ImportResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

        const errors: string[] = [];
        const items: Omit<PortfolioItem, "id">[] = [];
        const groupNames: string[] = [];

        rows.forEach((row, index) => {
          const rowNum = index + 2;

          const group = String(
            row["Group"] ?? row["group"] ?? "Default"
          ).trim();
          const coinId = String(
            row["CoinId"] ?? row["coinId"] ?? row["coin_id"] ?? ""
          ).trim();
          const symbol = String(row["Symbol"] ?? row["symbol"] ?? "").trim();
          const name = String(
            row["Coin"] ?? row["coin"] ?? row["Name"] ?? row["name"] ?? ""
          ).trim();
          const amountRaw = row["Amount"] ?? row["amount"];
          const amount = Number(amountRaw);

          if (!coinId && !symbol) {
            errors.push(`Row ${rowNum}: Missing CoinId and Symbol`);
            return;
          }
          if (isNaN(amount) || amount <= 0) {
            errors.push(`Row ${rowNum}: Invalid amount "${amountRaw}"`);
            return;
          }

          if (group && !groupNames.includes(group)) {
            groupNames.push(group);
          }

          // groupId will be resolved after groups are created
          items.push({
            groupId: -1, // placeholder, will be resolved
            _groupName: group,
            coinId: coinId || symbol.toLowerCase(),
            symbol: symbol.toUpperCase(),
            name: name || symbol.toUpperCase(),
            amount,
            createdAt: new Date().toISOString(),
          } as Omit<PortfolioItem, "id"> & { _groupName: string });
        });

        resolve({ success: errors.length === 0, items, groupNames, errors });
      } catch {
        resolve({
          success: false,
          items: [],
          groupNames: [],
          errors: [
            "Failed to parse file. Please ensure it is a valid XLSX file.",
          ],
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        items: [],
        groupNames: [],
        errors: ["Failed to read file."],
      });
    };

    reader.readAsArrayBuffer(file);
  });
};
