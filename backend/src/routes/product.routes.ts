import express, { Request, Response } from 'express';
import { Product } from '../models/product.model';
import { body, validationResult, param } from 'express-validator';
import { TypedRequestBody, TypedRequestParams } from '../types/express';
import multer from 'multer';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// Validation middleware
const validateProduct = [
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('description').optional().isString().trim(),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').optional().isString().trim(),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

// Get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get single product
router.get('/:id', async (req: TypedRequestParams<{ id: string }>, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Create product
router.post('/', validateProduct, async (req: TypedRequestBody<{
  name: string;
  description?: string;
  price: number;
  category?: string;
  stock: number;
}>, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product' });
  }
});

// Update product
router.put('/:id', validateProduct, async (req: TypedRequestParams<{ id: string }> & TypedRequestBody<{
  name: string;
  description?: string;
  price: number;
  category?: string;
  stock: number;
}>, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Upload product image
router.post('/:id/images', upload.single('image'), async (req: TypedRequestParams<{ id: string }> & Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const key = `products/${req.params.id}/${Date.now()}-${req.file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3Client.send(command);

    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    const downloadUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });

    product.images.push({ 
      key, 
      url: downloadUrl,
      uploadedAt: new Date()
    });
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image' });
  }
});

// Delete product
router.delete('/:id', async (req: TypedRequestParams<{ id: string }>, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

export const productRoutes = router; 