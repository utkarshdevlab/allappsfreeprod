import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import ArticleStructuredData from '@/components/blog/ArticleStructuredData';
import ReaderProgress from '@/components/blog/ReaderProgress';
import { Metadata } from 'next';
import Link from 'next/link';

const GRADIENTS = [
    'from-violet-400 via-purple-500 to-pink-500',
    'from-blue-400 via-cyan-400 to-teal-400',
    'from-pink-400 via-rose-400 to-orange-400',
];

interface PostPageProps {
    params: { slug: string };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const post = await db.query.posts.findFirst({
        where: eq(posts.slug, params.slug),
    });
    if (!post) return {};
    return {
        title: `${post.title} — AllAppsFree Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.createdAt.toISOString(),
            images: post.coverImage ? [post.coverImage] : [],
        },
    };
}

export default async function BlogPostPage({ params }: PostPageProps) {
    const post = await db.query.posts.findFirst({
        where: eq(posts.slug, params.slug),
    });

    if (!post || !post.published) notFound();

    const plainText = post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = plainText ? plainText.split(' ').filter(Boolean).length : 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // Fetch related posts
    const relatedPosts = await db
        .select()
        .from(posts)
        .where(eq(posts.published, true))
        .orderBy(desc(posts.createdAt))
        .limit(3);

    return (
        <div className="min-h-screen bg-[#f7f7f9]">
            <ArticleStructuredData post={post} />
            <ReaderProgress />

            {/* Article */}
            <article className="max-w-3xl mx-auto px-6 pt-20 pb-32">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-12">
                    <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/blog" className="hover:text-gray-700 transition-colors">Blog</Link>
                    <span>/</span>
                    <span className="text-gray-600 line-clamp-1">{post.title}</span>
                </div>

                {/* Category & Date */}
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                        {post.category}
                    </span>
                    <span className="text-sm text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-sm text-gray-400">· {readingTime} min read</span>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight tracking-tighter mb-8">
                    {post.title}
                </h1>

                {/* Excerpt */}
                {post.excerpt && (
                    <p className="text-xl text-gray-500 leading-relaxed mb-12 font-medium border-l-4 border-blue-500 pl-6">
                        {post.excerpt}
                    </p>
                )}

                {/* Cover Image */}
                {post.coverImage && (
                    <div className="w-full aspect-[16/9] rounded-3xl overflow-hidden mb-16 shadow-xl">
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Content */}
                <div className="prose prose-gray prose-lg max-w-none
                    prose-headings:font-black prose-headings:tracking-tight prose-headings:text-gray-900
                    prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                    prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-lg
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-black
                    prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 prose-blockquote:rounded-2xl prose-blockquote:px-8 prose-blockquote:py-4 prose-blockquote:not-italic prose-blockquote:text-gray-700
                    prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:rounded-lg prose-code:px-2 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm
                    prose-pre:bg-gray-950 prose-pre:text-gray-200 prose-pre:rounded-2xl prose-pre:shadow-xl
                    prose-img:rounded-2xl prose-img:shadow-lg
                    prose-ul:space-y-2 prose-ol:space-y-2
                "
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags / Share */}
                <div className="mt-24 pt-12 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-3">Filed under</p>
                        <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-bold hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer">
                            {post.category}
                        </span>
                    </div>
                    <Link href="/blog" className="text-sm font-black uppercase tracking-widest text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2">
                        ← Back to Blog
                    </Link>
                </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="bg-white border-t border-gray-100">
                    <div className="max-w-5xl mx-auto px-6 py-20">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-12">More from the Blog</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {relatedPosts.map((related, i) => (
                                <Link key={related.id} href={`/blog/${related.slug}`} className="group block">
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-sm">
                                        {related.coverImage ? (
                                            <img src={related.coverImage} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        ) : (
                                            <div className={`w-full h-full bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]}`}></div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2 uppercase font-bold tracking-wider">
                                        {new Date(related.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                    <h3 className="text-lg font-black text-gray-900 leading-snug group-hover:text-blue-600 transition-colors tracking-tight">
                                        {related.title}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
