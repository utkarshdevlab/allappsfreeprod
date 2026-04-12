interface ArticleSchemaProps {
    post: {
        title: string;
        excerpt: string;
        slug: string;
        coverImage: string | null;
        createdAt: Date;
        updatedAt: Date;
        category: string;
    };
}

export default function ArticleStructuredData({ post }: ArticleSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': post.title,
        'description': post.excerpt,
        'image': post.coverImage || 'https://www.allappsfree.com/logo.png',
        'datePublished': post.createdAt.toISOString(),
        'dateModified': post.updatedAt.toISOString(),
        'author': {
            '@type': 'Organization',
            'name': 'AllAppsFree',
            'url': 'https://www.allappsfree.com'
        },
        'publisher': {
            '@type': 'Organization',
            'name': 'AllAppsFree',
            'logo': {
                '@type': 'ImageObject',
                'url': 'https://www.allappsfree.com/logo.png'
            }
        },
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': `https://www.allappsfree.com/blog/${post.slug}`
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
