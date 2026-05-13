import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is not defined in environment variables');
}

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log('✅ Connected to MongoDB');
    return mongoose;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export default connectDB;