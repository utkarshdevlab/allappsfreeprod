'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import { useEffect, useCallback } from 'react';

interface TiptapEditorProps {
    content: string;
    onChange: (html: string) => void;
    onImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Icon components (inline SVG for zero dependency)
const Icon = ({ path, size = 14 }: { path: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={path} />
    </svg>
);

function ToolbarButton({
    onClick,
    active,
    title,
    children,
    disabled,
}: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            disabled={disabled}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all
                ${active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            {children}
        </button>
    );
}

function Divider() {
    return <div className="w-px h-5 bg-gray-200 mx-1" />;
}

export default function TiptapEditor({ content, onChange, onImageUpload }: TiptapEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3, 4] },
            }),
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-600 underline' } }),
            Image.configure({ HTMLAttributes: { class: 'rounded-xl max-w-full my-4' } }),
            Placeholder.configure({ placeholder: 'Write your article here…' }),
            Highlight.configure({ multicolor: false }),
            Typography,
        ],
        content,
        editorProps: {
            attributes: {
                class: 'outline-none min-h-[500px] prose prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-blue-600 focus:outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    const setLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().unsetLink().run();
            return;
        }
        editor.chain().focus().setLink({ href: url }).run();
    }, [editor]);

    const addImageFromUrl = useCallback(() => {
        if (!editor) return;
        const url = window.prompt('Enter image URL');
        if (url) editor.chain().focus().setImage({ src: url }).run();
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="border-2 border-gray-100 rounded-2xl overflow-hidden bg-white focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
            {/* Toolbar */}
            <div className="flex items-center flex-wrap gap-0.5 px-4 py-3 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">

                {/* Headings dropdown */}
                <select
                    className="h-8 px-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg mr-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={
                        editor.isActive('heading', { level: 1 }) ? 'h1' :
                            editor.isActive('heading', { level: 2 }) ? 'h2' :
                                editor.isActive('heading', { level: 3 }) ? 'h3' :
                                    editor.isActive('heading', { level: 4 }) ? 'h4' : 'p'
                    }
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'p') editor.chain().focus().setParagraph().run();
                        else editor.chain().focus().setHeading({ level: parseInt(val.slice(1)) as 1 | 2 | 3 | 4 }).run();
                    }}
                >
                    <option value="p">Paragraph</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                </select>

                <Divider />

                {/* Text formatting */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (⌘B)">
                    <b style={{ fontSize: 13 }}>B</b>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (⌘I)">
                    <i style={{ fontSize: 13 }}>I</i>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline (⌘U)">
                    <span style={{ fontSize: 13, textDecoration: 'underline' }}>U</span>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
                    <s style={{ fontSize: 13 }}>S</s>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight">
                    <span style={{ fontSize: 13, background: '#fde68a', padding: '0 2px', borderRadius: 2 }}>H</span>
                </ToolbarButton>

                <Divider />

                {/* Alignment */}
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="2" rx="1" /><rect x="3" y="9" width="12" height="2" rx="1" /><rect x="3" y="14" width="18" height="2" rx="1" /><rect x="3" y="19" width="12" height="2" rx="1" /></svg>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Center">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="2" rx="1" /><rect x="6" y="9" width="12" height="2" rx="1" /><rect x="3" y="14" width="18" height="2" rx="1" /><rect x="6" y="19" width="12" height="2" rx="1" /></svg>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="2" rx="1" /><rect x="9" y="9" width="12" height="2" rx="1" /><rect x="3" y="14" width="18" height="2" rx="1" /><rect x="9" y="19" width="12" height="2" rx="1" /></svg>
                </ToolbarButton>

                <Divider />

                {/* Lists */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><circle cx="4" cy="6" r="2" /><rect x="8" y="5" width="13" height="2" rx="1" /><circle cx="4" cy="12" r="2" /><rect x="8" y="11" width="13" height="2" rx="1" /><circle cx="4" cy="18" r="2" /><rect x="8" y="17" width="13" height="2" rx="1" /></svg>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered List">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><text x="1" y="8" fontSize="8" fontWeight="bold">1.</text><rect x="8" y="5" width="13" height="2" rx="1" /><text x="1" y="14" fontSize="8" fontWeight="bold">2.</text><rect x="8" y="11" width="13" height="2" rx="1" /><text x="1" y="20" fontSize="8" fontWeight="bold">3.</text><rect x="8" y="17" width="13" height="2" rx="1" /></svg>
                </ToolbarButton>

                <Divider />

                {/* Block */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" /></svg>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code">
                    <Icon path="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="3" /><path d="M8 10l-3 3 3 3M16 10l3 3-3 3" /></svg>
                </ToolbarButton>

                <Divider />

                {/* Link */}
                <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Insert Link">
                    <Icon path="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                </ToolbarButton>

                {/* Image from URL */}
                <ToolbarButton onClick={addImageFromUrl} active={false} title="Insert Image from URL">
                    <Icon path="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </ToolbarButton>

                {/* Image upload */}
                {onImageUpload && (
                    <label className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 cursor-pointer transition-all" title="Upload Image">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                        </svg>
                        <input type="file" accept="image/*" className="hidden" onChange={onImageUpload} />
                    </label>
                )}

                <Divider />

                {/* History */}
                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} active={false} title="Undo (⌘Z)">
                    <Icon path="M3 10h10a8 8 0 018 8v2M3 10l6 6M3 10l6-6" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} active={false} title="Redo (⌘⇧Z)">
                    <Icon path="M21 10H11A3 3 0 003 13v5h2M21 10l-6 6m6-6l-6-6" size={13} />
                </ToolbarButton>

                {/* Word count */}
                <div className="ml-auto text-[10px] text-gray-400 font-mono font-bold tabular-nums">
                    {editor.storage?.characterCount?.words?.() ?? editor.getText().trim().split(/\s+/).filter(Boolean).length} words
                </div>
            </div>

            {/* Editor content area */}
            <div className="px-8 py-8">
                <EditorContent editor={editor} />
            </div>

            {/* Footer bar */}
            <div className="px-6 py-2 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-mono">Rich Text · Tiptap</span>
                <span className="text-[10px] text-gray-400">
                    {editor.getText().length} chars
                </span>
            </div>
        </div>
    );
}
