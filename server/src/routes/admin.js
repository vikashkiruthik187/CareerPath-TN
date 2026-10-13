const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// GET /api/admin/stats
router.get('/stats', verifyToken, requireAdmin, (req, res) => {
  try {
    const studentCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student'").get().count;
    const careerCount = db.prepare('SELECT COUNT(*) as count FROM careers').get().count;
    const scholarshipCount = db.prepare('SELECT COUNT(*) as count FROM scholarships').get().count;
    const assessmentCount = db.prepare('SELECT COUNT(*) as count FROM assessment_results').get().count;
    const feedbackPending = db.prepare("SELECT COUNT(*) as count FROM feedback_queries WHERE status = 'pending'").get().count;
    const feedbackTotal = db.prepare('SELECT COUNT(*) as count FROM feedback_queries').get().count;

    // District-wise distribution across Tamil Nadu
    const districtStats = db.prepare(`
      SELECT district, COUNT(*) as count
      FROM users
      WHERE role = 'student' AND district IS NOT NULL
      GROUP BY district
      ORDER BY count DESC
      LIMIT 10
    `).all();

    // Education level distribution
    const educationStats = db.prepare(`
      SELECT education_level, COUNT(*) as count
      FROM users
      WHERE role = 'student' AND education_level IS NOT NULL
      GROUP BY education_level
      ORDER BY count DESC
    `).all();

    // Recent registered students
    const recentStudents = db.prepare(`
      SELECT id, name, email, district, school_name, education_level, created_at
      FROM users
      WHERE role = 'student'
      ORDER BY created_at DESC
      LIMIT 8
    `).all();

    return res.json({
      metrics: {
        totalStudents: studentCount,
        totalCareers: careerCount,
        totalScholarships: scholarshipCount,
        totalAssessments: assessmentCount,
        pendingQueries: feedbackPending,
        totalQueries: feedbackTotal
      },
      districtStats,
      educationStats,
      recentStudents
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

module.exports = router;
