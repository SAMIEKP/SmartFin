import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';

export const register = async (req: Request, res: Response) => {
  try {
    const { 
      email, 
      password, 
      role, 
      name, 
      phone, 
      location, 
      incomeRange,
      institutionName,
      contactPerson,
      institutionType,
      registrationNumber,
      segment,
      district,
      cityVillage,
      language
    } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Email, password, and role are required' 
      });
    }

    if (!['user', 'provider'].includes(role)) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Role must be either "user" or "provider"' 
      });
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        error: 'Conflict',
        message: 'User with this email already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user based on role
    let user;
    if (role === 'user') {
      user = await query(
        `INSERT INTO users (email, password, role, name, phone, location, income_range, segment, district, city_village, language)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, COALESCE($11, 'en'))
         RETURNING id, email, role, name, phone, location, income_range, segment, district, city_village, language, profile_status, created_at`,
        [email.toLowerCase(), hashedPassword, role, name, phone, location, incomeRange, segment, district, cityVillage, language]
      );
    } else {
      user = await query(
        `INSERT INTO users (email, password, role, institution_name, phone, contact_person, institution_type, registration_number, language)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, 'en'))
         RETURNING id, email, role, institution_name, phone, contact_person, institution_type, registration_number, language, provider_status, created_at`,
        [email.toLowerCase(), hashedPassword, role, institutionName, phone, contactPerson, institutionType, registrationNumber, language]
      );
    }

    const newUser = user.rows[0];

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email, 
        role: newUser.role 
      },
      secret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name || newUser.contact_person,
        phone: newUser.phone,
        institutionName: newUser.institution_name,
        institutionType: newUser.institution_type,
        registrationNumber: newUser.registration_number,
        language: newUser.language,
        profile_status: newUser.profile_status,
        provider_status: newUser.provider_status
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to register user' 
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Email and password are required' 
      });
    }

    // Find user
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid email or password' 
      });
    }

    const user = result.rows[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      secret,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name || user.contact_person,
        institutionName: user.institution_name,
        language: user.language,
        segment: user.segment,
        district: user.district,
        cityVillage: user.city_village,
        profile_status: user.profile_status,
        provider_status: user.provider_status
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to login' 
    });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const result = await query(
      'SELECT id, email, role, name, phone, location, income_range, segment, district, city_village, language, needs, profile_status, provider_status, institution_name, contact_person, institution_type, registration_number, is_verified, lending_policy, interest_policy, late_payment_policy, data_privacy_statement, notification_preferences, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'User not found' 
      });
    }

    res.status(200).json({ user: result.rows[0] });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to fetch user profile' 
    });
  }
};
