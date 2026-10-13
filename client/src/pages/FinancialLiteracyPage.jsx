import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import ScholarshipModal from '../components/ScholarshipModal';
import { TN_DISTRICTS, SCHOOL_TYPES, EDUCATION_LEVELS } from '../constants/tnData';
import {
  Coins,
  ShieldCheck,
  Calculator,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Bookmark,
  ExternalLink,
  Search,
  Sparkles,
  PieChart,
  HelpCircle,
  CreditCard,
  PhoneCall
} from 'lucide-react';

export default function FinancialLiteracyPage() {
  const { lang, t } = useLanguage();
  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState('schemes'); // 'schemes' | 'checker' | 'calculators' | 'safety'
  const [scholarships, setScholarships] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [loading, setLoading] = useState(true);

  // Eligibility Checker State
  const [checkerForm, setCheckerForm] = useState({
    gender: 'female',
    school_type: 'Government Higher Secondary School (GHSS)',
    education_level: 'Class 12 (HSC 2nd Year)',
    community: 'MBC',
    first_graduate: true,
    family_income: 150000
  });
  const [checkerResults, setCheckerResults] = useState(null);
  const [checking, setChecking] = useState(false);

  // Budget Calculator State (e.g. ₹1000 from Pudhumai Penn or Tamil Pudhalvan)
  const [monthlyStipend, setMonthlyStipend] = useState(1000);

  // Education Loan Estimator State
  const [loanAmount, setLoanAmount] = useState(300000);
  const [loanTenureYears, setLoanTenureYears] = useState(5);
  const [loanInterestRate, setLoanInterestRate] = useState(8.5);

  const isTamil = lang === 'ta';

  useEffect(() => {
    fetch('/api/scholarships')
      .then(res => res.json())
      .then(data => setScholarships(data.scholarships || []))
      .catch(err => console.error('Fetch scholarships error:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleCheckEligibility = async (e) => {
    e.preventDefault();
    setChecking(true);
    try {
      const res = await fetch('/api/scholarships/check-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkerForm)
      });
      const data = await res.json();
      setCheckerResults(data);
    } catch (err) {
      alert('Error evaluating eligibility: ' + err.message);
    } finally {
      setChecking(false);
    }
  };

  const handleBookmarkToggle = async (scholarshipId) => {
    if (!isAuthenticated) {
      alert(isTamil ? 'உதவித்தொகையை சேமிக்க உள்நுழையவும்!' : 'Please login to bookmark this scholarship!');
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
        body: JSON.stringify({ item_type: 'scholarship', item_id: scholarshipId })
      });
      const data = await res.json();
      if (res.ok) {
        setScholarships(prev =>
          prev.map(s => (s.id === scholarshipId ? { ...s, is_saved: data.bookmarked } : s))
        );
        if (selectedScholarship && selectedScholarship.id === scholarshipId) {
          setSelectedScholarship(prev => ({ ...prev, is_saved: data.bookmarked }));
        }
      }
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  // Budget calculations
  const needsAmount = Math.round(monthlyStipend * 0.5);
  const wantsAmount = Math.round(monthlyStipend * 0.3);
  const savingsAmount = Math.round(monthlyStipend * 0.2);

  // Loan EMI calculation: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = loanInterestRate / (12 * 100);
  const totalMonths = loanTenureYears * 12;
  const calculatedEmi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
  const totalLoanRepayment = calculatedEmi * totalMonths;
  const totalInterest = totalLoanRepayment - loanAmount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
          <Coins className="w-3.5 h-3.5 text-amber-700" />
          <span>{isTamil ? 'நிதி மேலாண்மை & கல்வி உதவித்தொகை தளம்' : 'Financial Literacy & Government Scholarships'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {isTamil ? 'கல்வி உதவித்தொகை & பண மேலாண்மை வழிகாட்டி' : 'Scholarships, Subsidies & Financial Skills'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {isTamil
            ? 'புதுமைப் பெண், தமிழ்ப் புதல்வன், 7.5% இடஒதுக்கீடு, கல்வி உதவித்தொகை தகுதி சரிபார்ப்பு மற்றும் பள்ளி மாணவர்களுக்கான எளிய பட்ஜெட் கால்குலேட்டர்.'
            : 'Explore state welfare schemes, verify your eligibility with our intelligent checker, and learn practical budgeting and digital banking safety.'}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center">
        <div className="bg-slate-200/80 p-1.5 rounded-2xl flex flex-wrap gap-1 border border-slate-300 max-w-full justify-center">
          <button
            onClick={() => setActiveTab('schemes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'schemes'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-600" />
            <span>{isTamil ? 'அரசு உதவித்தொகை திட்டங்கள்' : 'TN Govt Scholarships'}</span>
          </button>

          <button
            onClick={() => setActiveTab('checker')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'checker'
                ? 'bg-white text-amber-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{isTamil ? 'உதவித்தொகை தகுதி சோதிப்பான்' : 'Eligibility Finder'}</span>
          </button>

          <button
            onClick={() => setActiveTab('calculators')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'calculators'
                ? 'bg-white text-teal-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4 text-teal-600" />
            <span>{isTamil ? 'பட்ஜெட் & கல்விக் கடன் கணக்கீடு' : 'Budget & Loan Calculators'}</span>
          </button>

          <button
            onClick={() => setActiveTab('safety')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'safety'
                ? 'bg-white text-rose-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            <span>{isTamil ? 'வங்கி & இணைய மோசடி விழிப்புணர்வு' : 'Safe Banking & Cyber Safety'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SCHOLARSHIPS DIRECTORY */}
      {activeTab === 'schemes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scholarships.map((s) => {
              const title = isTamil ? s.title_ta : s.title_en;
              const desc = isTamil ? s.description_ta : s.description_en;
              const amount = isTamil ? s.amount_ta : s.amount_en;
              return (
                <div
                  key={s.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {s.provider}
                      </span>
                      <button
                        onClick={() => handleBookmarkToggle(s.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          s.is_saved
                            ? 'bg-amber-50 text-amber-600 border-amber-200'
                            : 'text-slate-300 border-transparent hover:text-slate-600 hover:bg-slate-50'
                        }`}
                        title={s.is_saved ? 'Bookmarked' : 'Bookmark Scholarship'}
                      >
                        <Bookmark className={`w-4 h-4 ${s.is_saved ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>

                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">
                      {title}
                    </h3>

                    {/* Amount Highlight */}
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-xs font-bold text-emerald-900">
                      {amount}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
                      {s.eligibility_school_type}
                    </span>
                    <button
                      onClick={() => setSelectedScholarship(s)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      <span>{t('common.viewDetails')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ELIGIBILITY FINDER */}
      {activeTab === 'checker' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {isTamil ? 'உங்களுக்கான உதவித்தொகை தகுதி சோதிப்பான்' : 'Scholarship Eligibility Assessment Form'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {isTamil
                ? 'உங்கள் பாலினம், பள்ளி வகை மற்றும் வகுப்பை தேர்ந்தெடுங்கள்; உங்களுக்குப் பொருந்தும் அனைத்து அரசு திட்டங்களையும் ஒரு நொடியில் கண்டறியுங்கள்!'
                : 'Enter your basic student background to uncover all state and central educational financial support schemes.'}
            </p>
          </div>

          <form onSubmit={handleCheckEligibility} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isTamil ? 'பாலினம் (Gender):' : 'Gender:'}
              </label>
              <select
                value={checkerForm.gender}
                onChange={(e) => setCheckerForm({ ...checkerForm, gender: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-hidden focus:border-emerald-500"
              >
                <option value="female">{isTamil ? 'மாணவி (Female)' : 'Female'}</option>
                <option value="male">{isTamil ? 'மாணவன் (Male)' : 'Male'}</option>
                <option value="all">{isTamil ? 'மற்றவை (Other)' : 'Other'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isTamil ? 'பள்ளி வகை (School Type):' : 'School Type:'}
              </label>
              <select
                value={checkerForm.school_type}
                onChange={(e) => setCheckerForm({ ...checkerForm, school_type: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-hidden focus:border-emerald-500"
              >
                {SCHOOL_TYPES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isTamil ? 'படிப்பு நிலை (Education Level):' : 'Education Level:'}
              </label>
              <select
                value={checkerForm.education_level}
                onChange={(e) => setCheckerForm({ ...checkerForm, education_level: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-hidden focus:border-emerald-500"
              >
                {EDUCATION_LEVELS.map(el => (
                  <option key={el} value={el}>{el}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isTamil ? 'சமூகப் பிரிவு (Community):' : 'Community:'}
              </label>
              <select
                value={checkerForm.community}
                onChange={(e) => setCheckerForm({ ...checkerForm, community: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-hidden focus:border-emerald-500"
              >
                <option value="BC">BC (Backward Classes)</option>
                <option value="MBC">MBC / DNC (Most Backward Classes)</option>
                <option value="SC">SC / SCA (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="OC">OC / General</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <input
                type="checkbox"
                id="first_grad"
                checked={checkerForm.first_graduate}
                onChange={(e) => setCheckerForm({ ...checkerForm, first_graduate: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label htmlFor="first_grad" className="text-xs text-slate-700 font-semibold cursor-pointer">
                {isTamil
                  ? 'குடும்பத்தில் முதல் தலைமுறை பட்டதாரி (பெற்றோர் மற்றும் உடன் பிறந்தவர்கள் பட்டம் பெற்றிருக்கவில்லை)'
                  : 'First Graduate in Family (Neither parents nor elder siblings hold a degree)'}
              </label>
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                disabled={checking}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{checking ? (isTamil ? 'சரிபார்க்கப்படுகிறது...' : 'Checking...') : (isTamil ? 'எனக்குரிய திட்டங்களைக் கண்டறி' : 'Find My Eligible Schemes')}</span>
              </button>
            </div>
          </form>

          {/* Checker Output Results */}
          {checkerResults && (
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-base text-slate-900">
                  {isTamil ? 'உங்களுக்குப் பொருந்தும் திட்டங்கள்:' : 'Your Eligible Schemes:'}
                </h4>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {checkerResults.eligibleCount} {isTamil ? 'திட்டங்கள் தகுதியுடையவை' : 'Schemes Found'}
                </span>
              </div>

              <div className="space-y-3">
                {checkerResults.scholarships?.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-100">
                        {s.provider}
                      </span>
                      <h5 className="font-bold text-sm text-slate-900 mt-1">
                        {isTamil ? s.title_ta : s.title_en}
                      </h5>
                      <p className="text-xs font-extrabold text-emerald-800 mt-0.5">
                        {isTamil ? s.amount_ta : s.amount_en}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedScholarship(s)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                    >
                      {t('common.viewDetails')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CALCULATORS */}
      {activeTab === 'calculators' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 50/30/20 Student Budget Planner */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded">
                Interactive Tool
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-2">
                {isTamil ? 'மாணவர் மாதாந்திர 50/30/20 பட்ஜெட் திட்டம்' : 'Student 50/30/20 Monthly Budget Planner'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isTamil
                  ? 'புதுமைப் பெண் அல்லது தமிழ்ப் புதல்வன் திட்டம் மூலம் கிடைக்கும் ₹1000 அல்லது பாக்கெட் மணியை எவ்வாறு சரியாக பிரித்து செலவு செய்வது?'
                  : 'Learn smart money allocation using your Pudhumai Penn / Tamil Pudhalvan stipend.'}
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                {isTamil ? 'மாதாந்திர உதவித்தொகை / பாக்கெட் மணி (₹):' : 'Monthly Stipend / Allowance (₹):'}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={monthlyStipend}
                  onChange={(e) => setMonthlyStipend(Number(e.target.value))}
                  className="flex-1 accent-emerald-600"
                />
                <span className="font-black text-base text-emerald-700 px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-200">
                  ₹{monthlyStipend}
                </span>
              </div>
            </div>

            {/* Visual Budget Breakdown Bars */}
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex justify-between items-center text-xs font-bold text-emerald-950">
                  <span>50% {isTamil ? 'கல்வி & அத்தியாவசிய தேவைகள் (Needs)' : 'Educational Needs'}</span>
                  <span className="text-sm font-black text-emerald-700">₹{needsAmount}</span>
                </div>
                <p className="text-[11px] text-emerald-800 mt-1">
                  {isTamil ? 'புத்தகங்கள், நோட்டு, பேனா, பேருந்து பாஸ், தேர்வு கட்டணம்' : 'Books, stationery, bus fare, essential food'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="flex justify-between items-center text-xs font-bold text-amber-950">
                  <span>30% {isTamil ? 'தனிப்பட்ட விருப்பங்கள் (Wants)' : 'Personal Wants'}</span>
                  <span className="text-sm font-black text-amber-700">₹{wantsAmount}</span>
                </div>
                <p className="text-[11px] text-amber-800 mt-1">
                  {isTamil ? 'நண்பர்களுடன் டீ, சிறு தின்பண்டங்கள், பொழுதுபோக்கு' : 'Small treats, occasional outing with friends'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                <div className="flex justify-between items-center text-xs font-bold text-teal-950">
                  <span>20% {isTamil ? 'வங்கி சேமிப்பு & அவசர நிதி (Savings)' : 'Bank Savings & Emergency'}</span>
                  <span className="text-sm font-black text-teal-700">₹{savingsAmount}</span>
                </div>
                <p className="text-[11px] text-teal-800 mt-1">
                  {isTamil ? 'வங்கிக் கணக்கில் சேமித்து வைப்பது; ஆண்டிற்கு ₹' + savingsAmount * 12 + ' சேரும்!' : 'Saved in bank account; yields ₹' + savingsAmount * 12 + ' per year!'}
                </p>
              </div>
            </div>
          </div>

          {/* Education Loan EMI Estimator */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded">
                Vidya Lakshmi Portal Guide
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-2">
                {isTamil ? 'கல்விக் கடன் & வட்டி மானிய கணக்கீடு' : 'Education Loan & Interest Subsidy (CSIS)'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isTamil
                  ? 'குடும்ப வருமானம் ₹4.5 லட்சத்திற்குள் இருந்தால் படிப்பு காலத்தில் வட்டி முழுவதும் மத்திய அரசால் ஏற்கப்படுகிறது (CSIS மானியம்).'
                  : 'Under CSIS, students from families earning under ₹4.5L get 100% interest subsidy during study period.'}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>{isTamil ? 'கடன் தொகை (Loan Amount):' : 'Loan Amount:'}</span>
                  <span className="text-indigo-700 font-extrabold">₹{loanAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1000000"
                  step="25000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>{isTamil ? 'திருப்பிச் செலுத்தும் காலம் (Tenure):' : 'Repayment Period:'}</span>
                  <span className="text-indigo-700 font-extrabold">{loanTenureYears} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={loanTenureYears}
                  onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            {/* Calculated Box */}
            <div className="p-5 rounded-2xl bg-indigo-900 text-white space-y-3">
              <div className="flex justify-between items-center border-b border-indigo-800 pb-2">
                <span className="text-xs text-indigo-200">{isTamil ? 'மாதத் தவணை (Monthly EMI):' : 'Estimated Monthly EMI:'}</span>
                <span className="text-xl font-black text-amber-300">₹{calculatedEmi.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-indigo-200">
                <span>{isTamil ? 'மொத்த வட்டி (Total Interest):' : 'Total Interest Amount:'}</span>
                <span className="font-bold text-white">₹{totalInterest.toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-indigo-300 bg-indigo-950/60 p-2.5 rounded-lg border border-indigo-800">
                {isTamil
                  ? '💡 உதவிக்குறிப்பு: வித்யா லக்ஷ்மி போர்டல் (vidyalakshmi.co.in) மூலம் ₹7.5 லட்சம் வரை எவ்வித அடமானமும் இன்றி விண்ணப்பிக்கலாம்.'
                  : '💡 Tip: Education loans up to ₹7.5 Lakhs require zero collateral security via Vidya Lakshmi Portal.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SAFE BANKING & SCAM PRESERVATION */}
      {activeTab === 'safety' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded">
              Cyber Security
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {isTamil ? 'பாதுகாப்பான டிஜிட்டல் வங்கி & இணைய மோசடி பாதுகாப்பு' : 'Student Digital Banking & Scam Protection'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {isTamil
                ? 'ஏடிஎம், கூகுள் பே, ஃபோன்பே மற்றும் போலி உதவித்தொகை அழைப்புகளிலிருந்து உங்களைப் பாதுகாத்துக் கொள்ள வேண்டிய முக்கிய விதிகள்.'
                : 'Essential cyber safety principles for student bank accounts, UPI apps, and fraud awareness.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{isTamil ? '1. OTP யாரிடமும் பகிராதீர்கள்' : '1. Never Share Your OTP'}</span>
              </div>
              <p className="text-xs text-rose-900 leading-relaxed">
                {isTamil
                  ? 'வங்கி மேலாளரோ அல்லது கல்வித்துறை அதிகாரியோ உங்கள் 6 இலக்க OTP எண்ணை ஒருபோதும் கேட்க மாட்டார்கள். யாரிடமும் கூறாதீர்கள்!'
                  : 'No bank manager, headmaster, or government official will ever ask for your 6-digit OTP. Keep it confidential.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <CreditCard className="w-5 h-5 text-amber-600 shrink-0" />
                <span>{isTamil ? '2. UPI PIN பணம் அனுப்ப மட்டுமே!' : '2. UPI PIN is Only for Sending Money'}</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                {isTamil
                  ? 'நீங்கள் உதவித்தொகை அல்லது பணம் பெறுவதற்கு (Receive) உங்கள் ரகசிய PIN எண்ணை உள்ளிடத் தேவையில்லை!'
                  : 'You NEVER need to enter your PIN to receive money or scholarship transfers. Entering PIN deducts money from your account!'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 space-y-2">
              <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                <span>{isTamil ? '3. ஜீரோ பேலன்ஸ் மாணவர் கணக்கு' : '3. Zero-Balance Student Bank Account'}</span>
              </div>
              <p className="text-xs text-teal-900 leading-relaxed">
                {isTamil
                  ? 'அருகிலுள்ள பொதுத்துறை வங்கியில் ஆதார் அட்டை மூலம் ஜீரோ பேலன்ஸ் கணக்கு தொடங்கி ஆதார் இணைப்பு (NPCI Seeding) செய்து கொள்ளவும்.'
                  : 'Open a Zero Balance Jan Dhan / Basic Savings Bank account linked to Aadhaar (NPCI seeded) for government DBT transfers.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <PhoneCall className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>{isTamil ? '4. உடனடி உதவிக்கு 1930 எண்ணை அழையுங்கள்' : '4. In Emergency Dial 1930 Cyber Helpline'}</span>
              </div>
              <p className="text-xs text-indigo-900 leading-relaxed">
                {isTamil
                  ? 'ஏதேனும் இணையப் பண மோசடி நடந்தால் முதல் 2 மணி நேரத்திற்குள் 1930 அவசர எண்ணிற்கு அழைத்து பண இழப்பைத் தடுக்கலாம்.'
                  : 'Report unauthorized bank debits immediately within the "Golden Hour" by calling toll-free 1930 or visiting cybercrime.gov.in.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scholarship Modal */}
      {selectedScholarship && (
        <ScholarshipModal
          scholarship={selectedScholarship}
          onClose={() => setSelectedScholarship(null)}
          onBookmarkToggle={handleBookmarkToggle}
        />
      )}
    </div>
  );
}
