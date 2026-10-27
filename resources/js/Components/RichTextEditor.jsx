import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { 
  FiBold, FiItalic, FiList, FiCheckSquare, 
  FiLink, FiRotateCcw, FiRotateCw 
} from 'react-icons/fi';

export default function RichTextEditor({ value, onChange, placeholder = 'Tulis itinerary lengkap...' }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [3, 4] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#D7B77A] underline',
        },
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'min-h-[180px] p-4 text-xs text-[#F1EBDD] bg-[#14251F] focus:outline-none prose prose-invert max-w-none prose-sm',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Masukkan URL:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="border border-[#242820] rounded-lg overflow-hidden bg-[#14251F]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-[#0E1A16] border-b border-[#242820]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded text-xs transition ${editor.isActive('bold') ? 'bg-[#242820] text-[#D7B77A]' : 'text-stone-400 hover:text-white'}`}
          title="Bold"
        >
          <FiBold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded text-xs transition ${editor.isActive('italic') ? 'bg-[#242820] text-[#D7B77A]' : 'text-stone-400 hover:text-white'}`}
          title="Italic"
        >
          <FiItalic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 rounded text-[11px] font-semibold transition ${editor.isActive('heading', { level: 3 }) ? 'bg-[#242820] text-[#D7B77A]' : 'text-stone-400 hover:text-white'}`}
          title="Heading"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded text-xs transition ${editor.isActive('bulletList') ? 'bg-[#242820] text-[#D7B77A]' : 'text-stone-400 hover:text-white'}`}
          title="Bullet List"
        >
          <FiList className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded text-xs transition ${editor.isActive('orderedList') ? 'bg-[#242820] text-[#D7B77A]' : 'text-stone-400 hover:text-white'}`}
          title="Numbered List"
        >
          <FiCheckSquare className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded text-xs transition ${editor.isActive('link') ? 'bg-[#242820] text-[#D7B77A]' : 'text-stone-400 hover:text-white'}`}
          title="Add Link"
        >
          <FiLink className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-4 bg-[#242820] mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-1.5 text-stone-400 hover:text-white transition"
          title="Undo"
        >
          <FiRotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-1.5 text-stone-400 hover:text-white transition"
          title="Redo"
        >
          <FiRotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Editor Body */}
      <EditorContent editor={editor} />
    </div>
  );
}