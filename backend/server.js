require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const allowedPatterns = [
    /^http:\/\/localhost:(\d+)$/,
    /^http:\/\/127\.0\.0\.1:(\d+)$/,
    /^https:\/\/[a-z0-9-]+\.netlify\.app$/,
  ];

  return allowedPatterns.some((pattern) => pattern.test(origin));
};

connectDB();

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.options('*', cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Backend is running' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ CORS enabled for: localhost, 127.0.0.1, and *.netlify.app domains`);
});
