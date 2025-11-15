import { Response, NextFunction } from 'express';
import { verifyToken, AuthRequest } from '../services/jwt.service';
import { findUserById } from '../modules/auth/auth.crud';

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
      return;
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, invalid token format',
      });
      return;
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, token is invalid or expired',
      });
      return;
    }

    // Get user from token
    const user = await findUserById(decoded.id);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Add user to request
    req.user = {
      id: String(user._id),
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.status(401).json({
      success: false,
      message: 'Not authorized',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
