import express, { Request, Response } from 'express';
import { Material } from '../models/material.model';
import { body, validationResult } from 'express-validator';
import { TypedRequestBody, TypedRequestParams } from '../types/express';

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
router.get('/', async (req: Request, res: Response) => {
  try {
    const materials = await Material.find().sort({ name: 1 });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching materials' });
  }
});

// Get single material
router.get('/:id', async (req: TypedRequestParams<{ id: string }>, res: Response) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching material' });
  }
});

// Create material
router.post('/', validateMaterial, async (req: TypedRequestBody<{
  name: string;
  type: string;
  quantity: number;
  unit: string;
  price: number;
  supplier?: string;
  notes?: string;
}>, res: Response) => {
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
});

// Update material
router.put('/:id', validateMaterial, async (req: TypedRequestParams<{ id: string }> & TypedRequestBody<{
  name: string;
  type: string;
  quantity: number;
  unit: string;
  price: number;
  supplier?: string;
  notes?: string;
}>, res: Response) => {
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
});

// Delete material
router.delete('/:id', async (req: TypedRequestParams<{ id: string }>, res: Response) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting material' });
  }
});

export const materialRoutes = router; 