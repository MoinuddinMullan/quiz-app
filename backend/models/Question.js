const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    enum: ['ML', 'MERN', 'CPP'],
  },
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      id: { type: String },
      text: { type: String },
    },
  ],
  correctOptionId: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model('Question', questionSchema);
