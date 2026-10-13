const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Use DB_PATH env var for persistent disk on Render, fallback to local for dev
const dbDir = process.env.DB_PATH || path.join(__dirname);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
const dbPath = path.join(dbDir, 'careerpath_tn.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'student',
      name TEXT NOT NULL,
      district TEXT,
      school_name TEXT,
      school_type TEXT,
      age INTEGER,
      education_level TEXT,
      stream TEXT,
      interests TEXT DEFAULT '[]',
      favourite_subjects TEXT DEFAULT '[]',
      skills TEXT DEFAULT '[]',
      career_aspirations TEXT,
      preferred_language TEXT DEFAULT 'ta',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS assessment_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      scores TEXT NOT NULL,
      top_careers TEXT NOT NULL,
      recommended_streams TEXT NOT NULL,
      feedback_en TEXT,
      feedback_ta TEXT,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS careers (
      id TEXT PRIMARY KEY,
      title_en TEXT NOT NULL,
      title_ta TEXT NOT NULL,
      category TEXT NOT NULL,
      description_en TEXT NOT NULL,
      description_ta TEXT NOT NULL,
      education_level_required TEXT NOT NULL,
      pathway_steps_en TEXT NOT NULL,
      pathway_steps_ta TEXT NOT NULL,
      required_skills_en TEXT NOT NULL,
      required_skills_ta TEXT NOT NULL,
      entrance_exams TEXT NOT NULL,
      top_colleges_tn TEXT NOT NULL,
      salary_range TEXT NOT NULL,
      gov_7_5_applicable INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      icon_name TEXT DEFAULT 'Compass',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS scholarships (
      id TEXT PRIMARY KEY,
      title_en TEXT NOT NULL,
      title_ta TEXT NOT NULL,
      provider TEXT NOT NULL,
      amount_en TEXT NOT NULL,
      amount_ta TEXT NOT NULL,
      eligibility_gender TEXT DEFAULT 'all',
      eligibility_community TEXT DEFAULT 'all',
      eligibility_school_type TEXT DEFAULT 'Govt Schools Only',
      eligibility_class TEXT DEFAULT 'Any',
      description_en TEXT NOT NULL,
      description_ta TEXT NOT NULL,
      application_portal TEXT NOT NULL,
      documents_required_en TEXT NOT NULL,
      documents_required_ta TEXT NOT NULL,
      deadline TEXT,
      is_featured INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS life_skills_modules (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      title_en TEXT NOT NULL,
      title_ta TEXT NOT NULL,
      summary_en TEXT NOT NULL,
      summary_ta TEXT NOT NULL,
      content_markdown_en TEXT NOT NULL,
      content_markdown_ta TEXT NOT NULL,
      practical_tips_en TEXT NOT NULL,
      practical_tips_ta TEXT NOT NULL,
      quiz_data TEXT NOT NULL,
      video_url TEXT,
      audio_url TEXT,
      duration_mins INTEGER DEFAULT 15,
      icon_name TEXT DEFAULT 'BookOpen',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS learning_resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      title_en TEXT NOT NULL,
      title_ta TEXT NOT NULL,
      category TEXT NOT NULL,
      url TEXT NOT NULL,
      platform TEXT NOT NULL,
      thumbnail TEXT,
      description_en TEXT,
      description_ta TEXT,
      is_free INTEGER DEFAULT 1,
      duration TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS student_saved_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      item_type TEXT NOT NULL,
      item_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, item_type, item_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS student_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      module_id TEXT NOT NULL,
      completed INTEGER DEFAULT 1,
      score INTEGER DEFAULT 0,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, module_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS feedback_queries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      email_or_phone TEXT NOT NULL,
      district TEXT,
      school_name TEXT,
      category TEXT NOT NULL,
      message TEXT NOT NULL,
      reply TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Database initialized successfully.');
}

module.exports = {
  db,
  initDatabase
};
