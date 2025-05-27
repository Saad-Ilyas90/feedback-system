const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST /api/feedback - Submit new feedback
router.post('/feedback', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/feedbacks - Get all feedbacks with pagination
router.get('/feedbacks', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const totalFeedbacks = await Feedback.countDocuments();
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      feedbacks,
      currentPage: page,
      totalPages: Math.ceil(totalFeedbacks / limit),
      totalItems: totalFeedbacks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/feedbacks/:subject - Get feedbacks by subject with pagination
router.get('/feedbacks/:subject', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const totalFeedbacks = await Feedback.countDocuments({
      subject: { $regex: new RegExp(req.params.subject, 'i') }
    });

    const feedbacks = await Feedback.find({ 
      subject: { $regex: new RegExp(req.params.subject, 'i') }
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      feedbacks,
      currentPage: page,
      totalPages: Math.ceil(totalFeedbacks / limit),
      totalItems: totalFeedbacks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
