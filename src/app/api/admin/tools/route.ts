import { NextResponse } from 'next/server';
import { getAllTools } from '@/utils/tools';

export async function GET() {
  try {
    const tools = getAllTools();
    
    return NextResponse.json({
      success: true,
      tools: tools.map(tool => ({
        id: tool.id,
        title: tool.title,
        type: tool.type,
        slug: tool.slug,
        category: tool.category
      }))
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}
