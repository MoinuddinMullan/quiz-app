const express = require('express');
const QuizAttempt = require('../models/QuizAttempt');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/history', async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ student: req.student._id }).select('-questionResults').sort({ submittedAt: -1 });
    return res.json({ attempts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/:attemptId', async (req, res) => {
  try {
    const attempt = await QuizAttempt.findOne({
      _id: req.params.attemptId,
      student: req.student._id,
    });

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    return res.json(attempt);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
