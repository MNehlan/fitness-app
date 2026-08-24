import express from 'express';
import cors from 'cors'
import 'dotenv/config';

// Routes
import exerciseRouters from './routes/exerciseRouters.js'

//error middlware
import errorHandler from './middleware/errorHandler.js';
import AppError from './utils/AppError.js';

const app = express();
const PORT = process.env.PORT;

app.use(express.json())
app.use(cors())

//route handlers
app.use('/api/exercises', exerciseRouters);

//Invalid route handler
app.use((req, res, next) => {
  next(new AppError(`Couldn't find ${req.originalUrl} route`, 404));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
