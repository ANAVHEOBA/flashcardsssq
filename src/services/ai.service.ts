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
5. distractors: An array of exactly 4 PLAUSIBLE BUT INCORRECT answers. These should:
   - Sound believable and technical
   - Be similar in length and style to the correct answer
   - Be about related but different programming concepts
   - NOT be obviously wrong or silly
   - Make the quiz challenging for learners

Return ONLY a valid JSON array of objects. No markdown, no explanations, just the JSON array.

Example format:
[
  {
    "keyword": "async",
    "question": "What does the async keyword do in ${language}?",
    "answer": "The async keyword declares an asynchronous function that returns a Promise. It allows the use of await inside the function body.",
    "codeExample": "async function fetchData() {\\n  const data = await fetch('api/url');\\n  return data;\\n}",
    "distractors": [
      "The async keyword creates a new thread for parallel execution, allowing multiple operations to run simultaneously in separate memory spaces.",
      "The async keyword defines a generator function that can pause execution and yield multiple values over time using the next() method.",
      "The async keyword declares a synchronous blocking function that waits for all operations to complete before returning control to the caller.",
      "The async keyword creates a callback queue that processes functions in FIFO order, ensuring sequential execution of asynchronous operations."
    ]
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

// Generate distractors for existing flashcards (migration/update)
export const generateDistractorsForFlashcard = async (
  language: string,
  keyword: string,
  correctAnswer: string
): Promise<string[]> => {
  try {
    const prompt = `You are an expert programming educator. Generate 4 PLAUSIBLE BUT INCORRECT answers for a quiz question about the "${keyword}" keyword in ${language}.

The CORRECT answer is:
"${correctAnswer}"

Generate exactly 4 WRONG answers that:
- MUST start with "The '${keyword}' keyword" or "The ${keyword} keyword" (same format as the correct answer)
- Sound believable and technical (not obviously wrong)
- Are similar in length and style to the correct answer
- Describe plausible but INCORRECT functionality for this keyword
- Would challenge a learner who doesn't fully understand the keyword

IMPORTANT: Every distractor MUST begin by mentioning the "${keyword}" keyword, so all 5 options (1 correct + 4 wrong) look identical in structure.

Return ONLY a valid JSON array of 4 strings. No markdown, no explanations.

Example for "async" keyword:
[
  "The 'async' keyword creates a new thread for parallel execution, allowing multiple operations to run simultaneously.",
  "The 'async' keyword defines a generator function that can pause and yield multiple values over time.",
  "The 'async' keyword declares a synchronous blocking function that waits for all operations to complete.",
  "The 'async' keyword creates a callback queue that processes functions in FIFO order."
]`;

    const completion = await openai.chat.completions.create({
      model: config.openrouter.model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const text = completion.choices[0]?.message?.content || '';
    const cleanedText = text.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const distractors: string[] = JSON.parse(cleanedText);

    // Ensure we have exactly 4 distractors
    if (!Array.isArray(distractors) || distractors.length !== 4) {
      throw new Error('Invalid distractors format');
    }

    return distractors;
  } catch (error: any) {
    console.error('Error generating distractors:', error);
    throw new Error(`Failed to generate distractors: ${error.message}`);
  }
};
