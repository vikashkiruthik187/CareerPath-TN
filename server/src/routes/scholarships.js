const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { optionalToken, verifyToken, requireAdmin } = require('../middleware/auth');

function formatScholarship(s, userId) {
  let isSaved = false;
  if (userId) {
    const saved = db.prepare('SELECT id FROM student_saved_items WHERE user_id = ? AND item_type = ? AND item_id = ?')
      .get(userId, 'scholarship', s.id);
    if (saved) isSaved = true;
  }

  return {
    ...s,
    is_featured: Boolean(s.is_featured),
    documents_required_en: JSON.parse(s.documents_required_en || '[]'),
    documents_required_ta: JSON.parse(s.documents_required_ta || '[]'),
    is_saved: isSaved
  };
}

// GET /api/scholarships
router.get('/', optionalToken, (req, res) => {
  try {
    const { school_type, gender, search } = req.query;
    let query = 'SELECT * FROM scholarships WHERE 1=1';
    const params = [];

    if (school_type && school_type !== 'All') {
      if (school_type === 'Govt Schools Only') {
        query += " AND (eligibility_school_type = 'Govt Schools Only' OR eligibility_school_type = 'All Schools')";
      }
    }

    if (gender && gender !== 'all') {
      query += " AND (eligibility_gender = ? OR eligibility_gender = 'all')";
      params.push(gender);
    }

    if (search && search.trim()) {
      const term = `%${search.trim().toLowerCase()}%`;
      query += ' AND (LOWER(title_en) LIKE ? OR LOWER(title_ta) LIKE ? OR LOWER(description_en) LIKE ? OR LOWER(description_ta) LIKE ?)';
      params.push(term, term, term, term);
    }

    query += ' ORDER BY is_featured DESC, title_en ASC';

    const rows = db.prepare(query).all(...params);
    const userId = req.user ? req.user.id : null;
    const scholarships = rows.map(r => formatScholarship(r, userId));

    return res.json({ scholarships });
  } catch (error) {
    console.error('Fetch scholarships error:', error);
    return res.status(500).json({ error: 'Failed to fetch scholarships' });
  }
});

// POST /api/scholarships/check-eligibility
router.post('/check-eligibility', optionalToken, (req, res) => {
  try {
    const {
      gender, // 'female' | 'male' | 'other'
      school_type, // 'Government School' | 'Govt Aided School' | 'Private School'
      education_level, // 'Class 8' | 'Class 10' | 'Class 12' | 'Higher Education' | 'Polytechnic / ITI'
      community, // 'OC' | 'BC' | 'MBC' | 'SC' | 'ST' | 'DNC'
      first_graduate, // true | false
      family_income // number e.g. 150000
    } = req.body;

    const allScholarships = db.prepare('SELECT * FROM scholarships').all();
    const isGovtSchool = !school_type || school_type.toLowerCase().includes('govt') || school_type.toLowerCase().includes('government');

    const matched = [];

    for (const s of allScholarships) {
      let isEligible = true;
      let reasons = [];

      // Gender check
      if (s.eligibility_gender !== 'all' && gender && s.eligibility_gender !== gender) {
        isEligible = false;
      }

      // School type check
      if (s.eligibility_school_type === 'Govt Schools Only' && !isGovtSchool) {
        isEligible = false;
      }

      // First graduate check
      if (s.id === 'first-graduate-concession' && first_graduate !== true && first_graduate !== 'true') {
        isEligible = false;
      }

      // Community check
      if (s.id === 'post-matric-sc-st') {
        const commUpper = (community || '').toUpperCase();
        if (!['SC', 'ST', 'SCA', 'SCC'].includes(commUpper)) {
          isEligible = false;
        }
      }

      // NMMS check
      if (s.id === 'nmms-scholarship') {
        if (!['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].includes(education_level)) {
          isEligible = false;
        }
      }

      if (isEligible) {
        matched.push(formatScholarship(s, req.user ? req.user.id : null));
      }
    }

    return res.json({
      eligibleCount: matched.length,
      scholarships: matched
    });
  } catch (error) {
    console.error('Check eligibility error:', error);
    return res.status(500).json({ error: 'Failed to evaluate eligibility' });
  }
});

// GET /api/scholarships/:id
router.get('/:id', optionalToken, (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM scholarships WHERE id = ?').get(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }

    const userId = req.user ? req.user.id : null;
    return res.json({ scholarship: formatScholarship(row, userId) });
  } catch (error) {
    console.error('Fetch scholarship by id error:', error);
    return res.status(500).json({ error: 'Failed to fetch scholarship' });
  }
});

// POST /api/scholarships (Admin only)
router.post('/', verifyToken, requireAdmin, (req, res) => {
  try {
    const {
      id,
      title_en,
      title_ta,
      provider,
      amount_en,
      amount_ta,
      eligibility_gender,
      eligibility_community,
      eligibility_school_type,
      eligibility_class,
      description_en,
      description_ta,
      application_portal,
      documents_required_en,
      documents_required_ta,
      deadline,
      is_featured
    } = req.body;

    const sId = id || title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const stmt = db.prepare(`
      INSERT INTO scholarships (
        id, title_en, title_ta, provider, amount_en, amount_ta,
        eligibility_gender, eligibility_community, eligibility_school_type, eligibility_class,
        description_en, description_ta, application_portal,
        documents_required_en, documents_required_ta, deadline, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      sId,
      title_en,
      title_ta,
      provider || 'Government of Tamil Nadu',
      amount_en,
      amount_ta,
      eligibility_gender || 'all',
      eligibility_community || 'all',
      eligibility_school_type || 'Govt Schools Only',
      eligibility_class || 'Any',
      description_en,
      description_ta,
      application_portal || 'https://www.tn.gov.in',
      JSON.stringify(documents_required_en || []),
      JSON.stringify(documents_required_ta || []),
      deadline || 'Open Annually',
      is_featured ? 1 : 0
    );

    const created = db.prepare('SELECT * FROM scholarships WHERE id = ?').get(sId);
    return res.status(201).json({ message: 'Scholarship created successfully', scholarship: formatScholarship(created) });
  } catch (error) {
    console.error('Create scholarship error:', error);
    return res.status(500).json({ error: 'Failed to create scholarship' });
  }
});

// PUT /api/scholarships/:id (Admin only)
router.put('/:id', verifyToken, requireAdmin, (req, res) => {
  try {
    const {
      title_en,
      title_ta,
      provider,
      amount_en,
      amount_ta,
      eligibility_gender,
      eligibility_community,
      eligibility_school_type,
      eligibility_class,
      description_en,
      description_ta,
      application_portal,
      documents_required_en,
      documents_required_ta,
      deadline,
      is_featured
    } = req.body;

    const stmt = db.prepare(`
      UPDATE scholarships SET
        title_en = COALESCE(?, title_en),
        title_ta = COALESCE(?, title_ta),
        provider = COALESCE(?, provider),
        amount_en = COALESCE(?, amount_en),
        amount_ta = COALESCE(?, amount_ta),
        eligibility_gender = COALESCE(?, eligibility_gender),
        eligibility_community = COALESCE(?, eligibility_community),
        eligibility_school_type = COALESCE(?, eligibility_school_type),
        eligibility_class = COALESCE(?, eligibility_class),
        description_en = COALESCE(?, description_en),
        description_ta = COALESCE(?, description_ta),
        application_portal = COALESCE(?, application_portal),
        documents_required_en = COALESCE(?, documents_required_en),
        documents_required_ta = COALESCE(?, documents_required_ta),
        deadline = COALESCE(?, deadline),
        is_featured = COALESCE(?, is_featured)
      WHERE id = ?
    `);

    stmt.run(
      title_en,
      title_ta,
      provider,
      amount_en,
      amount_ta,
      eligibility_gender,
      eligibility_community,
      eligibility_school_type,
      eligibility_class,
      description_en,
      description_ta,
      application_portal,
      documents_required_en ? JSON.stringify(documents_required_en) : null,
      documents_required_ta ? JSON.stringify(documents_required_ta) : null,
      deadline,
      typeof is_featured === 'boolean' ? (is_featured ? 1 : 0) : null,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM scholarships WHERE id = ?').get(req.params.id);
    return res.json({ message: 'Scholarship updated successfully', scholarship: formatScholarship(updated) });
  } catch (error) {
    console.error('Update scholarship error:', error);
    return res.status(500).json({ error: 'Failed to update scholarship' });
  }
});

// DELETE /api/scholarships/:id (Admin only)
router.delete('/:id', verifyToken, requireAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM scholarships WHERE id = ?').run(req.params.id);
    return res.json({ message: 'Scholarship deleted successfully' });
  } catch (error) {
    console.error('Delete scholarship error:', error);
    return res.status(500).json({ error: 'Failed to delete scholarship' });
  }
});

module.exports = router;
