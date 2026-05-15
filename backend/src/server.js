import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database.js';
import { initializeEmail } from './config/email.js';
import extensionsRoutes from './routes/extensions.js';
import submissionsRoutes from './routes/submissions.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Track database initialization state
let databaseInitialized = false;
let databaseInitializing = false;
let initializationPromise = null;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      // Allow Vercel preview URLs
      /\.vercel\.app$/,
      // Allow production domain
      process.env.FRONTEND_URL || 'http://localhost:5173'
    ];

    // For requests without origin (like Postman, mobile apps), allow them
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin matches any allowed origin
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Fast health check (doesn't require database)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    databaseInitialized: global.databaseInitialized || false
  });
});

// Health check that verifies database is ready
app.get('/health/db', async (req, res) => {
  try {
    const { getAsync } = await import('./config/database.js');
    const result = await getAsync('SELECT 1');
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'unavailable',
      error: error.message
    });
  }
});

// Diagnostic endpoint
app.get('/debug/status', (req, res) => {
  console.log('[DEBUG] Status check - DB initialized:', global.databaseInitialized);
  res.json({
    environment: process.env.NODE_ENV || 'development',
    databaseInitialized: global.databaseInitialized || false,
    vercelEnv: !!process.env.VERCEL,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// Quick test endpoint
app.get('/api/extensions/test', (req, res) => {
  console.log('[DEBUG] Test endpoint hit');
  res.json({
    status: 'ok',
    message: 'Backend is responding'
  });
});

// API Routes (proceed immediately, database queries handle initialization)
app.use('/api/extensions', extensionsRoutes);
app.use('/api/submissions', submissionsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Initialize and start server
const startServer = async () => {
  try {
    // Start listening immediately (don't wait for database)
    app.listen(PORT, () => {
      console.log(`\n🚀 Paunchy's List API Server running on http://localhost:${PORT}`);
      console.log(`📝 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`💾 Database: ./data/marketplace.db`);
      console.log(`📡 Initializing database in background...\n`);
    });

    // Initialize database in background (non-blocking)
    databaseInitializing = true;
    global.databaseInitialized = false;
    initializationPromise = initializeDatabase();

    initializationPromise
      .then(() => {
        console.log('✓ Database initialization complete');
        databaseInitialized = true;
        global.databaseInitialized = true;
        databaseInitializing = false;
      })
      .catch((error) => {
        console.error('❌ Database initialization error:', error);
        databaseInitialized = true;
        global.databaseInitialized = false;
        databaseInitializing = false;
        // Don't exit - API endpoints will handle DB errors gracefully
      });

    // Initialize email service
    initializeEmail();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
