import { useState } from "react";

import {
  IconArrowNarrowLeft,
  IconEdit,
  IconPlusFilled,
  IconTrash,
} from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";

import Button from "@components/base/Button";
import TiptapEditor from "@components/base/TiptapEditor";
import { routes } from "@constants/routes";
import {
  useDeleteJournalTemplate,
  useJournalTemplates,
  useSaveJournalTemplate,
} from "@modules/journaling/hooks/useJournalTemplates";

const JournalTemplatesContainer = () => {
  const navigate = useNavigate();
  const { data: templates = [], refetch } = useJournalTemplates();
  const saveMutation = useSaveJournalTemplate();
  const deleteMutation = useDeleteJournalTemplate();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const resetForm = () => {
    setName("");
    setContent("");
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!name.trim()) return;

    const now = new Date().toISOString();
    await saveMutation.mutateAsync({
      id: editingId ?? undefined,
      name: name.trim(),
      content,
      createdAt: now,
      updatedAt: now,
    });

    resetForm();
    refetch();
  };

  const handleEdit = (template: (typeof templates)[0]) => {
    setEditingId(template.id ?? null);
    setName(template.name);
    setContent(template.content);
    setIsCreating(true);
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
    refetch();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: routes.journaling.overview.path })}
            className="p-1 text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <IconArrowNarrowLeft size={16} />
          </button>
          <h1 className="text-xl font-semibold text-zinc-950">Templates</h1>
        </div>
        {!isCreating && (
          <Button
            onClick={() => setIsCreating(true)}
            variant="primary"
            size="regular"
            shape="semi-round"
            className="flex items-center gap-2"
          >
            <IconPlusFilled size={14} />
            New Template
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-950">
              {editingId ? "Edit Template" : "New Template"}
            </h3>
            <button
              onClick={resetForm}
              className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Cancel
            </button>
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Template name..."
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-all"
          />

          <div className="rounded-xl border border-zinc-200 p-4">
            <TiptapEditor
              content={content || undefined}
              placeholder="Template content..."
              onChange={setContent}
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending || !name.trim()}
            variant="primary"
            size="regular"
            shape="semi-round"
          >
            {editingId ? "Update Template" : "Save Template"}
          </Button>
        </div>
      )}

      {/* Template List */}
      <div className="space-y-3">
        {templates.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
            <p className="text-sm text-zinc-500">No templates yet</p>
            <p className="text-xs text-zinc-400 mt-1">
              Create templates to quickly start journal entries
            </p>
          </div>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className="rounded-xl border border-zinc-200 bg-white p-4 hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-zinc-950">
                  {template.name}
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(template)}
                    className="p-1 text-zinc-400 hover:text-zinc-900 transition-colors"
                  >
                    <IconEdit stroke={2} size={14} />
                  </button>
                  <button
                    onClick={() => template.id && handleDelete(template.id)}
                    className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <IconTrash stroke={2} size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JournalTemplatesContainer;
