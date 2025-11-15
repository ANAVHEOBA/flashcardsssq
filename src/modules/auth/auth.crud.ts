import bcrypt from 'bcryptjs';
import { UserModel } from './auth.model';
import { IUser, IUserInput, ILoginInput } from './auth.interface';
import { generateToken } from '../../services/jwt.service';

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Create a new user
export const createUser = async (userData: IUserInput): Promise<IUser> => {
  // Check if user already exists
  const existingUser = await UserModel.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(userData.password);

  // Create new user
  const newUser = new UserModel({
    email: userData.email,
    password: hashedPassword,
    name: userData.name,
  });

  return await newUser.save();
};

// Find user by email
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return await UserModel.findOne({ email });
};

// Find user by ID
export const findUserById = async (id: string): Promise<IUser | null> => {
  return await UserModel.findById(id).select('-password');
};

// Authenticate user
export const authenticateUser = async (
  loginData: ILoginInput
): Promise<{ user: IUser; token: string }> => {
  // Find user by email
  const user = await findUserByEmail(loginData.email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Compare password
  const isPasswordValid = await comparePassword(loginData.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate token
  const token = generateToken(String(user._id));

  return { user, token };
};
