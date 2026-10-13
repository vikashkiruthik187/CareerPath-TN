import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Languages,
  User,
  LogOut,
  Compass,
  FileText,
  Coins,
  BookOpen,
  LayoutDashboard,
  ShieldAlert,
  HelpCircle,
  Menu,
  X,
  PhoneCall,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, isAuthenticated, isAdmin, logout, quickLoginStudent, quickLoginAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleDemoStudent = async () => {
    try {
      await quickLoginStudent();
      setDemoMenuOpen(false);
      navigate('/dashboard');
    } catch (e) {
      alert('Demo student login error');
    }
  };

  const handleDemoAdmin = async () => {
    try {
      await quickLoginAdmin();
      setDemoMenuOpen(false);
      navigate('/admin');
    } catch (e) {
      alert('Demo admin login error');
    }
  };

  const navLinks = [
    { path: '/', label: t('nav.home'), icon: GraduationCap },
    { path: '/assessment', label: t('nav.assessment'), icon: Sparkles },
    { path: '/careers', label: t('nav.careers'), icon: Compass },
    { path: '/finance', label: t('nav.finance'), icon: Coins },
    { path: '/skills', label: t('nav.skills'), icon: BookOpen },
    { path: '/resume', label: t('nav.resume'), icon: FileText },
    { path: '/counseling', label: t('nav.counseling'), icon: HelpCircle }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Helpline Bar */}
      <div className="bg-emerald-700 text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>{t('helplineText')}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-emerald-100">
            <span>அரசுப் பள்ளி மாணவர்கள் நலம்</span>
            <span className="text-emerald-400">•</span>
            <span>Government of Tamil Nadu</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-white p-1 shadow-md border border-slate-200/80 flex items-center justify-center transform group-hover:scale-105 transition-transform overflow-hidden">
              <img
                src="/tn-emblem.png"
                alt="Tamil Nadu Government Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 bg-clip-text text-transparent">
                  {lang === 'ta' ? 'CareerPath TN' : 'CareerPath TN'}
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-amber-300">
                  தமிழ்நாடு
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-bold hidden sm:block">
                {lang === 'ta' ? 'அரசுப் பள்ளி மாணவர் வழிகாட்டி & வாழ்வியல் தளம்' : 'TN Student Career & Life Skills Platform'}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    active
                      ? 'bg-emerald-50 text-emerald-800 shadow-xs border border-emerald-200'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Tools: Language Switcher, Demo Login, Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title="Switch Language / மொழியை மாற்றுக"
              className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white hover:bg-emerald-50 hover:border-emerald-400 text-slate-700 hover:text-emerald-800 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Languages className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'ta' ? 'English' : 'தமிழ்'}</span>
            </button>

            {/* Quick Demo Access Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 flex items-center gap-1 transition-colors"
                title="Quick Demo Accounts"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Demo</span>
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Quick 1-Click Demo
                  </div>
                  <button
                    onClick={handleDemoStudent}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <div>
                      <div className="font-semibold">Demo Student (கவிதா)</div>
                      <div className="text-[10px] text-slate-600">Bio-Maths, Madurai GHSS</div>
                    </div>
                  </button>
                  <button
                    onClick={handleDemoAdmin}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    <div>
                      <div className="font-semibold">Demo Administrator</div>
                      <div className="text-[10px] text-slate-600">Full Access & Analytics</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* User Profile or Login */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200 flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('nav.admin')}</span>
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200 flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{user?.name?.split(' ')[0] || t('nav.dashboard')}</span>
                  </Link>
                )}

                <button
                  onClick={logout}
                  title={t('nav.logout')}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-bold rounded-lg text-emerald-800 hover:bg-emerald-50 transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <item.icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
          {isAuthenticated && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-700 bg-emerald-50"
            >
              <LayoutDashboard className="w-4 h-4" />
              {t('nav.dashboard')} ({user?.name})
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
