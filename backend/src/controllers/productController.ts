import { Response } from 'express';
import { query } from '../config/database';

export const createProduct = async (req: any, res: Response) => {
  try {
    const providerId = req.user.id;
    const {
      name,
      category,
      minAmount,
      maxAmount,
      interestRate,
      tenure,
      description,
      eligibilityCriteria,
      requiredDocuments,
      applicationQuestions
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Service name and category are required'
      });
    }

    const duplicate = await query(
      'SELECT id FROM loan_products WHERE provider_id = $1 AND LOWER(name) = LOWER($2)',
      [providerId, name.trim()]
    );
    if (duplicate.rows.length > 0) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'A service with this name already exists for this provider'
      });
    }

    const result = await query(
      `WITH inserted AS (
       INSERT INTO loan_products 
       (provider_id, name, category, min_amount, max_amount, interest_rate, tenure, description, eligibility_criteria, required_documents, application_questions)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *
       )
       SELECT inserted.*, u.institution_name AS provider_name
       FROM inserted
       JOIN users u ON u.id = inserted.provider_id`,
      [
        providerId,
        name.trim(),
        category,
        minAmount,
        maxAmount,
        interestRate,
        tenure,
        description,
        eligibilityCriteria,
        requiredDocuments,
        applicationQuestions
      ]
    );

    res.status(201).json({
      message: 'Loan product created successfully',
      product: result.rows[0]
    });

  } catch (error: any) {
    console.error('Create product error:', error);
    if (error?.code === '23505') {
      return res.status(409).json({
        error: 'Conflict',
        message: 'A service with this name already exists for this provider'
      });
    }
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to create loan product' 
    });
  }
};

export const getProviderProducts = async (req: any, res: Response) => {
  try {
    const providerId = req.user.id;

    const result = await query(
      `SELECT p.*, u.institution_name AS provider_name
       FROM loan_products p
       JOIN users u ON u.id = p.provider_id
       WHERE p.provider_id = $1
       ORDER BY p.created_at DESC`,
      [providerId]
    );

    res.status(200).json({ products: result.rows });

  } catch (error) {
    console.error('Get provider products error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to fetch provider products' 
    });
  }
};

export const updateProduct = async (req: any, res: Response) => {
  try {
    const providerId = req.user.id;
    const { productId } = req.params;
    const {
      name,
      category,
      minAmount,
      maxAmount,
      interestRate,
      tenure,
      description,
      eligibilityCriteria,
      requiredDocuments,
      applicationQuestions,
      isActive
    } = req.body;

    const result = await query(
      `UPDATE loan_products 
       SET name = COALESCE($1, name),
           category = COALESCE($2, category),
           min_amount = COALESCE($3, min_amount),
           max_amount = COALESCE($4, max_amount),
           interest_rate = COALESCE($5, interest_rate),
           tenure = COALESCE($6, tenure),
           description = COALESCE($7, description),
           eligibility_criteria = COALESCE($8, eligibility_criteria),
           required_documents = COALESCE($9, required_documents),
           application_questions = COALESCE($10, application_questions),
           is_active = COALESCE($11, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $12 AND provider_id = $13
       RETURNING *`,
      [
        name,
        category,
        minAmount,
        maxAmount,
        interestRate,
        tenure,
        description,
        eligibilityCriteria,
        requiredDocuments,
        applicationQuestions,
        isActive,
        productId,
        providerId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Product not found or unauthorized' 
      });
    }

    const product = result.rows[0];
    const provider = await query('SELECT institution_name AS provider_name FROM users WHERE id = $1', [providerId]);

    res.status(200).json({
      message: 'Product updated successfully',
      product: { ...product, provider_name: provider.rows[0]?.provider_name }
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to update product' 
    });
  }
};

export const deleteProduct = async (req: any, res: Response) => {
  try {
    const providerId = req.user.id;
    const { productId } = req.params;

    const result = await query(
      `DELETE FROM loan_products 
       WHERE id = $1 AND provider_id = $2
       RETURNING id`,
      [productId, providerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Product not found or unauthorized' 
      });
    }

    res.status(200).json({
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to delete product' 
    });
  }
};
