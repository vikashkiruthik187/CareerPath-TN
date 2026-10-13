import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import CareerModal from '../components/CareerModal';
import ScholarshipModal from '../components/ScholarshipModal';
import {
  GraduationCap,
  Sparkles,
  Compass,
  Coins,
  BookOpen,
  FileText,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Users,
  Building,
  PhoneCall,
  ExternalLink,
  Zap,
  Bookmark
} from 'lucide-react';

export default function HomePage() {
  const { lang, t } = useLanguage();
  const { isAuthenticated, quickLoginStudent } = useAuth();
  const navigate = useNavigate();

  const [featuredCareers, setFeaturedCareers] = useState([]);
  const [featuredScholarships, setFeaturedScholarships] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [loading, setLoading] = useState(true);

  const isTamil = lang === 'ta';

  useEffect(() => {
    Promise.all([
      fetch('/api/careers?is_featured=true').then(res => res.json()),
      fetch('/api/scholarships').then(res => res.json())
    ])
      .then(([careersData, scholarshipsData]) => {
        setFeaturedCareers((careersData.careers || []).slice(0, 6));
        setFeaturedScholarships((scholarshipsData.scholarships || []).slice(0, 4));
      })
      .catch(err => console.error('Failed to load home data:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20">
        {/* Background gradient decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-emerald-200/40 via-teal-100/30 to-amber-100/30 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs sm:text-sm font-bold shadow-xs animate-in fade-in slide-in-from-top-3">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            {isTamil ? (
              <>
                உங்கள் விருப்பமான தொழிலையும்{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">
                  உயர்கல்விப் பாதையையும்
                </span>{' '}
                தன்னம்பிக்கையுடன் தேர்வு செய்யுங்கள்
              </>
            ) : (
              <>
                Discover Your Career & Future{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">
                  Pathways With Confidence
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
            <Link
              to="/assessment"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/25 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{t('hero.ctaTakeAssessment')}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              to="/careers"
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-300 shadow-sm flex items-center gap-2 transition-all"
            >
              <Compass className="w-5 h-5 text-emerald-600" />
              <span>{t('hero.ctaExploreCareers')}</span>
            </Link>

            <Link
              to="/finance"
              className="px-5 py-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-sm sm:text-base border border-amber-200 shadow-xs flex items-center gap-2 transition-all"
            >
              <Coins className="w-5 h-5 text-amber-700" />
              <span>{t('hero.ctaCheckScholarships')}</span>
            </Link>
          </div>

          {/* Quick Notice Banner */}
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {isTamil
                ? 'தமிழ்நாடு பள்ளிக் கல்வித் துறை வழிகாட்டுதல் • அனைத்து மாணவர்களுக்கும் 100% இலவசம்'
                : 'Aligned with TN School Education Guidelines • 100% Free for all students'}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Key Pillars Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">{t('stats.districts')}</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">{t('stats.districtsSub')}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">{t('stats.schemes')}</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">{t('stats.schemesSub')}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">{t('stats.careers')}</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">{t('stats.careersSub')}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">{t('stats.skills')}</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">{t('stats.skillsSub')}</p>
          </div>
        </div>
      </section>

      {/* 3. TN Government Schemes Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30">
                  {isTamil ? 'தமிழ்நாடு அரசின் சிறப்புக் கல்வித் திட்டங்கள்' : 'Tamil Nadu Government Welfare Spotlight'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                  {isTamil ? 'அரசுப் பள்ளி மாணவர்களுக்கான தனிச் சலுகைகள்' : 'Special Benefits for TN Govt School Students'}
                </h2>
              </div>
              <Link
                to="/finance"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
              >
                <span>{isTamil ? 'அனைத்து திட்டங்களையும் காண்க' : 'View All Schemes'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Pudhumai Penn */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-amber-400/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded">
                      {isTamil ? 'மாணவிகள்' : 'Girls Only'}
                    </span>
                    <span className="text-xs font-black text-white">₹1,000 / Month</span>
                  </div>
                  <h4 className="font-bold text-base text-white">
                    {isTamil ? 'புதுமைப் பெண் திட்டம்' : 'Pudhumai Penn Scheme'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {isTamil
                      ? '6 முதல் 12 வரை அரசுப் பள்ளியில் படித்து கல்லூரி, பாலிடெக்னிக், ஐடிஐ சேரும் மாணவிகளுக்கு மாதம் ₹1,000 உதவித்தொகை.'
                      : 'Monthly assistance of ₹1,000 directly transferred to girl students from govt schools pursuing higher education.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 text-xs text-amber-300 font-semibold flex items-center justify-between">
                  <span>pudhumaipenn.tn.gov.in</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>

              {/* Tamil Pudhalvan */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-teal-400/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-teal-300 bg-teal-400/20 px-2 py-0.5 rounded">
                      {isTamil ? 'மாணவர்கள்' : 'Boys Only'}
                    </span>
                    <span className="text-xs font-black text-white">₹1,000 / Month</span>
                  </div>
                  <h4 className="font-bold text-base text-white">
                    {isTamil ? 'தமிழ்ப் புதல்வன் திட்டம்' : 'Tamil Pudhalvan Scheme'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {isTamil
                      ? 'அரசுப் பள்ளியில் படித்து உயர்கல்வி சேரும் மாணவர்களுக்கு புத்தகம் மற்றும் கல்விச் செலவுகளுக்காக மாதாந்திர ₹1,000 நிதியுதவி.'
                      : 'Monthly assistance of ₹1,000 to boys from govt schools for purchasing books and educational materials in college.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 text-xs text-teal-300 font-semibold flex items-center justify-between">
                  <span>tamilpudhalvan.tn.gov.in</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>

              {/* 7.5% Horizontal Reservation */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-emerald-400/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-300 bg-emerald-400/20 px-2 py-0.5 rounded">
                      {isTamil ? 'அனைத்து மாணவர்கள்' : 'All Students'}
                    </span>
                    <span className="text-xs font-black text-amber-300">100% Free Tuition & Hostel</span>
                  </div>
                  <h4 className="font-bold text-base text-white">
                    {isTamil ? '7.5% முன்னுரிமை இடஒதுக்கீடு' : '7.5% Govt School Horizontal Quota'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {isTamil
                      ? 'மருத்துவம் (MBBS), பொறியியல் (Anna Univ), வேளாண்மை (TNAU), கால்நடை மற்றும் சட்டப் படிப்புகளில் 100% இலவசக் கல்வி!'
                      : 'Free education in MBBS, Engineering, Agri, Veterinary, and Law with full tuition and hostel fees paid by TN Govt.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 text-xs text-emerald-300 font-semibold flex items-center justify-between">
                  <span>tneaonline.org | tnmedicalselection.net</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Career Paths */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              {isTamil ? 'உயர்கல்வி & வேலைவாய்ப்பு வழிகாட்டி' : 'Educational & Career Roadmaps'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {isTamil ? 'முக்கிய தொழில் வாய்ப்புகளை ஆராயுங்கள்' : 'Explore Featured Career Paths'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isTamil
                ? 'ஒவ்வொரு கரியரிலும் கல்வித்தகுதி, நுழைவுத் தேர்வுகள், தமிழ்நாட்டின் சிறந்த கல்லூரிகள் மற்றும் சம்பள விவரங்கள் உள்ளன.'
                : 'Complete qualification steps, entrance exams, top Tamil Nadu colleges, and salary insights.'}
            </p>
          </div>
          <Link
            to="/careers"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>{isTamil ? 'அனைத்து 25+ கரியர்களையும் காண்க' : 'View all 25+ Careers'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Career Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCareers.map((c) => {
            const title = isTamil ? c.title_ta : c.title_en;
            const desc = isTamil ? c.description_ta : c.description_en;
            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {c.category}
                    </span>
                    {c.gov_7_5_applicable && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-600" />
                        <span>7.5% Quota</span>
                      </span>
                    )}
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
                      {isTamil ? 'படிப்பு:' : 'Education:'}
                    </span>
                    <span className="font-bold text-slate-700 truncate max-w-[170px]">
                      {c.education_level_required}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">
                      {isTamil ? 'ஊதியம்:' : 'Salary:'}
                    </span>
                    <span className="font-bold text-emerald-700 truncate max-w-[170px]">
                      {c.salary_range}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedCareer(c)}
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
      </section>

      {/* 5. Life Skills & Spoken English Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-10 text-white shadow-lg flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wider uppercase">
              {isTamil ? 'வாழ்வியல் & தொடர்புத் திறன்' : 'Life Skills & Communication'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black leading-snug">
              {isTamil
                ? 'அச்சமின்றி எளிய ஆங்கிலத்தில் பேசுங்கள்; நேர்காணலை வெல்லுங்கள்!'
                : 'Speak English with Confidence & Ace Your First Interview!'}
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
              {isTamil
                ? 'அன்றாட பேச்சு ஆங்கிலம், மேடைப் பயம் நீக்கும் வழிகள், டிஜிட்டல் வங்கி பாதுகாப்பு மற்றும் பள்ளி மாணவர்களுக்கான பயோடேட்டா தயாரிப்பு வழிகாட்டிகள்.'
                : 'Daily spoken English phrases, interview confidence guides, digital payment fraud safety, and our student resume builder.'}
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                to="/skills"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 transition-all"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>{isTamil ? 'வாழ்வியல் பாடங்களைக் கற்க' : 'Explore Life Skills Modules'}</span>
              </Link>
              <Link
                to="/resume"
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-slate-900 text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 transition-all"
              >
                <FileText className="w-4 h-4 text-amber-600" />
                <span>{isTamil ? 'இலவச பயோடேட்டா தயாரிக்க' : 'Create Free Student Resume'}</span>
              </Link>
            </div>
          </div>

          {/* Quick Life Skills Cards Preview */}
          <div className="grid grid-cols-2 gap-3 w-full lg:w-auto shrink-0">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
              <Zap className="w-6 h-6 text-amber-200 mx-auto mb-2" />
              <div className="text-xs font-bold">Spoken English</div>
              <div className="text-[10px] text-amber-100">Daily Phrases & Audio</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
              <Users className="w-6 h-6 text-amber-200 mx-auto mb-2" />
              <div className="text-xs font-bold">Interview Prep</div>
              <div className="text-[10px] text-amber-100">STAR Method</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
              <Coins className="w-6 h-6 text-amber-200 mx-auto mb-2" />
              <div className="text-xs font-bold">Budget & Banking</div>
              <div className="text-[10px] text-amber-100">UPI Fraud Safety</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
              <FileText className="w-6 h-6 text-amber-200 mx-auto mb-2" />
              <div className="text-xs font-bold">Resume Maker</div>
              <div className="text-[10px] text-amber-100">Printable PDF</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Success Stories / Inspiration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            {isTamil ? 'உத்வேகம் தரும் வெற்றிக் கதைகள்' : 'Inspirational Success Stories'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {isTamil ? 'அரசுப் பள்ளியில் படித்து சாதனை படைத்தவர்கள்' : 'Govt School Alumni Who Reached the Skies'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isTamil
              ? 'வறுமையையும் தடையையும் உடைத்து சாதனை படைத்த அரசுப் பள்ளி மாணவர்களின் வெற்றிப் பயணம்.'
              : 'Inspiring journeys of Tamil Nadu government school students who became officers, doctors, and scientists.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center">
                M
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Dr. M. Sangeetha</h4>
                <p className="text-[11px] text-slate-500">GHSS Dharmapuri → MMC Chennai (MBBS)</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "{isTamil
                ? '7.5% அரசுப் பள்ளி இடஒதுக்கீடு என் வாழ்க்கையையே மாற்றியது. கட்டணம் முழுவதையும் அரசு ஏற்றதால் எந்தக் கடனும் இன்றி இன்று மருத்துவராகியுள்ளேன்!'
                : 'The 7.5% government school reservation transformed my destiny. With 100% free tuition and hostel fees, I completed MBBS without any financial debt!'}"
            </p>
            <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
              {isTamil ? '7.5% இடஒதுக்கீடு மாணவர்' : '7.5% Quota Beneficiary'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-800 font-black text-lg flex items-center justify-center">
                R
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">R. Rajesh Kumar, B.Sc Agri</h4>
                <p className="text-[11px] text-slate-500">GHSS Sivagangai → TNAU Coimbatore</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "{isTamil
                ? 'எங்கள் குடும்பத்தில் முதல் தலைமுறை பட்டதாரி நான். தமிழ் வழியில் படித்துவிட்டு வேளாண்மை அலுவலர் தேர்வில் தேர்ச்சி பெற்று விவசாயிகளுக்கு சேவை செய்கிறேன்.'
                : 'I am the first graduate in my family. Studying in Tamil medium at a government school, I cracked TNAU counseling and now serve as an Agricultural Officer.'}"
            </p>
            <div className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2.5 py-1 rounded-md inline-block">
              {isTamil ? 'முதல் தலைமுறை பட்டதாரி' : 'First Graduate Scheme'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 font-black text-lg flex items-center justify-center">
                K
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">K. Priya, Software Engineer</h4>
                <p className="text-[11px] text-slate-500">GHSS Perambalur → CEG Anna University</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "{isTamil
                ? 'புதுமைப் பெண் திட்டத்தின் மாதம் ₹1000 உதவித்தொகை எனது புத்தகங்கள் மற்றும் விடுதி செலவுகளுக்கு பேருதவியாக இருந்தது. இன்று சென்னை ஐடி நிறுவனத்தில் பணிபுரிகிறேன்!'
                : 'Pudhumai Penn scheme’s ₹1,000 monthly allowance supported my college books and basic needs. Today I am a software engineer in Chennai!'}"
            </p>
            <div className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-md inline-block">
              {isTamil ? 'புதுமைப் பெண் பயனாளி' : 'Pudhumai Penn Beneficiary'}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Free Counseling Call-to-Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-800 text-white p-8 sm:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black">
              {isTamil ? 'ஏதேனும் சந்தேகம் உள்ளதா? அரசு ஆலோசகரிடம் கேளுங்கள்!' : 'Have Career Doubts? Talk to Our Counselors!'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200 max-w-xl">
              {isTamil
                ? 'எங்கள் இணையதளம் மூலம் உங்கள் கேள்விகளை பதிவு செய்யுங்கள் அல்லது 14417 கட்டணமில்லா உதவி எண்ணிற்கு தொடர்பு கொண்டு உடனடி ஆலோசனை பெறுங்கள்.'
                : 'Submit your career, scholarship, or higher study queries or call the official 14417 student helpline 24x7.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              to="/counseling"
              className="px-6 py-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-sm shadow-md transition-colors"
            >
              {isTamil ? 'கேள்வி கேட்க / ஆலோசனை பெற' : 'Submit Counseling Query'}
            </Link>
            <a
              href="tel:14417"
              className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm border border-emerald-500 flex items-center gap-2 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-amber-300" />
              <span>14417 Helpdesk</span>
            </a>
          </div>
        </div>
      </section>

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
