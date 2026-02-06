import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const width = searchParams.get('width') || '800';
  const height = searchParams.get('height') || '600';
  const category = searchParams.get('category') || '';
  const grayscale = searchParams.get('grayscale') === 'true';
  const blur = searchParams.get('blur') || '0';

  try {
    let url = `https://picsum.photos/${width}/${height}?random=${Date.now()}`;
    if (category) url += `&category=${category}`;
    if (grayscale) url += '&grayscale';
    if (blur !== '0') url += `&blur=${blur}`;

    const response = await fetch(url, { method: 'HEAD' });
    const imageId = response.headers.get('picsum-id') || Date.now().toString();
    
    return NextResponse.json({ 
      success: true,
      url,
      imageId
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to generate image'
    }, { status: 500 });
  }
}
