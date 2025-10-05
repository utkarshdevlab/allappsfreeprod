import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const login = searchParams.get('login');
  const domain = searchParams.get('domain');
  const id = searchParams.get('id');

  if (!action || !login || !domain) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    let url = `https://www.1secmail.com/api/v1/?action=${action}&login=${login}&domain=${domain}`;
    
    if (action === 'readMessage' && id) {
      url += `&id=${id}`;
    }

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'API request failed', data: [] }, { status: response.status });
    }

    const text = await response.text();
    
    // Try to parse as JSON
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch {
      // If not JSON, return empty array for messages or error for single message
      if (action === 'getMessages') {
        return NextResponse.json([]);
      }
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
    }
  } catch (error) {
    console.error('Temp email API error:', error);
    return NextResponse.json({ error: 'Failed to fetch emails', data: [] }, { status: 500 });
  }
}
