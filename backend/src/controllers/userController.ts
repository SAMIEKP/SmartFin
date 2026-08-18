import { Response } from 'express';
import { query } from '../config/database';

export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const {
      email, name, phone, location, incomeRange, income_range,
      segment, district, cityVillage, city_village, needs,
      language, institutionName, institutionType, registrationNumber,
      lendingPolicy, interestPolicy, latePaymentPolicy, dataPrivacyStatement,
      notificationPreferences, twoFactorEnabled
    } = req.body;

    const result = await query(
      `UPDATE users
       SET email = COALESCE($1, email),
           name = COALESCE($2, name),
           phone = COALESCE($3, phone),
           location = COALESCE($4, location),
           income_range = COALESCE($5, income_range),
           segment = COALESCE($6, segment),
           district = COALESCE($7, district),
           city_village = COALESCE($8, city_village),
           needs = COALESCE($9, needs),
           language = COALESCE($10, language),
           institution_name = COALESCE($12, institution_name),
           institution_type = COALESCE($13, institution_type),
           registration_number = COALESCE($14, registration_number),
           lending_policy = COALESCE($15, lending_policy),
           interest_policy = COALESCE($16, interest_policy),
           late_payment_policy = COALESCE($17, late_payment_policy),
           data_privacy_statement = COALESCE($18, data_privacy_statement),
           notification_preferences = COALESCE($19, notification_preferences),
           profile_status = CASE WHEN $6 IS NOT NULL OR $7 IS NOT NULL OR $8 IS NOT NULL OR $9 IS NOT NULL THEN 'needs_verification' ELSE profile_status END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING id, email, role, name, phone, location, income_range, segment, district, city_village, language, needs, profile_status, provider_status, institution_name, institution_type, registration_number, is_verified, updated_at`,
      [email, name, phone, location, incomeRange ?? income_range, segment, district, cityVillage ?? city_village,
        needs == null ? null : JSON.stringify(needs), language, userId, institutionName, institutionType, registrationNumber,
        lendingPolicy, interestPolicy, latePaymentPolicy, dataPrivacyStatement,
        notificationPreferences == null ? null : JSON.stringify({ ...notificationPreferences, two_factor: twoFactorEnabled })]
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
            `SELECT a.*, p.name as product_name, u.institution_name as provider_name,
              COALESCE((SELECT json_agg(json_build_object('id', m.id, 'name', m.name, 'mimeType', m.mime_type, 'sizeBytes', m.size_bytes, 'url', '/api/applications/media/' || m.id)) FROM application_media m WHERE m.application_id = a.id), '[]'::json) AS media
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
