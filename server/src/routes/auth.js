const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db/database');
const { JWT_SECRET, verifyToken } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', (req, res) => {
  try {
    const {
      email,
      password,
      name,
      district,
      school_name,
      school_type,
      age,
      education_level,
      stream,
      interests,
      favourite_subjects,
      skills,
      career_aspirations,
      preferred_language
    } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const stmt = db.prepare(`
      INSERT INTO users (
        email, password_hash, role, name, district, school_name, school_type,
        age, education_level, stream, interests, favourite_subjects, skills,
        career_aspirations, preferred_language
      ) VALUES (?, ?, 'student', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      email.toLowerCase().trim(),
      passwordHash,
      name.trim(),
      district || 'Chennai',
      school_name || 'Government Higher Secondary School',
      school_type || 'Government Higher Secondary School',
      Number(age) || 16,
      education_level || 'Class 11',
      stream || 'Bio-Maths',
      JSON.stringify(interests || []),
      JSON.stringify(favourite_subjects || []),
      JSON.stringify(skills || []),
      career_aspirations || '',
      preferred_language || 'ta'
    );

    const user = db.prepare(`
      SELECT id, email, role, name, district, school_name, school_type, age,
             education_level, stream, interests, favourite_subjects, skills,
             career_aspirations, preferred_language, created_at
      FROM users WHERE id = ?
    `).get(result.lastInsertRowid);

    // Parse JSON fields
    user.interests = JSON.parse(user.interests || '[]');
    user.favourite_subjects = JSON.parse(user.favourite_subjects || '[]');
    user.skills = JSON.parse(user.skills || '[]');

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Student registered successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Parse JSON fields
    const safeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      district: user.district,
      school_name: user.school_name,
      school_type: user.school_type,
      age: user.age,
      education_level: user.education_level,
      stream: user.stream,
      interests: JSON.parse(user.interests || '[]'),
      favourite_subjects: JSON.parse(user.favourite_subjects || '[]'),
      skills: JSON.parse(user.skills || '[]'),
      career_aspirations: user.career_aspirations,
      preferred_language: user.preferred_language,
      created_at: user.created_at
    };

    const token = jwt.sign(
      { id: safeUser.id, email: safeUser.email, role: safeUser.role, name: safeUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// GET /api/auth/me
router.get('/me', verifyToken, (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      district: user.district,
      school_name: user.school_name,
      school_type: user.school_type,
      age: user.age,
      education_level: user.education_level,
      stream: user.stream,
      interests: JSON.parse(user.interests || '[]'),
      favourite_subjects: JSON.parse(user.favourite_subjects || '[]'),
      skills: JSON.parse(user.skills || '[]'),
      career_aspirations: user.career_aspirations,
      preferred_language: user.preferred_language,
      created_at: user.created_at
    };

    return res.json({ user: safeUser });
  } catch (error) {
    console.error('Fetch me error:', error);
    return res.status(500).json({ error: 'Failed to fetch current user' });
  }
});

// PUT /api/auth/profile
router.put('/profile', verifyToken, (req, res) => {
  try {
    const {
      name,
      district,
      school_name,
      school_type,
      age,
      education_level,
      stream,
      interests,
      favourite_subjects,
      skills,
      career_aspirations,
      preferred_language
    } = req.body;

    const stmt = db.prepare(`
      UPDATE users SET
        name = COALESCE(?, name),
        district = COALESCE(?, district),
        school_name = COALESCE(?, school_name),
        school_type = COALESCE(?, school_type),
        age = COALESCE(?, age),
        education_level = COALESCE(?, education_level),
        stream = COALESCE(?, stream),
        interests = COALESCE(?, interests),
        favourite_subjects = COALESCE(?, favourite_subjects),
        skills = COALESCE(?, skills),
        career_aspirations = COALESCE(?, career_aspirations),
        preferred_language = COALESCE(?, preferred_language),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      name,
      district,
      school_name,
      school_type,
      age ? Number(age) : null,
      education_level,
      stream,
      interests ? JSON.stringify(interests) : null,
      favourite_subjects ? JSON.stringify(favourite_subjects) : null,
      skills ? JSON.stringify(skills) : null,
      career_aspirations,
      preferred_language,
      req.user.id
    );

    const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    const safeUser = {
      id: updated.id,
      email: updated.email,
      role: updated.role,
      name: updated.name,
      district: updated.district,
      school_name: updated.school_name,
      school_type: updated.school_type,
      age: updated.age,
      education_level: updated.education_level,
      stream: updated.stream,
      interests: JSON.parse(updated.interests || '[]'),
      favourite_subjects: JSON.parse(updated.favourite_subjects || '[]'),
      skills: JSON.parse(updated.skills || '[]'),
      career_aspirations: updated.career_aspirations,
      preferred_language: updated.preferred_language,
      created_at: updated.created_at
    };

    return res.json({ message: 'Profile updated successfully', user: safeUser });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
