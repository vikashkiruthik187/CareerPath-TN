import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import CareerModal from '../components/CareerModal';
import {
  Compass,
  Search,
  Filter,
  Award,
  Bookmark,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Sparkles
} from 'lucide-react';

export default function CareersPage() {
  const { lang, t } = useLanguage();
  const { isAuthenticated } = useAuth();

  const [careers, setCareers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEducation, setSelectedEducation] = useState('All');
  const [filterGov75, setFilterGov75] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [loading, setLoading] = useState(true);

  const isTamil = lang === 'ta';

  const categories = [
    { id: 'All', label_en: 'All Sectors', label_ta: 'அனைத்து துறைகளும்' },
    { id: 'Agriculture & Allied', label_en: 'Agriculture & Veterinary', label_ta: 'வேளாண்மை & கால்நடை' },
    { id: 'Healthcare', label_en: 'Medicine & Healthcare', label_ta: 'மருத்துவம் & சுகாதாரம்' },
    { id: 'Engineering & Tech', label_en: 'Engineering & AI', label_ta: 'பொறியியல் & ஐடி' },
    { id: 'Government & Defence', label_en: 'Govt Services & Police', label_ta: 'அரசுப் பணி & சீருடை' },
    { id: 'Commerce & Finance', label_en: 'Commerce & Accounts', label_ta: 'வணிகம் & ஆடிட்டிங்' },
    { id: 'Vocational & ITI', label_en: 'Vocational & ITI', label_ta: 'தொழிற்பயிற்சி & ITI' },
    { id: 'Education', label_en: 'Teaching', label_ta: 'ஆசிரியர் பணி' },
    { id: 'Arts & Law', label_en: 'Law & Humanities', label_ta: 'சட்டம் & கலைகள்' }
  ];

  const educationLevels = [
    { id: 'All', label_en: 'All Education Levels', label_ta: 'அனைத்து கல்வி நிலைகளும்' },
    { id: '10th', label_en: 'After 10th (SSLC)', label_ta: '10ஆம் வகுப்பிற்குப் பின்' },
    { id: '12th', label_en: 'After 12th (HSC)', label_ta: '12ஆம் வகுப்பிற்குப் பின்' },
    { id: 'Degree', label_en: 'Bachelor Degree', label_ta: 'பட்டப்படிப்பு' },
    { id: 'ITI', label_en: 'ITI / Diploma', label_ta: 'ITI / பாலிடெக்னிக்' }
  ];

  const fetchCareers = () => {
    setLoading(true);
    let url = `/api/careers?category=${encodeURIComponent(selectedCategory)}&education=${encodeURIComponent(selectedEducation)}&gov_7_5=${filterGov75}&search=${encodeURIComponent(searchQuery)}`;
    const token = localStorage.getItem('careerpath_token');

    fetch(url, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    })
      .then(res => res.json())
      .then(data => {
        setCareers(data.careers || []);
      })
      .catch(err => console.error('Fetch careers error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCareers();
  }, [selectedCategory, selectedEducation, filterGov75]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCareers();
  };

  const handleBookmarkToggle = async (careerId) => {
    if (!isAuthenticated) {
      alert(isTamil ? 'கரியரைச் சேமிக்க தயவுசெய்து உள்நுழையவும்!' : 'Please login to bookmark this career!');
      return;
    }

    try {
      const token = localStorage.getItem('careerpath_token');
      const res = await fetch('/api/student/bookmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ item_type: 'career', item_id: careerId })
      });
      const data = await res.json();
      if (res.ok) {
        setCareers(prev =>
          prev.map(c => (c.id === careerId ? { ...c, is_saved: data.bookmarked } : c))
        );
        if (selectedCareer && selectedCareer.id === careerId) {
          setSelectedCareer(prev => ({ ...prev, is_saved: data.bookmarked }));
        }
      }
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
          <Compass className="w-3.5 h-3.5 text-emerald-700" />
          <span>{isTamil ? 'முழுமையான தொழில் கையேடு' : 'Comprehensive Career Pathways Guide'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {isTamil ? 'தமிழ்நாடு மாணவர் தொழில் வழிகாட்டி' : 'Explore Careers & Higher Education'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {isTamil
            ? 'பொறியியல், மருத்துவம், வேளாண்மை, ஆசிரியர் பணி, அரசுத் தேர்வுகள், ITI மற்றும் வணிகவியல் உள்ளிட்ட அனைத்து துறைகளின் முழு விபரம்.'
            : 'Detailed qualifications, entrance examinations, top Tamil Nadu government colleges, and 7.5% reservation opportunities.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isTamil ? 'கரியர் அல்லது படிப்புப் பெயரைத் தேடுக (எ.கா. Agriculture, Doctor, TNPSC)...' : 'Search careers (e.g. Agriculture Officer, Doctor, TNPSC)...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 text-xs sm:text-sm bg-slate-50 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors shrink-0"
          >
            {t('common.search')}
          </button>
        </form>

        {/* Categories Chips */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const label = isTamil ? cat.label_ta : cat.label_en;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Secondary Filters: Education Level & 7.5% Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">{isTamil ? 'படிப்பு நிலை:' : 'Education Level:'}</span>
            <select
              value={selectedEducation}
              onChange={(e) => setSelectedEducation(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold focus:outline-hidden"
            >
              {educationLevels.map(edu => (
                <option key={edu.id} value={edu.id}>{isTamil ? edu.label_ta : edu.label_en}</option>
              ))}
            </select>
          </div>

          {/* 7.5% Govt School Toggle */}
          <button
            type="button"
            onClick={() => setFilterGov75(!filterGov75)}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors border ${
              filterGov75
                ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>{isTamil ? '7.5% அரசு பள்ளி இடஒதுக்கீடு உள்ள படிப்புகள் மட்டும்' : '7.5% Govt School Horizontal Quota Only'}</span>
          </button>
        </div>
      </div>

      {/* Careers Results Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-xs font-semibold">{t('common.loading')}</p>
        </div>
      ) : careers.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-base text-slate-800">
            {isTamil ? 'பொருத்தமான தொழில்கள் எதுவும் காணப்படவில்லை' : 'No careers matched your search criteria'}
          </h3>
          <p className="text-xs text-slate-500">
            {isTamil ? 'வடிகட்டிகளை மாற்றி அல்லது வேறு சொல்லைப் பயன்படுத்தி தேடவும்.' : 'Try clearing filters or searching with different keywords.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedEducation('All');
              setFilterGov75(false);
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            {isTamil ? 'அனைத்து வடிகட்டிகளையும் நீக்குக' : 'Reset All Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((career) => {
            const title = isTamil ? career.title_ta : career.title_en;
            const desc = isTamil ? career.description_ta : career.description_en;
            return (
              <div
                key={career.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {career.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {career.gov_7_5_applicable && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-600" />
                          <span>7.5% Quota</span>
                        </span>
                      )}
                      <button
                        onClick={() => handleBookmarkToggle(career.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          career.is_saved
                            ? 'bg-amber-50 text-amber-600 border-amber-200'
                            : 'text-slate-300 border-transparent hover:text-slate-600 hover:bg-slate-50'
                        }`}
                        title={career.is_saved ? 'Bookmarked' : 'Bookmark Career'}
                      >
                        <Bookmark className={`w-4 h-4 ${career.is_saved ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">
                      {isTamil ? 'படிப்பு:' : 'Required:'}
                    </span>
                    <span className="font-bold text-slate-700 truncate max-w-[170px]">
                      {career.education_level_required}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">
                      {isTamil ? 'சம்பளம்:' : 'Salary:'}
                    </span>
                    <span className="font-bold text-emerald-700 truncate max-w-[170px]">
                      {career.salary_range}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedCareer(career)}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{t('common.viewDetails')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedCareer && (
        <CareerModal
          career={selectedCareer}
          onClose={() => setSelectedCareer(null)}
          onBookmarkToggle={handleBookmarkToggle}
        />
      )}
    </div>
  );
}
