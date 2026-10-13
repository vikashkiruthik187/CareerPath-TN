import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  MessageCircle,
  Users,
  Mic,
  Clock,
  ShieldAlert,
  Coins,
  CheckCircle2,
  PlayCircle,
  ExternalLink,
  Award,
  ArrowRight,
  Headphones,
  Video,
  FileText
} from 'lucide-react';

export default function LifeSkillsPage() {
  const { lang, t } = useLanguage();
  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState('modules'); // 'modules' | 'media'
  const [modules, setModules] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const isTamil = lang === 'ta';

  const categories = [
    { id: 'All', label_en: 'All Topics', label_ta: 'அனைத்து தலைப்புகளும்' },
    { id: 'Spoken English', label_en: 'Spoken English', label_ta: 'பேச்சு ஆங்கிலம்' },
    { id: 'Interview & Resume', label_en: 'Interview & Resume', label_ta: 'நேர்காணல் & பயோடேட்டா' },
    { id: 'Public Speaking', label_en: 'Public Speaking', label_ta: 'பேச்சுக்கலை & மேடை பயம்' },
    { id: 'Financial Literacy', label_en: 'Money & Banking', label_ta: 'நிதி & வங்கி பாதுகாப்பு' },
    { id: 'Mindset & Confidence', label_en: 'Study & Time Management', label_ta: 'நேர மேலாண்மை & மன உறுதி' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('careerpath_token');
    Promise.all([
      fetch('/api/skills/modules', {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      }).then(res => res.json()),
      fetch('/api/skills/resources').then(res => res.json())
    ])
      .then(([modData, resData]) => {
        setModules(modData.modules || []);
        setResources(resData.resources || []);
      })
      .catch(err => console.error('Fetch skills error:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredModules = selectedCategory === 'All'
    ? modules
    : modules.filter(m => m.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
          <span>{isTamil ? 'வாழ்வியல் மற்றும் தொடர்புத் திறன் மையம்' : 'Life Skills & Communication Center'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {isTamil ? 'பேச்சு ஆங்கிலம் & வாழ்வியல் திறன் தொகுதிகள்' : 'Communication & Essential Life Skills'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {isTamil
            ? 'அன்றாட எளிய ஸ்போக்கன் இங்கிலீஷ், நேர்காணல் வெற்றி நுட்பங்கள், பயோடேட்டா தயாரிப்பு, மேடைப் பேச்சு மற்றும் இலவச வீடியோ/பாட்காஸ்ட் தொகுப்புகள்.'
            : 'Interactive modules for spoken English, interview mastery, public speaking, exam stress relief, plus curated YouTube & audio podcasts.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-slate-200/80 p-1.5 rounded-2xl flex gap-1 border border-slate-300">
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'modules'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>{isTamil ? 'வாழ்வியல் பாடத் தொகுதிகள் (Modules)' : 'Interactive Skill Modules'}</span>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'media'
                ? 'bg-white text-amber-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Headphones className="w-4 h-4 text-amber-600" />
            <span>{isTamil ? 'கல்வி தொலைக்காட்சி, வீடியோ & பாட்காஸ்ட்' : 'Videos, Kalvi TV & Podcasts'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE MODULES */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {isTamil ? cat.label_ta : cat.label_en}
              </button>
            ))}
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((m) => {
              const title = isTamil ? m.title_ta : m.title_en;
              const summary = isTamil ? m.summary_ta : m.summary_en;
              return (
                <div
                  key={m.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                        {m.category}
                      </span>
                      {m.is_completed && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{isTamil ? 'நிறைவு' : 'Completed'}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {summary}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">
                      ⏱ {m.duration_mins} Mins
                    </span>
                    <Link
                      to={`/skills/${m.id}`}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <span>{isTamil ? 'பாடத்தைத் தொடங்குக' : 'Start Module'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CURATED RESOURCES & PODCASTS */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => {
              const title = isTamil ? res.title_ta : res.title_en;
              const desc = isTamil ? res.description_ta : res.description_en;
              return (
                <div
                  key={res.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Thumbnail / Header */}
                  <div className="relative h-40 overflow-hidden bg-slate-800">
                    <img
                      src={res.thumbnail}
                      alt={title}
                      className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-950/80 text-white backdrop-blur-xs">
                        {res.platform}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                        {res.duration || 'Free'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {res.category}
                      </span>
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 mt-2 leading-snug">
                        {title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-3">
                        {desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700">100% Free Access</span>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <span>{isTamil ? 'திறக்க / பார்க்க' : 'Open Resource'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
