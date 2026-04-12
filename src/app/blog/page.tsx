import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'The Blog — AllAppsFree',
    description: 'Expert guides, tutorials, and insights from the AllAppsFree team.',
};

// Gradient sets for articles with no cover image
const GRADIENTS = [
    'from-violet-400 via-purple-500 to-pink-500',
    'from-blue-400 via-cyan-400 to-teal-400',
    'from-pink-400 via-rose-400 to-orange-400',
    'from-indigo-500 via-blue-500 to-cyan-400',
    'from-purple-500 via-pink-500 to-rose-400',
    'from-teal-400 via-emerald-400 to-cyan-500',
];

function getGradient(index: number) {
    return GRADIENTS[index % GRADIENTS.length];
}

export default async function BlogPage() {
    const publishedPosts = await db
        .select()
        .from(posts)
        .where(eq(posts.published, true))
        .orderBy(desc(posts.createdAt));

    const featuredPost = publishedPosts[0];
    const gridPosts = publishedPosts.slice(1);

    return (
        <div className="min-h-screen bg-[#f7f7f9]">
            <div className="max-w-5xl mx-auto px-6 py-20">

                {/* Page Title */}
                <h1 className="text-7xl md:text-8xl font-black text-gray-900 tracking-tighter mb-16 leading-none">
                    The Blog
                </h1>

                {publishedPosts.length === 0 ? (
                    <div className="bg-white rounded-3xl p-24 text-center shadow-sm border border-gray-100">
                        <div className="text-6xl mb-6">📭</div>
                        <h2 className="text-3xl font-black text-gray-900 mb-3">No posts yet</h2>
                        <p className="text-gray-400 text-lg">Check back soon for new articles.</p>
                    </div>
                ) : (
                    <div className="space-y-20">

                        {/* Featured Post */}
                        {featuredPost && (
                            <Link href={`/blog/${featuredPost.slug}`} className="group block">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                    {/* Thumbnail */}
                                    <div className="rounded-3xl overflow-hidden aspect-[4/3] relative shadow-lg">
                                        {featuredPost.coverImage ? (
                                            <img
                                                src={featuredPost.coverImage}
                                                alt={featuredPost.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className={`w-full h-full bg-gradient-to-br ${getGradient(0)} flex items-center justify-center`}>
                                                <div className="w-20 h-20 rounded-full bg-white/20 blur-sm"></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <p className="text-sm text-gray-400 font-medium mb-4">
                                            {new Date(featuredPost.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6 group-hover:text-blue-600 transition-colors tracking-tight">
                                            {featuredPost.title}
                                        </h2>
                                        <p className="text-gray-500 text-base leading-relaxed">
                                            {featuredPost.excerpt}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Divider */}
                        {gridPosts.length > 0 && (
                            <div className="h-px bg-gray-200"></div>
                        )}

                        {/* Grid Posts */}
                        {gridPosts.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                {gridPosts.map((post, i) => (
                                    <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                                        {/* Thumbnail */}
                                        <div className="rounded-2xl overflow-hidden aspect-[4/3] relative shadow-sm mb-5">
                                            {post.coverImage ? (
                                                <img
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className={`w-full h-full bg-gradient-to-br ${getGradient(i + 1)}`}></div>
                                            )}
                                        </div>

                                        {/* Meta */}
                                        <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">
                                            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                        <h3 className="text-xl font-black text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors tracking-tight">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
