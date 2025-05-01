import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { config } from './config';
import { productionConfig } from './config/production';
import { customerRoutes } from './routes/customer.routes';
import { productRoutes } from './routes/product.routes';
import { orderRoutes } from './routes/order.routes';
import { materialRoutes } from './routes/material.routes';
import { projectRoutes } from './routes/project.routes';

// Debug environment variables
console.log('Environment variables:', {
  PORT: config.port,
  MONGODB_URI: config.mongodbUri ? '***' : undefined,
  NODE_ENV: config.nodeEnv
});

export const app = express();

// Security middleware
if (config.nodeEnv === 'production') {
  // Apply rate limiting
  app.use(rateLimit(productionConfig.rateLimit));
  
  // Apply security headers
  app.use(helmet());
  app.use((req, res, next) => {
    Object.entries(productionConfig.securityHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    next();
  });
  
  // Use production CORS settings
  app.use(cors(productionConfig.corsOptions));
} else {
  // Development CORS settings
  app.use(cors());
}

// Parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/projects', projectRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export a function to start the server
export const startServer = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');
    
    const port = config.port || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}; 