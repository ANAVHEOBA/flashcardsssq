import { Request, Response } from 'express';
import { createUser, authenticateUser } from './auth.crud';

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      res.status(400).json({
        success: false,
        message: 'Email, password, and name are required',
      });
      return;
    }

    // Validate password length
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
      return;
    }

    // Create user
    const user = await createUser({ email, password, name });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: String(user._id),
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error) {
    console.error('Error in register:', error);

    // Handle duplicate email error
    if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
      return;
    }

    // Authenticate user
    const { user, token } = await authenticateUser({ email, password });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: String(user._id),
          email: user.email,
          name: user.name,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Error in login:', error);

    // Handle invalid credentials
    if (error instanceof Error && error.message.includes('Invalid')) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
