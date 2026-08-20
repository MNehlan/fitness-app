import express from 'express';
import cors from 'cors'
import 'dotenv/config';

// Routes
import exerciseRouters from './routes/exerciseRouters.js'

const app = express();
const PORT = process.env.PORT;

app.use(express.json())
app.use(cors())

app.use('/api/exercises', exerciseRouters);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
