/**
 * Migration Script: Generate AI distractors for all existing flashcards
 *
 * Run with: npx ts-node src/scripts/generate-all-distractors.ts
 */

import mongoose from 'mongoose';
import { config } from '../config/app.config';
import { FlashcardModel } from '../modules/flashcard/flashcard.model';
import { LanguageModel } from '../modules/language/language.model';
import { generateDistractorsForFlashcard } from '../services/ai.service';

const BATCH_SIZE = 5; // Process 5 flashcards at a time to avoid rate limits
const DELAY_BETWEEN_BATCHES = 2000; // 2 seconds between batches

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateAllDistractors() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Get all languages
    const languages = await LanguageModel.find({ isGenerated: true });
    console.log(`📚 Found ${languages.length} languages with flashcards\n`);

    let totalUpdated = 0;
    let totalErrors = 0;
    let totalSkipped = 0;

    for (const language of languages) {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`🔤 Processing: ${language.name} (${language.slug})`);
      console.log(`${'='.repeat(50)}`);

      // Get flashcards without distractors for this language
      const flashcardsToUpdate = await FlashcardModel.find({
        languageId: language._id,
        $or: [
          { distractors: { $exists: false } },
          { distractors: { $size: 0 } },
          { distractors: null },
        ],
      });

      const flashcardsWithDistractors = await FlashcardModel.countDocuments({
        languageId: language._id,
        distractors: { $exists: true, $not: { $size: 0 } },
      });

      console.log(`   📊 Already have distractors: ${flashcardsWithDistractors}`);
      console.log(`   📝 Need distractors: ${flashcardsToUpdate.length}`);

      if (flashcardsToUpdate.length === 0) {
        console.log(`   ✅ All flashcards already have distractors!`);
        totalSkipped += flashcardsWithDistractors;
        continue;
      }

      // Process in batches
      for (let i = 0; i < flashcardsToUpdate.length; i += BATCH_SIZE) {
        const batch = flashcardsToUpdate.slice(i, i + BATCH_SIZE);
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(flashcardsToUpdate.length / BATCH_SIZE);

        console.log(`\n   📦 Batch ${batchNum}/${totalBatches}:`);

        for (const flashcard of batch) {
          try {
            process.stdout.write(`      • ${flashcard.keyword.padEnd(20)}`);

            const distractors = await generateDistractorsForFlashcard(
              language.name,
              flashcard.keyword,
              flashcard.answer
            );

            await FlashcardModel.findByIdAndUpdate(flashcard._id, { distractors });

            console.log('✅');
            totalUpdated++;
          } catch (error) {
            console.log(`❌ ${error instanceof Error ? error.message : 'Unknown error'}`);
            totalErrors++;
          }
        }

        // Delay between batches to avoid rate limiting
        if (i + BATCH_SIZE < flashcardsToUpdate.length) {
          console.log(`\n   ⏳ Waiting ${DELAY_BETWEEN_BATCHES / 1000}s before next batch...`);
          await sleep(DELAY_BETWEEN_BATCHES);
        }
      }
    }

    // Summary
    console.log(`\n${'='.repeat(50)}`);
    console.log('📊 MIGRATION COMPLETE');
    console.log(`${'='.repeat(50)}`);
    console.log(`   ✅ Updated: ${totalUpdated}`);
    console.log(`   ⏭️  Skipped (already had): ${totalSkipped}`);
    console.log(`   ❌ Errors: ${totalErrors}`);
    console.log(`${'='.repeat(50)}\n`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the migration
generateAllDistractors();


