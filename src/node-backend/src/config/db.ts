import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/maternal-care';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err: any) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    console.log('Running backend in MOCK MODE without a database.');
    // process.exit(1); 
  }
};
