const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { optionalToken, verifyToken, requireAdmin } = require('../middleware/auth');

function formatCareer(c, userId) {
  let isSaved = false;
  if (userId) {
    const saved = db.prepare('SELECT id FROM student_saved_items WHERE user_id = ? AND item_type = ? AND item_id = ?')
      .get(userId, 'career', c.id);
    if (saved) isSaved = true;
  }

  return {
    ...c,
    gov_7_5_applicable: Boolean(c.gov_7_5_applicable),
    is_featured: Boolean(c.is_featured),
    pathway_steps_en: JSON.parse(c.pathway_steps_en || '[]'),
    pathway_steps_ta: JSON.parse(c.pathway_steps_ta || '[]'),
    required_skills_en: JSON.parse(c.required_skills_en || '[]'),
    required_skills_ta: JSON.parse(c.required_skills_ta || '[]'),
    entrance_exams: JSON.parse(c.entrance_exams || '[]'),
    top_colleges_tn: JSON.parse(c.top_colleges_tn || '[]'),
    is_saved: isSaved
  };
}

// GET /api/careers
router.get('/', optionalToken, (req, res) => {
  try {
    const { category, education, gov_7_5, search } = req.query;
    let query = 'SELECT * FROM careers WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (education && education !== 'All') {
      query += ' AND education_level_required LIKE ?';
      params.push(`%${education}%`);
    }

    if (gov_7_5 === 'true') {
      query += ' AND gov_7_5_applicable = 1';
    }

    if (search && search.trim()) {
      const term = `%${search.trim().toLowerCase()}%`;
      query += ' AND (LOWER(title_en) LIKE ? OR LOWER(title_ta) LIKE ? OR LOWER(description_en) LIKE ? OR LOWER(description_ta) LIKE ?)';
      params.push(term, term, term, term);
    }

    query += ' ORDER BY is_featured DESC, title_en ASC';

    const rows = db.prepare(query).all(...params);
    const userId = req.user ? req.user.id : null;
    const careers = rows.map(r => formatCareer(r, userId));

    return res.json({ careers });
  } catch (error) {
    console.error('Fetch careers error:', error);
    return res.status(500).json({ error: 'Failed to fetch careers' });
  }
});

// GET /api/careers/:id
router.get('/:id', optionalToken, (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM careers WHERE id = ?').get(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Career not found' });
    }

    const userId = req.user ? req.user.id : null;
    return res.json({ career: formatCareer(row, userId) });
  } catch (error) {
    console.error('Fetch career by id error:', error);
    return res.status(500).json({ error: 'Failed to fetch career details' });
  }
});

// POST /api/careers (Admin only)
router.post('/', verifyToken, requireAdmin, (req, res) => {
  try {
    const {
      id,
      title_en,
      title_ta,
      category,
      description_en,
      description_ta,
      education_level_required,
      pathway_steps_en,
      pathway_steps_ta,
      required_skills_en,
      required_skills_ta,
      entrance_exams,
      top_colleges_tn,
      salary_range,
      gov_7_5_applicable,
      is_featured,
      icon_name
    } = req.body;

    const careerId = id || title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const stmt = db.prepare(`
      INSERT INTO careers (
        id, title_en, title_ta, category, description_en, description_ta,
        education_level_required, pathway_steps_en, pathway_steps_ta,
        required_skills_en, required_skills_ta, entrance_exams, top_colleges_tn,
        salary_range, gov_7_5_applicable, is_featured, icon_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      careerId,
      title_en,
      title_ta,
      category || 'General',
      description_en,
      description_ta,
      education_level_required || 'Any',
      JSON.stringify(pathway_steps_en || []),
      JSON.stringify(pathway_steps_ta || []),
      JSON.stringify(required_skills_en || []),
      JSON.stringify(required_skills_ta || []),
      JSON.stringify(entrance_exams || []),
      JSON.stringify(top_colleges_tn || []),
      salary_range || 'Competitive',
      gov_7_5_applicable ? 1 : 0,
      is_featured ? 1 : 0,
      icon_name || 'Briefcase'
    );

    const created = db.prepare('SELECT * FROM careers WHERE id = ?').get(careerId);
    return res.status(201).json({ message: 'Career added successfully', career: formatCareer(created) });
  } catch (error) {
    console.error('Create career error:', error);
    return res.status(500).json({ error: 'Failed to create career' });
  }
});

// PUT /api/careers/:id (Admin only)
router.put('/:id', verifyToken, requireAdmin, (req, res) => {
  try {
    const {
      title_en,
      title_ta,
      category,
      description_en,
      description_ta,
      education_level_required,
      pathway_steps_en,
      pathway_steps_ta,
      required_skills_en,
      required_skills_ta,
      entrance_exams,
      top_colleges_tn,
      salary_range,
      gov_7_5_applicable,
      is_featured,
      icon_name
    } = req.body;

    const stmt = db.prepare(`
      UPDATE careers SET
        title_en = COALESCE(?, title_en),
        title_ta = COALESCE(?, title_ta),
        category = COALESCE(?, category),
        description_en = COALESCE(?, description_en),
        description_ta = COALESCE(?, description_ta),
        education_level_required = COALESCE(?, education_level_required),
        pathway_steps_en = COALESCE(?, pathway_steps_en),
        pathway_steps_ta = COALESCE(?, pathway_steps_ta),
        required_skills_en = COALESCE(?, required_skills_en),
        required_skills_ta = COALESCE(?, required_skills_ta),
        entrance_exams = COALESCE(?, entrance_exams),
        top_colleges_tn = COALESCE(?, top_colleges_tn),
        salary_range = COALESCE(?, salary_range),
        gov_7_5_applicable = COALESCE(?, gov_7_5_applicable),
        is_featured = COALESCE(?, is_featured),
        icon_name = COALESCE(?, icon_name)
      WHERE id = ?
    `);

    stmt.run(
      title_en,
      title_ta,
      category,
      description_en,
      description_ta,
      education_level_required,
      pathway_steps_en ? JSON.stringify(pathway_steps_en) : null,
      pathway_steps_ta ? JSON.stringify(pathway_steps_ta) : null,
      required_skills_en ? JSON.stringify(required_skills_en) : null,
      required_skills_ta ? JSON.stringify(required_skills_ta) : null,
      entrance_exams ? JSON.stringify(entrance_exams) : null,
      top_colleges_tn ? JSON.stringify(top_colleges_tn) : null,
      salary_range,
      typeof gov_7_5_applicable === 'boolean' ? (gov_7_5_applicable ? 1 : 0) : null,
      typeof is_featured === 'boolean' ? (is_featured ? 1 : 0) : null,
      icon_name,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM careers WHERE id = ?').get(req.params.id);
    return res.json({ message: 'Career updated successfully', career: formatCareer(updated) });
  } catch (error) {
    console.error('Update career error:', error);
    return res.status(500).json({ error: 'Failed to update career' });
  }
});

// DELETE /api/careers/:id (Admin only)
router.delete('/:id', verifyToken, requireAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM careers WHERE id = ?').run(req.params.id);
    return res.json({ message: 'Career deleted successfully' });
  } catch (error) {
    console.error('Delete career error:', error);
    return res.status(500).json({ error: 'Failed to delete career' });
  }
});

module.exports = router;
