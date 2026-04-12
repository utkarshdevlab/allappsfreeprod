import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

function isAuthenticated(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    return !!authHeader;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const post = await db.select().from(posts).where(eq(posts.id, parseInt(id))).limit(1);

        if (post.length === 0) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post[0]);
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const { title, slug, content, excerpt, coverImage, category, published } = body;

        const updatedPost = await db.update(posts)
            .set({
                ...(title && { title }),
                ...(slug && { slug }),
                ...(content && { content }),
                ...(excerpt !== undefined && { excerpt }),
                ...(coverImage !== undefined && { coverImage }),
                ...(category && { category }),
                ...(published !== undefined && { published }),
                updatedAt: new Date(),
            })
            .where(eq(posts.id, parseInt(id)))
            .returning();

        if (updatedPost.length === 0) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(updatedPost[0]);
    } catch {
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const deletedPost = await db.delete(posts)
            .where(eq(posts.id, parseInt(id)))
            .returning();

        if (deletedPost.length === 0) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Post deleted successfully' });
    } catch {
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
