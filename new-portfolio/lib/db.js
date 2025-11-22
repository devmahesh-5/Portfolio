import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is not defined in environment variables');
}

// Use a global variable to keep connection across hot reloads in dev
let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = await mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected to host:', mongoose.connection.host);
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  
  return cached.conn;
  
}

export default connectDB;
