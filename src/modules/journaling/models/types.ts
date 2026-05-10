export interface JournalEntry {
  id?: number;
  date: string; // YYYY-MM-DD
  title: string;
  content: string; // Tiptap JSON as string
  templateId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface JournalTemplate {
  id?: number;
  name: string;
  content: string; // Tiptap JSON as string
  createdAt: string;
  updatedAt: string;
}
