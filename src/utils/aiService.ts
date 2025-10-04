// Initialize Hugging Face inference (unused but kept for future use)
// import { HfInference } from '@huggingface/inference';
// const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export interface ParaphraseOptions {
  tone: string;
  grammarCheck: boolean;
  maxLength?: number;
}

export interface ParaphraseResult {
  text: string;
  success: boolean;
  error?: string;
}

// Tone-specific prompts for better paraphrasing (unused but kept for future use)
// const TONE_PROMPTS = {
//   standard: "Paraphrase the following text in a clear, professional manner while preserving the original meaning:",
//   formal: "Rewrite the following text in a formal, academic tone while maintaining the original meaning:",
//   casual: "Rewrite the following text in a casual, conversational tone while keeping the original meaning:",
//   creative: "Rewrite the following text in a creative, engaging style while preserving the original meaning:",
//   academic: "Rewrite the following text in an academic, scholarly tone while maintaining the original meaning:"
// };

export async function paraphraseText(
  text: string, 
  options: ParaphraseOptions
): Promise<ParaphraseResult> {
  try {
    if (!text.trim()) {
      return { text: '', success: false, error: 'Please enter some text to paraphrase' };
    }

    if (text.length > 5000) {
      return { text: '', success: false, error: 'Text is too long. Please keep it under 5,000 characters.' };
    }

    // Use a better approach with direct API call to a paraphrasing model
    const response = await fetch('https://api-inference.huggingface.co/models/tuner007/pegasus_paraphrase', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          max_length: Math.min(options.maxLength || 500, 500),
          temperature: 0.8,
          do_sample: true,
          top_p: 0.9,
          repetition_penalty: 1.1,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      let paraphrasedText = data[0].generated_text || '';
      
      // Apply tone-specific post-processing
      paraphrasedText = applyToneTransformations(paraphrasedText, options.tone);
      
      return {
        text: paraphrasedText,
        success: true
      };
    }

    throw new Error('Invalid response format');

  } catch (error) {
    console.error('Paraphrasing error:', error);
    
    // Fallback to a simple paraphrasing method
    try {
      const fallbackResult = await simpleParaphrase(text, options.tone);
      return {
        text: fallbackResult,
        success: true
      };
    } catch {
      return {
        text: '',
        success: false,
        error: 'Unable to paraphrase text. Please try again later.'
      };
    }
  }
}

// Apply tone-specific transformations to the AI-generated text
function applyToneTransformations(text: string, tone: string): string {
  let transformed = text;
  
  switch (tone) {
    case 'formal':
      transformed = transformed
        .replace(/\b(very|really|quite)\b/gi, '')
        .replace(/\bgood\b/gi, 'excellent')
        .replace(/\bbad\b/gi, 'unfavorable')
        .replace(/\bso\b/gi, 'consequently')
        .replace(/\bget\b/gi, 'obtain')
        .replace(/\bmake\b/gi, 'create')
        .replace(/\bcan't\b/gi, 'cannot')
        .replace(/\bwon't\b/gi, 'will not');
      break;
    case 'casual':
      transformed = transformed
        .replace(/\bexcellent\b/gi, 'great')
        .replace(/\bunfavorable\b/gi, 'bad')
        .replace(/\bconsequently\b/gi, 'so')
        .replace(/\bobtain\b/gi, 'get')
        .replace(/\bcreate\b/gi, 'make')
        .replace(/\bimportant\b/gi, 'big')
        .replace(/\bcannot\b/gi, "can't")
        .replace(/\bwill not\b/gi, "won't");
      break;
    case 'creative':
      transformed = transformed
        .replace(/\bgood\b/gi, 'amazing')
        .replace(/\bbad\b/gi, 'terrible')
        .replace(/\bimportant\b/gi, 'crucial')
        .replace(/\bso\b/gi, 'thus')
        .replace(/\bvery\b/gi, 'incredibly')
        .replace(/\bget\b/gi, 'acquire')
        .replace(/\bmake\b/gi, 'craft');
      break;
    case 'academic':
      transformed = transformed
        .replace(/\bgood\b/gi, 'beneficial')
        .replace(/\bbad\b/gi, 'detrimental')
        .replace(/\bso\b/gi, 'consequently')
        .replace(/\bget\b/gi, 'acquire')
        .replace(/\bmake\b/gi, 'produce')
        .replace(/\bvery\b/gi, 'significantly')
        .replace(/\bimportant\b/gi, 'significant');
      break;
  }
  
  return transformed;
}

// Fallback paraphrasing method using simple text transformations
async function simpleParaphrase(text: string, tone: string): Promise<string> {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  const paraphrasedSentences = sentences.map(sentence => {
    let paraphrased = sentence.trim();
    
    // Apply comprehensive paraphrasing transformations
    paraphrased = paraphrased
      .replace(/\b(very|really|quite|extremely)\b/gi, '')
      .replace(/\bgood\b/gi, 'excellent')
      .replace(/\bbad\b/gi, 'poor')
      .replace(/\bimportant\b/gi, 'significant')
      .replace(/\bso\b/gi, 'therefore')
      .replace(/\bget\b/gi, 'obtain')
      .replace(/\bmake\b/gi, 'create')
      .replace(/\buse\b/gi, 'utilize')
      .replace(/\bhelp\b/gi, 'assist')
      .replace(/\btry\b/gi, 'attempt')
      .replace(/\bcan't\b/gi, 'cannot')
      .replace(/\bwon't\b/gi, 'will not')
      .replace(/\bdon't\b/gi, 'do not')
      .replace(/\bisn't\b/gi, 'is not')
      .replace(/\bwasn't\b/gi, 'was not')
      .replace(/\bweren't\b/gi, 'were not')
      .replace(/\bhasn't\b/gi, 'has not')
      .replace(/\bhaven't\b/gi, 'have not')
      .replace(/\bhadn't\b/gi, 'had not')
      .replace(/\bwouldn't\b/gi, 'would not')
      .replace(/\bshouldn't\b/gi, 'should not')
      .replace(/\bcouldn't\b/gi, 'could not');
    
    // Apply tone-specific transformations
    switch (tone) {
      case 'formal':
        paraphrased = paraphrased
          .replace(/\b(very|really|quite)\b/gi, '')
          .replace(/\bgood\b/gi, 'excellent')
          .replace(/\bbad\b/gi, 'unfavorable')
          .replace(/\bso\b/gi, 'consequently')
          .replace(/\bget\b/gi, 'obtain')
          .replace(/\bmake\b/gi, 'create');
        break;
      case 'casual':
        paraphrased = paraphrased
          .replace(/\bexcellent\b/gi, 'great')
          .replace(/\bunfavorable\b/gi, 'bad')
          .replace(/\bconsequently\b/gi, 'so')
          .replace(/\bobtain\b/gi, 'get')
          .replace(/\bcreate\b/gi, 'make')
          .replace(/\bimportant\b/gi, 'big');
        break;
      case 'creative':
        paraphrased = paraphrased
          .replace(/\bgood\b/gi, 'amazing')
          .replace(/\bbad\b/gi, 'terrible')
          .replace(/\bimportant\b/gi, 'crucial')
          .replace(/\bso\b/gi, 'thus')
          .replace(/\bvery\b/gi, 'incredibly');
        break;
      case 'academic':
        paraphrased = paraphrased
          .replace(/\bgood\b/gi, 'beneficial')
          .replace(/\bbad\b/gi, 'detrimental')
          .replace(/\bso\b/gi, 'consequently')
          .replace(/\bget\b/gi, 'acquire')
          .replace(/\bmake\b/gi, 'produce')
          .replace(/\bvery\b/gi, 'significantly');
        break;
    }
    
    return paraphrased;
  });
  
  return paraphrasedSentences.join('. ') + (text.endsWith('.') ? '.' : '');
}

// Alternative: Use a different free AI service
export async function paraphraseWithAlternativeService(
  text: string, 
  options: ParaphraseOptions
): Promise<ParaphraseResult> {
  try {
    // Using a better paraphrasing model
    const response = await fetch('https://api-inference.huggingface.co/models/tuner007/pegasus_paraphrase', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          max_length: options.maxLength || 500,
          temperature: 0.8,
          do_sample: true,
          top_p: 0.9,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      return {
        text: data[0].generated_text || text,
        success: true
      };
    }

    throw new Error('Invalid response format');

  } catch (error) {
    console.error('Alternative paraphrasing error:', error);
    return {
      text: '',
      success: false,
      error: 'Paraphrasing service unavailable. Please try again later.'
    };
  }
}