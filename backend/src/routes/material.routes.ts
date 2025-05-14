import express, { Request, Response, RequestHandler } from 'express';
import { Material } from '../models/material.model';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware
const validateMaterial = [
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('type').isString().trim().notEmpty().withMessage('Type is required'),
  body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('unit').isString().trim().notEmpty().withMessage('Unit is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('supplier').optional().isString().trim(),
  body('notes').optional().isString().trim(),
];

// Get all materials
router.get('/', (async (req: Request, res: Response) => {
  try {
    const materials = await Material.find().sort({ name: 1 });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching materials' });
  }
}) as RequestHandler);

// Get single material
router.get('/:id', (async (req: Request, res: Response) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching material' });
  }
}) as RequestHandler);

// Create material
router.post('/', validateMaterial, (async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const material = new Material(req.body);
    await material.save();
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: 'Error creating material' });
  }
}) as RequestHandler);

// Update material
router.put('/:id', validateMaterial, (async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: 'Error updating material' });
  }
}) as RequestHandler);

// Delete material
router.delete('/:id', (async (req: Request, res: Response) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting material' });
  }
}) as RequestHandler);

export const materialRoutes = router; 