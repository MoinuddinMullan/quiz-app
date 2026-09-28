require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  return /^http:\/\/localhost:(\d+)$/.test(origin) || /^http:\/\/127\.0\.0\.1:(\d+)$/.test(origin);
};

connectDB();

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
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

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
