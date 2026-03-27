const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const database = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth.routes');
const manufacturerRoutes = require('./routes/manufacturer.routes');
const supplierRoutes = require('./routes/supplier.routes');
const wholesalerRoutes = require('./routes/wholesaler.routes');
const retailerRoutes = require('./routes/retailer.routes');
const clientRoutes = require('./routes/client.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const orderRoutes = require('./routes/order.routes');
const shipmentRoutes = require('./routes/shipment.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// Import middleware
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Logging middleware
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/manufacturers', manufacturerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/wholesalers', wholesalerRoutes);
app.use('/api/retailers', retailerRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use(errorMiddleware);

// Database initialization
const initializeDatabase = async () => {
  try {
    await database.authenticate();
    console.log('Database connection successful');
    await database.sync({ alter: true });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await initializeDatabase();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`SHIVA SCM Backend Server running on port ${PORT}`);
  });
};

// Export for testing and direct start
module.exports = { app, startServer };

// Start if run directly
if (require.main === module) {
  startServer();
}
