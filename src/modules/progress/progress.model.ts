import { model } from 'mongoose';
import { IProgressDocument, IQuizSessionDocument } from './progress.interface';
import ProgressSchema, { QuizSessionSchema } from './progress.schema';

const Progress = model<IProgressDocument>('Progress', ProgressSchema);
export const QuizSession = model<IQuizSessionDocument>('QuizSession', QuizSessionSchema);

export default Progress;
