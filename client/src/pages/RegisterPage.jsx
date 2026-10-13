import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { TN_DISTRICTS, SCHOOL_TYPES, EDUCATION_LEVELS, STREAMS, INTEREST_TAGS } from '../constants/tnData';
import { GraduationCap, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const { lang, t } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    district: 'Madurai',
    school_name: 'Govt Girls Higher Secondary School',
    school_type: 'Government Higher Secondary School (GHSS)',
    age: 17,
    education_level: 'Class 12 (HSC 2nd Year)',
    stream: 'Bio-Maths (Physics, Chemistry, Biology, Mathematics)',
    interests: ['Agriculture & Allied', 'Science & Innovation'],
    career_aspirations: '',
    preferred_language: lang
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isTamil = lang === 'ta';

  const handleInterestToggle = (tag) => {
    if (form.interests.includes(tag)) {
      setForm({ ...form, interests: form.interests.filter(i => i !== tag) });
    } else {
      setForm({ ...form, interests: [...form.interests, tag] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError(isTamil ? 'அனைத்து கட்டாய விவரங்களையும் உள்ளிடவும்' : 'Please fill all required fields');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-amber-300 flex items-center justify-center mx-auto shadow-md">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          {isTamil ? 'அரசுப் பள்ளி மாணவர் பதிவு' : 'Student Registration'}
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          {isTamil
            ? 'உங்கள் கல்வி விவரங்களை பதிவு செய்து பிரத்யேக கரியர் ஆலோசனைகள் மற்றும் உதவித்தொகைகளைப் பெறுங்கள்.'
            : 'Join CareerPath TN to receive tailored career suggestions, 7.5% reservation guidance, and financial schemes.'}
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5 text-xs">
        {/* Basic Identity */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
            {isTamil ? '1. அடிப்படை விவரங்கள்' : '1. Basic Student Information'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isTamil ? 'முழுப் பெயர் *:' : 'Student Full Name *:'}
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Kavitha Murugan"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isTamil ? 'வயது (Age):' : 'Age:'}
              </label>
              <input
                type="number"
                min="12"
                max="25"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isTamil ? 'மின்னஞ்சல் *:' : 'Email Address *:'}
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="kavitha@example.com"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isTamil ? 'கடவுச்சொல் *:' : 'Password *:'}
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimum 6 characters"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>
          </div>
        </div>

        {/* School & District */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
            {isTamil ? '2. பள்ளி மற்றும் மாவட்டம்' : '2. School & District Details'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isTamil ? 'மாவட்டம் (District - TN 38):' : 'District:'}
              </label>
              <select
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                {TN_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isTamil ? 'பள்ளி வகை (School Type):' : 'School Type:'}
              </label>
              <select
                value={form.school_type}
                onChange={(e) => setForm({ ...form, school_type: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                {SCHOOL_TYPES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                {isTamil ? 'பள்ளியின் பெயர் (School Name):' : 'School Name:'}
              </label>
              <input
                type="text"
                value={form.school_name}
                onChange={(e) => setForm({ ...form, school_name: e.target.value })}
                placeholder="e.g. Govt Girls Higher Secondary School, Melur"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isTamil ? 'வகுப்பு / கல்வி நிலை:' : 'Education Level:'}
              </label>
              <select
                value={form.education_level}
                onChange={(e) => setForm({ ...form, education_level: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                {EDUCATION_LEVELS.map(el => (
                  <option key={el} value={el}>{el}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isTamil ? 'பாடப்பிரிவு (Stream):' : 'Subject Stream:'}
              </label>
              <select
                value={form.stream}
                onChange={(e) => setForm({ ...form, stream: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                {STREAMS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Interests & Aspirations */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
            {isTamil ? '3. விருப்பமான துறைகள் & இலக்கு' : '3. Interests & Career Goals'}
          </h4>
          <div>
            <label className="block font-bold text-slate-700 mb-2">
              {isTamil ? 'விருப்பமான பகுதிகள் (Select Areas of Interest):' : 'Areas of Interest:'}
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_TAGS.map(tag => {
                const selected = form.interests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleInterestToggle(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selected
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {isTamil ? 'உங்கள் எதிர்காலக் கனவு அல்லது தொழில் இலக்கு:' : 'Career Aspiration / Ambition:'}
            </label>
            <input
              type="text"
              value={form.career_aspirations}
              onChange={(e) => setForm({ ...form, career_aspirations: e.target.value })}
              placeholder={isTamil ? 'எ.கா. வேளாண்மை அலுவலர், மென்பொருள் பொறியாளர், காவல் ஆய்வாளர்...' : 'e.g. Agricultural Officer, Doctor, TNPSC Officer...'}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>{loading ? (isTamil ? 'பதிவு செய்யப்படுகிறது...' : 'Registering...') : (isTamil ? 'பதிவு செய்து தொடங்குக' : 'Create Student Account')}</span>
        </button>

        <div className="text-center pt-2 text-slate-500">
          <span>{isTamil ? 'ஏற்கனவே கணக்கு உள்ளதா? ' : 'Already registered? '}</span>
          <Link to="/login" className="font-bold text-emerald-700 hover:underline">
            {isTamil ? 'இங்கே உள்நுழைக' : 'Sign In Here'}
          </Link>
        </div>
      </form>
    </div>
  );
}
