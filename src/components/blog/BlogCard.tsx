import Link from 'next/link';

interface BlogCardProps {
    post: {
        id: number;
        title: string;
        slug: string;
        excerpt: string;
        coverImage: string | null;
        category: string;
        createdAt: Date;
    };
    dark?: boolean;
}

export default function BlogCard({ post, dark = false }: BlogCardProps) {
    return (
        <Link href={`/blog/${post.slug}`} className="group h-full block">
            <div className={`rounded-[2rem] border overflow-hidden transition-all duration-500 flex flex-col h-full relative ${dark
                    ? 'bg-slate-900/40 border-white/5 hover:border-white/20 hover:shadow-blue-500/10 hover:shadow-2xl'
                    : 'bg-white border-gray-100 hover:shadow-2xl hover:-translate-y-2'
                }`}>
                {/* Image Container */}
                <div className="aspect-[16/10] relative overflow-hidden bg-gray-50/5">
                    {post.coverImage ? (
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                        />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center text-4xl opacity-50 ${dark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                            📄
                        </div>
                    )}
                    <div className="absolute top-4 left-4">
                        <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm border backdrop-blur-md ${dark
                                ? 'bg-white/10 text-white border-white/10'
                                : 'bg-white/90 text-gray-900 border-gray-100'
                            }`}>
                            {post.category}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-6 h-[1px] bg-blue-500"></span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${dark ? 'text-blue-400' : 'text-blue-600'}`}>
                            {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>

                    <h3 className={`text-2xl font-black mb-4 group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {post.title}
                    </h3>

                    <p className={`text-sm leading-relaxed mb-8 line-clamp-3 font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                        {post.excerpt}
                    </p>

                    <div className={`mt-auto flex items-center justify-between pt-6 border-t ${dark ? 'border-white/5' : 'border-gray-50'}`}>
                        <span className={`font-black text-xs uppercase tracking-tighter flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
                            Explore <span className={`h-px transition-all ${dark ? 'bg-white w-8 group-hover:w-12' : 'bg-gray-900 w-8 group-hover:w-12'}`}></span>
                        </span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${dark
                                ? 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white'
                                : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                            }`}>
                            →
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
