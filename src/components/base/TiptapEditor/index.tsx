import { useEffect, useRef } from "react";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TiptapEditorProps {
  content?: string;
  placeholder?: string;
  onChange?: (json: string) => void;
  editable?: boolean;
  className?: string;
}

const TiptapEditor = ({
  content,
  placeholder = "Start writing...",
  onChange,
  editable = true,
  className = "",
}: TiptapEditorProps) => {
  const isLocalUpdate = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    editable,
    onUpdate: ({ editor }) => {
      isLocalUpdate.current = true;
      onChange?.(JSON.stringify(editor.getJSON()));
    },
  });

  useEffect(() => {
    if (isLocalUpdate.current) {
      isLocalUpdate.current = false;
      return;
    }
    if (editor && content) {
      try {
        const parsed = JSON.parse(content);
        editor.commands.setContent(parsed);
      } catch {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editable, editor]);

  if (!editor) return null;

  return (
    <div className={`tiptap-editor ${className}`}>
      {editable && (
        <div className="tiptap-toolbar flex items-center gap-1 border-b border-zinc-200 pb-2 mb-3">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              editor.isActive("bold")
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-slate-600 hover:bg-zinc-200"
            }`}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 rounded text-xs italic transition-colors ${
              editor.isActive("italic")
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-slate-600 hover:bg-zinc-200"
            }`}
          >
            I
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`px-2 py-1 rounded text-xs line-through transition-colors ${
              editor.isActive("strike")
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-slate-600 hover:bg-zinc-200"
            }`}
          >
            S
          </button>
          <div className="w-px h-4 bg-zinc-300 mx-1" />
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
              editor.isActive("heading", { level: 2 })
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-slate-600 hover:bg-zinc-200"
            }`}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
              editor.isActive("heading", { level: 3 })
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-slate-600 hover:bg-zinc-200"
            }`}
          >
            H3
          </button>
          <div className="w-px h-4 bg-zinc-300 mx-1" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              editor.isActive("bulletList")
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-slate-600 hover:bg-zinc-200"
            }`}
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              editor.isActive("orderedList")
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-slate-600 hover:bg-zinc-200"
            }`}
          >
            1. List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              editor.isActive("blockquote")
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-slate-600 hover:bg-zinc-200"
            }`}
          >
            " Quote
          </button>
        </div>
      )}
      <EditorContent editor={editor} className="tiptap-content" />
    </div>
  );
};

export default TiptapEditor;
