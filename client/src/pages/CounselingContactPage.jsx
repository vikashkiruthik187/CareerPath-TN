import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { TN_DISTRICTS } from '../constants/tnData';
import {
  HelpCircle,
  PhoneCall,
  Send,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  Building,
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';

export default function CounselingContactPage() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const isTamil = lang === 'ta';

  const [form, setForm] = useState({
    name: user?.name || '',
    email_or_phone: user?.email || '',
    district: user?.district || 'Madurai',
    school_name: user?.school_name || 'Government Higher Secondary School',
    category: 'Career Counseling',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [resolvedQueries, setResolvedQueries] = useState([]);

  useEffect(() => {
    fetch('/api/feedback')
      .then(res => res.json())
      .then(data => {
        setResolvedQueries(data.queries || []);
      })
      .catch(err => console.error('Fetch public queries error:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email_or_phone || !form.message) {
      alert(isTamil ? 'அனைத்து விவரங்களையும் பூர்த்தி செய்க' : 'Please fill all required fields');
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem('careerpath_token');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage(data.message);
        setForm({
          name: user?.name || '',
          email_or_phone: user?.email || '',
          district: user?.district || 'Madurai',
          school_name: user?.school_name || '',
          category: 'Career Counseling',
          message: ''
        });
      } else {
        alert(data.error || 'Failed to submit query');
      }
    } catch (err) {
      alert('Error submitting inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
          <span>{isTamil ? 'அரசு மாணவர் ஆலோசனை & வழிகாட்டுதல் மையம்' : 'Student Counseling & Helpline Helpdesk'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {isTamil ? 'வழிகாட்டுதல் ஆலோசனைகள் & தொடர்பு' : 'Ask a Counselor & Student Helplines'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {isTamil
            ? 'உயர்கல்வி, 7.5% இடஒதுக்கீடு, புதுமைப் பெண் திட்டம் அல்லது தேர்வு பதட்டம் குறித்து எங்கள் கல்வித்துறை ஆலோசகர்களிடம் நேரடியாக கேளுங்கள்.'
            : 'Submit your higher education and scheme doubts to certified educational counselors or dial official emergency helplines.'}
        </p>
      </div>

      {/* Helplines Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 14417 */}
        <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-6 rounded-3xl shadow-lg flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-amber-300">
                24x7 Toll Free
              </span>
              <PhoneCall className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <h3 className="text-2xl font-black">14417</h3>
            <h4 className="font-bold text-sm text-emerald-100 mt-1">
              {isTamil ? 'தமிழ்நாடு பள்ளிக் கல்வித்துறை மாணவர் உதவி மையம்' : 'TN School Education Student Helpline'}
            </h4>
            <p className="text-xs text-emerald-200 mt-2 leading-relaxed">
              {isTamil
                ? 'தேர்வு பயம், கரியர் ஆலோசனை, மன அழுத்தம் மற்றும் மேல்நிலைக் கல்வி வழிகாட்டலுக்கு கட்டணமில்லா தொலைபேசி எண்.'
                : 'Free counseling for exam stress, career confusion, mental wellbeing, and state syllabus queries.'}
            </p>
          </div>
          <a
            href="tel:14417"
            className="w-full py-2 bg-white hover:bg-emerald-50 text-emerald-950 rounded-xl text-xs font-bold text-center transition-colors"
          >
            {isTamil ? 'இப்போதே அழைக்கவும்' : 'Call 14417'}
          </a>
        </div>

        {/* 1098 */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-indigo-300">
                Childline
              </span>
              <ShieldCheck className="w-5 h-5 text-indigo-300" />
            </div>
            <h3 className="text-2xl font-black">1098</h3>
            <h4 className="font-bold text-sm text-indigo-100 mt-1">
              {isTamil ? 'குழந்தைகள் மற்றும் மாணவர் பாதுகாப்பு உதவி எண்' : 'Childline & Student Protection'}
            </h4>
            <p className="text-xs text-indigo-200 mt-2 leading-relaxed">
              {isTamil
                ? 'பள்ளிக் குழந்தைகளுக்கான அவசர உதவி, இடைநிற்றல் தடுப்பு மற்றும் கல்வி உரிமை பாதுகாப்புக்கான தேசிய உதவி மையம்.'
                : 'National emergency assistance service for school children in need of care, safety, and dropout prevention.'}
            </p>
          </div>
          <a
            href="tel:1098"
            className="w-full py-2 bg-white hover:bg-indigo-50 text-indigo-950 rounded-xl text-xs font-bold text-center transition-colors"
          >
            {isTamil ? 'இப்போதே அழைக்கவும்' : 'Call 1098'}
          </a>
        </div>

        {/* 1930 */}
        <div className="bg-gradient-to-br from-rose-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-rose-300">
                Cyber Crime
              </span>
              <PhoneCall className="w-5 h-5 text-rose-300" />
            </div>
            <h3 className="text-2xl font-black">1930</h3>
            <h4 className="font-bold text-sm text-rose-100 mt-1">
              {isTamil ? 'இணைய நிதி மோசடி அவசர உதவி எண்' : 'National Cyber Financial Fraud Helpline'}
            </h4>
            <p className="text-xs text-rose-200 mt-2 leading-relaxed">
              {isTamil
                ? 'போலி உதவித்தொகை, வங்கிப் பரிவர்த்தனை மோசடி மற்றும் ஏடிஎம் பண இழப்புகளுக்கு உடனடி தீர்வு.'
                : 'Report unauthorized banking, UPI, and scholarship scams within the golden hour to freeze fraudulent transactions.'}
            </p>
          </div>
          <a
            href="tel:1930"
            className="w-full py-2 bg-white hover:bg-rose-50 text-rose-950 rounded-xl text-xs font-bold text-center transition-colors"
          >
            {isTamil ? 'இப்போதே அழைக்கவும்' : 'Call 1930'}
          </a>
        </div>
      </div>

      {/* Split Form & Answered FAQs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Query Submission Form */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              {isTamil ? 'ஆலோசகரிடம் கேள்வி கேட்க' : 'Submit Your Career Question'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isTamil
                ? 'உங்கள் வினாவிற்கு அரசு பள்ளி ஆலோசகர்கள் வழிகாட்டுதல் பதில் வழங்குவார்கள்.'
                : 'Our certified counselors will review and provide detailed guidance.'}
            </p>
          </div>

          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isTamil ? 'உங்கள் பெயர் *:' : 'Your Name *:'}
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Student Name"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isTamil ? 'தொடர்பு எண் அல்லது மின்னஞ்சல் *:' : 'Contact (Phone Number or Email) *:'}
              </label>
              <input
                type="text"
                required
                value={form.email_or_phone}
                onChange={(e) => setForm({ ...form, email_or_phone: e.target.value })}
                placeholder="Mobile number or Email"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isTamil ? 'மாவட்டம்:' : 'District:'}
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
                  {isTamil ? 'கேள்விப் பிரிவு:' : 'Category:'}
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  <option value="Career Counseling">Career Counseling (கரியர் தேர்வு)</option>
                  <option value="Scholarship Help">Scholarship Help (உதவித்தொகை சந்தேகம்)</option>
                  <option value="7.5% Quota Guidance">7.5% Quota Guidance (7.5% இடஒதுக்கீடு)</option>
                  <option value="Exam Stress">Exam Stress & Preparation (தேர்வு பயம்)</option>
                  <option value="Other">Other Query (இதர)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isTamil ? 'பள்ளி பெயர்:' : 'School Name:'}
              </label>
              <input
                type="text"
                value={form.school_name}
                onChange={(e) => setForm({ ...form, school_name: e.target.value })}
                placeholder="e.g. Govt Girls HSS, Melur"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isTamil ? 'உங்கள் கேள்வி / ஆலோசனை விவரம் *:' : 'Your Question / Query Details *:'}
              </label>
              <textarea
                rows="4"
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={isTamil ? 'உங்கள் சந்தேகம் அல்லது ஆலோசனையை தெளிவாக எழுதவும்...' : 'Type your doubt or question clearly...'}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? (isTamil ? 'அனுப்பப்படுகிறது...' : 'Sending...') : (isTamil ? 'ஆலோசகருக்கு அனுப்புக' : 'Send to Counselor')}</span>
            </button>
          </form>
        </div>

        {/* Right: Answered Counselor FAQs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <span>{isTamil ? 'ஆலோசகர்களால் தீர்க்கப்பட்ட பொதுவான கேள்விகள்' : 'Frequently Asked Counseling Queries'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {isTamil
                ? 'தமிழ்நாடு அரசுப் பள்ளி மாணவர்கள் அதிகம் கேட்கும் வினாக்களுக்கான நேரடி பதில்கள்.'
                : 'Direct counselor answers to popular questions asked by TN government school students.'}
            </p>

            <div className="space-y-4 pt-2">
              {resolvedQueries.map((q) => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-bold text-slate-800">{q.name} ({q.district})</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">{q.category}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    Q: {q.message}
                  </div>
                  <div className="text-xs text-emerald-900 bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 leading-relaxed font-medium">
                    <span className="font-bold text-emerald-950 block mb-0.5">Counselor Advice:</span>
                    {q.reply}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
