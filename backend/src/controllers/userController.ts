import { Response } from 'express';
import { query } from '../config/database';

export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { email, name, phone, location, incomeRange, institutionName, institutionType, registrationNumber } = req.body;

    const result = await query(
      `UPDATE users 
       SET email = COALESCE($1, email),
           name = COALESCE($2, name),
           phone = COALESCE($3, phone),
           location = COALESCE($4, location),
           income_range = COALESCE($5, income_range),
           institution_name = COALESCE($6, institution_name),
           institution_type = COALESCE($7, institution_type),
           registration_number = COALESCE($8, registration_number),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING id, email, role, name, phone, location, income_range, institution_name, institution_type, registration_number, updated_at`,
      [email, name, phone, location, incomeRange, institutionName, institutionType, registrationNumber, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'User not found' 
      });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to update profile' 
    });
  }
};

export const getApplications = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT a.*, p.name as product_name, u.institution_name as provider_name
       FROM applications a
       JOIN loan_products p ON a.product_id = p.id
       JOIN users u ON p.provider_id = u.id
       WHERE a.user_id = $1
       ORDER BY a.created_at DESC`,
      [userId]
    );

    res.status(200).json({ applications: result.rows });

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to fetch applications' 
    });
  }
};

export const getLoanProducts = async (req: any, res: Response) => {
  try {
    const { category, minAmount, maxAmount } = req.query;

    let queryText = `
      SELECT p.*, u.institution_name as provider_name
      FROM loan_products p
      LEFT JOIN users u ON p.provider_id = u.id
      WHERE p.is_active = true
    `;
    const params: any[] = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      queryText += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (minAmount) {
      paramCount++;
      queryText += ` AND min_amount >= $${paramCount}`;
      params.push(minAmount);
    }

    if (maxAmount) {
      paramCount++;
      queryText += ` AND max_amount <= $${paramCount}`;
      params.push(maxAmount);
    }

    queryText += ` ORDER BY created_at DESC`;

    const result = await query(queryText, params);

    res.status(200).json({ products: result.rows });

  } catch (error) {
    console.error('Get loan products error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to fetch loan products' 
    });
  }
};
