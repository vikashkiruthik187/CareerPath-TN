const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { verifyToken } = require('../middleware/auth');

// GET /api/student/dashboard
router.get('/dashboard', verifyToken, (req, res) => {
  try {
    const userId = req.user.id;

    // 1. User Profile
    const user = db.prepare(`
      SELECT id, name, email, district, school_name, school_type, age,
             education_level, stream, interests, favourite_subjects, skills,
             career_aspirations, preferred_language, created_at
      FROM users WHERE id = ?
    `).get(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.interests = JSON.parse(user.interests || '[]');
    user.favourite_subjects = JSON.parse(user.favourite_subjects || '[]');
    user.skills = JSON.parse(user.skills || '[]');

    // 2. Latest Assessment
    const latestAssessment = db.prepare(`
      SELECT * FROM assessment_results WHERE user_id = ? ORDER BY completed_at DESC LIMIT 1
    `).get(userId);

    let parsedAssessment = null;
    if (latestAssessment) {
      parsedAssessment = {
        id: latestAssessment.id,
        completed_at: latestAssessment.completed_at,
        scores: JSON.parse(latestAssessment.scores || '{}'),
        top_careers: JSON.parse(latestAssessment.top_careers || '[]'),
        recommended_streams: JSON.parse(latestAssessment.recommended_streams || '[]'),
        feedback_en: latestAssessment.feedback_en,
        feedback_ta: latestAssessment.feedback_ta
      };
    }

    // 3. Saved Items (Careers & Scholarships)
    const savedRows = db.prepare(`
      SELECT item_type, item_id, created_at FROM student_saved_items WHERE user_id = ?
    `).all(userId);

    const savedCareerIds = savedRows.filter(r => r.item_type === 'career').map(r => r.item_id);
    const savedScholarshipIds = savedRows.filter(r => r.item_type === 'scholarship').map(r => r.item_id);

    const savedCareers = savedCareerIds.length > 0
      ? db.prepare(`SELECT id, title_en, title_ta, category, salary_range, gov_7_5_applicable FROM careers WHERE id IN (${savedCareerIds.map(() => '?').join(',')})`).all(...savedCareerIds)
      : [];

    const savedScholarships = savedScholarshipIds.length > 0
      ? db.prepare(`SELECT id, title_en, title_ta, provider, amount_en, amount_ta, deadline FROM scholarships WHERE id IN (${savedScholarshipIds.map(() => '?').join(',')})`).all(...savedScholarshipIds)
      : [];

    // 4. Completed Modules
    const progressRows = db.prepare(`
      SELECT p.module_id, p.score, p.completed_at, m.title_en, m.title_ta, m.category
      FROM student_progress p
      JOIN life_skills_modules m ON p.module_id = m.id
      WHERE p.user_id = ?
    `).all(userId);

    const totalModulesCount = db.prepare('SELECT COUNT(*) as count FROM life_skills_modules').get().count;

    return res.json({
      user,
      assessment: parsedAssessment,
      savedCareers,
      savedScholarships,
      progress: {
        completedCount: progressRows.length,
        totalCount: totalModulesCount,
        completedModules: progressRows
      }
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// POST /api/student/bookmark
router.post('/bookmark', verifyToken, (req, res) => {
  try {
    const { item_type, item_id } = req.body;
    if (!item_type || !item_id) {
      return res.status(400).json({ error: 'item_type and item_id are required' });
    }

    const existing = db.prepare(`
      SELECT id FROM student_saved_items WHERE user_id = ? AND item_type = ? AND item_id = ?
    `).get(req.user.id, item_type, item_id);

    if (existing) {
      db.prepare('DELETE FROM student_saved_items WHERE id = ?').run(existing.id);
      return res.json({ bookmarked: false, message: 'Removed from bookmarks' });
    } else {
      db.prepare(`
        INSERT INTO student_saved_items (user_id, item_type, item_id) VALUES (?, ?, ?)
      `).run(req.user.id, item_type, item_id);
      return res.json({ bookmarked: true, message: 'Saved to bookmarks' });
    }
  } catch (error) {
    console.error('Bookmark error:', error);
    return res.status(500).json({ error: 'Failed to update bookmark' });
  }
});

module.exports = router;
