import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User';
import { loginSchema, registerSchema } from '../validators/schemas';
import { AuthRequest } from '../middleware/authMiddleware';

// 1. Login User
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: parseResult.error.issues[0].message,
      });
      return;
    }

    const { email, password, role } = parseResult.data;
    const cleanEmail = email.toLowerCase().trim();

    let user = await User.findOne({ email: cleanEmail });

    // Seed default admin/employee if first time login test
    if (!user) {
      if (cleanEmail === 'admin@ems.com' && role === 'ADMIN') {
        user = await User.create({
          employeeId: 'ADM-001',
          name: 'Sarah Connor',
          email: 'admin@ems.com',
          passwordHash: 'password123',
          role: 'ADMIN',
          department: 'Human Resources',
          designation: 'HR Director',
          joiningDate: new Date('2022-01-15'),
          status: 'ACTIVE',
        });
      } else if (cleanEmail === 'alex@ems.com' && role === 'EMPLOYEE') {
        user = await User.create({
          employeeId: 'EMP-101',
          name: 'Alex Mercer',
          email: 'alex@ems.com',
          passwordHash: 'password123',
          role: 'EMPLOYEE',
          department: 'Engineering',
          designation: 'Senior Frontend Engineer',
          joiningDate: new Date('2023-03-10'),
          status: 'ACTIVE',
        });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials or user not found' });
        return;
      }
    }

    if (user.role !== role) {
      res.status(403).json({
        success: false,
        message: `Account role is ${user.role}. Please select the correct login portal tab.`,
      });
      return;
    }

    if (user.status !== 'ACTIVE') {
      res.status(403).json({ success: false, message: 'Account has been deactivated' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const tokenPayload = {
      id: user._id.toString(),
      employeeId: user.employeeId,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const secret = process.env.JWT_SECRET || 'super_secret_ems_jwt_token_key_2026';
    const token = jwt.sign(tokenPayload, secret, { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        joiningDate: user.joiningDate,
        status: user.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error during login' });
  }
};

// 2. Register New User
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: parseResult.error.issues[0].message,
      });
      return;
    }

    const { name, email, password, role, department, designation, phone } = parseResult.data;
    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      res.status(409).json({ success: false, message: 'Email address already registered' });
      return;
    }

    const empCode = `${role === 'ADMIN' ? 'ADM' : 'EMP'}-${Math.floor(100 + Math.random() * 900)}`;

    const user = await User.create({
      employeeId: empCode,
      name: name.trim(),
      email: cleanEmail,
      passwordHash: password,
      role: role || 'EMPLOYEE',
      department: department || 'Engineering',
      designation: designation || 'Software Specialist',
      phone,
      joiningDate: new Date(),
      status: 'ACTIVE',
    });

    const tokenPayload = {
      id: user._id.toString(),
      employeeId: user.employeeId,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const secret = process.env.JWT_SECRET || 'super_secret_ems_jwt_token_key_2026';
    const token = jwt.sign(tokenPayload, secret, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        joiningDate: user.joiningDate,
        status: user.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

// 3. Get Current User Profile
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      res.status(404).json({ success: false, message: 'User profile not found' });
      return;
    }

    res.status(200).json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Request Password Reset (Forgot Password)
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Email address is required' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return 200 to prevent email enumeration
      res.status(200).json({
        success: true,
        message: `If account exists for ${email}, a password reset token has been issued.`,
      });
      return;
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 Hour validity
    await user.save();

    console.log(`[AUTH] Reset Token for ${user.email}: ${resetToken}`);

    res.status(200).json({
      success: true,
      message: `Password reset instructions sent to ${email}`,
      resetToken, // Returned for dev testing convenience
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Reset Password using Token
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      res.status(400).json({ success: false, message: 'Reset token and new password are required' });
      return;
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
      return;
    }

    user.passwordHash = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Change Password (Authenticated User)
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Current and new password are required' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Current password does not match' });
      return;
    }

    user.passwordHash = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Update User Profile (Editable Name)
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { name, phone, department, designation } = req.body;
    if (!name || name.trim().length < 2) {
      res.status(400).json({ success: false, message: 'Name must be at least 2 characters long' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User profile not found' });
      return;
    }

    user.name = name.trim();
    if (phone) user.phone = phone.trim();
    if (department) user.department = department.trim();
    if (designation) user.designation = designation.trim();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        joiningDate: user.joiningDate,
        status: user.status,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
