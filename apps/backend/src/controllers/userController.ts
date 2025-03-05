import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { logger } from '../utils/logger';

// Generate JWT token
const generateToken = (id: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  return jwt.sign({ id }, secret, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstName, lastName, department, role } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }
    
    // Create user
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      department,
      role: role || 'user', // Default to user role if not specified
      isActive: true,
      lastLogin: new Date()
    });
    
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department,
        isActive: user.isActive,
        token: generateToken(user._id.toString())
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    logger.error('Error registering user:', error);
    res.status(500).json({
      message: 'Failed to register user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    // Find user by username
    const user = await User.findOne({ username });
    
    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Update last login time
      user.lastLogin = new Date();
      await user.save();
      
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department,
        isActive: user.isActive,
        token: generateToken(user._id.toString())
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    logger.error('Error logging in user:', error);
    res.status(500).json({
      message: 'Failed to login',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    
    const user = await User.findById(req.user.id).select('-password');
    
    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department,
        isActive: user.isActive,
        lastLogin: user.lastLogin
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    logger.error('Error getting user profile:', error);
    res.status(500).json({
      message: 'Failed to get user profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Update fields
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.department = req.body.department || user.department;
    user.email = req.body.email || user.email;
    
    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      department: updatedUser.department,
      isActive: updatedUser.isActive,
      token: generateToken(updatedUser._id.toString())
    });
  } catch (error) {
    logger.error('Error updating user profile:', error);
    res.status(500).json({
      message: 'Failed to update user profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    logger.error('Error getting users:', error);
    res.status(500).json({
      message: 'Failed to get users',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    logger.error('Error getting user by ID:', error);
    res.status(500).json({
      message: 'Failed to get user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Update fields
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.department = req.body.department || user.department;
    user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
    
    if (req.body.role) {
      user.role = req.body.role;
    }
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      department: updatedUser.department,
      isActive: updatedUser.isActive
    });
  } catch (error) {
    logger.error('Error updating user:', error);
    res.status(500).json({
      message: 'Failed to update user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } catch (error) {
    logger.error('Error deleting user:', error);
    res.status(500).json({
      message: 'Failed to delete user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
