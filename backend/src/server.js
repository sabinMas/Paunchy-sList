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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
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
    // Initialize database
    await initializeDatabase();
    console.log('✓ Database initialized');

    // Initialize email service
    initializeEmail();

    // Start listening
    app.listen(PORT, () => {
      console.log(`\n🚀 Paunchy's List API Server running on http://localhost:${PORT}`);
      console.log(`📝 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`💾 Database: ./data/marketplace.db\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
