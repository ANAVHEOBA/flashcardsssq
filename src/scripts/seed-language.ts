/**
 * Generic Seeding Script: Generate all flashcards for a specific language
 * 
 * Run with: npx ts-node src/scripts/seed-language.ts <language-slug>
 * Example: npx ts-node src/scripts/seed-language.ts solidity
 */

import mongoose from 'mongoose';
import { config } from '../config/app.config';
import { LanguageModel } from '../modules/language/language.model';
import { FlashcardModel } from '../modules/flashcard/flashcard.model';
import { getKeywordsBySlug, languageKeywords } from '../data/keywords';
import { generateFlashcardsForKeywords } from '../services/ai.service';

const BATCH_SIZE = 5; 
const DELAY_BETWEEN_BATCHES = 2000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function seedLanguage() {
  const slug = process.argv[2];
  
  if (!slug) {
    console.error('❌ Please provide a language slug. Example: npx ts-node src/scripts/seed-language.ts solidity');
    process.exit(1);
  }

  const langInfo = languageKeywords.find(l => l.slug === slug);
  if (!langInfo) {
    console.error(`❌ Language slug "${slug}" not found in src/data/keywords.ts`);
    process.exit(1);
  }

  try {
    console.log(`🔌 Connecting to MongoDB...`);
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');

    const keywords = getKeywordsBySlug(slug);

    // Ensure language exists
    let language = await LanguageModel.findOne({ slug });
    if (!language) {
      console.log(`📝 Creating language: ${langInfo.name}`);
      language = await LanguageModel.create({
        name: langInfo.name,
        slug,
        totalKeywords: keywords.length,
        isGenerated: false
      });
    }

    // Get existing to avoid duplicates
    const existingFlashcards = await FlashcardModel.find({ languageId: language._id }, { keyword: 1 });
    const existingKeywords = new Set(existingFlashcards.map(f => f.keyword));
    const keywordsToGenerate = keywords.filter(k => !existingKeywords.has(k));

    console.log(`🚀 Language: ${langInfo.name}`);
    console.log(`📊 Total keywords: ${keywords.length}`);
    console.log(`⏭️  Already generated: ${existingKeywords.size}`);
    console.log(`📝 To generate: ${keywordsToGenerate.length}\n`);

    if (keywordsToGenerate.length === 0) {
      console.log('✅ All flashcards already exist!');
      await LanguageModel.updateOne({ _id: language._id }, { isGenerated: true });
      return;
    }

    for (let i = 0; i < keywordsToGenerate.length; i += BATCH_SIZE) {
      const batch = keywordsToGenerate.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(keywordsToGenerate.length / BATCH_SIZE);

      console.log(`📦 Batch ${batchNum}/${totalBatches}: [${batch.join(', ')}]`);

      try {
        const generatedCards = await generateFlashcardsForKeywords(langInfo.name, batch);
        
        const flashcardsToSave = generatedCards.map(gc => ({
          languageId: language!._id,
          keyword: gc.keyword,
          question: gc.question,
          answer: gc.answer,
          codeExample: gc.codeExample,
          distractors: gc.distractors || []
        }));

        await FlashcardModel.insertMany(flashcardsToSave);
        console.log(`   ✅ Saved ${flashcardsToSave.length} cards`);

      } catch (error) {
        console.error(`   ❌ Failed batch:`, error instanceof Error ? error.message : error);
      }

      if (i + BATCH_SIZE < keywordsToGenerate.length) {
        await sleep(DELAY_BETWEEN_BATCHES);
      }
    }

    await LanguageModel.updateOne({ _id: language._id }, { isGenerated: true });
    console.log(`\n✨ Successfully seeded ${langInfo.name}!`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedLanguage();
