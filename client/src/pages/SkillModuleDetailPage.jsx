import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AiLessonViewer from '../components/AiLessonViewer';
import {
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Award,
  Video,
  Sparkles,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

export default function SkillModuleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { isAuthenticated, quickLoginStudent } = useAuth();

  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState({}); // { [qIdx]: selectedOptionIndex }
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const isTamil = lang === 'ta';

  useEffect(() => {
    const token = localStorage.getItem('careerpath_token');
    fetch(`/api/skills/modules/${id}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    })
      .then(res => res.json())
      .then(data => {
        setModule(data.module);
        if (data.module && data.module.is_completed) {
          setQuizSubmitted(true);
          setQuizScore(data.module.user_score || 100);
        }
      })
      .catch(err => console.error('Fetch module detail error:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSelectQuiz = (qIdx, optIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  const handleQuizSubmit = async () => {
    const quizList = module.quiz_data || [];
    let correctCount = 0;

    quizList.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / quizList.length) * 100);
    setQuizScore(calculatedScore);
    setQuizSubmitted(true);

    // Save completion
    const token = localStorage.getItem('careerpath_token');
    if (token) {
      try {
        await fetch(`/api/skills/modules/${id}/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ score: calculatedScore })
        });
      } catch (err) {
        console.error('Save progress error:', err);
      }
    }

    try {
      confetti({ particleCount: 75, spread: 60 });
    } catch (e) {}
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-500 text-xs font-semibold">{t('common.loading')}</p>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Module not found</h2>
        <Link to="/skills" className="text-emerald-700 font-bold text-sm">Return to Life Skills</Link>
      </div>
    );
  }

  const title = isTamil ? module.title_ta : module.title_en;
  const content = isTamil ? module.content_markdown_ta : module.content_markdown_en;
  const practicalTips = isTamil ? module.practical_tips_ta : module.practical_tips_en;
  const quizList = module.quiz_data || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <div>
        <Link
          to="/skills"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isTamil ? 'அனைத்து வாழ்வியல் தொகுதிகளுக்கும் திரும்பு' : 'Back to All Modules'}</span>
        </Link>
      </div>

      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 sm:p-10 rounded-3xl shadow-xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
          {module.category} • ⏱ {module.duration_mins} Mins
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">{title}</h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
          {isTamil ? module.summary_ta : module.summary_en}
        </p>
      </div>

      {/* Lesson Content Body */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>{isTamil ? 'பாடக் குறிப்புகள் & வழிகாட்டுதல்' : 'Core Lesson Content'}</span>
          </h3>
        </div>

        {/* AI Lesson Viewer */}
        <AiLessonViewer
          content={content}
          isTamil={isTamil}
          category={module.category}
        />

        {/* Practical Tips Checklist */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{isTamil ? 'தினசரி நடைமுறைப் பயிற்சிகள்' : 'Actionable Daily Practice Tips'}</span>
          </h4>
          <div className="space-y-2">
            {practicalTips?.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-teal-50/50 border border-teal-100 text-xs text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span className="font-medium">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Video Tutorial Link */}
        {module.video_url && (
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-amber-900">
              <Video className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold block">{isTamil ? 'கல்வி தொலைக்காட்சி / வீடியோ பாடம்' : 'Recommended Video Lesson'}</span>
                <span>{isTamil ? 'கூடுதல் விளக்கங்களுக்கு இந்த வீடியோவைக் காணவும்' : 'Watch recommended Tamil tutorial lesson'}</span>
              </div>
            </div>
            <a
              href={module.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
            >
              <span>{isTamil ? 'வீடியோவை பார்க்க' : 'Watch Video'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Interactive Module Quiz */}
      {quizList.length > 0 && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                {isTamil ? 'பயிற்சி வினாடி-வினா (Mini Quiz)' : 'Knowledge Check Quiz'}
              </h3>
            </div>
            {quizSubmitted && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                Score: {quizScore}%
              </span>
            )}
          </div>

          <div className="space-y-6">
            {quizList.map((q, qIdx) => {
              const qText = isTamil ? q.question_ta : q.question_en;
              const options = isTamil ? q.options_ta : q.options_en;
              const selectedOpt = quizAnswers[qIdx];
              return (
                <div key={qIdx} className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                    {qIdx + 1}. {qText}
                  </h5>

                  <div className="space-y-2">
                    {options.map((opt, optIdx) => {
                      const isChosen = selectedOpt === optIdx;
                      let optionStyle = 'border-slate-200 hover:border-slate-300 bg-white';

                      if (quizSubmitted) {
                        if (optIdx === q.correctIndex) {
                          optionStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold';
                        } else if (isChosen) {
                          optionStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                        }
                      } else if (isChosen) {
                        optionStyle = 'border-emerald-600 bg-emerald-50 font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectQuiz(qIdx, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${optionStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && optIdx === q.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="pt-2 text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                      <span className="font-bold text-slate-800">விளக்கம் / Explanation: </span>
                      {isTamil ? q.explanation_ta : q.explanation_en}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit / Retake Button */}
          <div className="pt-2 flex items-center justify-between">
            {!quizSubmitted ? (
              <button
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length < quizList.length}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  Object.keys(quizAnswers).length < quizList.length
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                }`}
              >
                {isTamil ? 'விடைகளைச் சமர்ப்பிக்க & புள்ளிகளைப் பெறுக' : 'Submit Answers'}
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setQuizSubmitted(false);
                    setQuizAnswers({});
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isTamil ? 'மீண்டும் முயற்சிக்க' : 'Retry Quiz'}</span>
                </button>
                <Link
                  to="/skills"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                >
                  {isTamil ? 'அடுத்த தொகுதிக்குச் செல்க' : 'Next Module'}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
