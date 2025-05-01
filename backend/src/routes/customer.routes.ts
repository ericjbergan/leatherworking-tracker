import express, { Request, Response } from 'express';
import { Customer } from '../models/customer.model';
import { body, validationResult } from 'express-validator';
import { TypedRequestBody, TypedRequestParams } from '../types/express';

const router = express.Router();

// Validation middleware
const validateCustomer = [
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().isString().trim(),
  body('address').optional().isString().trim(),
];

// Get all customers
router.get('/', async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find().sort({ name: 1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers' });
  }
});

// Get single customer
router.get('/:id', async (req: TypedRequestParams<{ id: string }>, res: Response) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer' });
  }
});

// Create customer
router.post('/', validateCustomer, async (req: TypedRequestBody<{
  name: string;
  email: string;
  phone?: string;
  address?: string;
}>, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer' });
  }
});

// Update customer
router.put('/:id', validateCustomer, async (req: TypedRequestParams<{ id: string }> & TypedRequestBody<{
  name: string;
  email: string;
  phone?: string;
  address?: string;
}>, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer' });
  }
});

// Delete customer
router.delete('/:id', async (req: TypedRequestParams<{ id: string }>, res: Response) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer' });
  }
});

export const customerRoutes = router; 