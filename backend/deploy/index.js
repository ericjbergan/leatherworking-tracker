"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const config_1 = require("./config");
const production_1 = require("./config/production");
const customer_routes_1 = require("./routes/customer.routes");
const product_routes_1 = require("./routes/product.routes");
const order_routes_1 = require("./routes/order.routes");
const material_routes_1 = require("./routes/material.routes");
const project_routes_1 = require("./routes/project.routes");
// Debug environment variables
console.log('Environment variables:', {
    PORT: config_1.config.port,
    MONGODB_URI: config_1.config.mongodbUri ? '***' : undefined,
    NODE_ENV: config_1.config.nodeEnv
});
exports.app = (0, express_1.default)();
// Security middleware
if (config_1.config.nodeEnv === 'production') {
    // Apply rate limiting
    exports.app.use((0, express_rate_limit_1.default)(production_1.productionConfig.rateLimit));
    // Apply security headers
    exports.app.use((0, helmet_1.default)());
    exports.app.use((req, res, next) => {
        Object.entries(production_1.productionConfig.securityHeaders).forEach(([key, value]) => {
            res.setHeader(key, value);
        });
        next();
    });
    // Use production CORS settings
    exports.app.use((0, cors_1.default)(production_1.productionConfig.corsOptions));
}
else {
    // Development CORS settings
    exports.app.use((0, cors_1.default)());
}
// Parse JSON bodies
exports.app.use(express_1.default.json());
// Routes
exports.app.use('/api/customers', customer_routes_1.customerRoutes);
exports.app.use('/api/products', product_routes_1.productRoutes);
exports.app.use('/api/orders', order_routes_1.orderRoutes);
exports.app.use('/api/materials', material_routes_1.materialRoutes);
exports.app.use('/api/projects', project_routes_1.projectRoutes);
// Health check endpoint
exports.app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// Error handling middleware
exports.app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
// Export a function to start the server
const startServer = async () => {
    try {
        await mongoose_1.default.connect(config_1.config.mongodbUri);
        console.log('Connected to MongoDB');
        const port = config_1.config.port || 3000;
        exports.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
exports.startServer = startServer;
