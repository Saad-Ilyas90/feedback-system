const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// GET all courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort('name');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add initial courses (you can call this once to populate the database)
router.post('/init-courses', async (req, res) => {
  try {
    const initialCourses = [
      { name: 'Web Development', code: 'WEB101' },
      { name: 'Database Management', code: 'DB201' },
      { name: 'Data Structures', code: 'DS301' },
      { name: 'Artificial Intelligence', code: 'AI401' },
      { name: 'Computer Networks', code: 'CN201' },
      { name: 'Software Engineering', code: 'SE301' }
    ];

    await Course.deleteMany({}); // Clear existing courses
    const courses = await Course.insertMany(initialCourses);
    res.status(201).json(courses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
