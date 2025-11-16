import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase, closeDatabase } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database BEFORE importing routes
initializeDatabase();

// Middleware - CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:5173',  // Local development
    'https://shipment-quote-calculator-ui.onrender.com',  // Production frontend
    /\.onrender\.com$/  // Allow all *.onrender.com domains
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Dynamically import routes after database initialization
const startServer = async () => {
  const { default: quoteRoutes } = await import('./routes/quoteRoutes.js');
  app.use('/api/quotes', quoteRoutes);

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

  // Graceful shutdown
  const gracefulShutdown = () => {
    console.log('\n🛑 Shutting down gracefully...');
    server.close(() => {
      closeDatabase();
      process.exit(0);
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  closeDatabase();
  process.exit(1);
});