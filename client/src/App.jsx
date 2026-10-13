import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import AssessmentPage from './pages/AssessmentPage';
import CareersPage from './pages/CareersPage';
import FinancialLiteracyPage from './pages/FinancialLiteracyPage';
import LifeSkillsPage from './pages/LifeSkillsPage';
import SkillModuleDetailPage from './pages/SkillModuleDetailPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CounselingContactPage from './pages/CounselingContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/assessment" element={<AssessmentPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/finance" element={<FinancialLiteracyPage />} />
                <Route path="/skills" element={<LifeSkillsPage />} />
                <Route path="/skills/:id" element={<SkillModuleDetailPage />} />
                <Route path="/resume" element={<ResumeBuilderPage />} />
                <Route path="/dashboard" element={<StudentDashboardPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/counseling" element={<CounselingContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}
