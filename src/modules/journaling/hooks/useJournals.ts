import { useMutation, useQuery } from "@tanstack/react-query";

import DexieDB from "@libs/dexieDB";
import type { JournalEntry } from "@modules/journaling/models/types";

export function useJournalsByDateRange(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["journals", startDate, endDate],
    queryFn: async () => {
      const journals = await DexieDB.journals
        .where("date")
        .between(startDate, endDate, true, true)
        .reverse()
        .sortBy("date");
      return journals;
    },
  });
}

export function useJournalDates(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["journalDates", startDate, endDate],
    queryFn: async () => {
      const journals = await DexieDB.journals
        .where("date")
        .between(startDate, endDate, true, true)
        .toArray();
      return new Set(journals.map((j) => j.date));
    },
  });
}

export function useJournal(id: number) {
  return useQuery({
    queryKey: ["journal", id],
    queryFn: () => DexieDB.journals.get(id),
    enabled: !!id,
  });
}

export function useSaveJournal() {
  return useMutation({
    mutationFn: async (entry: Omit<JournalEntry, "id"> & { id?: number }) => {
      const now = new Date().toISOString();
      if (entry.id) {
        await DexieDB.journals.update(entry.id, {
          ...entry,
          updatedAt: now,
        });
        return entry.id;
      }
      const id = await DexieDB.journals.add({
        ...entry,
        createdAt: now,
        updatedAt: now,
      });
      return id;
    },
  });
}

export function useDeleteJournal() {
  return useMutation({
    mutationFn: async (id: number) => {
      await DexieDB.journals.delete(id);
    },
  });
}
