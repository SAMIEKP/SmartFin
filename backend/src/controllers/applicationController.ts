import { Response } from 'express';
import { query } from '../config/database';

export const createApplication = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { productId, answers, documents } = req.body;

    // Check if product exists and is active
    const productResult = await query(
      'SELECT * FROM loan_products WHERE id = $1 AND is_active = true',
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Loan product not found or inactive' 
      });
    }

    // Check if user already has a pending application for this product
    const existingApplication = await query(
      `SELECT id FROM applications 
       WHERE user_id = $1 AND product_id = $2 AND status IN ('pending', 'under_review')`,
      [userId, productId]
    );

    if (existingApplication.rows.length > 0) {
      return res.status(409).json({ 
        error: 'Conflict',
        message: 'You already have a pending application for this product' 
      });
    }

    const result = await query(
      `INSERT INTO applications (user_id, product_id, answers, documents, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING *`,
      [userId, productId, answers, documents]
    );

    res.status(201).json({
      message: 'Application submitted successfully',
      application: result.rows[0]
    });

  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to submit application' 
    });
  }
};

export const getProviderApplications = async (req: any, res: Response) => {
  try {
    const providerId = req.user.id;
    const { status } = req.query;

    let queryText = `
      SELECT a.*, u.name as user_name, u.email as user_email, u.phone as user_phone,
             p.name as product_name, p.category as product_category
      FROM applications a
      JOIN users u ON a.user_id = u.id
      JOIN loan_products p ON a.product_id = p.id
      WHERE p.provider_id = $1
    `;
    const params: any[] = [providerId];

    if (status) {
      queryText += ` AND a.status = $2`;
      params.push(status);
    }

    queryText += ` ORDER BY a.created_at DESC`;

    const result = await query(queryText, params);

    res.status(200).json({ applications: result.rows });

  } catch (error) {
    console.error('Get provider applications error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to fetch applications' 
    });
  }
};

export const updateApplicationStatus = async (req: any, res: Response) => {
  try {
    const providerId = req.user.id;
    const { applicationId } = req.params;
    const { status, notes } = req.body;

    // Verify that the application belongs to a product from this provider
    const verifyResult = await query(
      `SELECT a.id FROM applications a
       JOIN loan_products p ON a.product_id = p.id
       WHERE a.id = $1 AND p.provider_id = $2`,
      [applicationId, providerId]
    );

    if (verifyResult.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Application not found or unauthorized' 
      });
    }

    const result = await query(
      `UPDATE applications 
       SET status = $1,
           notes = COALESCE($2, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, notes, applicationId]
    );

    res.status(200).json({
      message: 'Application status updated successfully',
      application: result.rows[0]
    });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to update application status' 
    });
  }
};

export const getApplicationDetails = async (req: any, res: Response) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    let queryText = `
      SELECT a.*, u.name as user_name, u.email as user_email, u.phone as user_phone, u.location,
             p.name as product_name, p.category, p.min_amount, p.max_amount, p.interest_rate, p.tenure,
             p.description, p.eligibility_criteria, p.required_documents,
             prov.institution_name, prov.contact_person
      FROM applications a
      JOIN users u ON a.user_id = u.id
      JOIN loan_products p ON a.product_id = p.id
      JOIN users prov ON p.provider_id = prov.id
      WHERE a.id = $1
    `;

    // Add role-based filtering
    if (userRole === 'user') {
      queryText += ` AND a.user_id = $2`;
    } else if (userRole === 'provider') {
      queryText += ` AND p.provider_id = $2`;
    }

    const result = await query(queryText, [applicationId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Application not found or unauthorized' 
      });
    }

    res.status(200).json({ application: result.rows[0] });

  } catch (error) {
    console.error('Get application details error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to fetch application details' 
    });
  }
};
