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

    const uploadedDocuments = Array.isArray(documents) ? documents : [];
    for (const document of uploadedDocuments) {
      const match = typeof document?.url === 'string' ? document.url.match(/^data:([^;]+);base64,(.+)$/) : null;
      if (!match) continue;
      await query(
        `INSERT INTO application_media (application_id, owner_user_id, name, mime_type, size_bytes, content_base64)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [result.rows[0].id, userId, document.name || 'Application document', match[1], Buffer.from(match[2], 'base64').length, match[2]]
      );
    }

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
      SELECT a.*, u.name as user_name, u.email as user_email, u.phone as user_phone, u.location,
              p.name as product_name, p.category as product_category, p.required_documents,
              COALESCE((SELECT json_agg(json_build_object('id', m.id, 'name', m.name, 'mimeType', m.mime_type, 'sizeBytes', m.size_bytes, 'url', '/api/applications/media/' || m.id)) FROM application_media m WHERE m.application_id = a.id), '[]'::json) AS media
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

    if (!['pending', 'under_review', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Bad Request', message: 'Invalid application status' });
    }

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

    const application = result.rows[0];
    if (status === 'approved' || status === 'rejected') {
      const product = await query(
        'SELECT name, interest_rate, tenure, repayment_schedule FROM loan_products WHERE id = $1',
        [application.product_id]
      );
      const productName = product.rows[0]?.name || 'your application';
      const title = status === 'approved' ? 'Loan application approved' : 'Loan application decision';
      const message = status === 'approved'
        ? `Your application for ${productName} has been approved.`
        : `Your application for ${productName} was rejected.${notes ? ` ${notes}` : ''}`;
      await query(
        `INSERT INTO notifications (user_id, type, title, message) VALUES ($1, $2, $3, $4)`,
        [application.user_id, status === 'approved' ? 'approval' : 'rejection', title, message]
      );

      if (status === 'approved') {
        const amount = Number(application.answers?.amount || 0);
        const termMatch = String(product.rows[0]?.tenure || '12').match(/\d+/);
        const term = Math.max(1, Number(termMatch?.[0] || 12));
        const payment = Math.round(amount / term);
        const schedule = Array.from({ length: term }, (_, index) => ({
          period: index + 1,
          amount: payment,
          status: 'upcoming'
        }));
        await query(
          `INSERT INTO approved_loans (application_id, user_id, product_id, outstanding_balance, next_payment_due, payment_amount, payment_frequency, schedule)
           VALUES ($1, $2, $3, $4, CURRENT_DATE + INTERVAL '30 days', $5, $6, $7)
           ON CONFLICT (application_id) DO NOTHING`,
          [applicationId, application.user_id, application.product_id, amount, payment, product.rows[0]?.repayment_schedule || 'monthly', JSON.stringify(schedule)]
        );
      }
    }

    res.status(200).json({
      message: 'Application status updated successfully',
      application
    });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to update application status' 
    });
  }
};

export const getUserNotifications = async (req: any, res: Response) => {
  const result = await query(
    'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
    [req.user.id]
  );
  res.status(200).json({ notifications: result.rows });
};

export const markNotificationRead = async (req: any, res: Response) => {
  await query('UPDATE notifications SET read_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2', [req.params.notificationId, req.user.id]);
  res.status(200).json({ message: 'Notification marked as read' });
};

export const getUserLoans = async (req: any, res: Response) => {
  const result = await query(
    `SELECT l.*, p.name AS product_name, u.institution_name AS provider_name
     FROM approved_loans l
     JOIN loan_products p ON p.id = l.product_id
     JOIN users u ON u.id = p.provider_id
     WHERE l.user_id = $1 ORDER BY l.created_at DESC`,
    [req.user.id]
  );
  res.status(200).json({ loans: result.rows });
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
             COALESCE((SELECT json_agg(json_build_object('id', m.id, 'name', m.name, 'mimeType', m.mime_type, 'sizeBytes', m.size_bytes, 'url', '/api/applications/media/' || m.id)) FROM application_media m WHERE m.application_id = a.id), '[]'::json) AS media,
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

export const getApplicationMedia = async (req: any, res: Response) => {
  const result = await query(
    `SELECT m.* FROM application_media m
     JOIN applications a ON a.id = m.application_id
     JOIN loan_products p ON p.id = a.product_id
     WHERE m.id = $1 AND (m.owner_user_id = $2 OR p.provider_id = $2)`,
    [req.params.mediaId, req.user.id]
  );
  if (!result.rows.length) return res.status(404).json({ error: 'Not Found', message: 'Document not found' });
  const media = result.rows[0];
  res.setHeader('Content-Type', media.mime_type);
  res.setHeader('Content-Disposition', `${req.query.download === 'true' ? 'attachment' : 'inline'}; filename="${media.name.replace(/"/g, '')}"`);
  res.send(Buffer.from(media.content_base64, 'base64'));
};
