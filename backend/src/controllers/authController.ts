import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';
import { sendPasswordResetEmail, sendVerificationEmail } from '../services/emailService';

const verificationChannels = ['email'];

const issueToken = (user: any) => jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  { expiresIn: '7d' },
);

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
      branchLocation,
      contactPerson,
      institutionType,
      registrationNumber,
      segment,
      district,
      cityVillage,
      language
    } = req.body;

    // Handle uploaded files for providers
    let registrationCertificatePath: string | null = null;
    let businessLicensePath: string | null = null;
    let taxClearancePath: string | null = null;
    let otherDocumentsPath: string | null = null;

    if (role === 'provider' && req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (files.registrationCertificate && files.registrationCertificate[0]) {
        registrationCertificatePath = files.registrationCertificate[0].path;
      }
      if (files.businessLicense && files.businessLicense[0]) {
        businessLicensePath = files.businessLicense[0].path;
      }
      if (files.taxClearance && files.taxClearance[0]) {
        taxClearancePath = files.taxClearance[0].path;
      }
      if (files.otherDocuments && files.otherDocuments[0]) {
        otherDocumentsPath = files.otherDocuments[0].path;
      }
    }

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

    const verificationChannel = req.body.verificationChannel;
    if (!verificationChannels.includes(verificationChannel)) {
      return res.status(400).json({ error: 'Bad Request', message: 'Email verification is required' });
    }

    if (role === 'provider' && !String(branchLocation || '').trim()) {
      return res.status(400).json({ error: 'Bad Request', message: 'Physical branch location is required for providers' });
    }

    // For providers, ensure contactPerson is set (use institution name if not provided)
    if (role === 'provider' && !contactPerson) {
      contactPerson = institutionName;
    }

    // For providers, validate required documents (only if files were uploaded)
    // This allows existing UI to work without documents while supporting new UI with documents
    if (role === 'provider' && (registrationCertificatePath || businessLicensePath || taxClearancePath || otherDocumentsPath)) {
      // If any documents are uploaded, require at least the mandatory ones
      if (!registrationCertificatePath) {
        return res.status(400).json({ error: 'Bad Request', message: 'Registration certificate is required when uploading documents' });
      }
      if (!businessLicensePath) {
        return res.status(400).json({ error: 'Bad Request', message: 'Business license is required when uploading documents' });
      }
    }

    // Do not create a login-capable account until the verification challenge succeeds.
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

    const verificationCode = String(Math.floor(100000 + Math.random() * 900000));
    const pending = await query(
      `INSERT INTO pending_registrations
       (email, password, role, profile_data, verification_channel, verification_code_hash, verification_expires_at)
       VALUES ($1, $2, $3, $4, $5, crypt($6, gen_salt('bf')), CURRENT_TIMESTAMP + INTERVAL '15 minutes')
       ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, role = EXCLUDED.role,
         profile_data = EXCLUDED.profile_data, verification_channel = EXCLUDED.verification_channel,
         verification_code_hash = EXCLUDED.verification_code_hash, verification_expires_at = EXCLUDED.verification_expires_at
       RETURNING id, email, role`,
      [email.toLowerCase(), hashedPassword, role, JSON.stringify({ 
        name, 
        phone, 
        location, 
        incomeRange, 
        institutionName, 
        branchLocation, 
        contactPerson, 
        institutionType, 
        registrationNumber, 
        segment, 
        district, 
        cityVillage, 
        language,
        registrationCertificatePath,
        businessLicensePath,
        taxClearancePath,
        otherDocumentsPath
      }), verificationChannel, verificationCode]
    );

    try {
      await sendVerificationEmail(email.toLowerCase(), verificationCode);
    } catch (emailError) {
      console.error('Verification email delivery error:', emailError);
      return res.status(503).json({
        error: 'Email Delivery Unavailable',
        message: 'We could not send the verification email. Please try again later or contact support.',
      });
    }

    res.status(202).json({
      message: `A verification code was sent to ${email.toLowerCase()}. Check your email to continue.`,
      verificationId: pending.rows[0].id,
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to register user' 
    });
  }
};

export const verifyRegistration = async (req: Request, res: Response) => {
  try {
    const { verificationId, code } = req.body;
    const pendingResult = await query(
      `SELECT * FROM pending_registrations
       WHERE id = $1 AND verification_expires_at > CURRENT_TIMESTAMP AND crypt($2, verification_code_hash) = verification_code_hash`,
      [verificationId, code]
    );
    if (!pendingResult.rows.length) return res.status(400).json({ error: 'Bad Request', message: 'Invalid or expired verification code' });

    const pending = pendingResult.rows[0];
    const profile = pending.profile_data;
    const providerPending = pending.role === 'provider';
    const userResult = await query(
      `INSERT INTO users (email, password, role, name, phone, location, income_range, institution_name, contact_person, institution_type, registration_number, segment, district, city_village, language, is_verified, provider_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, COALESCE($15, 'en'), true, $16)
       RETURNING *`,
      [pending.email, pending.password, pending.role, profile.name, profile.phone, profile.location || profile.branchLocation, profile.incomeRange, profile.institutionName, profile.contactPerson, profile.institutionType, profile.registrationNumber, profile.segment, profile.district, profile.cityVillage, profile.language, providerPending ? 'pending_review' : 'active']
    );
    const user = userResult.rows[0];
    if (pending.role === 'user') {
      await query(`INSERT INTO individual_profiles (user_id, full_name, location, income_range, segment, district, city_village) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [user.id, profile.name, profile.location, profile.incomeRange, profile.segment, profile.district, profile.cityVillage]);
    } else {
      await query(`INSERT INTO provider_profiles (user_id, institution_name, contact_person, institution_type, registration_number, branch_location, status, available_at, registration_certificate_path, business_license_path, tax_clearance_path, other_documents_path) VALUES ($1, $2, $3, $4, $5, $6, 'pending_review', CURRENT_TIMESTAMP + INTERVAL '12 hours', $7, $8, $9, $10)`, 
        [user.id, profile.institutionName, profile.contactPerson, profile.institutionType, profile.registrationNumber, profile.branchLocation, profile.registrationCertificatePath, profile.businessLicensePath, profile.taxClearancePath, profile.otherDocumentsPath]);
    }
    await query('INSERT INTO verification_events (pending_registration_id, channel, verified_at) VALUES ($1, $2, CURRENT_TIMESTAMP)', [pending.id, pending.verification_channel]);
    await query('DELETE FROM pending_registrations WHERE id = $1', [pending.id]);

    res.status(201).json({ message: providerPending ? 'Provider verified. Account activation is being processed and confirmation will be emailed within 12 hours.' : 'Account verified and created successfully', token: issueToken(user), user });
  } catch (error) {
    console.error('Registration verification error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to verify registration' });
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
      `SELECT u.*, pp.available_at
       FROM users u LEFT JOIN provider_profiles pp ON pp.user_id = u.id
       WHERE u.email = $1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid email or password' 
      });
    }

    const user = result.rows[0];

    if (!user.is_verified) return res.status(403).json({ error: 'Forbidden', message: 'Verify your account before logging in' });
    if (user.role === 'provider' && user.provider_status !== 'active') {
      if (!user.available_at || new Date(user.available_at) > new Date()) {
        return res.status(403).json({ error: 'Forbidden', message: 'Provider account is still being processed. Please wait for the confirmation email.' });
      }
      await query(`UPDATE users SET provider_status = 'active', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [user.id]);
      await query(`UPDATE provider_profiles SET status = 'active', updated_at = CURRENT_TIMESTAMP WHERE user_id = $1`, [user.id]);
      user.provider_status = 'active';
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = issueToken(user);

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

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const userResult = await query('SELECT id FROM users WHERE email = $1', [email]);

    if (userResult.rows.length > 0) {
      const reset = await query(
        `INSERT INTO password_resets (email, code_hash, expires_at)
         VALUES ($1, crypt($2, gen_salt('bf')), CURRENT_TIMESTAMP + INTERVAL '15 minutes')
         RETURNING id`,
        [email, code],
      );
      try {
        await sendPasswordResetEmail(email, code);
      } catch (emailError) {
        console.error('Password reset email delivery error:', emailError);
        return res.status(503).json({ error: 'Email Delivery Unavailable', message: 'We could not send the password reset email. Please try again later.' });
      }
      return res.status(202).json({
        message: 'If an account exists for that email, a password reset code has been sent.',
        resetId: reset.rows[0].id,
      });
    }

    return res.status(202).json({ message: 'If an account exists for that email, a password reset code has been sent.' });
  } catch (error) {
    console.error('Password reset request error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: 'Unable to start password reset' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { resetId, code, password } = req.body;
    const resetResult = await query(
      `SELECT * FROM password_resets
       WHERE id = $1 AND used_at IS NULL AND expires_at > CURRENT_TIMESTAMP
         AND crypt($2, code_hash) = code_hash`,
      [resetId, code],
    );
    if (!resetResult.rows.length) return res.status(400).json({ error: 'Bad Request', message: 'Invalid or expired reset code' });

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
    await query('UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2', [hashedPassword, resetResult.rows[0].email]);
    await query('UPDATE password_resets SET used_at = CURRENT_TIMESTAMP WHERE id = $1', [resetId]);
    return res.status(200).json({ message: 'Password reset successfully. You can now sign in.' });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: 'Unable to reset password' });
  }
};

export const changePassword = async (req: any, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userResult = await query('SELECT password FROM users WHERE id = $1', [req.user.id]);
    if (!userResult.rows.length || !(await bcrypt.compare(currentPassword, userResult.rows[0].password))) {
      return res.status(400).json({ error: 'Bad Request', message: 'Current password is incorrect' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
    await query('UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [hashedPassword, req.user.id]);
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: 'Unable to update password' });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const result = await query(
      'SELECT id, email, role, name, phone, location, income_range, segment, district, city_village, language, needs, profile_status, provider_status, institution_name, contact_person, institution_type, registration_number, avatar_url, is_verified, bio, financial_goal, theme, font_size, two_factor_enabled, lending_policy, interest_policy, late_payment_policy, data_privacy_statement, notification_preferences, created_at FROM users WHERE id = $1',
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
