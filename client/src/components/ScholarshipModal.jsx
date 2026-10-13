import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  Coins,
  CheckCircle2,
  ExternalLink,
  Calendar,
  Bookmark,
  Share2,
  FileCheck
} from 'lucide-react';

export default function ScholarshipModal({ scholarship, onClose, onBookmarkToggle }) {
  const { lang, t } = useLanguage();

  if (!scholarship) return null;

  const isTamil = lang === 'ta';
  const title = isTamil ? scholarship.title_ta : scholarship.title_en;
  const description = isTamil ? scholarship.description_ta : scholarship.description_en;
  const amount = isTamil ? scholarship.amount_ta : scholarship.amount_en;
  const documents = isTamil ? scholarship.documents_required_ta : scholarship.documents_required_en;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${scholarship.title_en} - CareerPath TN`,
        text: `Scholarship info for ${scholarship.title_en}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(isTamil ? 'இணைப்பு நகலெடுக்கப்பட்டது!' : 'Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                {scholarship.provider}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">{title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onBookmarkToggle && (
              <button
                onClick={() => onBookmarkToggle(scholarship.id)}
                className={`p-2 rounded-lg border transition-colors ${
                  scholarship.is_saved
                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                    : 'text-slate-400 border-slate-200 hover:text-slate-600 hover:bg-slate-50'
                }`}
                title={scholarship.is_saved ? 'Remove Bookmark' : 'Save to Bookmarks'}
              >
                <Bookmark className={`w-5 h-5 ${scholarship.is_saved ? 'fill-amber-500' : ''}`} />
              </button>
            )}
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
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

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Amount Card */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-md">
            <span className="text-xs text-emerald-100 uppercase tracking-wider font-semibold block mb-1">
              {isTamil ? 'உதவித்தொகை / சலுகை மதிப்பு:' : 'Financial Assistance Value:'}
            </span>
            <div className="text-xl sm:text-2xl font-black">{amount}</div>
          </div>

          {/* Eligibility Tags */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">{isTamil ? 'பள்ளி வகை' : 'School Type'}</span>
              <span className="font-bold text-slate-800">{scholarship.eligibility_school_type}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">{isTamil ? 'பாலினம்' : 'Gender'}</span>
              <span className="font-bold text-slate-800">
                {scholarship.eligibility_gender === 'female' ? (isTamil ? 'மாணவிகள் மட்டும்' : 'Girls Only') : scholarship.eligibility_gender === 'male' ? (isTamil ? 'மாணவர்கள் மட்டும்' : 'Boys Only') : (isTamil ? 'அனைவருக்கும்' : 'All Students')}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">{isTamil ? 'படிப்பு நிலை' : 'Target Class'}</span>
              <span className="font-bold text-slate-800">{scholarship.eligibility_class}</span>
            </div>
          </div>

          {/* Scheme Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              {isTamil ? 'திட்டத்தின் நோக்கம் & விவரம்' : 'Scheme Objectives & Details'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {description}
            </p>
          </div>

          {/* Mandatory Documents Checklist */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>{isTamil ? 'விண்ணப்பிக்க தேவையான ஆவணங்கள்' : 'Required Documents Checklist'}</span>
            </h4>
            <div className="space-y-2">
              {documents?.map((doc, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-800">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Application Deadline & Action */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-900">
              <Calendar className="w-4 h-4 text-amber-700" />
              <div>
                <span className="font-semibold block">{isTamil ? 'விண்ணப்ப கால வரம்பு:' : 'Application Timeline:'}</span>
                <span>{scholarship.deadline}</span>
              </div>
            </div>
            {scholarship.application_portal && (
              <a
                href={scholarship.application_portal.startsWith('http') ? scholarship.application_portal : `https://${scholarship.application_portal}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
              >
                <span>{isTamil ? 'இணையதளத்தில் விண்ணப்பிக்க' : 'Apply on Portal'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
