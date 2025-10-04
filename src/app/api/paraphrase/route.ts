import { NextRequest, NextResponse } from 'next/server';
import { paraphraseText, paraphraseWithAlternativeService } from '@/utils/aiService';

export async function POST(request: NextRequest) {
  try {
    const { text, tone, grammarCheck, maxLength } = await request.json();

    console.log('Paraphrase API called with:', { text: text.substring(0, 100) + '...', tone, grammarCheck, maxLength });

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: 'Text is too long. Maximum 5,000 characters allowed.' },
        { status: 400 }
      );
    }

    // Check if API key is available
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    console.log('API Key available:', !!apiKey);

    // Try primary service first
    let result = await paraphraseText(text, {
      tone: tone || 'standard',
      grammarCheck: grammarCheck || false,
      maxLength: maxLength || 500
    });

    console.log('Primary service result:', { success: result.success, textLength: result.text.length });

    // If primary service fails, try alternative
    if (!result.success) {
      console.log('Trying alternative service...');
      result = await paraphraseWithAlternativeService(text, {
        tone: tone || 'standard',
        grammarCheck: grammarCheck || false,
        maxLength: maxLength || 500
      });
      console.log('Alternative service result:', { success: result.success, textLength: result.text.length });
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Paraphrasing failed' },
        { status: 500 }
      );
    }

    console.log('Final result:', { success: true, originalLength: text.length, paraphrasedLength: result.text.length });

    return NextResponse.json({
      success: true,
      text: result.text,
      originalLength: text.length,
      paraphrasedLength: result.text.length
    });

  } catch (error) {
    console.error('Paraphrase API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
