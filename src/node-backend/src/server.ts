import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import aiRoutes from './routes/ai.routes';
import ashaRoutes from './routes/asha.routes';
import dietRoutes from './routes/diet.routes';
import alertRoutes from './routes/alert.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/asha', ashaRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/alerts', alertRoutes);

app.get('/', (req, res) => {
  res.send('Maternal Healthcare API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
