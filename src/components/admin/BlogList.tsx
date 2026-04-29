'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
    id: number;
    title: string;
    slug: string;
    published: boolean;
    category: string;
    createdAt: number | string;
}

/** Safely parse a createdAt value that may be a Unix timestamp (int seconds),
 *  a Unix timestamp in ms, or an ISO string. */
function parseDate(raw: number | string): Date {
    if (typeof raw === 'number') {
        // SQLite stores as seconds; if the number is < 1e12 it's seconds, else ms
        return new Date(raw < 1e12 ? raw * 1000 : raw);
    }
    return new Date(raw);
}

export default function BlogList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const token = sessionStorage.getItem('admin_token');
            const response = await fetch('/api/admin/blog', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            const token = sessionStorage.getItem('admin_token');
            const response = await fetch(`/api/admin/blog/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setPosts(posts.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Loading posts…</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {posts.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center">
                                    <div className="text-4xl mb-3">📝</div>
                                    <p className="text-gray-500 font-medium">No blog posts yet.</p>
                                    <p className="text-gray-400 text-sm mt-1">Create your first post to get started!</p>
                                </td>
                            </tr>
                        ) : (
                            posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-900">{post.title}</div>
                                        <div className="text-xs text-gray-500 font-mono">/{post.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {post.published ? '● Published' : '○ Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{post.category}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {parseDate(post.createdAt).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', year: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <Link
                                            href={`/admin/blog/editor?id=${post.id}`}
                                            className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                                        >
                                            Edit
                                        </Link>
                                        <a
                                            href={`/blog/${post.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-500 hover:text-gray-800 font-bold text-sm"
                                        >
                                            View
                                        </a>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="text-red-500 hover:text-red-700 font-bold text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
