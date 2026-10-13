const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { optionalToken, verifyToken, requireAdmin } = require('../middleware/auth');

function formatModule(m, userId) {
  let isCompleted = false;
  let progressScore = null;

  if (userId) {
    const progress = db.prepare('SELECT completed, score FROM student_progress WHERE user_id = ? AND module_id = ?')
      .get(userId, m.id);
    if (progress) {
      isCompleted = Boolean(progress.completed);
      progressScore = progress.score;
    }
  }

  return {
    ...m,
    practical_tips_en: JSON.parse(m.practical_tips_en || '[]'),
    practical_tips_ta: JSON.parse(m.practical_tips_ta || '[]'),
    quiz_data: JSON.parse(m.quiz_data || '[]'),
    is_completed: isCompleted,
    user_score: progressScore
  };
}

// GET /api/skills/modules
router.get('/modules', optionalToken, (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM life_skills_modules WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY id ASC';

    const rows = db.prepare(query).all(...params);
    const userId = req.user ? req.user.id : null;
    const modules = rows.map(r => formatModule(r, userId));

    return res.json({ modules });
  } catch (error) {
    console.error('Fetch modules error:', error);
    return res.status(500).json({ error: 'Failed to fetch life skills modules' });
  }
});

// GET /api/skills/modules/:id
router.get('/modules/:id', optionalToken, (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM life_skills_modules WHERE id = ?').get(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Module not found' });
    }

    const userId = req.user ? req.user.id : null;
    return res.json({ module: formatModule(row, userId) });
  } catch (error) {
    console.error('Fetch module by id error:', error);
    return res.status(500).json({ error: 'Failed to fetch module details' });
  }
});

// POST /api/skills/modules/:id/complete
router.post('/modules/:id/complete', verifyToken, (req, res) => {
  try {
    const { score } = req.body;
    const moduleId = req.params.id;

    const stmt = db.prepare(`
      INSERT INTO student_progress (user_id, module_id, completed, score)
      VALUES (?, ?, 1, ?)
      ON CONFLICT(user_id, module_id) DO UPDATE SET
        completed = 1,
        score = ?,
        completed_at = CURRENT_TIMESTAMP
    `);

    stmt.run(req.user.id, moduleId, Number(score) || 100, Number(score) || 100);

    return res.json({ message: 'Module marked as completed', moduleId, score });
  } catch (error) {
    console.error('Complete module error:', error);
    return res.status(500).json({ error: 'Failed to record module completion' });
  }
});

// GET /api/skills/resources
router.get('/resources', (req, res) => {
  try {
    const { type, category } = req.query;
    let query = 'SELECT * FROM learning_resources WHERE 1=1';
    const params = [];

    if (type && type !== 'All') {
      query += ' AND type = ?';
      params.push(type);
    }

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY id ASC';

    const resources = db.prepare(query).all(...params);
    return res.json({ resources });
  } catch (error) {
    console.error('Fetch resources error:', error);
    return res.status(500).json({ error: 'Failed to fetch learning resources' });
  }
});

// POST /api/skills/resources (Admin only)
router.post('/resources', verifyToken, requireAdmin, (req, res) => {
  try {
    const {
      type,
      title_en,
      title_ta,
      category,
      url,
      platform,
      thumbnail,
      description_en,
      description_ta,
      is_free,
      duration
    } = req.body;

    const stmt = db.prepare(`
      INSERT INTO learning_resources (
        type, title_en, title_ta, category, url, platform, thumbnail,
        description_en, description_ta, is_free, duration
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      type || 'video',
      title_en,
      title_ta,
      category || 'General',
      url,
      platform || 'Online',
      thumbnail || '',
      description_en || '',
      description_ta || '',
      is_free ? 1 : 0,
      duration || '15 mins'
    );

    const created = db.prepare('SELECT * FROM learning_resources WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ message: 'Resource created successfully', resource: created });
  } catch (error) {
    console.error('Create resource error:', error);
    return res.status(500).json({ error: 'Failed to create resource' });
  }
});

// DELETE /api/skills/resources/:id (Admin only)
router.delete('/resources/:id', verifyToken, requireAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM learning_resources WHERE id = ?').run(req.params.id);
    return res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    return res.status(500).json({ error: 'Failed to delete resource' });
  }
});

module.exports = router;
