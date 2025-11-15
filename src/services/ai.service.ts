import OpenAI from 'openai';
import { config } from '../config/app.config';
import { IFlashcardGenerated } from '../modules/flashcard/flashcard.interface';

const openai = new OpenAI({
  baseURL: config.openrouter.baseUrl,
  apiKey: config.openrouter.apiKey,
});

// Generate flashcards for a list of keywords
export const generateFlashcardsForKeywords = async (
  language: string,
  keywords: string[]
): Promise<IFlashcardGenerated[]> => {
  try {
    const prompt = `You are an expert programming educator. Generate flashcards for the following ${language} keywords: ${keywords.join(', ')}

For EACH keyword, create a flashcard with:
1. keyword: The exact keyword
2. question: A clear, concise question about what the keyword does (one sentence)
3. answer: A brief explanation (2-3 sentences maximum)
4. codeExample: A small, practical code snippet showing usage (2-5 lines)

Return ONLY a valid JSON array of objects. No markdown, no explanations, just the JSON array.

Example format:
[
  {
    "keyword": "async",
    "question": "What does the async keyword do in ${language}?",
    "answer": "The async keyword declares an asynchronous function that returns a Promise. It allows the use of await inside the function body.",
    "codeExample": "async function fetchData() {\\n  const data = await fetch('api/url');\\n  return data;\\n}"
  }
]

Generate flashcards for ALL ${keywords.length} keywords now:`;

    const completion = await openai.chat.completions.create({
      model: config.openrouter.model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 16000,
    });

    const text = completion.choices[0]?.message?.content || '';

    // Parse the JSON response
    const cleanedText = text.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const flashcards: IFlashcardGenerated[] = JSON.parse(cleanedText);

    return flashcards;
  } catch (error: any) {
    console.error('Error generating flashcards:', error);
    throw new Error(`Failed to generate flashcards: ${error.message}`);
  }
};
