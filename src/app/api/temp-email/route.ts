import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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

    const response = await fetch(url);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Temp email API error:', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}
