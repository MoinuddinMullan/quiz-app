const express = require('express');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, enrollmentNumber, password, confirmPassword } = req.body;

    if (!name || !enrollmentNumber || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingStudent = await Student.findOne({ enrollmentNumber });
    if (existingStudent) {
      return res.status(400).json({ message: 'Enrollment number already exists' });
    }

    const student = await Student.create({
      name,
      enrollmentNumber,
      password,
    });

    return res.status(201).json({ message: 'Registration successful', student: { _id: student._id, name, enrollmentNumber } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { enrollmentNumber, password } = req.body;

    if (!enrollmentNumber || !password) {
      return res.status(400).json({ message: 'Enrollment number and password are required' });
    }

    const student = await Student.findOne({ enrollmentNumber });
    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { _id: student._id, name: student.name, enrollmentNumber: student.enrollmentNumber },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      student: { _id: student._id, name: student.name, enrollmentNumber: student.enrollmentNumber },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
