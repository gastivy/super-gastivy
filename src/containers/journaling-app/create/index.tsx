import { useEffect, useState } from "react";

import {
  IconArrowNarrowLeft,
  IconBook2,
  IconCircleCheckFilled,
} from "@tabler/icons-react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { format } from "date-fns";

import Button from "@components/base/Button";
import TiptapEditor from "@components/base/TiptapEditor";
import { routes } from "@constants/routes";
import {
  useJournal,
  useSaveJournal,
} from "@modules/journaling/hooks/useJournals";
import { useJournalTemplates } from "@modules/journaling/hooks/useJournalTemplates";

const JournalCreateContainer = () => {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as {
    date?: string;
    edit?: number;
  };

  const isEditing = !!search.edit;
  const { data: existingJournal } = useJournal(search.edit ?? 0);
  const { data: templates = [] } = useJournalTemplates();
  const saveMutation = useSaveJournal();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(
    search.date || format(new Date(), "yyyy-MM-dd")
  );
  const [content, setContent] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    if (isEditing && existingJournal) {
      setTitle(existingJournal.title);
      setDate(existingJournal.date);
      setContent(existingJournal.content);
    }
  }, [isEditing, existingJournal]);

  const handleSave = async () => {
    const now = new Date().toISOString();
    const entry = {
      id: search.edit,
      title: title || "Untitled",
      date,
      content,
      templateId: undefined,
      createdAt: now,
      updatedAt: now,
    };

    const id = await saveMutation.mutateAsync(entry);
    // navigate({ to: routes.journaling.overview.path });
    return id;
  };

  const handleApplyTemplate = (templateContent: string) => {
    setContent(templateContent);
    setShowTemplates(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate({ to: routes.journaling.overview.path })}
          className="flex items-center gap-2 text-sm text-shark-500 hover:text-shark-900 transition-colors"
        >
          <IconArrowNarrowLeft size={16} />
          Back
        </button>
        <Button
          disabled={saveMutation.isPending}
          variant="primary"
          size="regular"
          shape="semi-round"
          className="flex items-center gap-2"
          onClick={handleSave}
        >
          <IconCircleCheckFilled size={14} />
          {isEditing ? "Update" : "Save"}
        </Button>
      </div>

      {/* Title & Date Row */}
      <div className="flex gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Journal title..."
          className="flex-1 rounded-lg border border-shark-200 bg-white px-4 py-3 text-sm text-shark-950 placeholder:text-shark-400 outline-none focus:border-green-yellow-400 focus:ring-1 focus:ring-green-yellow-400 transition-all"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-shark-200 bg-white px-4 py-3 text-sm text-shark-700 outline-none focus:border-green-yellow-400 focus:ring-1 focus:ring-green-yellow-400 transition-all"
        />
      </div>

      {/* Templates */}
      <div className="relative">
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center gap-2 rounded-lg border border-shark-200 bg-white px-3 py-2 text-xs text-shark-600 hover:text-shark-900 hover:border-shark-300 transition-colors"
        >
          <IconBook2 stroke={2} size={14} />
          Templates
        </button>
        {showTemplates && templates.length > 0 && (
          <div className="absolute top-full left-0 mt-1 z-10 w-64 rounded-lg border border-shark-200 bg-white shadow-lg overflow-hidden">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => handleApplyTemplate(t.content)}
                className="w-full text-left px-4 py-2.5 text-sm text-shark-700 hover:bg-shark-50 transition-colors"
              >
                {t.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Editor Card */}
      <div className="rounded-xl border border-shark-200 bg-white p-5">
        <TiptapEditor
          content={isEditing ? content : content || undefined}
          placeholder="Write your journal entry..."
          onChange={setContent}
        />
      </div>
    </div>
  );
};

export default JournalCreateContainer;
