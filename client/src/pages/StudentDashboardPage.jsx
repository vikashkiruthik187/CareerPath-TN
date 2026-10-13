import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import CareerModal from '../components/CareerModal';
import ScholarshipModal from '../components/ScholarshipModal';
import { TN_DISTRICTS } from '../constants/tnData';
import {
  User,
  GraduationCap,
  Sparkles,
  Compass,
  Coins,
  BookOpen,
  Award,
  CheckCircle2,
  Bookmark,
  Calendar,
  Edit3,
  Save,
  ArrowRight,
  LogOut,
  MapPin,
  Building,
  Target
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { lang, t } = useLanguage();
  const { user, isAuthenticated, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    district: '',
    school_name: '',
    education_level: '',
    career_aspirations: ''
  });

  const [selectedCareer, setSelectedCareer] = useState(null);
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  // Student 30-Day Higher Education Checklist State
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('careerpath_checklist');
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, text_en: 'Collect Class 6-12 Continuous Study Certificate from Headmaster for 7.5% quota', text_ta: '7.5% இடஒதுக்கீட்டிற்காக 6-12 வரை அரசுப் பள்ளி படிப்புச் சான்றிதழை தலைமை ஆசிரியரிடம் பெறுதல்', done: true },
          { id: 2, text_en: 'Open Zero-Balance Student Bank Account & seed Aadhaar with NPCI', text_ta: 'ஆதார் இணைக்கப்பட்ட ஜீரோ பேலன்ஸ் மாணவர் வங்கிக் கணக்கு தொடங்குதல்', done: true },
          { id: 3, text_en: 'Take Career Assessment Quiz & finalize 11th/12th stream or college degree', text_ta: 'கரியர் மதிப்பீட்டுத் தேர்வெழுதி விருப்பமான படிப்பை உறுதி செய்தல்', done: false },
          { id: 4, text_en: 'Create professional bio-data using Resume Builder', text_ta: 'பயோடேட்டா தயாரிப்பான் மூலம் ரெஸ்யூமே தயார் செய்தல்', done: false },
          { id: 5, text_en: 'Complete Spoken English Module 1 daily conversation exercises', text_ta: 'ஸ்போக்கன் இங்கிலீஷ் பாடங்களை முடித்து உரையாடிப் பழகுதல்', done: false }
        ];
  });

  const isTamil = lang === 'ta';

  const fetchDashboard = () => {
    const token = localStorage.getItem('careerpath_token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    fetch('/api/student/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load dashboard');
        return res.json();
      })
      .then(data => {
        setDashboardData(data);
        if (data.user) {
          setProfileForm({
            name: data.user.name || '',
            district: data.user.district || 'Madurai',
            school_name: data.user.school_name || '',
            education_level: data.user.education_level || 'Class 12',
            career_aspirations: data.user.career_aspirations || ''
          });
        }
      })
      .catch(err => {
        console.error('Dashboard error:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const toggleChecklistItem = (id) => {
    const updated = checklist.map(item => (item.id === id ? { ...item, done: !item.done } : item));
    setChecklist(updated);
    localStorage.setItem('careerpath_checklist', JSON.stringify(updated));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('careerpath_token');
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });
      const data = await res.json();
      if (res.ok) {
        updateUserProfile(data.user);
        setEditMode(false);
        fetchDashboard();
      }
    } catch (err) {
      alert('Error updating profile');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-500 text-xs font-semibold">{t('common.loading')}</p>
      </div>
    );
  }

  const profile = dashboardData?.user || user;
  const assessment = dashboardData?.assessment;
  const savedCareers = dashboardData?.savedCareers || [];
  const savedScholarships = dashboardData?.savedScholarships || [];
  const progress = dashboardData?.progress;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-6 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 text-2xl font-black shadow-inner">
            {profile?.name ? profile.name.charAt(0) : 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-700 text-emerald-100">
                {profile?.education_level || 'Class 12'}
              </span>
              <span className="text-xs text-emerald-300 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{profile?.district || 'Tamil Nadu'}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">{profile?.name}</h1>
            <p className="text-xs text-slate-300 mt-0.5">{profile?.school_name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{editMode ? (isTamil ? 'மூடுக' : 'Close') : (isTamil ? 'சுயவிவரம் திருத்து' : 'Edit Profile')}</span>
          </button>
          <button
            onClick={logout}
            className="p-2 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white text-xs font-bold transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Edit Profile Form (conditional) */}
      {editMode && (
        <form onSubmit={handleProfileSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-2">
            {isTamil ? 'மாணவர் விவரங்களை புதுப்பிக்கவும்' : 'Update Profile Information'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">{isTamil ? 'பெயர்:' : 'Name:'}</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">{isTamil ? 'மாவட்டம்:' : 'District:'}</label>
              <select
                value={profileForm.district}
                onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
              >
                {TN_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">{isTamil ? 'பள்ளி பெயர்:' : 'School Name:'}</label>
              <input
                type="text"
                value={profileForm.school_name}
                onChange={(e) => setProfileForm({ ...profileForm, school_name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">{isTamil ? 'கரியர் இலக்கு (Aspiration):' : 'Career Goal:'}</label>
              <input
                type="text"
                value={profileForm.career_aspirations}
                onChange={(e) => setProfileForm({ ...profileForm, career_aspirations: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
              />
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isTamil ? 'சேமிக்க' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Grid: Assessment Report & 30-Day Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Assessment Snapshot */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-base text-slate-900">
                  {isTamil ? 'கரியர் மதிப்பீட்டு முடிவுகள்' : 'Career Aptitude Report'}
                </h3>
              </div>
              <Link
                to="/assessment"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>{assessment ? (isTamil ? 'மீண்டும் தேர்வு செய்ய' : 'Retake Assessment') : (isTamil ? 'மதிப்பீடு செய்க' : 'Take Assessment')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {assessment ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-slate-700 leading-relaxed">
                  <p className="font-medium">
                    {isTamil ? assessment.feedback_ta : assessment.feedback_en}
                  </p>
                </div>

                {/* Top Recommended Careers */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    {isTamil ? 'பரிந்துரைக்கப்பட்ட கரியர்கள்:' : 'Top Matched Careers:'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {assessment.top_careers?.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          fetch(`/api/careers/${c.id}`)
                            .then(res => res.json())
                            .then(d => setSelectedCareer(d.career));
                        }}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer flex justify-between items-center"
                      >
                        <div>
                          <div className="font-extrabold text-xs text-slate-900">
                            {isTamil ? c.title_ta : c.title_en}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                            {c.salary_range}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <Compass className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">
                  {isTamil
                    ? 'நீங்கள் இன்னும் கரியர் மதிப்பீட்டு வினாடி வினாவை முடிக்கவில்லை.'
                    : 'You have not completed the career assessment yet.'}
                </p>
                <Link
                  to="/assessment"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isTamil ? 'மதிப்பீட்டைத் தொடங்கு' : 'Take Free Assessment'}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Bookmarked Careers & Scholarships */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Bookmark className="w-5 h-5 text-emerald-600" />
              <span>{isTamil ? 'சேமிக்கப்பட்ட கரியர்கள் & உதவித்தொகைகள்' : 'Bookmarked Careers & Schemes'}</span>
            </h3>

            {savedCareers.length === 0 && savedScholarships.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                {isTamil ? 'சேமிக்கப்பட்ட தகவல்கள் ஏதுமில்லை.' : 'No items bookmarked yet.'}
              </p>
            ) : (
              <div className="space-y-4">
                {savedCareers.length > 0 && (
                  <div>
                    <h5 className="text-[11px] font-bold uppercase text-slate-500 mb-2">
                      {isTamil ? 'கரியர்கள்' : 'Careers'}
                    </h5>
                    <div className="space-y-2">
                      {savedCareers.map(c => (
                        <div
                          key={c.id}
                          onClick={() => {
                            fetch(`/api/careers/${c.id}`).then(r => r.json()).then(d => setSelectedCareer(d.career));
                          }}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center cursor-pointer hover:border-emerald-300"
                        >
                          <div>
                            <span className="font-bold text-xs text-slate-900">{isTamil ? c.title_ta : c.title_en}</span>
                            <span className="text-[10px] text-slate-500 block">{c.salary_range}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {savedScholarships.length > 0 && (
                  <div>
                    <h5 className="text-[11px] font-bold uppercase text-slate-500 mb-2">
                      {isTamil ? 'உதவித்தொகைகள்' : 'Scholarships'}
                    </h5>
                    <div className="space-y-2">
                      {savedScholarships.map(s => (
                        <div
                          key={s.id}
                          onClick={() => {
                            fetch(`/api/scholarships/${s.id}`).then(r => r.json()).then(d => setSelectedScholarship(d.scholarship));
                          }}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center cursor-pointer hover:border-amber-300"
                        >
                          <div>
                            <span className="font-bold text-xs text-slate-900">{isTamil ? s.title_ta : s.title_en}</span>
                            <span className="text-[10px] text-emerald-700 font-extrabold block">{isTamil ? s.amount_ta : s.amount_en}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 30-Day Action Checklist & Life Skills Progress */}
        <div className="lg:col-span-5 space-y-6">
          {/* Life Skills Progress Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              <span>{isTamil ? 'வாழ்வியல் திறன் முன்னேற்றம்' : 'Life Skills Progress'}</span>
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>{isTamil ? 'நிறைவு செய்த பாடங்கள்:' : 'Completed Modules:'}</span>
                <span className="text-teal-700">{progress?.completedCount || 0} / {progress?.totalCount || 6}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full"
                  style={{ width: `${Math.round(((progress?.completedCount || 0) / (progress?.totalCount || 6)) * 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {progress?.completedModules?.map((mod, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-teal-50/50 border border-teal-100 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">{isTamil ? mod.title_ta : mod.title_en}</span>
                  <span className="font-black text-teal-800">{mod.score}%</span>
                </div>
              ))}
            </div>

            <Link
              to="/skills"
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>{isTamil ? 'கூடுதல் பாடங்களைக் கற்க' : 'Explore More Modules'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 30-Day Higher Education Checklist */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-600" />
              <h3 className="font-extrabold text-base text-slate-900">
                {isTamil ? 'மாணவர் 30-நாள் இலக்கு அட்டவணை' : '30-Day College Prep Checklist'}
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              {isTamil
                ? 'அரசுப் பள்ளி மாணவர்கள் உயர்கல்விக்கு தயார் செய்ய வேண்டிய முக்கிய பணிகள்.'
                : 'Key milestones every TN govt school student should complete before college entry.'}
            </p>

            <div className="space-y-2.5">
              {checklist.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    item.done
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-600'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                    item.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {item.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-xs font-semibold leading-relaxed ${item.done ? 'line-through text-slate-400' : ''}`}>
                    {isTamil ? item.text_ta : item.text_en}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedCareer && (
        <CareerModal career={selectedCareer} onClose={() => setSelectedCareer(null)} />
      )}
      {selectedScholarship && (
        <ScholarshipModal scholarship={selectedScholarship} onClose={() => setSelectedScholarship(null)} />
      )}
    </div>
  );
}
