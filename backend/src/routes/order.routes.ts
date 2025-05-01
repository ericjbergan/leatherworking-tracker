import express, { Request, Response } from 'express';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { body, validationResult } from 'express-validator';
import { TypedRequestBody, TypedRequestParams } from '../types/express';

const router = express.Router();

// Validation middleware
const validateOrder = [
  body('customerId').isMongoId().withMessage('Valid customer ID is required'),
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.productId').isMongoId().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('status').isIn(['Pending', 'Processing', 'Completed', 'Cancelled']).withMessage('Invalid status'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be a positive number'),
  body('notes').optional().isString().trim(),
];

// Get all orders
router.get('/', async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get single order
router.get('/:id', async (req: TypedRequestParams<{ id: string }>, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' });
  }
});

// Create order
router.post('/', validateOrder, async (req: TypedRequestBody<{
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  totalAmount: number;
  notes?: string;
}>, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Update order
router.put('/:id', validateOrder, async (req: TypedRequestParams<{ id: string }> & TypedRequestBody<{
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  totalAmount: number;
  notes?: string;
}>, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order' });
  }
});

// Update order status
router.patch('/:id/status', [
  body('status').isIn(['Pending', 'Processing', 'Completed', 'Cancelled']).withMessage('Invalid status')
], async (req: TypedRequestParams<{ id: string }> & TypedRequestBody<{
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
}>, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// Delete order
router.delete('/:id', async (req: TypedRequestParams<{ id: string }>, res: Response) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order' });
  }
});

export const orderRoutes = router; 