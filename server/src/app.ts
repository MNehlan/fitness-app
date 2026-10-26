import express from 'express';
import cors from 'cors';

// Routes
import exerciseRouters from './routes/exerciseRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';

//error middleware
import errorHandler from './middleware/errorHandler.js';
import AppError from './utils/AppError.js';

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/exercises', exerciseRouters);
app.use('/api/workouts', workoutRoutes);

// Handle unknown routes
app.use((req, _res, next) => {
  next(new AppError(`Couldn't find ${req.originalUrl} route`, 404));
});

// Error-handling middleware must come after routes
app.use(errorHandler);

export default app;