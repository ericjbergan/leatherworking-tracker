"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Custom environment variable loader
function loadEnv() {
    const envPath = path_1.default.resolve(__dirname, '../.env');
    console.log('Attempting to read .env from:', envPath);
    try {
        const envFile = fs_1.default.readFileSync(envPath, 'utf8');
        console.log('Raw .env contents:', envFile);
        const envVars = envFile.split('\n').reduce((acc, line) => {
            const [key, value] = line.split('=').map(part => part.trim());
            if (key && value) {
                acc[key] = value;
            }
            return acc;
        }, {});
        console.log('Parsed environment variables:', envVars);
        return envVars;
    }
    catch (error) {
        console.error('Error reading .env file:', error);
        return {};
    }
}
// Load environment variables
const envVars = loadEnv();
// Hardcoded configuration
exports.config = {
    port: 3000,
    mongodbUri: 'mongodb+srv://ericjbergan:%24Patches1@cluster0.8jssa8i.mongodb.net/leatherworking-tracker?retryWrites=true&w=majority&appName=Cluster0',
    nodeEnv: 'development'
};
// No need to validate since we're hardcoding the values
console.log('Using configuration:', {
    port: exports.config.port,
    mongodbUri: '***',
    nodeEnv: exports.config.nodeEnv
});
