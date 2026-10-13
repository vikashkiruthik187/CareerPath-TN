import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { GraduationCap, Phone, ShieldCheck, ExternalLink, Award } from 'lucide-react';

export default function Footer() {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      {/* Helpline Alert Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 py-4 px-4 border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
              <Phone className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm sm:text-base">
                {lang === 'ta' ? 'தமிழ்நாடு அரசு கட்டணமில்லா மாணவர் வழிகாட்டி உதவி மையம்' : 'Govt of Tamil Nadu Free Student Support Helpline'}
              </h4>
              <p className="text-emerald-200 text-xs">
                {lang === 'ta' ? 'கரியர் ஆலோசனை, தேர்வு பதட்டம், கல்வி உதவித்தொகை வழிகாட்டலுக்கு உடனே அழையுங்கள்' : 'Call for 24x7 Career Guidance, Exam Counseling, and Scheme Help'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:14417"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-lg text-sm flex items-center gap-2 shadow-lg transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>14417 (கல்வி உதவி)</span>
            </a>
            <a
              href="tel:1098"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs border border-slate-700"
            >
              1098 (Childline)
            </a>
            <a
              href="tel:1930"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs border border-slate-700"
            >
              1930 (Cyber Fraud)
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md overflow-hidden">
                <img src="/tn-emblem.png" alt="Tamil Nadu Government Emblem" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">
                  CareerPath TN
                </span>
                <span className="block text-xs text-emerald-400 font-medium">
                  {lang === 'ta' ? 'தமிழ்நாடு மாணவர் வழிகாட்டி' : 'TN Student Platform'}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'ta'
                ? 'தமிழ்நாடு அரசுப் பள்ளி மாணவர்களின் உயர்கல்வி வாய்ப்புகள், 7.5% முன்னுரிமை இடஒதுக்கீடு, புதுமைப் பெண் மற்றும் தமிழ்ப் புதல்வன் திட்டங்கள், வேலைவாய்ப்பு மற்றும் வாழ்வியல் திறன்களை மேம்படுத்த உருவாக்கப்பட்ட முழுமையான வழிகாட்டி தளம்.'
                : 'A dedicated full-stack platform empowering Tamil Nadu government school students with holistic career guidance, 7.5% reservation pathways, financial literacy, and essential life skills.'}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-amber-300">
              <Award className="w-3.5 h-3.5" />
              <span>38 Districts • 100% Free Access</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              {lang === 'ta' ? 'முக்கிய தொகுதிகள்' : 'Core Modules'}
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/assessment" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>→</span> {t('nav.assessment')}
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>→</span> {t('nav.careers')}
                </Link>
              </li>
              <li>
                <Link to="/finance" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>→</span> {t('nav.finance')}
                </Link>
              </li>
              <li>
                <Link to="/skills" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>→</span> {t('nav.skills')}
                </Link>
              </li>
              <li>
                <Link to="/resume" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>→</span> {t('nav.resume')}
                </Link>
              </li>
              <li>
                <Link to="/counseling" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>→</span> {t('nav.counseling')}
                </Link>
              </li>
            </ul>
          </div>

          {/* TN Govt Portals */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              {lang === 'ta' ? 'அரசு அதிகாரப்பூர்வ தளங்கள்' : 'TN Official Portals'}
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="https://naanmudhalvan.tn.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-300"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                  <span>நான் முதல்வன் (Naan Mudhalvan)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.pudhumaipenn.tn.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-300"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                  <span>புதுமைப் பெண் இணையதளம்</span>
                </a>
              </li>
              <li>
                <a
                  href="https://tneaonline.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-300"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                  <span>TNEA பொறியியல் கலந்தாய்வு</span>
                </a>
              </li>
              <li>
                <a
                  href="https://tnmedicalselection.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-300"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                  <span>மருத்துவக் கலந்தாய்வு (7.5% Quota)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://tnpsc.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-300"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                  <span>TNPSC அரசு பணியாளர் தேர்வாணையம்</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Student Support Box */}
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-3">
            <h5 className="text-white font-bold text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ta' ? 'அரசுப் பள்ளி மாணவர் பாதுகாப்பு' : 'Student Privacy & Safety'}</span>
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'ta'
                ? 'மாணவர்களின் அனைத்து தகவல்களும் பாதுகாப்பாக வைக்கப்படுகின்றன. அரசுப் பள்ளி மாணவர்களுக்கு அனைத்து சேவைகளும் முற்றிலும் இலவசம்.'
                : 'Student information is securely protected. All career guidance content, assessment tools, and learning materials are 100% free.'}
            </p>
            <div className="pt-2 border-t border-slate-700 text-[11px] text-slate-400">
              <span>தமிழ்நாடு பள்ளிக் கல்வித் துறை முன்முயற்சி</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex items-center justify-center text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CareerPath TN — Tamil Nadu Student Career Guidance & Life Skills Platform.</p>
        </div>
      </div>
    </footer>
  );
}
