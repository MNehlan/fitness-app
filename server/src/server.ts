import express from 'express';
import 'dotenv/config';

// Routes
import exerciseRouters from './routes/exerciseRouters.js'

const app = express();
const PORT = process.env.PORT;

app.use('/api/exercises', exerciseRouters);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
