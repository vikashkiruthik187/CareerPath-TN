const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { initDatabase } = require('./db/database');
const { seedDatabase } = require('./db/seed');

// Initialize database schema and initial data
initDatabase();
seedDatabase();

const authRoutes = require('./routes/auth');
const careerRoutes = require('./routes/careers');
const scholarshipRoutes = require('./routes/scholarships');
const assessmentRoutes = require('./routes/assessment');
const skillRoutes = require('./routes/skills');
const studentRoutes = require('./routes/student');
const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'CareerPath TN - Tamil Nadu Student Career Guidance & Life Skills Platform',
    timestamp: new Date().toISOString()
  });
});

// Serve built React frontend (production)
const clientDist = path.join(__dirname, '../../client/dist');
if (require('fs').existsSync(clientDist)) {
  app.use(express.static(clientDist));
  // Catch-all: serve index.html for React Router client-side routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'An unexpected server error occurred' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CareerPath TN Backend running on port ${PORT}`);
});
