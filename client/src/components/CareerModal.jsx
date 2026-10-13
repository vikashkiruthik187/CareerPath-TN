import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Award,
  BookOpen,
  Building,
  CheckCircle,
  ExternalLink,
  Briefcase,
  Bookmark,
  Share2
} from 'lucide-react';

export default function CareerModal({ career, onClose, onBookmarkToggle }) {
  const { lang, t } = useLanguage();
  const { isAuthenticated } = useAuth();

  if (!career) return null;

  const isTamil = lang === 'ta';
  const title = isTamil ? career.title_ta : career.title_en;
  const description = isTamil ? career.description_ta : career.description_en;
  const pathwaySteps = isTamil ? career.pathway_steps_ta : career.pathway_steps_en;
  const requiredSkills = isTamil ? career.required_skills_ta : career.required_skills_en;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${career.title_en} - CareerPath TN`,
        text: `Check out career roadmap for ${career.title_en} on CareerPath TN!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(isTamil ? 'இணைப்பு நகலெடுக்கப்பட்டது!' : 'Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {career.category}
                </span>
                {career.gov_7_5_applicable && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-600" />
                    <span>7.5% அரசு பள்ளி இடஒதுக்கீடு</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">{title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onBookmarkToggle && (
              <button
                onClick={() => onBookmarkToggle(career.id)}
                className={`p-2 rounded-lg border transition-colors ${
                  career.is_saved
                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                    : 'text-slate-400 border-slate-200 hover:text-slate-600 hover:bg-slate-50'
                }`}
                title={career.is_saved ? 'Remove Bookmark' : 'Save to Bookmarks'}
              >
                <Bookmark className={`w-5 h-5 ${career.is_saved ? 'fill-amber-500' : ''}`} />
              </button>
            )}
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 font-medium block">
                {isTamil ? 'தேவையான அடிப்படை படிப்பு:' : 'Required Education:'}
              </span>
              <span className="text-sm font-bold text-slate-800">{career.education_level_required}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">
                {isTamil ? 'எதிர்பார்க்கப்படும் மாத ஊதியம்:' : 'Expected Salary Range:'}
              </span>
              <span className="text-sm font-bold text-emerald-700">{career.salary_range}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              {isTamil ? 'தொழில் கண்ணோட்டம்' : 'Career Overview'}
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
              {description}
            </p>
          </div>

          {/* 7.5% Govt School Horizontal Quota Alert */}
          {career.gov_7_5_applicable && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
              <Award className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <h5 className="font-bold text-amber-900 text-sm mb-1">
                  {isTamil
                    ? '7.5% அரசுப் பள்ளி மாணவ, மாணவிகளுக்கான இலவச உயர்கல்வி வாய்ப்பு!'
                    : 'Eligible for 7.5% TN Govt School Horizontal Reservation!'}
                </h5>
                <p className="text-amber-800 leading-relaxed">
                  {isTamil
                    ? '6ஆம் வகுப்பு முதல் 12ஆம் வகுப்பு வரை அரசுப் பள்ளியில் படித்த மாணவர்கள் இந்த படிப்பிற்கு ஒற்றைச் சாளர கலந்தாய்வில் பங்கேற்கும்போது அவர்களுக்கான கல்விக் கட்டணம், தேர்வுக் கட்டணம் மற்றும் விடுதிக் கட்டணம் முழுவதையும் தமிழ்நாடு அரசே முழுமையாக ஏற்கும்.'
                    : 'Students who completed schooling from Class 6 to 12 in TN Govt schools receive 100% tuition, exam fee, and hostel fee waiver funded entirely by the Government of Tamil Nadu.'}
                </p>
              </div>
            </div>
          )}

          {/* Step-by-Step Educational Pathway */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>{isTamil ? 'படி படியான கல்வி & வேலைவாய்ப்புப் பாதை' : 'Step-by-Step Educational Pathway'}</span>
            </h4>
            <div className="relative pl-6 space-y-4 border-l-2 border-emerald-300 ml-2">
              {pathwaySteps?.map((step, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center ring-4 ring-white shadow-xs">
                    {idx + 1}
                  </div>
                  <div className="bg-slate-50 hover:bg-emerald-50/50 p-3 rounded-xl border border-slate-200 transition-colors">
                    <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              {isTamil ? 'வளர்த்துக் கொள்ள வேண்டிய முக்கிய தனித்திறன்கள்' : 'Key Skills to Develop'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {requiredSkills?.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Entrance Exams */}
          {career.entrance_exams && career.entrance_exams.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <span>{isTamil ? 'முக்கிய நுழைவுத் தேர்வுகள்' : 'Relevant Entrance Examinations'}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {career.entrance_exams.map((exam, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900">{exam.name}</h5>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{exam.description}</p>
                    </div>
                    {exam.link && (
                      <a
                        href={exam.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 inline-flex"
                      >
                        <span>{isTamil ? 'அதிகாரப்பூர்வ தளம்' : 'Official Portal'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Tamil Nadu Government Institutions */}
          {career.top_colleges_tn && career.top_colleges_tn.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600" />
                <span>{isTamil ? 'தமிழ்நாட்டின் முதன்மை அரசு & உதவிபெறும் கல்வி நிறுவனங்கள்' : 'Top Tamil Nadu Colleges & Universities'}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {career.top_colleges_tn.map((col, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-emerald-50/40 border border-emerald-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{col.name}</span>
                      <span className="text-slate-500 text-[11px]">{col.location}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-medium">
                      {col.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {isTamil ? '14417 உதவி எண்ணை அழைத்து கூடுதல் விளக்கம் பெறலாம்' : 'Call 14417 for one-on-one counselor guidance'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
