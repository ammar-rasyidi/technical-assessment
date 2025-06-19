/* eslint-disable no-console */
import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './router/index.js'

dotenv.config()

const app = express();

// Connect to MongoDB
connectDB();

// Init Middleware
app.use(express.json());
app.use(cookieParser())

// CORS setup
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: frontendUrl,
  credentials: true, // if you need to send cookies/auth
}));

app.use('/api', router);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5800;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
