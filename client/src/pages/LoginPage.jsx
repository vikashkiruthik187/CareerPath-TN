import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogIn, Sparkles, ShieldAlert, User, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { lang, t } = useLanguage();
  const { login, quickLoginStudent, quickLoginAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isTamil = lang === 'ta';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoStudent = async () => {
    try {
      await quickLoginStudent();
      navigate('/dashboard');
    } catch (err) {
      setError('Demo login error');
    }
  };

  const handleDemoAdmin = async () => {
    try {
      await quickLoginAdmin();
      navigate('/admin');
    } catch (err) {
      setError('Demo admin error');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-amber-300 flex items-center justify-center mx-auto shadow-md">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">
          {isTamil ? 'மாணவர் உள்நுழைவு' : 'Student & Staff Login'}
        </h1>
        <p className="text-xs text-slate-500">
          {isTamil
            ? 'உங்கள் கரியர் அறிக்கை மற்றும் சேமிக்கப்பட்ட தகவல்களைக் காண உள்நுழையவும்.'
            : 'Access your personalized career profile, bookmarks, and learning modules.'}
        </p>
      </div>

      {/* Quick 1-Click Demo Buttons */}
      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2.5">
        <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Quick 1-Click Instant Demo Login:</span>
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleDemoStudent}
            className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 text-xs font-bold border border-amber-300 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>Demo Student</span>
          </button>
          <button
            type="button"
            onClick={handleDemoAdmin}
            className="p-2.5 rounded-xl bg-white hover:bg-amber-100 text-slate-800 text-xs font-bold border border-amber-300 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            <span>Demo Admin</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">
            {isTamil ? 'மின்னஞ்சல் (Email):' : 'Email Address:'}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@school.tn.gov.in"
            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">
            {isTamil ? 'கடவுச்சொல் (Password):' : 'Password:'}
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>{loading ? (isTamil ? 'உள்நுழைகிறது...' : 'Signing in...') : (isTamil ? 'உள்நுழைக' : 'Sign In')}</span>
        </button>

        <div className="text-center pt-2 text-slate-500">
          <span>{isTamil ? 'புதிய மாணவரா? ' : "Don't have an account? "}</span>
          <Link to="/register" className="font-bold text-emerald-700 hover:underline">
            {isTamil ? 'இங்கே பதிவு செய்க' : 'Register Here'}
          </Link>
        </div>
      </form>
    </div>
  );
}
