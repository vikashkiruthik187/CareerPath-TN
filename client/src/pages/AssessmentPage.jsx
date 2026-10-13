import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import CareerModal from '../components/CareerModal';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Award,
  BookOpen,
  Briefcase,
  RotateCcw,
  UserCheck,
  Compass,
  Lightbulb,
  GraduationCap
} from 'lucide-react';

export default function AssessmentPage() {
  const { lang, t } = useLanguage();
  const { isAuthenticated, user, quickLoginStudent } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qId]: optionIndex }
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalCareer, setModalCareer] = useState(null);

  const isTamil = lang === 'ta';

  useEffect(() => {
    fetch('/api/assessment/questions')
      .then(res => res.json())
      .then(data => {
        setQuestions(data.questions || []);
      })
      .catch(err => console.error('Failed to load assessment questions:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectOption = (questionId, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const answersArray = Object.entries(selectedAnswers).map(([qId, optIdx]) => ({
      questionId: qId,
      optionIndex: optIdx
    }));

    try {
      const token = localStorage.getItem('careerpath_token');
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ answers: answersArray })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setResult(data);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    } catch (err) {
      alert('Error calculating assessment: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setResult(null);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 font-medium">{t('common.loading')}</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round((answeredCount / totalQ) * 100);
  const currentSelection = currentQ ? selectedAnswers[currentQ.id] : undefined;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>{isTamil ? 'அறிவியல் பூர்வ கரியர் மதிப்பீடு' : 'Standardized Career Aptitude Tool'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('assessment.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          {t('assessment.subtitle')}
        </p>
      </div>

      {/* Assessment Body or Result View */}
      {!result ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>
                {t('assessment.progress')} {currentIndex + 1} {t('assessment.of')} {totalQ}
              </span>
              <span className="text-emerald-700">{progressPercent}% {isTamil ? 'நிறைவு' : 'Completed'}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalQ) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          {currentQ && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {currentQ.category}
                </span>
                <h3 className="text-base sm:text-xl font-extrabold text-slate-900 leading-snug">
                  {isTamil ? currentQ.question_ta : currentQ.question_en}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = currentSelection === optIdx;
                  const optText = isTamil ? opt.text_ta : opt.text_en;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start gap-3 group ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                          : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-slate-300 group-hover:border-emerald-400'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-4 h-4 fill-white text-emerald-600" />}
                      </div>
                      <span className={`text-xs sm:text-sm font-semibold leading-relaxed ${isSelected ? 'text-emerald-950 font-bold' : 'text-slate-800'}`}>
                        {optText}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                currentIndex === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isTamil ? 'முந்தைய வினா' : 'Previous'}</span>
            </button>

            {currentIndex < totalQ - 1 ? (
              <button
                onClick={handleNext}
                disabled={currentSelection === undefined}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                  currentSelection === undefined
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <span>{isTamil ? 'அடுத்த வினா' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={answeredCount < totalQ || submitting}
                className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all shadow-md ${
                  answeredCount < totalQ || submitting
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-emerald-500/25'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{submitting ? (isTamil ? 'கணக்கிடப்படுகிறது...' : 'Evaluating...') : t('assessment.submit')}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Result Report Card */
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
          {/* Result Banner */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white p-6 sm:p-10 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>{t('assessment.yourResult')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              {isTamil ? 'உங்களுக்கான சிறந்த தொழில் & உயர்கல்வி அறிக்கை' : 'Your Personalized Career & Academic Roadmap'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-2xl">
              {isTamil ? result.feedback_ta : result.feedback_en}
            </p>

            {/* If not logged in, prompt to save */}
            {!isAuthenticated && (
              <div className="mt-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>{t('assessment.saveProfilePrompt')}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold transition-colors"
                  >
                    {t('nav.register')}
                  </Link>
                  <button
                    onClick={quickLoginStudent}
                    className="px-3.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold transition-colors"
                  >
                    Demo Login
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Top Domain Clusters */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span>{t('assessment.topDomains')}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {result.topDomains?.map((dom, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Match Score: {dom.score}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-sm">
                    {isTamil ? dom.label_ta : dom.label_en}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended 11th/12th Streams */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              <span>{t('assessment.recommendedStream')}</span>
            </h3>
            <div className="space-y-3">
              {result.recommendedStreams?.map((stream, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1">
                  <h5 className="font-extrabold text-xs sm:text-sm text-emerald-950">
                    {stream.group}
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {stream.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Careers */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              <span>{t('assessment.matchedCareers')}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.recommendedCareers?.map((career) => {
                const title = isTamil ? career.title_ta : career.title_en;
                return (
                  <div
                    key={career.id}
                    className="p-5 rounded-2xl bg-slate-50 hover:bg-emerald-50/40 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                          {career.category}
                        </span>
                        {career.gov_7_5_applicable && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                            7.5% Quota
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                        {title}
                      </h4>
                      <p className="text-xs text-emerald-700 font-bold mt-1">
                        {career.salary_range}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <button
                        onClick={() => {
                          fetch(`/api/careers/${career.id}`)
                            .then(res => res.json())
                            .then(d => setModalCareer(d.career));
                        }}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
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

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <button
              onClick={handleRetake}
              className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('assessment.retake')}</span>
            </button>

            <Link
              to="/careers"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 transition-all"
            >
              <span>{t('hero.ctaExploreCareers')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Career Details Modal */}
      {modalCareer && (
        <CareerModal career={modalCareer} onClose={() => setModalCareer(null)} />
      )}
    </div>
  );
}
