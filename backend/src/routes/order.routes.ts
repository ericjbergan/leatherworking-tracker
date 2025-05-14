import express, { Request, Response, RequestHandler } from 'express';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { body, param, validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware
const validateOrder = [
  body('customerId').isMongoId().withMessage('Invalid customer ID'),
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.productId').isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be a positive number'),
  body('status').isIn(['Pending', 'Processing', 'Completed', 'Cancelled']).withMessage('Invalid status'),
  body('notes').optional().isString().withMessage('Notes must be a string')
];

const validateOrderUpdate = [
  param('id').isMongoId().withMessage('Invalid order ID'),
  body('customerId').optional().isMongoId().withMessage('Invalid customer ID'),
  body('items').optional().isArray().withMessage('Items must be an array'),
  body('items.*.productId').optional().isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('totalAmount').optional().isFloat({ min: 0 }).withMessage('Total amount must be a positive number'),
  body('status').optional().isIn(['Pending', 'Processing', 'Completed', 'Cancelled']).withMessage('Invalid status'),
  body('notes').optional().isString().withMessage('Notes must be a string')
];

// Get all orders
const getAllOrders: RequestHandler = async (req, res) => {
  try {
    const orders = await Order.find().populate('customerId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get a single order
const getOrder: RequestHandler = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customerId');
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// Create a new order
const createOrder: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Update an order
const updateOrder: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// Update order status
const updateOrderStatus: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// Delete an order
const deleteOrder: RequestHandler = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

// Route definitions
router.get('/', getAllOrders);
router.get('/:id', getOrder);
router.post('/', validateOrder, createOrder);
router.put('/:id', validateOrderUpdate, updateOrder);
router.patch('/:id/status', [
  param('id').isMongoId().withMessage('Invalid order ID'),
  body('status').isIn(['Pending', 'Processing', 'Completed', 'Cancelled']).withMessage('Invalid status')
], updateOrderStatus);
router.delete('/:id', deleteOrder);

export const orderRoutes = router; 