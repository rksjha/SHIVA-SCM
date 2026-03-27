const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
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

// Trust Railway's proxy for correct IP in rate limiting
app.set('trust proxy', 1);

// Security middleware — relax CSP to allow React app assets
app.use(
  helmet({
    contentSecurityPolicy: false, // React handles its own CSP
    crossOriginEmbedderPolicy: false,
  })
);

// CORS — allow same-origin and configured frontend URLs
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, same-origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(null, true); // Allow all in Railway (single service)
    },
    credentials: true,
  })
);

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // increased limit for production
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'SHIVA SCM API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
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

// ─── Serve React Frontend (Production / Railway) ─────────────────────────────
const publicPath = path.join(__dirname, '../public');

if (fs.existsSync(publicPath)) {
  // Serve static files
  app.use(express.static(publicPath, { maxAge: '7d' }));

  // React Router fallback — serve index.html for all non-API routes
  app.get('*', (req, res) => {
    const indexFile = path.join(publicPath, 'index.html');
    if (fs.existsSync(indexFile)) {
      res.sendFile(indexFile);
    } else {
      res.status(404).json({ message: 'Frontend build not found' });
    }
  });
} else {
  // API-only mode (development — frontend runs separately on Vite)
  app.use((req, res) => {
    res.status(404).json({
      message: 'Route not found',
      hint: 'Frontend runs on http://localhost:5173 in development',
    });
  });
}

// Global error handler
app.use(errorMiddleware);

// Database initialization
const initializeDatabase = async () => {
  try {
    await database.authenticate();
    console.log('✅ Database connection successful');
    await database.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log('✅ Database synchronized');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await initializeDatabase();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SHIVA SCM Server running on port ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    if (fs.existsSync(publicPath)) {
      console.log(`   Frontend: served from /public`);
    }
  });
};

module.exports = { app, startServer };

if (require.main === module) {
  startServer();
}
