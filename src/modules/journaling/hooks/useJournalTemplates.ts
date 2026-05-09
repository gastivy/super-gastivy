import DexieDB from "@libs/dexieDB";
import type { JournalTemplate } from "@modules/journaling/models/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useJournalTemplates() {
  return useQuery({
    queryKey: ["journalTemplates"],
    queryFn: async () => {
      const templates = await DexieDB.journalTemplates
        .orderBy("createdAt")
        .reverse()
        .toArray();
      return templates;
    },
  });
}

export function useJournalTemplate(id: number) {
  return useQuery({
    queryKey: ["journalTemplate", id],
    queryFn: () => DexieDB.journalTemplates.get(id),
    enabled: !!id,
  });
}

export function useSaveJournalTemplate() {
  return useMutation({
    mutationFn: async (
      template: Omit<JournalTemplate, "id"> & { id?: number }
    ) => {
      const now = new Date().toISOString();
      if (template.id) {
        await DexieDB.journalTemplates.update(template.id, {
          ...template,
          updatedAt: now,
        });
        return template.id;
      }
      const id = await DexieDB.journalTemplates.add({
        ...template,
        createdAt: now,
        updatedAt: now,
      });
      return id;
    },
  });
}

export function useDeleteJournalTemplate() {
  return useMutation({
    mutationFn: async (id: number) => {
      await DexieDB.journalTemplates.delete(id);
    },
  });
}