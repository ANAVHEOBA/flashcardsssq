import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { config } from '../config/app.config';

// JWT User interface
export interface JwtUser {
  id: string;
  email: string;
  name: string;
}

// JWT Payload interface
export interface JwtPayload {
  id: string;
}

// Extend Express Request with user property
export interface AuthRequest extends Request {
  user?: JwtUser;
}

// Generate JWT token
export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as any,
  });
};

// Verify JWT token
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, config.jwtSecret) as JwtPayload;
  } catch (error) {
    return null;
  }
};
