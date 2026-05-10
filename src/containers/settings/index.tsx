import { useState, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import DexieDB from "@libs/dexieDB";

import Button from "@components/base/Button";
import { routes } from "@constants/routes";
import { IconArrowNarrowLeft } from "@tabler/icons-react";

interface BackupData {
  version: string;
  exportedAt: string;
  journals: unknown[];
  journalTemplates: unknown[];
  stockPortfolio: unknown[];
  stockGroups: unknown[];
  portfolio: unknown[];
  portfolioGroups: unknown[];
}

const SettingsContainer = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const clearStatus = () => setStatus(null);

  const showStatus = (type: "success" | "error", message: string) => {
    setStatus({ type, message });
    setTimeout(() => clearStatus(), 4000);
  };

  const handleBackup = async () => {
    setLoading(true);
    try {
      const [journals, journalTemplates, stockPortfolio, stockGroups, portfolio, portfolioGroups] =
        await Promise.all([
          DexieDB.journals.toArray(),
          DexieDB.journalTemplates.toArray(),
          DexieDB.stockPortfolio.toArray(),
          DexieDB.stockGroups.toArray(),
          DexieDB.portfolio.toArray(),
          DexieDB.portfolioGroups.toArray(),
        ]);

      const data: BackupData = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        journals,
        journalTemplates,
        stockPortfolio,
        stockGroups,
        portfolio,
        portfolioGroups,
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gastivy-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showStatus("success", "Backup downloaded successfully");
    } catch {
      showStatus("error", "Failed to create backup");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const text = await file.text();
      const data: BackupData = JSON.parse(text);

      if (!data.version || !data.exportedAt) {
        showStatus("error", "Invalid backup file format");
        return;
      }

      await Promise.all([
        (async () => {
          await DexieDB.journals.clear();
          if (data.journals?.length) {
            await DexieDB.journals.bulkAdd(data.journals as never[]);
          }
        })(),
        (async () => {
          await DexieDB.journalTemplates.clear();
          if (data.journalTemplates?.length) {
            await DexieDB.journalTemplates.bulkAdd(
              data.journalTemplates as never[]
            );
          }
        })(),
        (async () => {
          await DexieDB.stockPortfolio.clear();
          if (data.stockPortfolio?.length) {
            await DexieDB.stockPortfolio.bulkAdd(data.stockPortfolio as never[]);
          }
        })(),
        (async () => {
          await DexieDB.stockGroups.clear();
          if (data.stockGroups?.length) {
            await DexieDB.stockGroups.bulkAdd(data.stockGroups as never[]);
          }
        })(),
        (async () => {
          await DexieDB.portfolio.clear();
          if (data.portfolio?.length) {
            await DexieDB.portfolio.bulkAdd(data.portfolio as never[]);
          }
        })(),
        (async () => {
          await DexieDB.portfolioGroups.clear();
          if (data.portfolioGroups?.length) {
            await DexieDB.portfolioGroups.bulkAdd(
              data.portfolioGroups as never[]
            );
          }
        })(),
      ]);

      showStatus("success", "Data restored successfully");
    } catch {
      showStatus("error", "Failed to restore backup");
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerRestore = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleRestore}
      />

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate({ to: routes.home.path })}
          className="p-1 text-shark-500 hover:text-shark-900 transition-colors"
        >
          <IconArrowNarrowLeft size={16} />
        </button>
        <h1 className="text-xl font-semibold text-shark-950">Settings</h1>
      </div>

      {/* Status Message */}
      {status && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            status.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {status.message}
        </div>
      )}

      {/* Backup & Restore */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-shark-900">
          Backup & Restore
        </h2>

        <div className="rounded-xl border border-shark-200 bg-white p-5 space-y-5">
          {/* Backup */}
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-50 shrink-0">
              <Icon
                name="Download-outline"
                size={18}
                className="text-green-600"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-shark-950">
                Backup Data
              </h3>
              <p className="text-xs text-shark-500 mt-0.5">
                Export all your data including journaling, portfolio stocks, and
                crypto as a JSON file.
              </p>
              <Button
                variant="primary"
                size="regular"
                shape="semi-round"
                onClick={handleBackup}
                disabled={loading}
                className="flex items-center gap-2 mt-3"
              >
                <Icon name="Download-outline" size={14} />
                Download Backup
              </Button>
            </div>
          </div>

          <div className="border-t border-shark-100" />

          {/* Restore */}
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 shrink-0">
              <Icon
                name="Upload-outline"
                size={18}
                className="text-blue-600"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-shark-950">
                Restore Data
              </h3>
              <p className="text-xs text-shark-500 mt-0.5">
                Import a previously exported backup file. This will replace all
                existing data.
              </p>
              <Button
                variant="outline"
                size="regular"
                shape="semi-round"
                onClick={triggerRestore}
                disabled={loading}
                className="flex items-center gap-2 mt-3"
              >
                <Icon name="Upload-outline" size={14} />
                Upload Backup
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsContainer;
