import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

// Simple auth check helper
function isAuthenticated(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    // In this simple setup, we just check if a token exists. 
    // In a real app, you'd verify this against a session store or JWT.
    return !!authHeader;
}

export async function GET(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));
        return NextResponse.json(allPosts);
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, slug, content, excerpt, coverImage, category, published } = body;

        if (!title || !slug || !content) {
            return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 });
        }

        const newPost = await db.insert(posts).values({
            title,
            slug,
            content,
            excerpt: excerpt || '',
            coverImage: coverImage || '',
            category: category || 'General',
            published: published ?? false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        return NextResponse.json(newPost[0]);
    } catch (error) {
        console.error('Failed to create post:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
