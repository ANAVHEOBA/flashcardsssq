import { model } from 'mongoose';
import { IProgressDocument } from './progress.interface';
import ProgressSchema from './progress.schema';

const Progress = model<IProgressDocument>('Progress', ProgressSchema);

export default Progress;
