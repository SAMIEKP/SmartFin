import { Response } from 'express';
import { query } from '../config/database';

const jsonValue = (value: unknown) => value == null ? null : JSON.stringify(value);

export const createProduct = async (req: any, res: Response) => {
  try {
    const providerId = req.user.id;
    const {
      name,
      category,
      minAmount,
      maxAmount,
      interestRate,
      interestRateMax,
      tenure,
      processingDays,
      collateralRequired,
      collateralText,
      tags,
      rating,
      reviewsCount,
      description,
      eligibilityCriteria,
      requiredDocuments,
      applicationQuestions,
      interestType,
      repaymentSchedule,
      fees
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
       (provider_id, name, category, min_amount, max_amount, interest_rate, interest_rate_max, tenure, processing_days, collateral_required, collateral_text, tags, rating, reviews_count, description, eligibility_criteria, required_documents, application_questions, interest_type, repayment_schedule, fees)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, 0), COALESCE($10, false), $11, COALESCE($12, '[]'), $13, COALESCE($14, 0), $15, $16, $17, $18, COALESCE($19, 'fixed'), COALESCE($20, 'monthly'), COALESCE($21, '[]'))
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
        interestRateMax,
        tenure,
        processingDays,
        collateralRequired,
        collateralText,
        jsonValue(tags),
        rating,
        reviewsCount,
        description,
        jsonValue(eligibilityCriteria),
        jsonValue(requiredDocuments),
        jsonValue(applicationQuestions),
        interestType,
        repaymentSchedule,
        jsonValue(fees)
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
      interestRateMax,
      tenure,
      processingDays,
      collateralRequired,
      collateralText,
      tags,
      rating,
      reviewsCount,
      description,
      eligibilityCriteria,
      requiredDocuments,
      applicationQuestions,
      isActive,
      interestType,
      repaymentSchedule,
      fees
    } = req.body;

    const result = await query(
      `UPDATE loan_products 
       SET name = COALESCE($1, name),
           category = COALESCE($2, category),
           min_amount = COALESCE($3, min_amount),
           max_amount = COALESCE($4, max_amount),
           interest_rate = COALESCE($5, interest_rate),
           interest_rate_max = COALESCE($6, interest_rate_max),
           tenure = COALESCE($7, tenure),
           processing_days = COALESCE($8, processing_days),
           collateral_required = COALESCE($9, collateral_required),
           collateral_text = COALESCE($10, collateral_text),
           tags = COALESCE($11, tags),
           rating = COALESCE($12, rating),
           reviews_count = COALESCE($13, reviews_count),
           description = COALESCE($14, description),
           eligibility_criteria = COALESCE($15, eligibility_criteria),
           required_documents = COALESCE($16, required_documents),
           application_questions = COALESCE($17, application_questions),
           is_active = COALESCE($18, is_active),
           interest_type = COALESCE($19, interest_type),
           repayment_schedule = COALESCE($20, repayment_schedule),
           fees = COALESCE($21, fees),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $22 AND provider_id = $23
       RETURNING *`,
      [
        name,
        category,
        minAmount,
        maxAmount,
        interestRate,
        interestRateMax,
        tenure,
        processingDays,
        collateralRequired,
        collateralText,
        jsonValue(tags),
        rating,
        reviewsCount,
        description,
        jsonValue(eligibilityCriteria),
        jsonValue(requiredDocuments),
        jsonValue(applicationQuestions),
        isActive,
        interestType,
        repaymentSchedule,
        jsonValue(fees),
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
