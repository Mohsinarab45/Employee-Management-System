import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import holidayRoutes from './routes/holidayRoutes';
import leaveRoutes from './routes/leaveRoutes';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow Swagger UI inline scripts
  })
);
const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: allowedOrigin === '*' ? true : allowedOrigin,
    credentials: true,
  })
);

// Rate Limiter (Max 200 requests per 15 mins)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', apiLimiter);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Swagger API Documentation URL
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root Endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'EMS Enterprise REST API Server is running cleanly',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/holidays', holidayRoutes);
app.use('/api/v1/leaves', leaveRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`⚡ EMS REST API Server running on port ${PORT}`);
  console.log(`⚡ Healthcheck: http://localhost:${PORT}/`);
  console.log(`⚡ Swagger UI API Docs: http://localhost:${PORT}/api-docs`);
  console.log(`==================================================`);
});

export default app;
