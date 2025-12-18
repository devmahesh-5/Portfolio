import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is not defined in environment variables');
}


async function connectDB() {
  mongoose.connect(MONGODB_URI).then(() => {
    console.log('✅ Connected to MongoDB');
  }).catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

  return mongoose;
}

export default connectDB;
