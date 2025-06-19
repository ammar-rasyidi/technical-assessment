/* eslint-disable no-console */
import mongoose from 'mongoose';

const connectDB = async () => {
  try {

    const dbURI = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DATABASE;

    if (!dbURI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    if (!dbName) {
      throw new Error('MONGODB_DATABASE environment variable is not defined');
    }

    // Construct connection string with proper formatting
    const connectionString = `${dbURI.replace(/\/$/, '')}/${dbName}`;
    
    // Add authentication if credentials are provided
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    };

    await mongoose.connect(connectionString, options);
    console.log('MongoDB Connected...');
    
    // Connection event listeners for better debugging
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
  } catch (err) {
    console.error('MongoDB connection failed:');
    console.error('- URI used:', process.env.MONGODB_URI);
    console.error('- Database:', process.env.MONGODB_DATABASE);
    console.error('Full error:', err.message);
    process.exit(1);
  }
};
export default connectDB;


