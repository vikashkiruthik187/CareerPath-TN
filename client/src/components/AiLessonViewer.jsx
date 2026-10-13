import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Lightbulb,
  MessageSquare,
  Bookmark,
  Zap,
  TrendingUp,
  Percent,
  Compass
} from 'lucide-react';

/**
 * Format inline markdown text:
 * - Converts **text** into strong elements
 * - Converts *text* into em elements
 * - Converts "quoted text" into styled quotes
 * - Strips any stray # or markdown artifacts
 */
function renderInlineFormatting(text) {
  if (!text) return null;

  // Clean any remaining raw markdown symbols like leading ### or trailing colons/hashes
  let cleaned = text.replace(/^[#\s*]+/, '').trim();

  // Pattern to match **bold**, *italic*, or "quoted" text
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|"[^"]+"|[“”][^“”]+[“”])/g;
  const parts = cleaned.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold text **...**
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      const inner = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-slate-900">
          {inner}
        </strong>
      );
    }

    // Italic text *...*
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      const inner = part.slice(1, -1);
      return (
        <em key={index} className="italic text-slate-700 bg-amber-50/80 px-1 py-0.5 rounded font-normal">
          {inner}
        </em>
      );
    }

    // Quoted text "..."
    if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith('“') && part.endsWith('”'))) {
      const inner = part.slice(1, -1);
      return (
        <span key={index} className="inline-block text-emerald-800 bg-emerald-50/70 border border-emerald-200/50 px-2 py-0.5 rounded-md font-medium text-xs sm:text-sm my-0.5">
          “{inner}”
        </span>
      );
    }

    // Plain text - strip any leftover raw markdown
    const sanitized = part.replace(/\*\*/g, '').replace(/###/g, '');
    return <span key={index}>{sanitized}</span>;
  });
}

/**
 * Parses raw lesson markdown string into clean structured sections and items.
 */
function parseLessonContent(rawText) {
  if (!rawText) return [];

  // Split by heading (e.g. ### 1. Needs vs Wants or ### Title)
  const lines = rawText.split('\n');
  const sections = [];
  let currentSection = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();
    if (!line) continue;

    // Check if line is a header (### Header or ## Header or # Header)
    if (line.startsWith('#')) {
      const cleanTitle = line
        .replace(/^#+\s*/, '')
        .replace(/^(\d+[\.\)]\s*)/, '') // extract leading number separately if needed
        .replace(/:$/, '')
        .trim();

      // Extract section number if present (e.g. "1." or "2.")
      const numMatch = line.replace(/^#+\s*/, '').match(/^(\d+)[\.\)]/);
      const sectionNumber = numMatch ? numMatch[1] : (sections.length + 1).toString();

      currentSection = {
        number: sectionNumber,
        title: cleanTitle,
        items: []
      };
      sections.push(currentSection);
      continue;
    }

    // If no header encountered yet, create a default first section
    if (!currentSection) {
      currentSection = {
        number: '1',
        title: 'Core Concepts',
        items: []
      };
      sections.push(currentSection);
    }

    // Check if line is an indented sub-item
    const isSubItem = rawLine.startsWith('   -') || rawLine.startsWith('    -') || rawLine.startsWith('\t-');

    // Clean bullet or number prefix: "- ", "* ", "1. ", etc.
    let contentLine = line.replace(/^[-*•]\s+/, '').replace(/^\d+[\.\)]\s+/, '').trim();

    // Check if line has a key-value pair like: **Key**: Value or **Key** — Value
    const kvMatch = contentLine.match(/^\*\*([^*]+)\*\*[:—\-]\s*(.*)$/);

    if (kvMatch) {
      const key = kvMatch[1].trim();
      const val = kvMatch[2].trim();
      currentSection.items.push({
        type: 'key-value',
        key,
        value: val,
        isSubItem
      });
    } else if (contentLine.startsWith('"') && contentLine.endsWith('"')) {
      // Direct speech quote
      currentSection.items.push({
        type: 'quote',
        quote: contentLine.slice(1, -1),
        isSubItem
      });
    } else {
      // General paragraph or standard bullet
      currentSection.items.push({
        type: 'general',
        text: contentLine,
        isSubItem
      });
    }
  }

  return sections;
}

/**
 * Returns badge styling based on key text (e.g., Need, Want, 50%, etc.)
 */
function getKeyBadgeTheme(key = '') {
  const lower = key.toLowerCase();

  if (lower.includes('need') || lower.includes('அவசியம்') || lower.includes('தேவை')) {
    return {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500',
      tag: 'Need / தேவை'
    };
  }

  if (lower.includes('want') || lower.includes('விருப்பம்') || lower.includes('ஆடம்பரம்')) {
    return {
      bg: 'bg-amber-50 text-amber-900 border-amber-200',
      dot: 'bg-amber-500',
      tag: 'Want / விருப்பம்'
    };
  }

  if (lower.includes('%') || lower.includes('percent') || lower.includes('விதி')) {
    return {
      bg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      dot: 'bg-indigo-500',
      tag: 'Rule / விதி'
    };
  }

  if (lower.includes('star') || lower.includes('pomodoro') || lower.includes('technique') || lower.includes('formula') || lower.includes('ஃபார்முலா')) {
    return {
      bg: 'bg-purple-50 text-purple-900 border-purple-200',
      dot: 'bg-purple-500',
      tag: 'Method'
    };
  }

  return {
    bg: 'bg-slate-100 text-slate-800 border-slate-200',
    dot: 'bg-teal-500',
    tag: null
  };
}

export default function AiLessonViewer({ content, isTamil = false, category = 'General' }) {
  const [copied, setCopied] = useState(false);

  const sections = parseLessonContent(content);

  const handleCopy = () => {
    if (!content) return;
    // Strip markdown characters for clean clipboard text
    const cleanPlain = content
      .replace(/###\s*/g, '')
      .replace(/\*\*/g, '')
      .replace(/-\s+/g, '• ')
      .trim();

    navigator.clipboard.writeText(cleanPlain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* AI Assistant Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                {isTamil ? 'AI கற்றல் வழிகாட்டி' : 'AI Learning Guide'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {isTamil ? 'AI சுருக்கம்' : 'AI Curated'}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {isTamil
                ? 'எளிமையான குறிப்புகள் & முக்கியக் கருத்துக்கள்'
                : 'Simple, structured concepts crafted for clarity'}
            </p>
          </div>
        </div>

        {/* Copy & Status Bar */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition-colors border border-white/10 active:scale-95"
            title="Copy notes"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-bold">{isTamil ? 'நகலெடுக்கப்பட்டது!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-300" />
                <span>{isTamil ? 'குறிப்புகளை நகலெடு' : 'Copy Notes'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Structured Sections */}
      <div className="space-y-5">
        {sections.map((section, sIdx) => (
          <div
            key={sIdx}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300/60 transition-all duration-200 overflow-hidden"
          >
            {/* Section Header */}
            <div className="bg-slate-50/80 px-5 py-3.5 border-b border-slate-100 flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs shadow-xs">
                {section.number}
              </span>
              <h4 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                {section.title}
              </h4>
            </div>

            {/* Section Items */}
            <div className="p-5 sm:p-6 space-y-3.5">
              {section.items.map((item, iIdx) => {
                if (item.type === 'key-value') {
                  const theme = getKeyBadgeTheme(item.key);
                  return (
                    <div
                      key={iIdx}
                      className={`p-4 rounded-xl border ${theme.bg} ${
                        item.isSubItem ? 'ml-4 sm:ml-6' : ''
                      } transition-all duration-150 flex flex-col sm:flex-row sm:items-start gap-2.5 sm:gap-3`}
                    >
                      <div className="shrink-0 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${theme.dot}`} />
                        <span className="font-extrabold text-xs sm:text-sm tracking-tight text-slate-900">
                          {item.key}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal sm:border-l sm:border-slate-200/80 sm:pl-3">
                        {renderInlineFormatting(item.value)}
                      </div>
                    </div>
                  );
                }

                if (item.type === 'quote') {
                  return (
                    <div
                      key={iIdx}
                      className={`p-3.5 rounded-xl bg-teal-50/60 border border-teal-200/60 flex items-start gap-2.5 ${
                        item.isSubItem ? 'ml-4 sm:ml-6' : ''
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm font-medium text-teal-950 italic leading-relaxed">
                        “{item.quote}”
                      </p>
                    </div>
                  );
                }

                // General bullet or paragraph
                return (
                  <div
                    key={iIdx}
                    className={`flex items-start gap-3 p-3 rounded-xl bg-slate-50/60 border border-slate-100 ${
                      item.isSubItem ? 'ml-4 sm:ml-6' : ''
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {renderInlineFormatting(item.text)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* AI Smart Key Takeaway Footer */}
      <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
          <Lightbulb className="w-4 h-4 text-amber-700" />
        </div>
        <div className="space-y-0.5">
          <h5 className="font-bold text-xs sm:text-sm text-amber-950">
            {isTamil ? 'AI ஸ்மார்ட் நினைவூட்டல்' : 'AI Smart Takeaway'}
          </h5>
          <p className="text-xs text-slate-700 leading-relaxed">
            {isTamil
              ? 'இந்த முக்கிய வழிகாட்டுதல்களை தினசரி நடைமுறையில் செயல்படுத்தி, உங்கள் தன்னம்பிக்கையை வளர்த்துக்கொள்ளுங்கள்.'
              : 'Review these core takeaways regularly and apply them step-by-step in your daily study and life routines.'}
          </p>
        </div>
      </div>
    </div>
  );
}
