import { model } from 'mongoose';
import { IUser } from './auth.interface';
import { UserSchema } from './auth.schema';

export const UserModel = model<IUser>('User', UserSchema);
