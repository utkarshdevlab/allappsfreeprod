'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Load Tiptap dynamically to avoid SSR issues
const TiptapEditor = dynamic(() => import('@/components/blog/TiptapEditor'), {
    ssr: false,
    loading: () => (
        <div className="border-2 border-gray-100 rounded-2xl min-h-[500px] bg-gray-50 animate-pulse flex items-center justify-center">
            <p className="text-gray-400 text-sm font-medium">Loading editor…</p>
        </div>
    ),
});

function BlogEditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const postId = searchParams.get('id');

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [category, setCategory] = useState('General');
    const [published, setPublished] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: 'success' as 'success' | 'error' });

    useEffect(() => {
        const authenticated = sessionStorage.getItem('admin_authenticated');
        if (authenticated !== 'true') {
            router.push('/admin');
            return;
        }
        if (postId) fetchPost(postId);
    }, [postId, router]);

    const fetchPost = async (id: string) => {
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('admin_token');
            const response = await fetch(`/api/admin/blog/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setTitle(data.title);
                setSlug(data.slug);
                setContent(data.content);
                setExcerpt(data.excerpt || '');
                setCoverImage(data.coverImage || '');
                setCategory(data.category || 'General');
                setPublished(data.published);
            }
        } catch (error) {
            console.error('Failed to fetch post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Upload image for cover or inline content
    const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'inline') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = sessionStorage.getItem('admin_token');
            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                if (type === 'cover') {
                    setCoverImage(data.url);
                } else {
                    // For inline: append an <img> tag to the HTML content
                    setContent(prev => prev + `<img src="${data.url}" alt="Uploaded image" />`);
                }
                setMessage({ text: '✓ Image uploaded', type: 'success' });
            } else {
                setMessage({ text: '✗ Upload failed', type: 'error' });
            }
        } catch {
            setMessage({ text: '✗ Error uploading', type: 'error' });
        }
    }, []);

    const handleInlineImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        handleImageUpload(e, 'inline');
    }, [handleImageUpload]);

    const handleSave = async () => {
        if (!title.trim()) {
            setMessage({ text: '✗ Title is required', type: 'error' });
            return;
        }
        if (!slug.trim()) {
            setMessage({ text: '✗ Slug is required', type: 'error' });
            return;
        }

        setIsSaving(true);
        setMessage({ text: '', type: 'success' });

        try {
            const token = sessionStorage.getItem('admin_token');
            const method = postId ? 'PATCH' : 'POST';
            const url = postId ? `/api/admin/blog/${postId}` : '/api/admin/blog';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, slug, content, excerpt, coverImage, category, published })
            });

            if (response.ok) {
                setMessage({ text: '✓ Saved successfully!', type: 'success' });
                if (!postId) {
                    const data = await response.json();
                    router.push(`/admin/blog/editor?id=${data.id}`);
                }
            } else {
                const error = await response.json();
                setMessage({ text: `✗ ${error.error}`, type: 'error' });
            }
        } catch {
            setMessage({ text: '✗ Save failed', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f7f7f9]">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading post…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f9] flex flex-col">
            {/* Top Header */}
            <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </Link>
                    <div>
                        <h1 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                            {postId ? 'Edit Post' : 'New Article'}
                        </h1>
                        <p className="text-[10px] text-gray-400 font-mono">{slug || 'slug will appear here'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {message.text && (
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                            {message.text}
                        </span>
                    )}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <div className={`relative w-10 h-5 rounded-full transition-colors ${published ? 'bg-blue-600' : 'bg-gray-300'}`} onClick={() => setPublished(p => !p)}>
                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${published ? 'left-5' : 'left-0.5'}`}></div>
                        </div>
                        <span className="text-xs font-bold text-gray-700">{published ? 'Published' : 'Draft'}</span>
                    </label>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-sm disabled:opacity-50 transition-all shadow-md active:scale-95"
                    >
                        {isSaving ? 'Saving…' : '🚀 Save'}
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10 space-y-8">
                {/* Title & Slug */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (!postId) {
                                setSlug(e.target.value.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-').replace(/-+/g, '-'));
                            }
                        }}
                        className="w-full text-5xl font-black text-gray-900 tracking-tighter border-none focus:ring-0 placeholder-gray-200 bg-transparent mb-3"
                        placeholder="Article title…"
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest shrink-0">Slug:</span>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="text-xs font-mono text-blue-600 bg-transparent border-none p-0 focus:ring-0 w-full"
                            placeholder="url-friendly-slug"
                        />
                    </div>
                </div>

                {/* Meta */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cover Image */}
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Cover Image</label>
                        {coverImage && (
                            <div className="mb-3 rounded-xl overflow-hidden aspect-video relative">
                                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                <button onClick={() => setCoverImage('')} className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black text-white rounded-full text-xs flex items-center justify-center transition-all">✕</button>
                            </div>
                        )}
                        <input
                            type="text"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://..."
                        />
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                            Upload cover
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
                        </label>
                    </div>

                    <div className="space-y-4">
                        {/* Category */}
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option>General</option>
                                <option>Tutorial</option>
                                <option>Development</option>
                                <option>Design</option>
                                <option>Announcement</option>
                            </select>
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Excerpt (SEO)</label>
                            <textarea
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Short summary for search engines and social previews…"
                            />
                        </div>
                    </div>
                </div>

                {/* Rich Text Editor */}
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Article Content</label>
                    <TiptapEditor
                        content={content}
                        onChange={setContent}
                        onImageUpload={handleInlineImageUpload}
                    />
                </div>
            </main>
        </div>
    );
}

export default function BlogEditor() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading…</div>}>
            <BlogEditorContent />
        </Suspense>
    );
}
