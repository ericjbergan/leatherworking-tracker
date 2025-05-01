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
      const [key, value] = line.split('=').map(part => part.trim());
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

// Hardcoded configuration
export const config = {
  port: 3000,
  mongodbUri: 'mongodb+srv://ericjbergan:%24Patches1@cluster0.8jssa8i.mongodb.net/leatherworking-tracker?retryWrites=true&w=majority&appName=Cluster0',
  nodeEnv: 'development'
};

// No need to validate since we're hardcoding the values
console.log('Using configuration:', {
  port: config.port,
  mongodbUri: '***',
  nodeEnv: config.nodeEnv
}); 