"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Undo,
  Redo,
} from "lucide-react";

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichEditor({
  value,
  onChange,
  placeholder = "내용을 입력하세요",
  minHeight = "120px",
}: RichEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  function handleLinkToggle() {
    if (editor!.isActive("link")) {
      editor!.chain().focus().unsetLink().run();
    } else {
      const url = window.prompt("링크 URL 입력");
      if (url) editor!.chain().focus().setLink({ href: url }).run();
    }
  }

  type ToolbarItem =
    | { separator: true }
    | { icon: React.ReactNode; action: () => void; isActive: boolean; title: string };

  const toolbarItems: ToolbarItem[] = [
    {
      icon: <Bold size={13} />,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      title: "굵게",
    },
    {
      icon: <Italic size={13} />,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      title: "기울임",
    },
    {
      icon: <UnderlineIcon size={13} />,
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
      title: "밑줄",
    },
    { separator: true },
    {
      icon: <Heading2 size={13} />,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
      title: "제목 2",
    },
    {
      icon: <Heading3 size={13} />,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive("heading", { level: 3 }),
      title: "제목 3",
    },
    { separator: true },
    {
      icon: <List size={13} />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      title: "글머리 목록",
    },
    {
      icon: <ListOrdered size={13} />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      title: "번호 목록",
    },
    {
      icon: <Quote size={13} />,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
      title: "인용",
    },
    { separator: true },
    {
      icon: <AlignLeft size={13} />,
      action: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: editor.isActive({ textAlign: "left" }),
      title: "왼쪽 정렬",
    },
    {
      icon: <AlignCenter size={13} />,
      action: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: editor.isActive({ textAlign: "center" }),
      title: "가운데 정렬",
    },
    {
      icon: <AlignRight size={13} />,
      action: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: editor.isActive({ textAlign: "right" }),
      title: "오른쪽 정렬",
    },
    { separator: true },
    {
      icon: <LinkIcon size={13} />,
      action: handleLinkToggle,
      isActive: editor.isActive("link"),
      title: "링크",
    },
    { separator: true },
    {
      icon: <Undo size={13} />,
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
      title: "실행 취소",
    },
    {
      icon: <Redo size={13} />,
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
      title: "다시 실행",
    },
  ];

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-violet-400 focus-within:border-transparent">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-slate-100 bg-slate-50">
        {toolbarItems.map((item, i) =>
          "separator" in item ? (
            <div key={i} className="w-px h-4 bg-slate-200 mx-0.5" />
          ) : (
            <button
              key={i}
              type="button"
              title={item.title}
              onClick={item.action}
              className={`p-1.5 rounded transition-colors ${
                item.isActive
                  ? "text-violet-600 bg-violet-50"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              {item.icon}
            </button>
          )
        )}
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="rich-editor-content px-3 py-2 text-sm text-slate-700 focus:outline-none"
        style={{ minHeight }}
      />

      <style>{`
        .rich-editor-content .tiptap { outline: none; }
        .rich-editor-content .tiptap p.is-editor-empty:first-child::before {
          color: #94a3b8;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .rich-editor-content .tiptap p { margin: 0; line-height: 1.6; }
        .rich-editor-content .tiptap p + p { margin-top: 0.25em; }
        .rich-editor-content .tiptap h2 { font-size: 1rem; font-weight: 600; margin: 0.75em 0 0.25em; color: #1e293b; }
        .rich-editor-content .tiptap h3 { font-size: 0.9rem; font-weight: 600; margin: 0.5em 0 0.25em; color: #334155; }
        .rich-editor-content .tiptap ul { list-style: disc; padding-left: 1.25rem; margin: 0.25em 0; }
        .rich-editor-content .tiptap ol { list-style: decimal; padding-left: 1.25rem; margin: 0.25em 0; }
        .rich-editor-content .tiptap li { margin: 0.1em 0; }
        .rich-editor-content .tiptap blockquote { border-left: 3px solid #e2e8f0; padding-left: 0.75rem; color: #64748b; margin: 0.5em 0; }
        .rich-editor-content .tiptap strong { font-weight: 600; }
        .rich-editor-content .tiptap em { font-style: italic; }
        .rich-editor-content .tiptap u { text-decoration: underline; }
        .rich-editor-content .tiptap a { color: #7c3aed; text-decoration: underline; cursor: pointer; }
        .rich-editor-content .tiptap a:hover { color: #6d28d9; }
      `}</style>
    </div>
  );
}
