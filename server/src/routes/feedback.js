const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { optionalToken, verifyToken, requireAdmin } = require('../middleware/auth');

// POST /api/feedback (Submit question/feedback)
router.post('/', optionalToken, (req, res) => {
  try {
    const { name, email_or_phone, district, school_name, category, message } = req.body;

    if (!name || !email_or_phone || !message) {
      return res.status(400).json({ error: 'Name, contact (email or phone), and message are required' });
    }

    const userId = req.user ? req.user.id : null;

    const stmt = db.prepare(`
      INSERT INTO feedback_queries (
        user_id, name, email_or_phone, district, school_name, category, message
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      userId,
      name.trim(),
      email_or_phone.trim(),
      district || 'Not Specified',
      school_name || 'Government School',
      category || 'Career Counseling',
      message.trim()
    );

    return res.status(201).json({
      message: 'Your query has been submitted to TN Career Guidance counselors. You will receive assistance shortly!',
      queryId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Submit query error:', error);
    return res.status(500).json({ error: 'Failed to submit feedback query' });
  }
});

// GET /api/feedback (Admin: all, Public: resolved FAQs)
router.get('/', optionalToken, (req, res) => {
  try {
    const isAdmin = req.user && req.user.role === 'admin';
    let queries;

    if (isAdmin) {
      queries = db.prepare('SELECT * FROM feedback_queries ORDER BY created_at DESC').all();
    } else {
      queries = db.prepare("SELECT id, name, district, school_name, category, message, reply, created_at FROM feedback_queries WHERE status = 'resolved' ORDER BY created_at DESC LIMIT 10").all();
    }

    return res.json({ queries });
  } catch (error) {
    console.error('Fetch queries error:', error);
    return res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// PUT /api/feedback/:id/reply (Admin reply)
router.put('/:id/reply', verifyToken, requireAdmin, (req, res) => {
  try {
    const { reply, status } = req.body;
    if (!reply) {
      return res.status(400).json({ error: 'Reply message is required' });
    }

    const stmt = db.prepare(`
      UPDATE feedback_queries SET
        reply = ?,
        status = ?
      WHERE id = ?
    `);

    stmt.run(reply.trim(), status || 'resolved', req.params.id);

    const updated = db.prepare('SELECT * FROM feedback_queries WHERE id = ?').get(req.params.id);
    return res.json({ message: 'Reply submitted successfully', query: updated });
  } catch (error) {
    console.error('Reply feedback error:', error);
    return res.status(500).json({ error: 'Failed to update reply' });
  }
});

module.exports = router;
