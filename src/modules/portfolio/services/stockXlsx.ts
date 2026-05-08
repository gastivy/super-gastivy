import * as XLSX from "xlsx";
import type { StockItem, StockGroup } from "../models/stockTypes";

interface StockExportRow {
  Group: string;
  Symbol: string;
  Name: string;
  Shares: number;
  AddedAt: string;
}

export const exportStockPortfolioToXlsx = (
  items: StockItem[],
  groups: StockGroup[],
  quoteMap?: Map<string, { regularMarketPrice: number; regularMarketChangePercent: number }>,
  filename = "stock-portfolio"
) => {
  const groupMap = new Map(groups.map((g) => [g.id, g.name]));

  const headerRow: string[] = [
    "Group",
    "Symbol",
    "Name",
    "Shares",
    "AddedAt",
    "Current Price",
    "Change (%)",
  ];

  const dataRows = items.map((item) => {
    const quote = quoteMap?.get(item.symbol);
    return [
      groupMap.get(item.groupId) ?? "Unknown",
      item.symbol,
      item.name,
      item.shares,
      item.createdAt,
      quote?.regularMarketPrice ?? 0,
      quote?.regularMarketChangePercent ?? 0,
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows]);
  ws["!cols"] = [
    { wch: 20 }, // Group
    { wch: 12 }, // Symbol
    { wch: 25 }, // Name
    { wch: 12 }, // Shares
    { wch: 22 }, // AddedAt
    { wch: 16 }, // Current Price
    { wch: 12 }, // Change %
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Stock Portfolio");
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export interface StockImportResult {
  success: boolean;
  items: Omit<StockItem, "id">[];
  groupNames: string[];
  errors: string[];
}

export const importStockPortfolioFromXlsx = (
  file: File
): Promise<StockImportResult> => {
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
        const items: Omit<StockItem, "id">[] = [];
        const groupNames: string[] = [];

        rows.forEach((row, index) => {
          const rowNum = index + 2;

          const group = String(
            row["Group"] ?? row["group"] ?? "Default"
          ).trim();
          const symbol = String(
            row["Symbol"] ?? row["symbol"] ?? ""
          ).trim();
          const name = String(
            row["Name"] ?? row["name"] ?? ""
          ).trim();
          const sharesRaw = row["Shares"] ?? row["shares"];
          const shares = Number(sharesRaw);

          if (!symbol) {
            errors.push(`Row ${rowNum}: Missing Symbol`);
            return;
          }
          if (isNaN(shares) || shares <= 0) {
            errors.push(`Row ${rowNum}: Invalid shares "${sharesRaw}"`);
            return;
          }

          if (group && !groupNames.includes(group)) {
            groupNames.push(group);
          }

          // groupId will be resolved after groups are created
          items.push({
            groupId: -1, // placeholder, will be resolved
            _groupName: group,
            symbol: symbol.toUpperCase(),
            name: name || symbol.toUpperCase(),
            shares,
            createdAt: new Date().toISOString(),
          } as Omit<StockItem, "id"> & { _groupName: string });
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