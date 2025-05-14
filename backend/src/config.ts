import fs from 'fs';
import path from 'path';

// Custom environment variable loader
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  console.log('Attempting to read .env from:', envPath);
  
  try {
    const envFile = fs.readFileSync(envPath, 'utf8');
    console.log('Raw .env contents:', envFile);
    
    const envVars = envFile.split('\n').reduce((acc, line) => {
      // Skip empty lines
      if (!line.trim()) return acc;
      
      // Find the first equals sign
      const equalsIndex = line.indexOf('=');
      if (equalsIndex === -1) return acc;
      
      const key = line.substring(0, equalsIndex).trim();
      const value = line.substring(equalsIndex + 1).trim();
      
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);
    
    console.log('Parsed environment variables:', envVars);
    return envVars;
  } catch (error) {
    console.error('Error reading .env file:', error);
    return {};
  }
}

// Load environment variables
const envVars = loadEnv();

// Configuration with environment variables
export const config = {
  port: parseInt(envVars.PORT || '3000', 10),
  mongodbUri: envVars.MONGODB_URI || 'mongodb://localhost:27017/leatherworking-tracker',
  nodeEnv: envVars.NODE_ENV || 'development'
};

// Validate configuration
if (!config.mongodbUri) {
  throw new Error('MONGODB_URI environment variable is required');
}

console.log('Using configuration:', {
  port: config.port,
  mongodbUri: '***',
  nodeEnv: config.nodeEnv
}); 