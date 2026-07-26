import { Response } from 'express';
import { query } from '../config/database';

export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { name, phone, location, incomeRange } = req.body;

    const result = await query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           location = COALESCE($3, location),
           income_range = COALESCE($4, income_range),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, email, role, name, phone, location, income_range, updated_at`,
      [name, phone, location, incomeRange, userId]
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
      `SELECT a.*, p.name as product_name, p.institution_name 
       FROM applications a
       JOIN loan_products p ON a.product_id = p.id
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
      SELECT * FROM loan_products 
      WHERE is_active = true
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
