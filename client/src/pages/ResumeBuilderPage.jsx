import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Printer,
  Download,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle,
  GraduationCap,
  Award,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

export default function ResumeBuilderPage() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const isTamil = lang === 'ta';

  const [resumeData, setResumeData] = useState({
    fullName: user?.name || (isTamil ? 'கவிதா முருகன்' : 'Kavitha Murugan'),
    district: user?.district || 'Madurai, Tamil Nadu',
    phone: '98421 XXXXX',
    email: user?.email || 'kavitha.student@gmail.com',
    objective: isTamil
      ? 'அரசுப் பள்ளியில் பெற்ற நல்லொழுக்கம் மற்றும் அறிவியல் ஆர்வத்துடன், வேளாண்மை மற்றும் மக்கள் நலனில் சிறந்து விளங்கி சமுதாயத்திற்கு சேவையாற்றுவதே எனது முதன்மை நோக்கம்.'
      : 'Dedicated government school student with strong foundations in science and problem solving, aspiring to pursue higher education and contribute meaningfully to society.',
    education: [
      {
        institution: user?.school_name || 'Govt Girls Higher Secondary School, Melur',
        qualification: 'Class 12 (HSC) - Bio-Maths',
        year: '2025 - 2026',
        marks: '89.5%'
      },
      {
        institution: 'Govt High School, Melur',
        qualification: 'Class 10 (SSLC)',
        year: '2023 - 2024',
        marks: '92.0%'
      }
    ],
    skills: ['Problem Solving', 'Spoken English & Tamil', 'Basic Computer & Coding', 'Teamwork', 'Public Speaking'],
    achievements: [
      'Tamil Nadu State Science Fair District Level 2nd Prize',
      'Active National Green Corps (NGC) School Eco-Club Member',
      'National Means-cum-Merit Scholarship (NMMS) Awardee'
    ],
    languages: 'Tamil (Native), English (Fluent)'
  });

  const [newSkill, setNewSkill] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setResumeData({ ...resumeData, skills: [...resumeData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (idx) => {
    setResumeData({ ...resumeData, skills: resumeData.skills.filter((_, i) => i !== idx) });
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setResumeData({ ...resumeData, achievements: [...resumeData.achievements, newAchievement.trim()] });
      setNewAchievement('');
    }
  };

  const handleRemoveAchievement = (idx) => {
    setResumeData({ ...resumeData, achievements: resumeData.achievements.filter((_, i) => i !== idx) });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header (Hidden on print) */}
      <div className="no-print text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
          <FileText className="w-3.5 h-3.5 text-emerald-700" />
          <span>{isTamil ? 'பள்ளி மாணவர் பயோடேட்டா தயாரிப்பான்' : 'Student Resume & Biodata Maker'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {isTamil ? 'தொழில்முறை பயோடேட்டா (Resume) உருவாக்குக' : 'Build Your Professional Student Resume'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {isTamil
            ? 'கல்லூரி சேர்க்கை, திறன் பயிற்சி, நான் முதல்வன் வேலைவாய்ப்புகள் மற்றும் உதவித்தொகை விண்ணப்பங்களுக்கான நேர்த்தியான பயோடேட்டா.'
            : 'Fill in your details on the left, watch live real-time preview on the right, and export or print a clean A4 resume!'}
        </p>
      </div>

      {/* Editor & Preview Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form (Hidden on print) */}
        <div className="no-print lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-base text-slate-900">
              {isTamil ? 'விவரங்களை உள்ளிடவும்' : 'Edit Resume Details'}
            </h3>
            <span className="text-xs text-slate-400 font-semibold">Step-by-Step</span>
          </div>

          {/* Personal Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {isTamil ? 'தனிப்பட்ட விவரங்கள்' : 'Personal Information'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {isTamil ? 'முழுப் பெயர்:' : 'Full Name:'}
                </label>
                <input
                  type="text"
                  value={resumeData.fullName}
                  onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-emerald-500 bg-slate-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {isTamil ? 'மாவட்டம் & மாநிலம்:' : 'District / Location:'}
                </label>
                <input
                  type="text"
                  value={resumeData.district}
                  onChange={(e) => setResumeData({ ...resumeData, district: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-emerald-500 bg-slate-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {isTamil ? 'தொடர்பு எண்:' : 'Phone Number:'}
                </label>
                <input
                  type="text"
                  value={resumeData.phone}
                  onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-emerald-500 bg-slate-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {isTamil ? 'மின்னஞ்சல்:' : 'Email Address:'}
                </label>
                <input
                  type="email"
                  value={resumeData.email}
                  onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-emerald-500 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Objective */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {isTamil ? 'கரியர் நோக்கம் (Career Objective)' : 'Career Objective'}
            </h4>
            <textarea
              rows="3"
              value={resumeData.objective}
              onChange={(e) => setResumeData({ ...resumeData, objective: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-emerald-500 bg-slate-50 focus:bg-white leading-relaxed"
            />
          </div>

          {/* Education Form */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {isTamil ? 'கல்வித் தகுதி (Education)' : 'Education History'}
            </h4>
            {resumeData.education.map((edu, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <input
                  type="text"
                  placeholder="School / College Name"
                  value={edu.institution}
                  onChange={(e) => {
                    const updated = [...resumeData.education];
                    updated[idx].institution = e.target.value;
                    setResumeData({ ...resumeData, education: updated });
                  }}
                  className="w-full p-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Qualification (e.g. 12th)"
                    value={edu.qualification}
                    onChange={(e) => {
                      const updated = [...resumeData.education];
                      updated[idx].qualification = e.target.value;
                      setResumeData({ ...resumeData, education: updated });
                    }}
                    className="p-2 bg-white rounded-lg border border-slate-200 text-xs col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="Marks (e.g. 90%)"
                    value={edu.marks}
                    onChange={(e) => {
                      const updated = [...resumeData.education];
                      updated[idx].marks = e.target.value;
                      setResumeData({ ...resumeData, education: updated });
                    }}
                    className="p-2 bg-white rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Skills Management */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {isTamil ? 'தனித்திறன்கள் (Skills)' : 'Skills & Strengths'}
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={isTamil ? 'புதிய திறனை உள்ளிடவும்...' : 'Add a skill (e.g. Spoken English)...'}
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 p-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {resumeData.skills.map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 border border-emerald-200">
                  <span>{skill}</span>
                  <button type="button" onClick={() => handleRemoveSkill(idx)} className="text-rose-500 hover:text-rose-700">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {isTamil ? 'சாதனைகள் & சான்றிதழ்கள்' : 'Achievements & Activities'}
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={isTamil ? 'சான்றிதழ் / போட்டியை உள்ளிடவும்...' : 'Add competition / award...'}
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                className="flex-1 p-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
              />
              <button
                type="button"
                onClick={handleAddAchievement}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5 pt-1">
              {resumeData.achievements.map((ach, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-medium text-slate-800">{ach}</span>
                  <button type="button" onClick={() => handleRemoveAchievement(idx)} className="text-rose-500 hover:text-rose-700">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-600">
              {isTamil ? 'தெரிந்த மொழிகள்:' : 'Languages Known:'}
            </label>
            <input
              type="text"
              value={resumeData.languages}
              onChange={(e) => setResumeData({ ...resumeData, languages: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50"
            />
          </div>

          {/* Print Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Preview renders live on the right</span>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>{isTamil ? 'பயோடேட்டாவை அச்சிட / PDF சேமிக்க' : 'Print / Save as PDF'}</span>
            </button>
          </div>
        </div>

        {/* Right: Live A4 Printable Sheet Preview */}
        <div className="lg:col-span-6 sticky top-24">
          <div className="no-print flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>A4 Live Preview</span>
            </span>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sheet</span>
            </button>
          </div>

          {/* Printable A4 Resume Container */}
          <div className="resume-sheet bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-300 text-slate-900 space-y-6">
            {/* Resume Top Header */}
            <div className="border-b-2 border-emerald-700 pb-4 flex flex-col sm:flex-row justify-between items-start gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {resumeData.fullName}
                </h1>
                <p className="text-xs text-emerald-800 font-bold mt-0.5">
                  {isTamil ? 'அரசுப் பள்ளி மாணவர் பயோடேட்டா' : 'Tamil Nadu Student Profile'}
                </p>
              </div>
              <div className="text-xs text-slate-600 space-y-0.5 text-left sm:text-right">
                <div className="flex items-center gap-1 sm:justify-end">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>{resumeData.district}</span>
                </div>
                <div className="flex items-center gap-1 sm:justify-end">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>{resumeData.phone}</span>
                </div>
                <div className="flex items-center gap-1 sm:justify-end">
                  <Mail className="w-3 h-3 text-emerald-600" />
                  <span>{resumeData.email}</span>
                </div>
              </div>
            </div>

            {/* Career Objective */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-black uppercase tracking-wider text-emerald-800 border-b border-slate-200 pb-1">
                {isTamil ? 'கரியர் நோக்கம் / Career Objective' : 'Career Objective'}
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                {resumeData.objective}
              </p>
            </div>

            {/* Education History */}
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-emerald-800 border-b border-slate-200 pb-1">
                {isTamil ? 'கல்வி விவரங்கள் / Education' : 'Educational Qualifications'}
              </h2>
              <div className="space-y-2 text-xs">
                {resumeData.education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-slate-900">{edu.qualification}</div>
                      <div className="text-slate-600 text-[11px]">{edu.institution}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-800">{edu.marks}</div>
                      <div className="text-slate-400 text-[10px]">{edu.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-black uppercase tracking-wider text-emerald-800 border-b border-slate-200 pb-1">
                {isTamil ? 'தனித்திறன்கள் / Skills' : 'Core Skills & Competencies'}
              </h2>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {resumeData.skills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-semibold border border-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements & Activities */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-black uppercase tracking-wider text-emerald-800 border-b border-slate-200 pb-1">
                {isTamil ? 'சாதனைகள் / Achievements' : 'Achievements & Co-Curricular Activities'}
              </h2>
              <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
                {resumeData.achievements.map((ach, idx) => (
                  <li key={idx} className="leading-snug">{ach}</li>
                ))}
              </ul>
            </div>

            {/* Languages Known */}
            <div className="space-y-1 pt-1 border-t border-slate-200 text-xs">
              <span className="font-bold text-slate-800">
                {isTamil ? 'மொழிகள்: ' : 'Languages Known: '}
              </span>
              <span className="text-slate-600">{resumeData.languages}</span>
            </div>

            {/* Declaration */}
            <div className="pt-4 text-[10px] text-slate-400 italic">
              {isTamil
                ? 'மேற்கண்ட அனைத்து விவரங்களும் உண்மையானவை என்று உறுதியளிக்கிறேன்.'
                : 'I hereby declare that the above particulars are true and authentic to the best of my knowledge.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
