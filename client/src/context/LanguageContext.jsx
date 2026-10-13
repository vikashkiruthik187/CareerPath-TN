import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    appName: 'CareerPath TN',
    appNameSub: 'Govt of Tamil Nadu Student Guidance Platform',
    appTagline: 'Empowering Tamil Nadu Government School Students Towards Bright Futures',
    helplineText: 'TN School Education Toll-Free Student Helpline: 14417 (24x7 Free Counseling)',
    nav: {
      home: 'Home',
      assessment: 'Career Assessment',
      careers: 'Career Paths',
      finance: 'Scholarships & Finance',
      skills: 'Life Skills & Media',
      resume: 'Resume Builder',
      dashboard: 'My Dashboard',
      admin: 'Admin Portal',
      counseling: 'Ask Counselor',
      login: 'Student Login',
      register: 'Register',
      logout: 'Logout'
    },
    hero: {
      badge: 'Dedicated for Tamil Nadu Govt School Students',
      title: 'Discover Your Career & Future Pathways with Confidence',
      subtitle: 'Personalized career recommendations, 7.5% government school horizontal reservation details, Pudhumai Penn & Tamil Pudhalvan schemes, financial literacy, and spoken English life skills.',
      ctaTakeAssessment: 'Take Free Career Assessment',
      ctaExploreCareers: 'Explore 25+ Career Paths',
      ctaCheckScholarships: 'Check Scholarship Eligibility'
    },
    stats: {
      districts: '38 Districts',
      districtsSub: 'Covering all TN rural & urban schools',
      schemes: '100% Free Schemes',
      schemesSub: 'Pudhumai Penn & 7.5% Quota Guide',
      careers: '25+ Career Roadmaps',
      careersSub: 'From 10th/12th to top jobs',
      skills: 'Essential Life Skills',
      skillsSub: 'Spoken English & digital banking'
    },
    schemesSection: {
      title: 'Tamil Nadu Government Educational Welfare Highlights',
      subtitle: 'Key benefits designed specifically for students graduating from Government Schools',
      pudhumaiPenn: 'Pudhumai Penn Scheme (₹1,000/mo for girls entering higher ed)',
      tamilPudhalvan: 'Tamil Pudhalvan Scheme (₹1,000/mo for boys entering higher ed)',
      quota75: '7.5% Horizontal Reservation with 100% FREE tuition & hostel in MBBS, Engineering, Agri & Law',
      firstGraduate: 'First Graduate Full Tuition Fee Concession'
    },
    assessment: {
      title: 'Student Career Assessment Questionnaire',
      subtitle: 'Answer 8 practical, scenario-based questions to uncover your natural strengths, favorite subjects, and optimal higher secondary stream or career roadmap.',
      progress: 'Question',
      of: 'of',
      submit: 'Calculate My Career Recommendations',
      yourResult: 'Your Personalized Career Profile',
      topDomains: 'Your Top Strength Clusters',
      matchedCareers: 'Top Matching Careers for You',
      recommendedStream: 'Recommended 11th/12th Academic Group',
      retake: 'Retake Assessment',
      saveProfilePrompt: 'Register or login to save your assessment report permanently to your student dashboard!'
    },
    common: {
      viewDetails: 'View Full Roadmap',
      save: 'Bookmark',
      saved: 'Saved',
      applyNow: 'Official Portal',
      eligible: 'Eligible',
      salary: 'Expected Salary',
      education: 'Education Needed',
      exams: 'Entrance Exams',
      colleges: 'Top Tamil Nadu Colleges',
      skills: 'Required Skills',
      readMore: 'Read More',
      close: 'Close',
      submit: 'Submit',
      search: 'Search by keyword...',
      filterAll: 'All Categories',
      loading: 'Loading information...'
    }
  },
  ta: {
    appName: 'கரியர்பாத் தமிழ்நாடு',
    appNameSub: 'தமிழ்நாடு அரசுப் பள்ளி மாணவர் வழிகாட்டித் தளம்',
    appTagline: 'தமிழ்நாடு அரசுப் பள்ளி மாணவர்களின் உயர்கல்வி மற்றும் ஒளிமயமான எதிர்காலத்திற்கான கையேடு',
    helplineText: 'தமிழ்நாடு பள்ளிக் கல்வித்துறை கட்டணமில்லா மாணவர் உதவி எண்: 14417 (24 மணி நேரமும் செயல்படுகிறது)',
    nav: {
      home: 'முகப்பு',
      assessment: 'கரியர் மதிப்பீடு',
      careers: 'தொழில் வழிகாட்டி',
      finance: 'கல்வி உதவித்தொகை & நிதி',
      skills: 'வாழ்வியல் & ஆங்கிலத் திறன்',
      resume: 'பயோடேட்டா தயாரிப்பு',
      dashboard: 'மாணவர் தளம்',
      admin: 'நிர்வாகி தளம்',
      counseling: 'ஆலோசகர் உதவி',
      login: 'மாணவர் உள்நுழைவு',
      register: 'பதிவு செய்ய',
      logout: 'வெளியேறு'
    },
    hero: {
      badge: 'தமிழ்நாடு அரசுப் பள்ளி மாணவர்களுக்கான பிரத்யேக தளம்',
      title: 'உங்கள் விருப்பமான தொழிலையும் உயர்கல்விப் பாதையையும் தன்னம்பிக்கையுடன் தேர்வு செய்யுங்கள்',
      subtitle: 'தனிப்பயனாக்கப்பட்ட கரியர் பரிந்துரைகள், 7.5% அரசுப் பள்ளி முன்னுரிமை இடஒதுக்கீடு வழிகாட்டுதல், புதுமைப் பெண் மற்றும் தமிழ்ப் புதல்வன் திட்டங்கள், நிதி விழிப்புணர்வு மற்றும் எளிய ஸ்போக்கன் இங்கிலீஷ்.',
      ctaTakeAssessment: 'இலவச கரியர் மதிப்பீடு செய்க',
      ctaExploreCareers: '25+ தொழில் வழிகாட்டிகளை காண்க',
      ctaCheckScholarships: 'உதவித்தொகை தகுதி சோதிக்க'
    },
    stats: {
      districts: '38 மாவட்டங்கள்',
      districtsSub: 'கிராமப்புற & நகர்ப்புற அரசுப் பள்ளிகளுக்கு',
      schemes: '100% இலவச அரசு திட்டங்கள்',
      schemesSub: 'புதுமைப் பெண் & 7.5% இடஒதுக்கீடு',
      careers: '25+ விரிவான கரியர் பாதைகள்',
      careersSub: '10ஆம்/12ஆம் வகுப்பு முதல் வேலை வரை',
      skills: 'அத்தியாவசிய வாழ்வியல் திறன்',
      skillsSub: 'பேச்சு ஆங்கிலம் & வங்கிப் பாதுகாப்பு'
    },
    schemesSection: {
      title: 'தமிழ்நாடு அரசின் சிறப்புக் கல்வி நலத்திட்டங்கள்',
      subtitle: 'அரசுப் பள்ளியில் படித்த மாணவ, மாணவிகளுக்காக செயல்படுத்தப்படும் முக்கிய திட்டங்கள்',
      pudhumaiPenn: 'புதுமைப் பெண் திட்டம் (உயர்கல்வி பயிலும் மாணவிகளுக்கு மாதம் ₹1,000)',
      tamilPudhalvan: 'தமிழ்ப் புதல்வன் திட்டம் (உயர்கல்வி பயிலும் மாணவர்களுக்கு மாதம் ₹1,000)',
      quota75: '7.5% முன்னுரிமை இடஒதுக்கீடு - மருத்துவம், பொறியியல், வேளாண்மை, சட்டப் படிப்புகளில் 100% கட்டணமில்லா சேர்க்கை',
      firstGraduate: 'முதல் தலைமுறை பட்டதாரி கல்விக் கட்டணச் சலுகை'
    },
    assessment: {
      title: 'மாணவர் கரியர் மதிப்பீட்டு வினாடி வினா',
      subtitle: 'உங்கள் இயல்பான ஆர்வம், விருப்பமான பாடம் மற்றும் சிறந்த 11/12ஆம் வகுப்பு பிரிவை கண்டறிய 8 எளிய சூழ்நிலை வினாக்களுக்கு பதிலளியுங்கள்.',
      progress: 'வினா',
      of: 'இல்',
      submit: 'எனக்கான பரிந்துரைகளைக் கணக்கிடு',
      yourResult: 'உங்கள் தனிப்பயனாக்கப்பட்ட கரியர் அறிக்கை',
      topDomains: 'உங்கள் முதன்மை பலங்கள்',
      matchedCareers: 'உங்களுக்குப் பொருத்தமான தொழில்கள்',
      recommendedStream: 'பரிந்துரைக்கப்படும் மேல்நிலை வகுப்புப் பிரிவு',
      retake: 'மீண்டும் மதிப்பீடு செய்க',
      saveProfilePrompt: 'இந்த அறிக்கையை உங்கள் மாணவர் தளத்தில் எப்போதும் பார்க்க பதிவு செய்யவும் அல்லது உள்நுழையவும்!'
    },
    common: {
      viewDetails: 'முழு விவரங்கள் காண்க',
      save: 'சேமிக்க',
      saved: 'சேமிக்கப்பட்டது',
      applyNow: 'அதிகாரப்பூர்வ தளம்',
      eligible: 'தகுதியுடையது',
      salary: 'எதிர்பார்க்கப்படும் ஊதியம்',
      education: 'தேவையான கல்வித்தகுதி',
      exams: 'நுழைவுத் தேர்வுகள்',
      colleges: 'தமிழ்நாட்டின் சிறந்த கல்லூரிகள்',
      skills: 'தேவையான தனித்திறன்கள்',
      readMore: 'மேலும் படிக்க',
      close: 'மூடுக',
      submit: 'சமர்ப்பிக்க',
      search: 'தேடுக...',
      filterAll: 'அனைத்து பிரிவுகளும்',
      loading: 'தகவல்கள் பதிவேற்றப்படுகின்றன...'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('careerpath_lang') || 'ta';
  });

  useEffect(() => {
    localStorage.setItem('careerpath_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'ta' ? 'en' : 'ta'));
  };

  const t = (path) => {
    const keys = path.split('.');
    let current = translations[lang];
    for (const k of keys) {
      if (current && current[k] !== undefined) {
        current = current[k];
      } else {
        // Fallback to English
        let fallback = translations.en;
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
