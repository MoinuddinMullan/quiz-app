const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  subject: {
    type: String,
    required: true,
    enum: ['ML', 'MERN', 'CPP'],
  },
  score: {
    type: Number,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  timeTaken: {
    type: Number,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  questionResults: [
    {
      questionId: mongoose.Schema.Types.ObjectId,
      questionText: String,
      options: [{ id: String, text: String }],
      correctOptionId: String,
      selectedOptionId: String,
      isCorrect: Boolean,
    },
  ],
});

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
