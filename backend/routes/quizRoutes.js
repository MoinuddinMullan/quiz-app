const express = require('express');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const SUBJECTS = {
  ML: { id: 'ML', label: 'Machine Learning', icon: 'psychology', difficulty: 'Advanced' },
  MERN: { id: 'MERN', label: 'MERN Stack', icon: 'terminal', difficulty: 'Intermediate' },
  CPP: { id: 'CPP', label: 'C++ Programming', icon: 'code', difficulty: 'Intermediate' },
};

const VALID_SUBJECTS = Object.keys(SUBJECTS);

const fisherYatesShuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

router.use(authMiddleware);

router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Promise.all(Object.values(SUBJECTS).map(async (subject) => ({
      ...subject,
      questionCount: await Question.countDocuments({ subject: subject.id }),
    })));
    return res.json(subjects);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/questions/:subject', async (req, res) => {
  const { subject } = req.params;

  if (!VALID_SUBJECTS.includes(subject)) {
    return res.status(400).json({ message: 'Invalid subject' });
  }

  try {
    const questions = await Question.find({ subject }).select('-correctOptionId').lean();
    const shuffled = fisherYatesShuffle(questions);
    return res.json({ questions: shuffled });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/submit', async (req, res) => {
  try {
    const { subject, timeTaken, answers } = req.body;

    if (!VALID_SUBJECTS.includes(subject)) {
      return res.status(400).json({ message: 'Invalid subject' });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers must be an array' });
    }

    const questions = await Question.find({ subject });
    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this subject' });
    }

    const questionIds = new Set(questions.map((question) => String(question._id)));
    const answerMap = new Map();
    for (const answer of answers) {
      const questionId = String(answer.questionId);
      if (!questionIds.has(questionId) || answerMap.has(questionId)) {
        return res.status(400).json({ message: 'Answers contain an invalid or duplicate question' });
      }
      answerMap.set(questionId, answer.selectedOptionId || null);
    }

    let score = 0;
    const totalMarks = questions.reduce((total, question) => total + question.marks, 0);
    const questionResults = questions.map((question) => {
      const selectedOptionId = answerMap.get(String(question._id)) || null;
      const isCorrect = selectedOptionId === question.correctOptionId;
      if (isCorrect) score += question.marks;

      return {
        questionId: question._id,
        questionText: question.questionText,
        options: question.options,
        correctOptionId: question.correctOptionId,
        selectedOptionId,
        isCorrect,
      };
    });

    const attempt = await QuizAttempt.create({
      student: req.student._id,
      subject,
      score,
      totalMarks,
      timeTaken,
      questionResults,
    });

    return res.status(201).json({
      attemptId: attempt._id,
      score,
      totalMarks,
      percentage: Math.round((score / totalMarks) * 100),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
