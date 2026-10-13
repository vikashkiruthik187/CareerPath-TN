const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { optionalToken, verifyToken } = require('../middleware/auth');

// 12 carefully calibrated assessment questions covering Holland RIASEC + Academic Affinity
const ASSESSMENT_QUESTIONS = [
  {
    id: 'q1',
    category: 'Investigative',
    question_en: 'When faced with a broken machine, scientific puzzle, or math problem, what do you usually do?',
    question_ta: 'பழுதடைந்த இயந்திரம், அறிவியல் புதிர் அல்லது கணக்கு வினாவை எதிர்கொள்ளும்போது நீங்கள் என்ன செய்வீர்கள்?',
    options: [
      { text_en: 'Curiously investigate how it works step-by-step and solve it', text_ta: 'அது எவ்வாறு இயங்குகிறது என ஆர்வத்துடன் ஆராய்ந்து தீர்வு காண்பேன்', scores: { investigative: 3, stem: 3 } },
      { text_en: 'Ask friends to work together in a group to find an answer', text_ta: 'நண்பர்களை ஒன்று திரட்டி குழுவாக விவாதித்து விடை காண்பேன்', scores: { social: 3, enterprising: 1 } },
      { text_en: 'Use practical tools (screwdriver, multimeter, hands-on repair) to fix it', text_ta: 'கருவிகளை எடுத்து உடனடியாக கைகளால் பழுதுபார்க்க முயற்சிப்பேன்', scores: { realistic: 3, vocational: 3 } },
      { text_en: 'Write down a neat plan or refer to systematic instructions', text_ta: 'முறைப்படியான வழிமுறைகளை குறித்து வைத்து பின்பற்றுவேன்', scores: { conventional: 3 } }
    ]
  },
  {
    id: 'q2',
    category: 'Social',
    question_en: 'In your school or village, which activity makes you feel most satisfied?',
    question_ta: 'உங்கள் பள்ளி அல்லது கிராமத்தில் உங்களுக்கு அதிக மனநிறைவை தரும் செயல்பாடு எது?',
    options: [
      { text_en: 'Teaching junior students or helping people who are ill/in distress', text_ta: 'இளைய வகுப்பு மாணவர்களுக்கு பாடம் சொல்லித் தருவது அல்லது உடல்நலக்குறைவு உள்ளவர்களுக்கு உதவுவது', scores: { social: 4, healthcare: 3 } },
      { text_en: 'Tree plantation, farming, caring for cattle, and protecting local waterbodies', text_ta: 'மரம் நடுதல், விவசாயம், கால்நடைகளை பராமரித்தல், நீர்நிலைகளைப் பாதுகாத்தல்', scores: { realistic: 3, agriculture: 4 } },
      { text_en: 'Coding on a computer, browsing science facts, or designing digital posters', text_ta: 'கணினியில் வேலை செய்வது, புதிய அறிவியல் செய்திகள் அறிவது, டிஜிட்டல் வேலைகள்', scores: { investigative: 3, tech: 3 } },
      { text_en: 'Organizing school cultural events, speeches, or sports tournaments', text_ta: 'பள்ளி விழாக்கள், பேச்சுப் போட்டிகள் அல்லது விளையாட்டுப் போட்டிகளை முன்னின்று நடத்துவது', scores: { enterprising: 4, leadership: 3 } }
    ]
  },
  {
    id: 'q3',
    category: 'Realistic',
    question_en: 'What kind of work environment do you enjoy the most?',
    question_ta: 'எத்தகைய பணிச்சூழலில் நீங்கள் மிகவும் மகிழ்ச்சியாக இருப்பீர்கள்?',
    options: [
      { text_en: 'Outdoors in farm fields, nature, or environmental research labs', text_ta: 'இயற்கை சூழல், வயல்வெளிகள், கால்நடை பண்ணை அல்லது இயற்கை ஆய்வுக்கூடம்', scores: { agriculture: 4, realistic: 3 } },
      { text_en: 'Modern tech office or software development workspace with high-speed computers', text_ta: 'வேகமான கணினிகளுடன் கூடிய நவீன மென்பொருள் அல்லது ஐடி அலுவலகம்', scores: { tech: 4, investigative: 2 } },
      { text_en: 'Hospital, clinic, or community healthcare center saving lives', text_ta: 'மருத்துவமனை, ஆரம்ப சுகாதார நிலையம் அல்லது ஆய்வகத்தில் மக்களுக்கு சிகிச்சை அளிப்பது', scores: { healthcare: 4, social: 3 } },
      { text_en: 'Government taluk office, police station, or courtroom serving the public', text_ta: 'அரசு தாலுகா அலுவலகம், காவல் நிலையம் அல்லது நீதிமன்றத்தில் மக்கள் நலப்பணி', scores: { government: 4, leadership: 3 } }
    ]
  },
  {
    id: 'q4',
    category: 'Enterprising',
    question_en: 'If you are given ₹10,000 to start an initiative, what would you prefer to do?',
    question_ta: 'உங்களுக்கு ₹10,000 வழங்கப்பட்டால், நீங்கள் எதை தொடங்க விரும்புவீர்கள்?',
    options: [
      { text_en: 'Start a small agro/organic food business or nursery to earn sustainable profit', text_ta: 'சிறிய அளவிலான இயற்கை உணவு/நாற்றுப்பண்ணை தொழில் தொடங்கி லாபம் ஈட்டுவேன்', scores: { enterprising: 3, commerce: 3, agriculture: 2 } },
      { text_en: 'Invest in books, online courses, and research software tools to learn advanced skills', text_ta: 'ஆன்லைன் படிப்புகள், புத்தகங்கள் வாங்கி புதிய திறன்களை ஆழமாகக் கற்பேன்', scores: { investigative: 4, tech: 2 } },
      { text_en: 'Start a free coaching club or library in your village for government school kids', text_ta: 'கிராமத்து ஏழை அரசுப் பள்ளி மாணவர்களுக்கு இலவச மாலை நேர படிப்பு மையம்/நூலகம் அமைப்பேன்', scores: { social: 4, education: 3 } },
      { text_en: 'Buy an electrical repair toolkit or solar equipment to provide maintenance services', text_ta: 'எலக்ட்ரிக்கல் கருவிகள் வாங்கி சுற்றுவட்டார வீடுகளுக்கு பராமரிப்பு சேவை வழங்குவேன்', scores: { vocational: 4, realistic: 3 } }
    ]
  },
  {
    id: 'q5',
    category: 'Subject Affinity',
    question_en: 'Which subject in school do you find most fascinating without feeling bored?',
    question_ta: 'பள்ளியில் உங்களுக்கு சலிப்பே தட்டாமல் மிகவும் சுவாரஸ்யமாக இருக்கும் பாடம் எது?',
    options: [
      { text_en: 'Biology & Botany (Human body, plant growth, ecosystems, genetics)', text_ta: 'உயிரியல் & தாவரவியல் (மனித உடல், தாவர வளர்ச்சி, மரபியல், மருத்துவம்)', scores: { healthcare: 4, agriculture: 3, investigative: 2 } },
      { text_en: 'Mathematics & Computer Science (Numbers, equations, logical algorithms)', text_ta: 'கணிதம் & கணினி அறிவியல் (சமன்பாடுகள், தர்க்கவியல், நிரலாக்கம்)', scores: { tech: 4, stem: 4, investigative: 3 } },
      { text_en: 'Social Science, History & Tamil Literature (Society, laws, heritage, politics)', text_ta: 'சமூக அறிவியல், வரலாறு & தமிழ் இலக்கியம் (சமூகம், சட்டங்கள், அரசியல், மனித உரிமை)', scores: { government: 4, law: 3, artistic: 3 } },
      { text_en: 'Commerce, Accountancy & Economics (Money flow, markets, banking, business)', text_ta: 'வணிகவியல், கணக்குப்பதிவியல் & பொருளியல் (பணப்புழக்கம், வரவு-செலவு, வங்கிகள்)', scores: { commerce: 4, conventional: 3 } }
    ]
  },
  {
    id: 'q6',
    category: 'Artistic & Communication',
    question_en: 'How do you prefer expressing your opinions to others?',
    question_ta: 'உங்கள் கருத்துக்களை மற்றவர்களுக்கு எவ்வாறு வெளிப்படுத்த விரும்புவீர்கள்?',
    options: [
      { text_en: 'Delivering an inspiring speech or participating in debates and discussions', text_ta: 'மேடையில் கம்பீரமாக உரை நிகழ்த்துவது அல்லது விவாதங்களில் வாதாடுவது', scores: { law: 4, leadership: 4, artistic: 2 } },
      { text_en: 'Writing essays, poetry, articles, or creating informative visual charts', text_ta: 'கட்டுரைகள், கவிதைகள் எழுதுவது அல்லது வரைபடங்கள் மூலம் விளக்குவது', scores: { artistic: 4, education: 2 } },
      { text_en: 'Presenting hard data, facts, scientific evidence, and charts', text_ta: 'துல்லியமான அறிவியல் தரவுகள், எண்கள் மற்றும் சான்றுகளுடன் விளக்குவது', scores: { investigative: 4, conventional: 2 } },
      { text_en: 'Showing a live practical demonstration with physical models or prototypes', text_ta: 'நேரடியாக ஒரு இயந்திரம் அல்லது மாதிரியை இயக்கி செயல்முறை விளக்கம் அளிப்பது', scores: { realistic: 4, vocational: 3 } }
    ]
  },
  {
    id: 'q7',
    category: 'Work Value',
    question_en: 'What is your highest career priority for the future?',
    question_ta: 'எதிர்காலத்தில் உங்கள் உத்தியோகத்தில் மிக முக்கியமான குறிக்கோள் எது?',
    options: [
      { text_en: 'Public authority, social prestige, and serving Tamil Nadu as a government officer', text_ta: 'அரசு அதிகாரியாக மக்களுக்கும் தமிழ்நாட்டிற்கும் சேவை செய்வது மற்றும் சமூக அந்தஸ்து', scores: { government: 5, leadership: 3 } },
      { text_en: 'High global salary, innovation, and working on modern digital technologies', text_ta: 'சர்வதேச ஊதியம், புதிய தொழில்நுட்பங்களை உருவாக்குதல் மற்றும் உலகளாவிய வளர்ச்சி', scores: { tech: 5, enterprising: 2 } },
      { text_en: 'Saving lives, healing sick people, and community medical welfare', text_ta: 'ஏழைகளின் உயிரைக் காப்பது, நோய்களைக் குணப்படுத்துவது மற்றும் மருத்துவ சேவை', scores: { healthcare: 5, social: 3 } },
      { text_en: 'Self-reliance, green farming, veterinary care, and food security for our state', text_ta: 'சுயசார்பு, பசுமை விவசாயம், கால்நடை வளர்ப்பு மற்றும் உணவுப் பாதுகாப்பு', scores: { agriculture: 5, realistic: 3 } }
    ]
  },
  {
    id: 'q8',
    category: 'Problem Solving Style',
    question_en: 'When a crisis happens, what is your natural reaction?',
    question_ta: 'ஒரு நெருக்கடி அல்லது பிரச்சனை ஏற்படும்போது உங்கள் இயல்பான எதிர்வினை என்ன?',
    options: [
      { text_en: 'Take calm charge, guide people authoritatively, and restore peace', text_ta: 'பதட்டப்படாமல் தலைமை ஏற்று மக்களை அமைதிப்படுத்தி வழிகாட்டுவேன்', scores: { government: 4, leadership: 4 } },
      { text_en: 'Diagnose the physical pain or emergency and provide immediate first aid', text_ta: 'பாதிக்கப்பட்டவருக்கு உடனடியாக முதலுதவி செய்து நலம் விசாரிப்பேன்', scores: { healthcare: 4, social: 3 } },
      { text_en: 'Analyze the root cause logically and find a systematic technical solution', text_ta: 'பிரச்சனையின் மூல காரணத்தை தர்க்கரீதியாக ஆராய்ந்து தொழில்நுட்ப தீர்வு காண்பேன்', scores: { tech: 3, investigative: 4 } },
      { text_en: 'Negotiate calmly and resolve the misunderstanding through mutual dialogue', text_ta: 'இருதரப்பினரிடமும் பேசி சமரசமாக பிரச்சனையை பேசித் தீர்ப்பேன்', scores: { law: 4, social: 3 } }
    ]
  }
];

// GET /api/assessment/questions
router.get('/questions', (req, res) => {
  return res.json({
    totalQuestions: ASSESSMENT_QUESTIONS.length,
    questions: ASSESSMENT_QUESTIONS
  });
});

// POST /api/assessment/submit
router.post('/submit', optionalToken, (req, res) => {
  try {
    const { answers } = req.body;
    // answers is array of { questionId, optionIndex }

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'Answers must be provided as an array' });
    }

    // Cumulative category scores
    const categoryScores = {
      investigative: 0,
      realistic: 0,
      social: 0,
      enterprising: 0,
      conventional: 0,
      artistic: 0,
      tech: 0,
      healthcare: 0,
      agriculture: 0,
      government: 0,
      commerce: 0,
      vocational: 0,
      law: 0,
      education: 0
    };

    answers.forEach(ans => {
      const q = ASSESSMENT_QUESTIONS.find(x => x.id === ans.questionId);
      if (q && q.options[ans.optionIndex]) {
        const optionScores = q.options[ans.optionIndex].scores || {};
        for (const [key, val] of Object.entries(optionScores)) {
          categoryScores[key] = (categoryScores[key] || 0) + val;
        }
      }
    });

    // Determine top 3 domains
    const domainMapping = [
      { id: 'tech', label_en: 'Technology & Engineering', label_ta: 'பொறியியல் & தகவல் தொழில்நுட்பம்', score: categoryScores.tech + categoryScores.investigative },
      { id: 'agriculture', label_en: 'Agriculture & Veterinary', label_ta: 'வேளாண்மை & கால்நடை அறிவியல்', score: categoryScores.agriculture + categoryScores.realistic },
      { id: 'healthcare', label_en: 'Medicine & Healthcare', label_ta: 'மருத்துவம் & பொது சுகாதாரம்', score: categoryScores.healthcare + categoryScores.social },
      { id: 'government', label_en: 'Public Service & Administration', label_ta: 'அரசு நிர்வாகம் & சீருடைப் பணியாளர்', score: categoryScores.government + categoryScores.enterprising },
      { id: 'commerce', label_en: 'Commerce & Financial Auditing', label_ta: 'வணிகவியல் & நிதி மேலாண்மை', score: categoryScores.commerce + categoryScores.conventional },
      { id: 'vocational', label_en: 'Skill Trades & Polytechnic', label_ta: 'தொழிற்பயிற்சி & பாலிடெக்னிக்', score: categoryScores.vocational + categoryScores.realistic },
      { id: 'law', label_en: 'Law, Justice & Advocacy', label_ta: 'சட்டம், நீதி & வாதாடல்', score: categoryScores.law + categoryScores.artistic },
      { id: 'education', label_en: 'Teaching & Academia', label_ta: 'ஆசிரியர் பணி & உயர்கல்வி', score: categoryScores.education + categoryScores.social }
    ];

    domainMapping.sort((a, b) => b.score - a.score);
    const topDomains = domainMapping.slice(0, 3);

    // Map top domain to recommended careers from database
    const allCareers = db.prepare('SELECT * FROM careers').all();
    const matchedCareers = [];

    topDomains.forEach(domain => {
      if (domain.id === 'agriculture') {
        const ag = allCareers.find(c => c.id === 'agricultural-officer');
        const vet = allCareers.find(c => c.id === 'veterinary-doctor');
        const fish = allCareers.find(c => c.id === 'dairy-fisheries-technologist');
        if (ag) matchedCareers.push(ag);
        if (vet) matchedCareers.push(vet);
        if (fish) matchedCareers.push(fish);
      } else if (domain.id === 'tech') {
        const se = allCareers.find(c => c.id === 'software-engineer');
        if (se) matchedCareers.push(se);
      } else if (domain.id === 'healthcare') {
        const doc = allCareers.find(c => c.id === 'doctor-mbbs');
        const sid = allCareers.find(c => c.id === 'siddha-doctor-bsms');
        if (doc) matchedCareers.push(doc);
        if (sid) matchedCareers.push(sid);
      } else if (domain.id === 'government') {
        const vao = allCareers.find(c => c.id === 'tnpsc-group4-vao');
        const si = allCareers.find(c => c.id === 'sub-inspector-police');
        if (vao) matchedCareers.push(vao);
        if (si) matchedCareers.push(si);
      } else if (domain.id === 'commerce') {
        const ca = allCareers.find(c => c.id === 'chartered-accountant-ca');
        if (ca) matchedCareers.push(ca);
      } else if (domain.id === 'vocational') {
        const ele = allCareers.find(c => c.id === 'iti-polytechnic-electrician');
        if (ele) matchedCareers.push(ele);
      } else if (domain.id === 'law') {
        const law = allCareers.find(c => c.id === 'advocate-lawyer');
        if (law) matchedCareers.push(law);
      } else if (domain.id === 'education') {
        const tea = allCareers.find(c => c.id === 'school-teacher-bt-pg');
        if (tea) matchedCareers.push(tea);
      }
    });

    // Remove duplicates
    const uniqueCareers = [];
    const seenIds = new Set();
    for (const c of matchedCareers) {
      if (!seenIds.has(c.id)) {
        seenIds.add(c.id);
        uniqueCareers.push({
          id: c.id,
          title_en: c.title_en,
          title_ta: c.title_ta,
          category: c.category,
          salary_range: c.salary_range,
          gov_7_5_applicable: Boolean(c.gov_7_5_applicable)
        });
      }
    }

    // Recommended 11th/12th Streams
    let recommendedStreams = [];
    const primaryDomain = topDomains[0].id;
    if (primaryDomain === 'agriculture' || primaryDomain === 'healthcare') {
      recommendedStreams = [
        { group: 'Group 1: Bio-Maths (Physics, Chemistry, Biology, Mathematics)', rationale: 'Opens doors for Medical, TNAU Agri, TANUVAS Veterinary, and Engineering' },
        { group: 'Group 2: Pure Science (Physics, Chemistry, Botany, Zoology)', rationale: 'Ideal for MBBS, BDS, Siddha, Nursing, and Biological Sciences' }
      ];
    } else if (primaryDomain === 'tech') {
      recommendedStreams = [
        { group: 'Group 3: Computer Science + Maths (Physics, Chemistry, Maths, CS)', rationale: 'Direct springboard for Anna University Engineering, B.Tech AI & Data Science' },
        { group: 'Polytechnic Diploma in Computer / IT / EEE', rationale: 'Hands-on practical route after 10th with Lateral Entry to 2nd year B.E' }
      ];
    } else if (primaryDomain === 'commerce') {
      recommendedStreams = [
        { group: 'Group 4: Commerce with Business Maths / Computer Applications', rationale: 'Direct pathway for Chartered Accountancy (CA), B.Com, and Banking' }
      ];
    } else if (primaryDomain === 'vocational') {
      recommendedStreams = [
        { group: 'Vocational Higher Secondary / 2-Year ITI Electrician', rationale: 'Immediate industrial skill certification and apprenticeships with stipend' }
      ];
    } else {
      recommendedStreams = [
        { group: 'Arts & Humanities / Any Degree Group', rationale: 'Excellent base for TNPSC Group 1, Group 4, Civil Judge, and Law admissions' }
      ];
    }

    // Personalized feedback
    const feedback_en = `Based on your responses, your primary strength lies in ${topDomains[0].label_en}, followed by ${topDomains[1].label_en}. You exhibit strong problem-solving capabilities, practical mindset, and a keen desire to make an impact in Tamil Nadu. We strongly recommend exploring Tamil Nadu Government's 7.5% reservation opportunities in relevant higher education institutes!`;
    const feedback_ta = `உங்கள் பதில்களின் அடிப்படையில், உங்களின் முதன்மை பலம் "${topDomains[0].label_ta}" துறையிலும், அதனைத் தொடர்ந்து "${topDomains[1].label_ta}" துறையிலும் உள்ளது. உங்களிடம் சமூக அக்கறை மற்றும் சிறந்த பகுப்பாய்வு திறன் உள்ளது. தமிழ்நாடு அரசின் 7.5% முன்னுரிமை இடஒதுக்கீடு மற்றும் நான் முதல்வன் வழிகாட்டுதல்களைப் பயன்படுத்தி உங்கள் கனவை நனவாக்குங்கள்!`;

    // If student is logged in, save result
    if (req.user && req.user.id) {
      const stmt = db.prepare(`
        INSERT INTO assessment_results (
          user_id, scores, top_careers, recommended_streams, feedback_en, feedback_ta
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        req.user.id,
        JSON.stringify(categoryScores),
        JSON.stringify(uniqueCareers),
        JSON.stringify(recommendedStreams),
        feedback_en,
        feedback_ta
      );
    }

    return res.json({
      topDomains,
      scores: categoryScores,
      recommendedCareers: uniqueCareers.slice(0, 4),
      recommendedStreams,
      feedback_en,
      feedback_ta
    });
  } catch (error) {
    console.error('Assessment evaluation error:', error);
    return res.status(500).json({ error: 'Failed to process assessment' });
  }
});

// GET /api/assessment/history
router.get('/history', verifyToken, (req, res) => {
  try {
    const results = db.prepare(`
      SELECT * FROM assessment_results WHERE user_id = ? ORDER BY completed_at DESC
    `).all(req.user.id);

    const formatted = results.map(r => ({
      id: r.id,
      completed_at: r.completed_at,
      scores: JSON.parse(r.scores || '{}'),
      top_careers: JSON.parse(r.top_careers || '[]'),
      recommended_streams: JSON.parse(r.recommended_streams || '[]'),
      feedback_en: r.feedback_en,
      feedback_ta: r.feedback_ta
    }));

    return res.json({ results: formatted });
  } catch (error) {
    console.error('Assessment history error:', error);
    return res.status(500).json({ error: 'Failed to fetch assessment history' });
  }
});

module.exports = router;
