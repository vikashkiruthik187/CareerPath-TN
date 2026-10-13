const bcrypt = require('bcryptjs');
const { db, initDatabase } = require('./database');

function seedDatabase() {
  initDatabase();

  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) {
    console.log('Database already seeded. Skipping initial seed.');
    return;
  }

  console.log('Seeding database with authentic Tamil Nadu student guidance data...');

  // 1. Seed Users (Admin & Demo Student)
  const salt = bcrypt.genSaltSync(10);
  const adminHash = bcrypt.hashSync('admin123', salt);
  const studentHash = bcrypt.hashSync('student123', salt);

  const insertUser = db.prepare(`
    INSERT INTO users (
      email, password_hash, role, name, district, school_name, school_type,
      age, education_level, stream, interests, favourite_subjects, skills, career_aspirations, preferred_language
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(
    'admin@careerpathtn.gov.in',
    adminHash,
    'admin',
    'TN Career Guidance Admin',
    'Chennai',
    'Directorate of School Education',
    'State Administration',
    35,
    'Administrator',
    'Education Administration',
    JSON.stringify(['Administration', 'Guidance']),
    JSON.stringify(['Policy', 'Technology']),
    JSON.stringify(['Counseling', 'Curriculum']),
    'Empower all TN students',
    'en'
  );

  insertUser.run(
    'kavitha@school.tn.gov.in',
    studentHash,
    'student',
    'கவிதா முருகன் (Kavitha Murugan)',
    'Madurai',
    'Govt Girls Higher Secondary School, Melur',
    'Government Higher Secondary School',
    17,
    'Class 12',
    'Bio-Maths',
    JSON.stringify(['Agriculture', 'Science & Research', 'Public Service']),
    JSON.stringify(['Biology', 'Tamil', 'Maths']),
    JSON.stringify(['Problem Solving', 'Public Speaking', 'Gardening']),
    'Agricultural Officer or TNPSC Group 1 Officer',
    'ta'
  );

  // 2. Seed Careers
  const insertCareer = db.prepare(`
    INSERT INTO careers (
      id, title_en, title_ta, category, description_en, description_ta,
      education_level_required, pathway_steps_en, pathway_steps_ta,
      required_skills_en, required_skills_ta, entrance_exams, top_colleges_tn,
      salary_range, gov_7_5_applicable, is_featured, icon_name
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const careersData = [
    {
      id: 'agricultural-officer',
      title_en: 'Agricultural Officer (AO)',
      title_ta: 'வேளாண்மை அலுவலர் (Agricultural Officer)',
      category: 'Agriculture & Allied',
      description_en: 'Guides farmers with scientific farming methods, soil health, crop protection, and implements state agricultural schemes across Tamil Nadu blocks.',
      description_ta: 'விவசாயிகளுக்கு நவீன அறிவியல் வேளாண் முறைகள், பயிர் பாதுகாப்பு மற்றும் தமிழ்நாடு அரசின் விவசாய திட்டங்களை கிராமங்களில் செயல்படுத்தி வழிநடத்துபவர்.',
      education_level_required: 'Bachelor Degree (B.Sc Agri)',
      pathway_steps_en: JSON.stringify([
        'Pass 10th standard with strong Science & Maths foundation',
        'Choose 12th Bio-Maths or Pure Science (Biology/Physics/Chemistry)',
        'Score cut-off for TNEA Agri counseling or ICAR AIEEA exam',
        'Complete 4-year B.Sc (Hons) Agriculture / Horticulture in TNAU or affiliated colleges',
        'Clear TNPSC Agricultural Officer Exam or pursue M.Sc / Bank Specialist Officer (AFO)'
      ]),
      pathway_steps_ta: JSON.stringify([
        '10ஆம் வகுப்பில் கணிதம் மற்றும் அறிவியலில் தேர்ச்சி',
        '12ஆம் வகுப்பில் உயிரியல்-கணிதம் (Bio-Maths) அல்லது அறிவியல் பிரிவு தேர்வு செய்தல்',
        'TNAU ஒற்றை சாளர கலந்தாய்வு (Single Window Counseling) மூலம் சேர்க்கை பெறுதல் (7.5% அரசு பள்ளி இடஒதுக்கீடு பொருந்தும்)',
        '4 வருட B.Sc (Hons) வேளாண்மை பட்டம் முடித்தல்',
        'TNPSC வேளாண்மை அலுவலர் தேர்வு அல்லது வங்கி AFO தேர்வில் வெற்றி பெறுதல்'
      ]),
      required_skills_en: JSON.stringify(['Crop Agronomy Knowledge', 'Soil Health Analysis', 'Tamil Communication with Farmers', 'Govt Scheme Execution', 'Data Documentation']),
      required_skills_ta: JSON.stringify(['பயிர் மேலாண்மை அறிவு', 'மண் பரிசோதனை திறன்', 'விவசாயிகளுடன் தமிழ் உரையாடல்', 'அரசு திட்டங்கள் செயல்படுத்தல்', 'ஆய்வு அறிக்கை தயாரிப்பு']),
      entrance_exams: JSON.stringify([
        { name: 'TNAU Single Window Counseling', description: 'Based on 12th marks with 7.5% govt school horizontal reservation', link: 'https://tnau.ac.in' },
        { name: 'ICAR AIEEA (CUET-UG)', description: 'All India entrance for agricultural universities', link: 'https://icar.org.in' },
        { name: 'TNPSC Agricultural Officer Exam', description: 'Direct recruitment by Tamil Nadu Public Service Commission', link: 'https://tnpsc.gov.in' }
      ]),
      top_colleges_tn: JSON.stringify([
        { name: 'Tamil Nadu Agricultural University (TNAU)', location: 'Coimbatore', type: 'State Govt Premier Univ' },
        { name: 'Agricultural College & Research Institute', location: 'Madurai', type: 'Govt Constituent College' },
        { name: 'Anbil Dharmalingam Agricultural College', location: 'Tiruchirappalli', type: 'Govt Constituent College' },
        { name: 'Thanthai Roever Agricultural College', location: 'Perambalur', type: 'Govt Aided / Affiliated' }
      ]),
      salary_range: '₹37,700 - ₹1,19,500 / month (Govt Pay Level 14)',
      gov_7_5_applicable: 1,
      is_featured: 1,
      icon_name: 'Sprout'
    },
    {
      id: 'software-engineer',
      title_en: 'Software Engineer & AI Developer',
      title_ta: 'மென்பொருள் பொறியாளர் & செயற்கை நுண்ணறிவு உருவாக்குநர்',
      category: 'Engineering & Tech',
      description_en: 'Designs, develops, and deploys software applications, mobile apps, and artificial intelligence solutions for global industries and government digital initiatives.',
      description_ta: 'கணினி மென்பொருட்கள், மொபைல் செயலிகள் மற்றும் செயற்கை நுண்ணறிவு (AI) தீர்வுகளை உருவாக்கி சர்வதேச நிறுவனங்கள் மற்றும் அரசு திட்டங்களுக்கு வழங்கிடுபவர்.',
      education_level_required: 'B.E / B.Tech / B.Sc Computer Science / BCA',
      pathway_steps_en: JSON.stringify([
        'Complete 10th with good Maths & Science marks',
        'Choose 12th standard Computer Science + Maths or Bio-Maths group',
        'Apply for TNEA Anna University Counseling (7.5% Govt school reservation covers full tuition & hostel!)',
        'Pursue B.E / B.Tech in CSE, IT, or AI & Data Science (or Polytechnic Diploma -> Lateral Entry B.E)',
        'Learn coding (Python, JavaScript, DSA) via Naan Mudhalvan, build projects, and get placed in tech firms'
      ]),
      pathway_steps_ta: JSON.stringify([
        '10ஆம் வகுப்பில் நல்ல மதிப்பெண்களுடன் தேர்ச்சி',
        '12ஆம் வகுப்பில் கணினி அறிவியல் (Computer Science) அல்லது கணிதப் பிரிவு',
        'TNEA அண்ணா பல்கலைக்கழக கலந்தாய்வு (7.5% அரசு பள்ளி மாணவர்களுக்கு முழு கல்விக் கட்டணம் & விடுதிக் கட்டணம் முற்றிலும் இலவசம்!)',
        'B.E / B.Tech கணினி பொறியியல் அல்லது பாலிடெக்னிக் டிப்ளமோ வழியே நேரடி 2ஆம் ஆண்டு B.E',
        'நான் முதல்வன் (Naan Mudhalvan) வழியாக கோடிங் கற்றுக்கொண்டு ஐடி துறையில் வேலை பெறுதல்'
      ]),
      required_skills_en: JSON.stringify(['Problem Solving & Logic', 'Python / JavaScript / Java', 'Web & Mobile Development', 'Data Structures & Algorithms', 'Team Collaboration']),
      required_skills_ta: JSON.stringify(['பிரச்சனை தீர்க்கும் பகுப்பாய்வு திறன்', 'கோடிங் (Python, JavaScript, Java)', 'இணையதள & மொபைல் ஆப் உருவாக்கம்', 'அடிப்படை தரவு கட்டமைப்பு (DSA)', 'குழுப்பணி']),
      entrance_exams: JSON.stringify([
        { name: 'TNEA (Tamil Nadu Engineering Admissions)', description: 'Based on 12th Maths, Physics, Chemistry cut-off (200 marks)', link: 'https://tneaonline.org' },
        { name: 'JEE Main', description: 'For admission to NIT Trichy, IIIT Kancheepuram, and national institutes', link: 'https://jeemain.nta.nic.in' }
      ]),
      top_colleges_tn: JSON.stringify([
        { name: 'College of Engineering, Guindy (CEG - Anna University)', location: 'Chennai', type: 'Govt Premier' },
        { name: 'MIT Campus, Anna University', location: 'Chromepet, Chennai', type: 'Govt Premier' },
        { name: 'Government College of Technology (GCT)', location: 'Coimbatore', type: 'Govt Autonomous' },
        { name: 'Government College of Engineering (GCE)', location: 'Salem', type: 'Govt College' },
        { name: 'NIT Tiruchirappalli', location: 'Trichy', type: 'National Institute' }
      ]),
      salary_range: '₹35,000 - ₹1,50,000+ / month (Entry to Senior)',
      gov_7_5_applicable: 1,
      is_featured: 1,
      icon_name: 'Code'
    },
    {
      id: 'doctor-mbbs',
      title_en: 'Medical Doctor (MBBS) & Public Health Officer',
      title_ta: 'மருத்துவர் (MBBS) & பொது சுகாதார அலுவலர்',
      category: 'Healthcare',
      description_en: 'Diagnoses and treats illnesses, promotes community health, works in Primary Health Centres (PHC) and government hospitals to save lives.',
      description_ta: 'நோய்களை கண்டறிந்து சிகிச்சையளித்து, ஆரம்ப சுகாதார நிலையங்கள் (PHC) மற்றும் அரசு மருத்துவமனைகளில் மக்களுக்கு மருத்துவ சேவை வழங்குபவர்.',
      education_level_required: 'MBBS (5.5 Years including CRRI internship)',
      pathway_steps_en: JSON.stringify([
        'Complete 10th with high marks in Science',
        'Choose 12th Bio-Maths or Pure Science (Physics, Chemistry, Biology)',
        'Appear for NEET-UG examination with dedicated preparation (TN Govt free NEET coaching)',
        'Secure MBBS seat via TN DME Counseling under 7.5% Govt School Horizontal Quota (100% Free Education & Hostel)',
        'Complete 4.5 years MBBS + 1 year Compulsory Rotatory Residential Internship (CRRI)',
        'Register with Tamil Nadu Medical Council and join TN MRB (Medical Services Recruitment Board)'
      ]),
      pathway_steps_ta: JSON.stringify([
        '10ஆம் வகுப்பில் அறிவியலில் சிறந்த மதிப்பெண்',
        '12ஆம் வகுப்பில் உயிரியல்-கணிதம் அல்லது தூய அறிவியல் பிரிவு',
        'நீட் (NEET-UG) தேர்வெழுதுதல் (தமிழ்நாடு அரசு இலவச நீட் பயிற்சி வகுப்புகளை பயன்படுத்தலாம்)',
        '7.5% அரசு பள்ளி கிடைமட்ட இடஒதுக்கீட்டின் கீழ் கட்டணமின்றி அரசு மருத்துவக் கல்லூரியில் MBBS இடம் பெறுதல்',
        '4.5 ஆண்டுகள் படிப்பு + 1 ஆண்டு பயிற்சி மருத்துவர் (CRRI) முடித்தல்',
        'தமிழ்நாடு மருத்துவக் கவுன்சிலில் பதிவு செய்து அரசு மருத்துவமனைகளில் மருத்துவராகப் பணியாற்றுதல்'
      ]),
      required_skills_en: JSON.stringify(['Clinical Knowledge', 'Patient Empathy', 'Emergency Decision Making', 'Communication in Tamil & English', 'Dedication to Community']),
      required_skills_ta: JSON.stringify(['மருத்துவ நோய் கண்டறிதல்', 'நோயாளிகளிடம் கனிவு மற்றும் இரக்கம்', 'அவசர சிகிச்சை முடிவெடுத்தல்', 'தமிழ் & ஆங்கில தொடர்பு திறன்', 'சமூக சேவை ஆர்வம்']),
      entrance_exams: JSON.stringify([
        { name: 'NEET-UG', description: 'National Eligibility cum Entrance Test (Mandatory for MBBS/BDS/BSMS)', link: 'https://neet.nta.nic.in' },
        { name: 'TN Medical Selection Counseling', description: 'State quota seats with 7.5% reservation for TN Govt school students', link: 'https://tnmedicalselection.net' }
      ]),
      top_colleges_tn: JSON.stringify([
        { name: 'Madras Medical College (MMC)', location: 'Chennai', type: 'Govt Premier (Est. 1835)' },
        { name: 'Stanley Medical College', location: 'Chennai', type: 'Govt Premier' },
        { name: 'Madurai Medical College', location: 'Madurai', type: 'Govt Medical College' },
        { name: 'Coimbatore Medical College', location: 'Coimbatore', type: 'Govt Medical College' },
        { name: 'KAP Viswanatham Govt Medical College', location: 'Trichy', type: 'Govt Medical College' }
      ]),
      salary_range: '₹56,100 - ₹1,77,500 / month (MRB Assistant Surgeon)',
      gov_7_5_applicable: 1,
      is_featured: 1,
      icon_name: 'HeartPulse'
    },
    {
      id: 'tnpsc-group4-vao',
      title_en: 'Village Administrative Officer (VAO) / TNPSC Group 4',
      title_ta: 'கிராம நிர்வாக அலுவலர் (VAO) & TNPSC குரூப் 4',
      category: 'Government & Defence',
      description_en: 'The administrative backbone of Tamil Nadu revenue villages, managing land records, issuing community/income certificates, and maintaining village law and order.',
      description_ta: 'தமிழ்நாட்டின் கிராம நிர்வாகத்தின் தூண்; நில ஆவணங்கள் மேலாண்மை, சாதி/வருமான சான்றிதழ் ஆய்வு, கிராம நலத்திட்டங்கள் மற்றும் அமைதியை நிலைநாட்டுபவர்.',
      education_level_required: '10th Standard Pass (SSLC)',
      pathway_steps_en: JSON.stringify([
        'Pass 10th Standard (SSLC) with Tamil as a subject',
        'Prepare for TNPSC Group 4 Examination (General Tamil + General Studies + Aptitude)',
        'Attain age of 21 years (for VAO) or 18 years (for Junior Assistant / Typist)',
        'Score high marks in the single written exam conducted across Tamil Nadu',
        'Participate in TNPSC Certificate Verification & Counseling to select posting district'
      ]),
      pathway_steps_ta: JSON.stringify([
        '10ஆம் வகுப்பு (SSLC) தேர்ச்சி பெற்றிருத்தல் (தமிழில் தேர்ச்சி அவசியம்)',
        'TNPSC குரூப் 4 தேர்வுக்கு தயாராகுதல் (பொதுத்தமிழ் 100 வினாக்கள் + பொது அறிவு 75 வினாக்கள் + கணிதம் 25 வினாக்கள்)',
        'VAO பதவிக்கு 21 வயது, இளநிலை உதவியாளர்/தட்டச்சர் பதவிக்கு 18 வயது பூர்த்தி',
        'எழுத்துத் தேர்வில் அதிக மதிப்பெண் பெற்று தரவரிசை பட்டியலில் இடம் பெறுதல்',
        'TNPSC கலந்தாய்வில் பங்கேற்று விரும்பிய மாவட்டம் மற்றும் துறையை தேர்வு செய்தல்'
      ]),
      required_skills_en: JSON.stringify(['General Tamil Grammar & Literature', 'Tamil Nadu History & Culture', 'Mental Ability & Math', 'Public Communication', 'Tamil Revenue Administration']),
      required_skills_ta: JSON.stringify(['பொதுத்தமிழ் இலக்கணம் மற்றும் இலக்கியம்', 'தமிழ்நாட்டு வரலாறு மற்றும் திருக்குறள் அறிவு', 'கணிதம் மற்றும் அறிவுக்கூர்மை', 'பொதுமக்கள் சேவை திறன்', 'வருவாய்த்துறை விதிகள்']),
      entrance_exams: JSON.stringify([
        { name: 'TNPSC Group 4 & VAO Exam', description: 'Annual recruitment exam for over 7,000+ posts based on 10th standard syllabus', link: 'https://tnpsc.gov.in' }
      ]),
      top_colleges_tn: JSON.stringify([
        { name: 'Direct after 10th Standard', location: 'All Districts', type: 'No College Degree Required' },
        { name: 'Govt Arts & Science Colleges', location: 'District HQs', type: 'For higher degree while in service' }
      ]),
      salary_range: '₹19,500 - ₹62,000 / month (Pay Level 8) + Govt Allowances',
      gov_7_5_applicable: 0,
      is_featured: 1,
      icon_name: 'ShieldCheck'
    },
    {
      id: 'veterinary-doctor',
      title_en: 'Veterinary Surgeon (B.V.Sc & A.H)',
      title_ta: 'கால்நடை மருத்துவர் (Veterinary Surgeon)',
      category: 'Agriculture & Allied',
      description_en: 'Treats cattle, goats, poultry, and domestic pets, runs vaccination drives, promotes livestock breeding and dairy development in rural Tamil Nadu.',
      description_ta: 'மாடுகள், ஆடுகள், கோழிகள் மற்றும் வீட்டு விலங்குகளுக்கு சிகிச்சை அளித்து, பால்வளம் மற்றும் கால்நடை பராமரிப்பில் கிராமப்புற மக்களுக்கு உதவும் மருத்துவர்.',
      education_level_required: 'B.V.Sc & A.H (5.5 Years via TANUVAS)',
      pathway_steps_en: JSON.stringify([
        'Complete 10th standard with strong Science marks',
        'Choose 12th Bio-Maths or Pure Science (Physics, Chemistry, Biology)',
        'Apply for TANUVAS Counseling (7.5% Govt School reservation applies with full fee waiver!)',
        'Complete 5.5 years B.V.Sc & A.H at Madras Veterinary College, Namakkal, Tirunelveli, or Orathanadu',
        'Join Tamil Nadu Animal Husbandry Department as Veterinary Assistant Surgeon via TNPSC'
      ]),
      pathway_steps_ta: JSON.stringify([
        '10ஆம் வகுப்பில் அறிவியலில் தேர்ச்சி',
        '12ஆம் வகுப்பில் உயிரியல்-கணிதம் அல்லது தூய அறிவியல் பிரிவு தேர்வு',
        'TANUVAS ஒற்றை சாளர கலந்தாய்வு விண்ணப்பம் (7.5% அரசு பள்ளி இடஒதுக்கீடு மூலம் இலவச கல்வி)',
        '5.5 வருட B.V.Sc & A.H கால்நடை மருத்துவ படிப்பு முடித்தல்',
        'TNPSC தேர்வு வழியாக தமிழ்நாடு கால்நடை பராமரிப்புத் துறையில் உதவி அறுவை சிகிச்சை நிபுணராகப் பணி'
      ]),
      required_skills_en: JSON.stringify(['Animal Healthcare & Surgery', 'Livestock Nutrition', 'Vaccination Management', 'Farmer Counseling', 'Dairy Science']),
      required_skills_ta: JSON.stringify(['கால்நடை சிகிச்சை மற்றும் அறுவை சிகிச்சை', 'தீவன மேலாண்மை', 'தடுப்பூசி செலுத்துதல்', 'விவசாயிகளுடன் ஆலோசனை', 'பால்வள அறிவியல்']),
      entrance_exams: JSON.stringify([
        { name: 'TANUVAS Undergraduate Admission', description: 'Based on 12th standard cut-off marks with 7.5% govt school reservation', link: 'https://tanuvas.ac.in' },
        { name: 'TNPSC Veterinary Assistant Surgeon Exam', description: 'Direct government officer appointment', link: 'https://tnpsc.gov.in' }
      ]),
      top_colleges_tn: JSON.stringify([
        { name: 'Madras Veterinary College (MVC - TANUVAS)', location: 'Vepery, Chennai', type: 'Oldest Veterinary College in Asia' },
        { name: 'Veterinary College and Research Institute', location: 'Namakkal', type: 'Govt Constituent College' },
        { name: 'Veterinary College and Research Institute', location: 'Tirunelveli', type: 'Govt Constituent College' },
        { name: 'Veterinary College and Research Institute', location: 'Orathanadu, Thanjavur', type: 'Govt Constituent College' }
      ]),
      salary_range: '₹56,100 - ₹1,77,500 / month (Pay Level 22)',
      gov_7_5_applicable: 1,
      is_featured: 1,
      icon_name: 'PawPrint'
    },
    {
      id: 'school-teacher-bt-pg',
      title_en: 'Government School Teacher (BT & PG Assistant)',
      title_ta: 'அரசு பள்ளி ஆசிரியர் (பட்டதாரி & முதுகலை ஆசிரியர்)',
      category: 'Education',
      description_en: 'Educates future generations in Tamil Nadu government high schools and higher secondary schools, igniting scientific temper and social awareness.',
      description_ta: 'தமிழ்நாடு அரசு உயர்நிலை மற்றும் மேல்நிலைப் பள்ளிகளில் மாணவர்களுக்கு கல்வி கற்பித்து, எதிர்கால சமுதாயத்தை உருவாக்கும் உன்னத பணி.',
      education_level_required: 'Bachelor / Master Degree + B.Ed + TNTET / TRB',
      pathway_steps_en: JSON.stringify([
        'Complete 10th and 12th standard with passion for your favorite subject (Tamil, English, Maths, Science, Social)',
        'Complete B.A / B.Sc in the relevant subject in a Government Arts & Science College',
        'Complete 2-year B.Ed (Bachelor of Education) degree',
        'Appear for Tamil Nadu Teacher Eligibility Test (TNTET Paper 2 for Classes 6-8) or TRB PG Assistant Exam (for Classes 11-12 with M.A/M.Sc + B.Ed)',
        'Get recruited through TRB (Teachers Recruitment Board) into Tamil Nadu School Education Department'
      ]),
      pathway_steps_ta: JSON.stringify([
        '10 மற்றும் 12ஆம் வகுப்பில் விருப்பமான பாடத்தில் சிறந்த தேர்ச்சி (தமிழ், கணிதம், இயற்பியல், வேதியியல், வரலாறு போன்றவை)',
        'அரசு கலை & அறிவியல் கல்லூரியில் இளங்கலை B.A அல்லது B.Sc பட்டம் பெறுதல்',
        '2 வருட B.Ed (கல்வியியல் பட்டம்) முடித்தல்',
        'TNTET (ஆசிரியர் தகுதித் தேர்வு) அல்லது TRB முதுகலை ஆசிரியர் தேர்வில் வெற்றி பெறுதல்',
        'தமிழ்நாடு ஆசிரியர் தேர்வு வாரியம் (TRB) மூலம் அரசுப் பள்ளியில் பணியில் சேருதல்'
      ]),
      required_skills_en: JSON.stringify(['Subject Mastery', 'Student Psychology & Mentorship', 'Classroom Engagement', 'Tamil & English Fluency', 'Inclusive Teaching']),
      required_skills_ta: JSON.stringify(['பாட அறிவு', 'மாணவர் உளவியல் மற்றும் வழிகாட்டுதல்', 'வகுப்பறை கற்பித்தல் திறன்', 'மொழி ஆளுமை', 'பரிவு மற்றும் ஊக்கமளித்தல்']),
      entrance_exams: JSON.stringify([
        { name: 'TNTET (Tamil Nadu Teacher Eligibility Test)', description: 'Mandatory for Class 1 to 8 teachers conducted by TRB', link: 'https://trb.tn.gov.in' },
        { name: 'TRB PG Assistant Direct Recruitment', description: 'For Higher Secondary teachers in Govt Schools', link: 'https://trb.tn.gov.in' }
      ]),
      top_colleges_tn: JSON.stringify([
        { name: 'Presidency College', location: 'Chennai', type: 'Govt Autonomous Premier' },
        { name: 'Lady Doak College / Madura College', location: 'Madurai', type: 'Govt Aided' },
        { name: 'Govt College of Education for Women', location: 'Coimbatore', type: 'Govt B.Ed College' },
        { name: 'Tamil Nadu Teachers Education University (TNTEU)', location: 'Chennai', type: 'State University' }
      ]),
      salary_range: '₹36,400 - ₹1,15,700 / month (Pay Level 16/18)',
      gov_7_5_applicable: 0,
      is_featured: 0,
      icon_name: 'GraduationCap'
    },
    {
      id: 'siddha-doctor-bsms',
      title_en: 'Siddha Medical Doctor (BSMS)',
      title_ta: 'சித்த மருத்துவர் (BSMS - பாரம்பரிய தமிழ் மருத்துவம்)',
      category: 'Healthcare',
      description_en: 'Practices traditional Tamil Siddha medicine, treating chronic and lifestyle diseases using herbal formulations, dietetics, and holistic healthcare.',
      description_ta: 'பண்டைய தமிழ் சித்த மருத்துவ முறையின் மூலம் மூலிகைகள், இயற்கை உணவுகள் மற்றும் யோகா வழியாக நோய்களை குணப்படுத்தும் மருத்துவர்.',
      education_level_required: 'BSMS (Bachelor of Siddha Medicine and Surgery - 5.5 Years)',
      pathway_steps_en: JSON.stringify([
        'Pass 10th and 12th Bio-Maths or Pure Science with Tamil language proficiency',
        'Qualify in NEET-UG examination',
        'Apply for AYUSH Counseling in Tamil Nadu (7.5% Govt School reservation applies with fee waiver)',
        'Complete 4.5 years BSMS course + 1 year internship at Govt Siddha Medical College Palayamkottai or Chennai',
        'Register with Tamil Nadu Siddha Medical Council and practice or join Govt PHCs via MRB'
      ]),
      pathway_steps_ta: JSON.stringify([
        '10 மற்றும் 12ஆம் வகுப்பில் உயிரியல் பிரிவில் தேர்ச்சி (தமிழ் மொழி அறிவு கட்டாயம்)',
        'நீட் (NEET-UG) தேர்வில் தகுதி பெறுதல்',
        'தமிழ்நாடு AYUSH கலந்தாய்வில் விண்ணப்பித்தல் (7.5% அரசு பள்ளி இடஒதுக்கீடு பொருந்தும்)',
        '4.5 ஆண்டுகள் BSMS படிப்பு + 1 ஆண்டு பயிற்சி மருத்துவம் முடித்தல் (பாளையங்கோட்டை அல்லது சென்னை அரசு சித்த மருத்துவக் கல்லூரி)',
        'தமிழ்நாடு சித்த மருத்துவக் கவுன்சிலில் பதிவு செய்து அரசு ஆரம்ப சுகாதார நிலையங்களில் சித்த மருத்துவராகப் பணி'
      ]),
      required_skills_en: JSON.stringify(['Siddha Materia Medica (Gunapadam)', 'Pulse Diagnosis (Naadi)', 'Herbal Formulation', 'Diet Therapy & Varmam', 'Patient Counseling']),
      required_skills_ta: JSON.stringify(['குணபாடம் (மூலிகை அறிவியல்)', 'நாடி பரிசோதனை முறை', 'சித்த மருந்து செய்முறை', 'வர்ம மருத்துவம் மற்றும் உணவு முறை', 'நோயாளிகள் ஆலோசனை']),
      entrance_exams: JSON.stringify([
        { name: 'NEET-UG for AYUSH', description: 'National exam for Siddha, Ayurveda, Homeopathy admissions', link: 'https://neet.nta.nic.in' }
      ]),
      top_colleges_tn: JSON.stringify([
        { name: 'Government Siddha Medical College', location: 'Palayamkottai, Tirunelveli', type: 'Heritage Govt Premier (Est. 1964)' },
        { name: 'National Institute of Siddha (NIS)', location: 'Tambaram, Chennai', type: 'Central Premier Institute' },
        { name: 'Government Siddha Medical College', location: 'Arumbakkam, Chennai', type: 'Govt Medical College' }
      ]),
      salary_range: '₹56,100 - ₹1,77,500 / month (MRB Assistant Medical Officer)',
      gov_7_5_applicable: 1,
      is_featured: 0,
      icon_name: 'Leaf'
    },
    {
      id: 'sub-inspector-police',
      title_en: 'Sub-Inspector of Police (Taluk / Armed Reserve)',
      title_ta: 'காவல் உதவி ஆய்வாளர் (Sub-Inspector of Police - TNUSRB)',
      category: 'Government & Defence',
      description_en: 'Investigates crimes, maintains law & order, ensures public safety, and leads police stations across Tamil Nadu districts.',
      description_ta: 'குற்றங்களை புலனாய்வு செய்தல், சட்ட ஒழுங்கை பாதுகாத்தல், மகளிர் மற்றும் பொதுமக்களுக்கு பாதுகாப்பு அளித்து காவல் நிலையங்களை வழிநடத்துபவர்.',
      education_level_required: 'Any Bachelor Degree (B.A / B.Sc / B.Com / B.E)',
      pathway_steps_en: JSON.stringify([
        'Pass 10th and 12th standard',
        'Complete any 3-year or 4-year degree from a recognized university in Tamil Nadu',
        'Meet physical standards (Height: 170cm for Men OC/BC/MBC, 167cm SC/ST; 159cm for Women OC/BC/MBC, 157cm SC/ST)',
        'Clear TNUSRB SI Examination: Written Exam (Tamil Eligibility + General Knowledge & Psychology)',
        'Pass Physical Measurement Test (PMT), Endurance Test (1500m in 7 mins), and Physical Efficiency Test (Rope climbing, Long jump, 100m sprint)',
        'Clear Viva-Voce and complete 1-year training at Tamil Nadu Police Academy, Oonamanchery, Chennai'
      ]),
      pathway_steps_ta: JSON.stringify([
        '10 மற்றும் 12ஆம் வகுப்பு தேர்ச்சி',
        'ஏதேனும் ஒரு இளங்கலை பட்டம் (Degree) முடித்தல்',
        'உடற்தகுதி வரம்புகளை பூர்த்தி செய்தல் (ஆண்கள் மற்றும் பெண்களுக்கு தனித்தனி உயரம் மற்றும் மார்பளவு விதிகள்)',
        'TNUSRB SI எழுத்துத் தேர்வில் தேர்ச்சி (தமிழ் மொழி தகுதித் தேர்வு + பொது அறிவு மற்றும் உளவியல் தேர்வு)',
        'உடல்திறன் போட்டிகளில் (கயிறு ஏறுதல், நீளம் தாண்டுதல், ஓட்டம்) தேர்ச்சி பெறுதல்',
        'நேர்காணல் முடித்து வண்டலூர் தமிழ்நாடு காவல் உயர் பயிற்சி மையத்தில் 1 வருட பயிற்சி பெற்று காவல் நிலைய பொறுப்பு பெறுதல்'
      ]),
      required_skills_en: JSON.stringify(['Physical Stamina & Agility', 'Tamil Nadu Police Acts & CrPC', 'Psychological Investigation', 'Public Crowd Control', 'Integrity & Leadership']),
      required_skills_ta: JSON.stringify(['உடற்தகுதி மற்றும் மன உறுதி', 'காவல்துறை சட்டங்கள் மற்றும் குற்றவியல் நடைமுறை சட்டம்', 'புலனாய்வு உளவியல் திறன்', 'பொதுமக்கள் கூட்ட மேலாண்மை', 'நேர்மை மற்றும் தலைமைப்பண்பு']),
      entrance_exams: JSON.stringify([
        { name: 'TNUSRB Sub-Inspector Recruitment Exam', description: 'Conducted periodically by Tamil Nadu Uniformed Services Recruitment Board', link: 'https://tnusrb.tn.gov.in' }
      ]),
      top_colleges_tn: JSON.stringify([
        { name: 'Any Recognized Degree College', location: 'Tamil Nadu', type: 'Govt Arts / Science / Engineering' },
        { name: 'Tamil Nadu Police Academy', location: 'Oonamanchery, Chennai', type: 'Officer Induction Academy' }
      ]),
      salary_range: '₹36,900 - ₹1,16,600 / month (Pay Level 13) + Special Allowances',
      gov_7_5_applicable: 0,
      is_featured: 1,
      icon_name: 'Shield'
    },
    {
      id: 'chartered-accountant-ca',
      title_en: 'Chartered Accountant (CA)',
      title_ta: 'பட்டயக் கணக்காளர் (Chartered Accountant - CA)',
      category: 'Commerce & Finance',
      description_en: 'Audits corporate finances, manages tax compliance, advises on investments and financial strategies for major industries and businesses.',
      description_ta: 'நிறுவனங்களின் வரவு-செலவு கணக்குகளை தணிக்கை செய்தல் (Auditing), ஜிஎஸ்டி மற்றும் வருமான வரி ஆலோசனை, முதலீட்டு வழிகாட்டுதல் வழங்கும் நிதி நிபுணர்.',
      education_level_required: '12th Pass -> CA Foundation -> Inter -> Articleship -> Final',
      pathway_steps_en: JSON.stringify([
        'Complete 10th standard with strong arithmetic skills',
        'Choose 12th Commerce with Accountancy, Business Maths / Economics',
        'Register with ICAI for CA Foundation exam after 12th standard',
        'Clear CA Foundation -> Register and clear CA Intermediate',
        'Complete 2 years of practical Articleship training under a practicing CA',
        'Clear CA Final examination and become an Associate Member of ICAI'
      ]),
      pathway_steps_ta: JSON.stringify([
        '10ஆம் வகுப்பில் கணிதத்தில் நல்ல தேர்ச்சி',
        '12ஆம் வகுப்பில் வணிகவியல், கணக்குப்பதிவியல் (Accountancy) பிரிவு தேர்வு',
        '12ஆம் வகுப்பு முடிந்தவுடன் இந்திய பட்டயக் கணக்காளர் கழகத்தில் (ICAI) CA Foundation தேர்வுக்கு பதிவு',
        'CA Foundation தேர்ச்சி -> CA Intermediate படிப்பு முடித்தல்',
        '2 ஆண்டுகள் பட்டய கணக்காளர் கீழ் நேரடி பயிற்சி (Articleship)',
        'CA Final தேர்வில் வெற்றி பெற்று ICAI உறுப்பினராகி கைநிறைய வருமானம் ஈட்டுதல்'
      ]),
      required_skills_en: JSON.stringify(['Financial Accounting', 'Auditing & Assurance', 'Indian Tax Laws (Income Tax & GST)', 'Corporate Law', 'Analytical Thinking']),
      required_skills_ta: JSON.stringify(['நிதி கணக்கியல்', 'கணக்கு தணிக்கை (Auditing)', 'ஜிஎஸ்டி மற்றும் வருமான வரி சட்டங்கள்', 'நிறுவன சட்ட விதிகள்', 'கூர்மையான நிதி பகுப்பாய்வு']),
      entrance_exams: JSON.stringify([
        { name: 'CA Foundation Exam', description: 'National exam held twice a year by ICAI for 12th pass students', link: 'https://icai.org' }
      ]),
      top_colleges_tn: JSON.stringify([
        { name: 'ICAI Southern India Regional Council (SIRC)', location: 'Nungambakkam, Chennai', type: 'Statutory Professional Institute' },
        { name: 'Loyola College (Autonomous)', location: 'Chennai', type: 'Govt Aided Commerce College' },
        { name: 'Presidency College', location: 'Chennai', type: 'Govt Autonomous College' }
      ]),
      salary_range: '₹60,000 - ₹2,50,000+ / month (High Earning Potential)',
      gov_7_5_applicable: 0,
      is_featured: 0,
      icon_name: 'Calculator'
    },
    {
      id: 'iti-polytechnic-electrician',
      title_en: 'Industrial Electrician & Solar Technician (ITI / Diploma)',
      title_ta: 'தொழில்துறை மின் பணியாளர் & சோலார் தொழில்நுட்பவியலாளர் (ITI / Diploma)',
      category: 'Vocational & ITI',
      description_en: 'Installs, maintains, and repairs industrial machinery, electrical panels, high-voltage transformers, and renewable solar energy grids across TN industrial corridors.',
      description_ta: 'தொழிற்சாலைகள், மின்சார டிரான்ஸ்பார்மர்கள் மற்றும் சூரிய ஒளி (Solar) அமைப்புகளை நிறுவி பழுதுநீக்கும் திறன்மிக்க தொழில்நுட்ப நிபுணர்.',
      education_level_required: '10th Pass -> 2-Year ITI Electrician or 3-Year Diploma EEE',
      pathway_steps_en: JSON.stringify([
        'Pass 10th Standard (SSLC) with Science and Maths',
        'Apply for Tamil Nadu Govt ITI admissions (free tools, free uniform, monthly stipend under Naan Mudhalvan)',
        'Complete 2-year National Trade Certificate (NTC) in Electrician Trade (or 3-year Polytechnic Diploma in Electrical Engineering)',
        'Undergo National Apprenticeship Certificate (NAC) training in TANGEDCO / BHEL / Chennai Auto corridor',
        'Obtain Electrical ‘B’ or ‘C’ Wireman / Supervisor License and work in industry or start electrical contracting business'
      ]),
      pathway_steps_ta: JSON.stringify([
        '10ஆம் வகுப்பு தேர்ச்சி (SSLC)',
        'தமிழ்நாடு அரசு தொழிற்பயிற்சி நிலையங்களில் (Govt ITI) இலவச சேர்க்கை (இலவச சீருடை, லேப்டாப், மாதாந்திர உதவித்தொகை வழங்கப்படுகிறது)',
        '2 வருட எலக்ட்ரீசியன் தொழில்பயிற்சி (அல்லது பாலிடெக்னிக் டிப்ளமோ EEE)',
        'TANGEDCO (மின்வாரியம்) அல்லது ஆட்டோமொபைல் தொழிற்சாலைகளில் அப்ரண்டிஸ் பயிற்சி',
        'மின்சார மேற்பார்வையாளர் (Wireman License) உரிமம் பெற்று அரசு/தனியார் வேலை அல்லது சொந்த தொழில் தொடங்குதல்'
      ]),
      required_skills_en: JSON.stringify(['Circuit Diagnostics', 'Three-Phase Wiring', 'PLC & Industrial Automation', 'Solar Rooftop Installation', 'Safety & First Aid Protocols']),
      required_skills_ta: JSON.stringify(['மின்சுற்று பழுதுபார்த்தல்', 'திரீ-பேஸ் மின் வயரிங்', 'தொழில்துறை மோட்டார் கட்டுப்பாடு', 'சூரிய ஒளி சோலார் நிறுவுதல்', 'மின் பாதுகாப்பு விதிகள்']),
      entrance_exams: JSON.stringify([
        { name: 'Tamil Nadu Govt ITI Counseling', description: 'Merit-based admission after 10th standard', link: 'https://skilltraining.tn.gov.in' },
        { name: 'Directorate of Technical Education (DOTE) Diploma', description: 'Polytechnic admission', link: 'https://dote.tn.gov.in' }
      ]),
      top_colleges_tn: JSON.stringify([
        { name: 'Government ITI Guindy', location: 'Chennai', type: 'Govt ITI Premier' },
        { name: 'Government ITI Madurai', location: 'Madurai', type: 'Govt Model ITI' },
        { name: 'Central Polytechnic College (CPT)', location: 'Taramani, Chennai', type: 'Govt Polytechnic' },
        { name: 'Govt Polytechnic College', location: 'Coimbatore', type: 'Govt Polytechnic' }
      ]),
      salary_range: '₹18,000 - ₹50,000 / month (Immediate Job Readiness)',
      gov_7_5_applicable: 0,
      is_featured: 0,
      icon_name: 'Zap'
    },
    {
      id: 'advocate-lawyer',
      title_en: 'Legal Advocate & Civil Judge Aspirant (LL.B / B.A. LL.B)',
      title_ta: 'வழக்கறிஞர் & உரிமையியல் நீதிபதி (Advocate & Civil Judge)',
      category: 'Arts & Law',
      description_en: 'Represents citizens in district courts and High Court of Madras, protects human rights, provides legal aid to underprivileged communities, and aspires for Tamil Nadu Judicial Service.',
      description_ta: 'மக்களுக்கு சட்ட உதவி வழங்குதல், மனித உரிமைகளைப் பாதுகாத்தல், நீதிமன்றங்களில் வழக்காடுதல் மற்றும் மாவட்ட உரிமையியல் நீதிபதியாக உயரும் வாய்ப்பு.',
      education_level_required: '5-Year Integrated B.A. LL.B or 3-Year LL.B after degree',
      pathway_steps_en: JSON.stringify([
        'Complete 10th and 12th standard with good marks in humanities, commerce, or science',
        'Apply for Tamil Nadu Dr. Ambedkar Law University (TNDALU) counseling (7.5% Govt School reservation applies with full fee waiver!)',
        'Complete 5-year B.A. LL.B (Honours) at School of Excellence in Law or affiliated Govt Law Colleges (Madurai, Trichy, Coimbatore, Tirunelveli)',
        'Enroll with the Bar Council of Tamil Nadu & Puducherry and clear All India Bar Examination (AIBE)',
        'Practice under a senior advocate or appear for TNPSC Civil Judge Examination to become a Magistrate'
      ]),
      pathway_steps_ta: JSON.stringify([
        '10 மற்றும் 12ஆம் வகுப்பில் ஏதேனும் ஒரு பிரிவில் நல்ல மதிப்பெண்',
        'தமிழ்நாடு டாக்டர் அம்பேத்கர் சட்டப் பல்கலைக்கழக (TNDALU) கலந்தாய்வு (7.5% அரசு பள்ளி மாணவர்களுக்கு முழு கல்விக் கட்டணம் இலவசம்!)',
        '5 வருட B.A. LL.B சட்டப்படிப்பு அரசு சட்டக் கல்லூரிகளில் (சென்னை, மதுரை, திருச்சி, கோவை) படித்தல்',
        'தமிழ்நாடு & புதுச்சேரி பார் கவுன்சிலில் வழக்கறிஞராகப் பதிவு செய்து AIBE அகில இந்திய பார் தேர்வு எழுதுதல்',
        'மூத்த வழக்கறிஞரிடம் பயிற்சி பெறுதல் அல்லது TNPSC உரிமையியல் நீதிபதி (Civil Judge) தேர்வு எழுதி நீதிபதியாதல்'
      ]),
      required_skills_en: JSON.stringify(['Constitutional Law Knowledge', 'Argumentation & Public Speaking', 'Drafting in Tamil & English', 'Critical Analysis of Evidence', 'Ethics & Empathy']),
      required_skills_ta: JSON.stringify(['இந்திய அரசியலமைப்பு சட்ட அறிவு', 'வாதத்திறன் மற்றும் பேச்சாற்றல்', 'தமிழ் மற்றும் ஆங்கில மனு எழுதும் திறன்', 'சாட்சியங்கள் பகுப்பாய்வு', 'சட்ட ஒழுக்க நெறிகள்']),
      entrance_exams: JSON.stringify([
        { name: 'TNDALU Law Admissions', description: 'Cut-off based admission with 7.5% govt school reservation', link: 'https://tndalu.ac.in' },
        { name: 'CLAT (Common Law Admission Test)', description: 'For National Law Universities like TNNLU Trichy', link: 'https://consortiumofnlus.ac.in' },
        { name: 'TNPSC Civil Judge Exam', description: 'Recruitment for Subordinate Judicial Service', link: 'https://tnpsc.gov.in' }
      ]),
      top_colleges_tn: JSON.stringify([
        { name: 'School of Excellence in Law (SOEL - TNDALU)', location: 'Perungudi, Chennai', type: 'State Premier Law School' },
        { name: 'Tamil Nadu National Law University (TNNLU)', location: 'Navalur Kuttapattu, Trichy', type: 'National Law University' },
        { name: 'Madras Law College (Dr. Ambedkar Govt Law College)', location: 'Pattaraiperumbudur & Pudupakkam', type: 'Heritage Govt Law College' },
        { name: 'Government Law College', location: 'Madurai', type: 'Govt Law College' }
      ]),
      salary_range: '₹30,000 - ₹1,50,000+ / month (Civil Judge starting ~₹77,840)',
      gov_7_5_applicable: 1,
      is_featured: 0,
      icon_name: 'Scale'
    },
    {
      id: 'dairy-fisheries-technologist',
      title_en: 'Fisheries & Aquaculture Technologist (B.F.Sc)',
      title_ta: 'மீன்வளத் தொழில்நுட்ப நிபுணர் (B.F.Sc - TNJFU)',
      category: 'Agriculture & Allied',
      description_en: 'Manages marine fish harvest, shrimp hatcheries, inland cage culture, and seafood export quality standards along Tamil Nadu’s 1,076 km coastline.',
      description_ta: 'தமிழ்நாட்டின் 1,076 கி.மீ கடற்கரை மற்றும் உள்நாட்டு நீர்நிலைகளில் மீன்வளர்ப்பு, இறால் பண்ணைகள், மீன் பதப்படுத்துதல் மற்றும் ஏற்றுமதி தரக்கட்டுப்பாடு நிபுணர்.',
      education_level_required: 'B.F.Sc (Bachelor of Fisheries Science - 4 Years)',
      pathway_steps_en: JSON.stringify([
        'Pass 10th and 12th standard in Bio-Maths or Pure Science (Biology/Physics/Chemistry)',
        'Apply for TNJFU (Tamil Nadu Dr. J. Jayalalithaa Fisheries University) counseling (7.5% Govt School reservation applies with full fee waiver!)',
        'Complete 4-year B.F.Sc degree at Nagapattinam, Thoothukudi, or Ponneri',
        'Work as Fisheries Inspector via TNPSC, Hatchery Manager, or Seafood Processing Quality Manager',
        'Option to start your own Biofloc Fish Farm or Shrimp Hatchery with MSME & PMMSY subsidies'
      ]),
      pathway_steps_ta: JSON.stringify([
        '10 மற்றும் 12ஆம் வகுப்பில் உயிரியல் பிரிவில் தேர்ச்சி',
        'தமிழ்நாடு டாக்டர் ஜெ. ஜெயலலிதா மீன்வளப் பல்கலைக்கழக (TNJFU) கலந்தாய்வு (7.5% அரசு பள்ளி இடஒதுக்கீடு மூலம் இலவச படிப்பு)',
        '4 வருட B.F.Sc மீன்வள அறிவியல் படிப்பு முடித்தல் (நாகப்பட்டினம், தூத்துக்குடி, பொன்னேரி)',
        'TNPSC மீன்வள ஆய்வாளர் தேர்வில் வெற்றி பெறுதல் அல்லது மீன் ஏற்றுமதி நிறுவனங்களில் தரம் கட்டுப்பாடு மேலாளராகப் பணி',
        'பிரதமரின் மத்ஸ்ய சம்பதா யோஜனா (PMMSY) அரசு மானியத்துடன் சொந்த மீன் பண்ணை தொடங்குதல்'
      ]),
      required_skills_en: JSON.stringify(['Marine Biology & Aquaculture', 'Water Quality Monitoring', 'Hatchery Management', 'Seafood Export Standards (HACCP)', 'Fish Health & Disease Control']),
      required_skills_ta: JSON.stringify(['கடல்சார் உயிரியல் & மீன்வளர்ப்பு', 'நீர் தரம் பரிசோதனை', 'மீன் குஞ்சு பொரிப்பக மேலாண்மை', 'ஏற்றுமதி தரக்கட்டுப்பாடு', 'மீன் நோய் தடுப்பு']),
      entrance_exams: JSON.stringify([
        { name: 'TNJFU Single Window Admissions', description: 'Based on 12th cut-off marks with 7.5% govt school reservation', link: 'https://tnjfu.ac.in' },
        { name: 'TNPSC Fisheries Inspector Exam', description: 'Recruitment for Tamil Nadu Fisheries Subordinate Service', link: 'https://tnpsc.gov.in' }
      ]),
      top_colleges_tn: JSON.stringify([
        { name: 'Fisheries College and Research Institute (FCRI)', location: 'Thoothukudi', type: 'Govt Premier (Est. 1977)' },
        { name: 'TNJFU Nagapattinam Campus', location: 'Nagapattinam', type: 'University Headquarters' },
        { name: 'College of Fisheries Engineering', location: 'Nagapattinam', type: 'Govt Engineering' }
      ]),
      salary_range: '₹35,900 - ₹1,13,500 / month (Govt Pay Level 13)',
      gov_7_5_applicable: 1,
      is_featured: 0,
      icon_name: 'Fish'
    }
  ];

  for (const c of careersData) {
    insertCareer.run(
      c.id, c.title_en, c.title_ta, c.category, c.description_en, c.description_ta,
      c.education_level_required, c.pathway_steps_en, c.pathway_steps_ta,
      c.required_skills_en, c.required_skills_ta, c.entrance_exams, c.top_colleges_tn,
      c.salary_range, c.gov_7_5_applicable, c.is_featured, c.icon_name
    );
  }

  // 3. Seed Scholarships & Government Schemes
  const insertScholarship = db.prepare(`
    INSERT INTO scholarships (
      id, title_en, title_ta, provider, amount_en, amount_ta,
      eligibility_gender, eligibility_community, eligibility_school_type, eligibility_class,
      description_en, description_ta, application_portal, documents_required_en, documents_required_ta,
      deadline, is_featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const scholarshipsData = [
    {
      id: 'pudhumai-penn-scheme',
      title_en: 'Pudhumai Penn Scheme (Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme)',
      title_ta: 'புதுமைப் பெண் திட்டம் (மூவலூர் ராமாமிர்தம் அம்மையார் உயர்கல்வி உறுதித் திட்டம்)',
      provider: 'Government of Tamil Nadu',
      amount_en: '₹1,000 per month (₹12,000 per year) credited directly to bank account till degree completion',
      amount_ta: 'மாதம்தோறும் ₹1,000 (ஆண்டுக்கு ₹12,000) மாணவியின் வங்கிக் கணக்கில் நேரடியாக வரவு வைக்கப்படும்',
      eligibility_gender: 'female',
      eligibility_community: 'all',
      eligibility_school_type: 'Govt Schools Only',
      eligibility_class: 'Higher Education (Degree / Diploma / ITI)',
      description_en: 'To prevent early marriage and encourage girl students who studied in Classes 6 to 12 in Tamil Nadu Government schools to pursue higher education without financial hurdles.',
      description_ta: 'தமிழ்நாடு அரசுப் பள்ளிகளில் 6 முதல் 12ஆம் வகுப்பு வரை படித்து உயர்கல்வி (இளங்கலை பட்டம், டிப்ளமோ, ஐடிஐ) பயிலும் மாணவிகளுக்கு இடைநிற்றலைத் தடுத்து அவர்களின் முன்னேற்றத்திற்காக வழங்கப்படும் மாதாந்திர உதவித்தொகை.',
      application_portal: 'https://www.pudhumaipenn.tn.gov.in',
      documents_required_en: JSON.stringify(['Classes 6 to 12 Govt School Study Certificate / EMIS Number', 'College Bonafide Certificate / Admission Slip', 'Aadhaar Card copy', 'Bank Passbook copy (linked to Aadhaar)', 'Passport size photo']),
      documents_required_ta: JSON.stringify(['6 முதல் 12 வரை அரசுப் பள்ளியில் படித்ததற்கான சான்றிதழ் / EMIS எண்', 'கல்லூரி போனாஃபைடு சான்றிதழ் அல்லது சேர்க்கை ரசீது', 'ஆதார் அட்டை நகல்', 'ஆதாருடன் இணைக்கப்பட்ட வங்கிக் கணக்கு புத்தக நகல்', 'பாஸ்போர்ட் அளவு புகைப்படம்']),
      deadline: 'Ongoing every academic year through college Nodal Officer',
      is_featured: 1
    },
    {
      id: 'tamil-pudhalvan-scheme',
      title_en: 'Tamil Pudhalvan Scheme',
      title_ta: 'தமிழ்ப் புதல்வன் திட்டம்',
      provider: 'Government of Tamil Nadu',
      amount_en: '₹1,000 per month (₹12,000 per year) direct benefit transfer until completion of UG degree/diploma',
      amount_ta: 'மாதம்தோறும் ₹1,000 மாணவனின் வங்கிக் கணக்கில் நேரடியாக செலுத்தப்படுகிறது',
      eligibility_gender: 'male',
      eligibility_community: 'all',
      eligibility_school_type: 'Govt Schools Only',
      eligibility_class: 'Higher Education (Degree / Diploma / ITI)',
      description_en: 'Special welfare scheme for boy students who studied from Classes 6 to 12 in Tamil Nadu Government schools, providing monthly financial support for textbook purchase and educational needs.',
      description_ta: 'தமிழ்நாடு அரசுப் பள்ளிகளில் 6 முதல் 12ஆம் வகுப்பு வரை தமிழ் வழியில்/அரசுப் பள்ளியில் படித்து கல்லூரி, பாலிடெக்னிக், ஐடிஐ சேரும் மாணவர்களுக்கு உயர்கல்வி தேவைகளுக்காக வழங்கப்படும் மாதாந்திர உதவித்தொகை.',
      application_portal: 'https://tamilpudhalvan.tn.gov.in',
      documents_required_en: JSON.stringify(['Govt School Transfer Certificate (TC) or 6-12th Bonafide', 'College Identity Card / Admission Allotment', 'Aadhaar Card', 'Student Active Savings Bank Account linked to NPCI']),
      documents_required_ta: JSON.stringify(['6 முதல் 12 வரை அரசு பள்ளியில் படித்ததற்கான மாற்றுச் சான்றிதழ் (TC) அல்லது சான்று', 'கல்லூரி அடையாள அட்டை / சேர்க்கை ஆணை', 'ஆதார் அட்டை', 'NPCI இணைக்கப்பட்ட மாணவரின் வங்கிக் கணக்கு புத்தகம்']),
      deadline: 'Annual enrollment via College Department Nodal Desk',
      is_featured: 1
    },
    {
      id: 'gov-7-5-reservation-scheme',
      title_en: '7.5% Horizontal Reservation for Government School Students (Free Education & Hostel)',
      title_ta: 'அரசுப் பள்ளி மாணவர்களுக்கான 7.5% முன்னுரிமை இடஒதுக்கீடு (முழு இலவசக் கல்வி & விடுதி)',
      provider: 'Government of Tamil Nadu',
      amount_en: '100% Free Tuition Fee, Examination Fee, Hostel Charges, and Transport borne completely by the State Government',
      amount_ta: '100% கல்விக் கட்டணம், தேர்வுக் கட்டணம் மற்றும் விடுதிக் கட்டணம் முழுவதையும் தமிழ்நாடு அரசே முழுமையாக ஏற்கும்',
      eligibility_gender: 'all',
      eligibility_community: 'all',
      eligibility_school_type: 'Govt Schools Only',
      eligibility_class: 'Professional Courses (Medical, Engineering, Agriculture, Veterinary, Fisheries, Law)',
      description_en: 'Historic policy reserving 7.5% of seats on preferential basis in all government and private professional colleges for students who studied in TN Government schools from Class 6 to 12. Covers MBBS, BDS, B.E/B.Tech, B.Sc Agri, B.V.Sc, B.F.Sc, and B.A. LL.B.',
      description_ta: '6 முதல் 12ஆம் வகுப்பு வரை அரசுப் பள்ளிகளில் படித்த மாணவர்களுக்கு மருத்துவம், பொறியியல், வேளாண்மை, கால்நடை மருத்துவம், மீன்வளம் மற்றும் சட்டப் படிப்புகளில் 7.5% முன்னுரிமை இடங்கள் ஒதுக்கீடு செய்யப்படுகின்றன. சேர்க்கை பெறும் மாணவர்களின் எல்லாக் கட்டணங்களையும் அரசே செலுத்தும்.',
      application_portal: 'https://tneaonline.org | https://tnmedicalselection.net',
      documents_required_en: JSON.stringify(['Class 6 to 12th Continuous Govt School Study Certificate certified by Headmaster & BEO/DEO', '10th & 12th Marksheets', 'Community Certificate', 'Nativity Certificate of Tamil Nadu']),
      documents_required_ta: JSON.stringify(['தலைமை ஆசிரியர் & வட்டார கல்வி அலுவலர் (BEO/DEO) கையொப்பமிட்ட 6 முதல் 12 வரை அரசுப் பள்ளி படிப்புச் சான்றிதழ்', '10 மற்றும் 12ஆம் வகுப்பு மதிப்பெண் சான்றிதழ்கள்', 'சாதிச் சான்றிதழ்', 'இருப்பிடச் சான்றிதழ்']),
      deadline: 'During respective Single Window Counseling schedules (June - August)',
      is_featured: 1
    },
    {
      id: 'first-graduate-concession',
      title_en: 'First Graduate Tuition Fee Exemption Scheme',
      title_ta: 'முதல் தலைமுறை பட்டதாரி கல்விக் கட்டணச் சலுகை',
      provider: 'Government of Tamil Nadu',
      amount_en: 'Full Tuition Fee Concession (₹20,000 - ₹50,000 per year) for Professional Courses admitted via Single Window Counseling',
      amount_ta: 'ஒற்றைச் சாளர கலந்தாய்வு மூலம் சேரும் தொழில்முறை படிப்புகளுக்கு முழு கல்விக் கட்டண விலக்கு',
      eligibility_gender: 'all',
      eligibility_community: 'all',
      eligibility_school_type: 'All Schools',
      eligibility_class: 'Higher Education (B.E / B.Tech / Medical / Agri / Law)',
      description_en: 'Provides tuition fee waiver for students who are the first person in their family (neither parents nor siblings hold a graduate degree) to pursue a professional degree.',
      description_ta: 'குடும்பத்தில் முதல் நபராக பட்டப்படிப்பு பயிலும் மாணவர்களுக்கு (பெற்றோர் மற்றும் உடன் பிறந்தவர்கள் யாரும் பட்டம் பெற்றிருக்கக்கூடாது) அரசு வழங்கும் கல்விக் கட்டண விலக்கு.',
      application_portal: 'https://www.tnesevai.tn.gov.in',
      documents_required_en: JSON.stringify(['First Graduate Certificate issued by Tahsildar through e-Sevai', 'Family Ration Card / Smart Card', 'Parents and Siblings Educational Declaration Transfer Certificates']),
      documents_required_ta: JSON.stringify(['இ-சேவை மையம் மூலம் வட்டாட்சியர் வழங்கிய முதல் தலைமுறை பட்டதாரி சான்றிதழ்', 'குடும்ப ஸ்மார்ட் கார்டு (ரேஷன் அட்டை)', 'பெற்றோர் மற்றும் உடன் பிறந்தவர்களின் கல்வி மாற்றுச் சான்றிதழ்கள்']),
      deadline: 'Submit during counseling certificate verification',
      is_featured: 1
    },
    {
      id: 'nmms-scholarship',
      title_en: 'National Means-cum-Merit Scholarship (NMMS)',
      title_ta: 'தேசிய வருவாய் வழி மற்றும் திறன் படிப்புதவித் தொகைத் திட்டம் (NMMS)',
      provider: 'Ministry of Education & TN DGE',
      amount_en: '₹12,000 per year (₹1,000 per month) for 4 years from Class 9 to Class 12',
      amount_ta: '9ஆம் வகுப்பு முதல் 12ஆம் வகுப்பு வரை 4 ஆண்டுகளுக்கு ஆண்டுக்கு ₹12,000 (மாதம் ₹1,000)',
      eligibility_gender: 'all',
      eligibility_community: 'all',
      eligibility_school_type: 'Govt Schools Only',
      eligibility_class: 'Class 8 Students (Appearing for exam for 9-12 payout)',
      description_en: 'Awarded to meritorious students from economically weaker sections studying in Class 8 in TN Government and Govt-aided schools to arrest school dropouts at Class 8 and continue secondary education.',
      description_ta: '8ஆம் வகுப்பு பயிலும் அரசு மற்றும் அரசு உதவிபெறும் பள்ளி மாணவர்களுக்கான மாநில அளவிலான போட்டித் தேர்வு. இதில் தேர்ச்சி பெற்றால் 9 முதல் 12ஆம் வகுப்பு வரை மாதம் ₹1,000 உதவித்தொகை கிடைக்கும்.',
      application_portal: 'https://dge.tn.gov.in',
      documents_required_en: JSON.stringify(['Class 7 Marksheet with minimum 55% marks (50% for SC/ST)', 'Family Annual Income Certificate below ₹3,50,000', 'Aadhaar Card', 'Student Bank Account Details']),
      documents_required_ta: JSON.stringify(['7ஆம் வகுப்பில் குறைந்தபட்சம் 55% மதிப்பெண் சான்று', 'குடும்ப ஆண்டு வருமானம் ₹3,50,000-க்குள் உள்ளதற்கான வருமானச் சான்றிதழ்', 'ஆதார் அட்டை', 'மாணவரின் வங்கிக் கணக்கு புத்தகம்']),
      deadline: 'Registration in November - Exam in February every year',
      is_featured: 0
    },
    {
      id: 'post-matric-sc-st',
      title_en: 'Post-Matric Scholarship Scheme for SC / ST / SCA Students',
      title_ta: 'ஆதிதிராவிடர் மற்றும் பழங்குடியினர் போஸ்ட் மெட்ரிக் கல்வி உதவித்தொகை',
      provider: 'TN Adi Dravidar and Tribal Welfare Dept',
      amount_en: '100% Compulsory Non-Refundable Fees + Maintenance Allowance up to ₹13,500/yr for hostellers',
      amount_ta: '100% கல்வி கட்டணம் மற்றும் தங்கும் விடுதி மாணவர்களுக்கு பராமரிப்பு படியாக ஆண்டுக்கு ₹13,500 வரை',
      eligibility_gender: 'all',
      eligibility_community: 'SC/ST',
      eligibility_school_type: 'All Schools',
      eligibility_class: 'Post-Matric (Classes 11, 12, ITI, Polytechnic, UG, PG)',
      description_en: 'Financial assistance for SC, ST, and SC converted Christian students studying post-matriculation courses in recognized institutions to cover all mandatory fees.',
      description_ta: '11, 12ஆம் வகுப்பு, ஐடிஐ, பாலிடெக்னிக் மற்றும் கல்லூரி படிப்புகள் பயிலும் ஆதிதிராவிடர், பழங்குடியினர் மற்றும் கிறித்துவ மதத்திற்கு மாறிய ஆதிதிராவிட மாணவர்களுக்கான முழு கல்விக் கட்டண உதவி.',
      application_portal: 'https://adwscholarship.tn.gov.in',
      documents_required_en: JSON.stringify(['Community Certificate (Permanent card)', 'Income Certificate (Family income below ₹2.5 Lakhs per year)', 'Previous Year Marksheet', 'College Fee Structure', 'Aadhaar Seeded Bank Account']),
      documents_required_ta: JSON.stringify(['சாதிச் சான்றிதழ் (Community Certificate)', 'ஆண்டு வருமானச் சான்றிதழ் (₹2.5 லட்சத்திற்குள்)', 'முந்தைய ஆண்டு மதிப்பெண் சான்றிதழ்', 'கல்லூரி கட்டண விவரம்', 'ஆதாருடன் இணைக்கப்பட்ட வங்கிக் கணக்கு புத்தகம்']),
      deadline: 'September to November annually',
      is_featured: 0
    },
    {
      id: 'vidya-lakshmi-loan',
      title_en: 'Vidya Lakshmi Portal - Education Loan Scheme & Interest Subsidy (CSIS)',
      title_ta: 'வித்யா லக்ஷ்மி போர்டல் - குறைந்த வட்டி கல்விக் கடன் & முழு வட்டி மானியத் திட்டம்',
      provider: 'Ministry of Finance & IBA',
      amount_en: 'Loans up to ₹7.5 Lakhs without collateral security + 100% interest subsidy during study period for family income under ₹4.5 Lakhs',
      amount_ta: 'பிணையம் ஏதுமின்றி ₹7.5 லட்சம் வரை கல்விக் கடன் + படிப்பு காலத்தில் 100% வட்டி மானியம்',
      eligibility_gender: 'all',
      eligibility_community: 'all',
      eligibility_school_type: 'All Schools',
      eligibility_class: 'Higher Education (Technical & Professional Courses)',
      description_en: 'Single window electronic platform for students to apply for education loans across all nationalized banks with Central Sector Interest Subsidy (CSIS) during moratorium period.',
      description_ta: 'அனைத்து தேசியமயமாக்கப்பட்ட வங்கிகளிலும் கல்விக் கடன் பெற ஒரே இணையதளம். குடும்ப வருமானம் ₹4.5 லட்சத்திற்குள் இருந்தால் படிக்கும் காலம் வரை வட்டி முழுவதும் அரசே ஏற்கும்.',
      application_portal: 'https://www.vidyalakshmi.co.in',
      documents_required_en: JSON.stringify(['Admission Allotment Letter & College Fee Structure', '10th & 12th Marksheets', 'Income Certificate from Tahsildar', 'Applicant & Parent PAN Card and Aadhaar Card', '6 Months Bank Statement of Parent']),
      documents_required_ta: JSON.stringify(['கல்லூரி சேர்க்கை ஆணை மற்றும் கல்விக் கட்டண விவர பட்டியல்', '10 மற்றும் 12ஆம் வகுப்பு மதிப்பெண் தாள்கள்', 'வட்டாட்சியர் வழங்கிய வருமானச் சான்றிதழ்', 'மாணவர் மற்றும் பெற்றோர் பான் கார்டு, ஆதார் அட்டை', 'பெற்றோரின் 6 மாத வங்கி கணக்கு அறிக்கை']),
      deadline: 'Open throughout the year during college admissions',
      is_featured: 1
    }
  ];

  for (const s of scholarshipsData) {
    insertScholarship.run(
      s.id, s.title_en, s.title_ta, s.provider, s.amount_en, s.amount_ta,
      s.eligibility_gender, s.eligibility_community, s.eligibility_school_type, s.eligibility_class,
      s.description_en, s.description_ta, s.application_portal,
      s.documents_required_en, s.documents_required_ta, s.deadline, s.is_featured
    );
  }

  // 4. Seed Life Skills & Communication Modules
  const insertModule = db.prepare(`
    INSERT INTO life_skills_modules (
      id, category, title_en, title_ta, summary_en, summary_ta,
      content_markdown_en, content_markdown_ta, practical_tips_en, practical_tips_ta,
      quiz_data, video_url, audio_url, duration_mins, icon_name
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const modulesData = [
    {
      id: 'spoken-english-daily',
      category: 'Spoken English',
      title_en: 'Everyday Spoken English & Self-Introduction',
      title_ta: 'அன்றாட பேச்சு ஆங்கிலம் & சுய அறிமுகம்',
      summary_en: 'Master confident basic English conversations, greeting etiquette, classroom interactions, and introducing yourself fluently.',
      summary_ta: 'அச்சமின்றி எளிய ஆங்கிலத்தில் உரையாடுவது எப்படி? வாழ்த்துக்கள், வகுப்பறை ஆங்கிலம் மற்றும் உங்களை நம்பிக்கையுடன் அறிமுகப்படுத்தும் வழிகாட்டி.',
      content_markdown_en: `
### Key Conversational Phrases:
1. **Greetings & Politeness**:
   - "Good morning, Sir / Ma'am! How are you today?"
   - "Could you please explain that once more?"
   - "Thank you for giving me this opportunity."
2. **Self-Introduction Blueprint (The 4-Point Formula)**:
   - **Name & Origin**: "Hello everyone! I am Kavitha, from Madurai district."
   - **Schooling**: "I recently completed Class 12 from Govt Higher Secondary School, Melur."
   - **Passions & Hobbies**: "My favourite subject is Biology, and in my spare time, I enjoy gardening and reading Tamil literature."
   - **Career Goal**: "My dream is to become an Agricultural Officer and support rural farmers in Tamil Nadu."
3. **Overcoming Hesitation**:
   - Do not worry about grammatical perfection initially. Fluency comes from speaking aloud every day!
   - Practice reading English news headlines aloud for 5 minutes daily.
      `,
      content_markdown_ta: `
### முக்கியமான உரையாடல் வாக்கியங்கள்:
1. **மரியாதையான வாழ்த்துக்கள்**:
   - "Good morning, Sir / Ma'am!" (காலை வணக்கம் ஐயா / அம்மா!)
   - "Could you please explain that once more?" (இதை மீண்டும் ஒருமுறை விளக்க முடியுமா?)
   - "Thank you very much for your guidance." (உங்கள் வழிகாட்டலுக்கு மிக்க நன்றி.)
2. **4-படி சுய அறிமுக ஃபார்முலா**:
   - **பெயர் & ஊர்**: "Hello everyone! My name is [உங்கள் பெயர்], and I hail from [உங்கள் மாவட்டம்]."
   - **படிப்பு**: "I am studying Class 12 at Government Higher Secondary School."
   - **ஆர்வம்**: "I am deeply interested in Science and Public Service."
   - **இலக்கு**: "My aspiration is to become an officer and serve our society."
3. **தயக்கத்தை வெல்ல 3 வழிகள்**:
   - இலக்கணத் தவறைப் பற்றிக் கவலைப்படாமல் பேசத் தொடங்குங்கள்.
   - தினமும் 5 நிமிடங்கள் ஆங்கில உரைகளை சத்தமாக வாசித்து பழகவும்.
      `,
      practical_tips_en: JSON.stringify([
        'Practice in front of a mirror for 2 minutes every morning',
        'Pair up with a friend to speak only in English during lunch break',
        'Watch Kalvi TV English lessons and repeat each sentence aloud'
      ]),
      practical_tips_ta: JSON.stringify([
        'தினமும் காலையில் கண்ணாடி முன் நின்று 2 நிமிடங்கள் பேசிப் பார்க்கவும்',
        'நண்பருடன் சேர்ந்து தினமும் சில ஆங்கில வாக்கியங்களை பேசி பழகவும்',
        'கல்வி தொலைக்காட்சி ஆங்கில வகுப்புகளைக் கவனித்து சத்தமாக திருப்பிச் சொல்லவும்'
      ]),
      quiz_data: JSON.stringify([
        {
          question_en: 'Which phrase is most appropriate when entering an interview room or classroom?',
          question_ta: 'நேர்காணல் அறை அல்லது வகுப்பறைக்குள் நுழையும்போது எந்த வாக்கியம் சரியானது?',
          options_en: ['Hey, I am coming in', 'May I come in, Sir / Ma’am?', 'Open the door please', 'Can I sit now?'],
          options_ta: ['Hey, I am coming in', 'May I come in, Sir / Ma’am? (அனுமதி கோருதல்)', 'Open the door please', 'Can I sit now?'],
          correctIndex: 1,
          explanation_en: '"May I come in, Sir / Ma’am?" is the polite, professional standard.',
          explanation_ta: '"May I come in, Sir / Ma’am?" என்பது கண்ணியமான மற்றும் முறையான ஆங்கில வாக்கியம்.'
        },
        {
          question_en: 'What is the best way to handle making a grammatical mistake while speaking?',
          question_ta: 'பேசும்போது இலக்கணத் தவறு நேர்ந்தால் என்ன செய்ய வேண்டும்?',
          options_en: ['Stop speaking completely', 'Smile, politely correct yourself, and continue speaking', 'Start crying', 'Run away'],
          options_ta: ['பேசுவதை உடனடியாக நிறுத்திவிட வேண்டும்', 'புன்னகையுடன் சரிசெய்து தொடர்ந்து பேச வேண்டும்', 'அழ வேண்டும்', 'ஓடிவிட வேண்டும்'],
          correctIndex: 1,
          explanation_en: 'Confidence is key! Politely correct yourself and keep communicating.',
          explanation_ta: 'தவறுகள் இயல்பானவை! புன்னகையுடன் திருத்திக் கொண்டு தொடர்ந்து பேசுவதே சிறந்த தன்னம்பிக்கை.'
        }
      ]),
      video_url: 'https://www.youtube.com/watch?v=juKd26qkNAw',
      audio_url: '',
      duration_mins: 15,
      icon_name: 'MessageCircle'
    },
    {
      id: 'interview-mastery',
      category: 'Interview & Resume',
      title_en: 'Cracking College & Job Interviews',
      title_ta: 'கல்லூரி & வேலைவாய்ப்பு நேர்காணலில் வெற்றி பெறுவது எப்படி?',
      summary_en: 'Master interview body language, handle tricky questions with the STAR method, and make a lasting positive impression.',
      summary_ta: 'நேர்காணல் உடல்மொழி, பொதுவாக கேட்கப்படும் வினாக்களுக்கு பதிலளிக்கும் STAR முறை மற்றும் பயமின்றி நேர்காணலை எதிர்கொள்ளும் வழிகள்.',
      content_markdown_en: `
### What Interviewers Look For:
1. **Honesty & Integrity**: If you don’t know an answer, say politely: *"I am not certain about this right now, but I am eager to learn."*
2. **Body Language Rules**:
   - Firm handshake or polite traditional "Vanakkam / Good Morning".
   - Sit upright with shoulders relaxed. Avoid crossing arms.
   - Maintain natural eye contact with all panel members.
3. **The STAR Technique for Behavioural Questions**:
   - **S**ituation: Describe the background context.
   - **T**ask: What was the challenge you faced?
   - **A**ction: What concrete steps did you take?
   - **R**esult: What positive outcome did you achieve?
      `,
      content_markdown_ta: `
### நேர்காணலில் அதிகாரிகள் எதிர்பார்ப்பது என்ன?
1. **நேர்மை**: ஒரு கேள்விக்கான விடை தெரியாவிட்டால், *"மன்னிக்கவும் ஐயா, எனக்கு இந்த கேள்விக்கான துல்லியமான விடை இப்போது தெரியவில்லை, விரைவில் கற்றுக்கொள்கிறேன்"* என்று கண்ணியமாக கூறலாம்.
2. **உடல்மொழி (Body Language)**:
   - நேராக நிமிர்ந்து அமரவும். கைகளைக் கட்டிக்கொள்ளக் கூடாது.
   - நேர்காணல் செய்வோரின் கண்களைப் பார்த்து பேசவும் (Eye contact).
3. **STAR ஃபார்முலா மூலம் பதிலளித்தல்**:
   - **S**ituation (சூழ்நிலை): நடந்த சூழ்நிலையை விவரிக்கவும்.
   - **T**ask (சவால்): நீங்கள் எதிர்கொண்ட பணி அல்லது பிரச்சனை என்ன?
   - **A**ction (செயல்பாடு): நீங்கள் எடுத்த ஆக்கபூர்வமான நடவடிக்கை என்ன?
   - **R**esult (வெற்றி): அதன் மூலம் கிடைத்த சாதகமான முடிவு என்ன?
      `,
      practical_tips_en: JSON.stringify([
        'Wear neat, ironed formal attire',
        'Keep all certificates organized in a clean file folder in chronological order',
        'Arrive at the venue at least 20 minutes before schedule'
      ]),
      practical_tips_ta: JSON.stringify([
        'நேர்த்தியான தூய்மையான ஆடை அணியவும்',
        'அனைத்து அசல் சான்றிதழ்களையும் வரிசையாக ஒரு ஃபைலில் அடுக்கி வைக்கவும்',
        'நேர்காணல் நேரத்திற்கு 20 நிமிடங்கள் முன்னதாகவே செல்லவும்'
      ]),
      quiz_data: JSON.stringify([
        {
          question_en: 'When asked "Tell me about yourself", what should you focus on?',
          question_ta: '"உங்களைப் பற்றி சொல்லுங்கள்" என்று கேட்கும்போது எதற்கு முக்கியத்துவம் அளிக்க வேண்டும்?',
          options_en: ['Your favorite movies and songs only', 'Your education, skills, achievements, and career goal', 'Your family history for 15 minutes', 'Complaining about your village'],
          options_ta: ['திரைப்படங்கள் மற்றும் பாடல்கள் பற்றி மட்டுமே', 'படிப்பு, தனித்திறன்கள், சாதனைகள் மற்றும் எதிர்கால இலக்கு', 'குடும்ப வரலாற்றை 15 நிமிடங்கள் விவரிப்பது', 'கிராமத்தைப் பற்றி குறை கூறுவது'],
          correctIndex: 1,
          explanation_en: 'Keep it professional: summarize your education, skills, and goals relevant to the opportunity.',
          explanation_ta: 'படிப்பு, தனித்திறன், சாதனைகள் மற்றும் இலக்கு குறித்து சுருக்கமாகவும் தெளிவாகவும் கூற வேண்டும்.'
        }
      ]),
      video_url: 'https://www.youtube.com/watch?v=1mHjMNZZvFo',
      audio_url: '',
      duration_mins: 20,
      icon_name: 'Users'
    },
    {
      id: 'financial-literacy-budgeting',
      category: 'Financial Literacy',
      title_en: 'Money Basics: Budgeting & The 50/30/20 Rule',
      title_ta: 'பண மேலாண்மை: பட்ஜெட் & 50/30/20 விதி',
      summary_en: 'Learn how to differentiate Needs vs Wants, plan a monthly student budget, and grow a disciplined savings habit.',
      summary_ta: 'அடிப்படை தேவைகள் மற்றும் ஆடம்பர விருப்பங்களை பிரித்து அறிவது, மாதாந்திர பட்ஜெட் போடுவது மற்றும் சேமிக்கும் பழக்கத்தை உருவாக்குவது எப்படி?',
      content_markdown_en: `
### 1. Needs vs. Wants:
- **Need (அவசியம்)**: Things essential for survival and studies — Food, basic clothing, school books, bus pass, medicine.
- **Want (விருப்பம்)**: Things that are nice to have but not essential — Expensive branded sneakers, daily bakery snacks, cinema tickets.

### 2. The Golden 50/30/20 Rule adapted for Students:
- **50% for Educational Needs**: Books, stationery, bus fare, essential food.
- **30% for Personal Wants**: Small treats, outings, celebrations.
- **20% for Savings & Emergency Fund**: Keep in bank account for emergency exam fees or higher study savings!
      `,
      content_markdown_ta: `
### 1. அத்தியாவசிய தேவைகள் vs. ஆடம்பர விருப்பங்கள்:
- **தேவை (Needs)**: படிப்புக்கும் வாழ்வுக்கும் இன்றியமையாதவை — புத்தகம், பேருந்து கட்டணம், உணவு, மருத்துவம்.
- **விருப்பம் (Wants)**: தற்காலிக மகிழ்ச்சி தரும் ஆடம்பரங்கள் — விலை உயர்ந்த ஆடைகள், தினமும் பேக்கரி தின்பண்டங்கள், சினிமா.

### 2. மாணவர்களுக்கான 50/30/20 பட்ஜெட் ஃபார்முலா:
- **50% கல்வி தேவைகளுக்கு**: புத்தகங்கள், நோட்டு, பேனா, பேருந்து சீட்டு.
- **30% விருப்பங்களுக்கு**: சிறு கொண்டாட்டங்கள், நண்பர்களுடன் உபசரிப்பு.
- **20% சேமிப்பு & அவசர நிதி**: உங்கள் வங்கிக் கணக்கில் சேமித்து வைப்பது.
      `,
      practical_tips_en: JSON.stringify([
        'Track every rupee spent using a small pocket notebook or our online Budget Calculator',
        'Avoid borrowing money for gadgets or non-essential lifestyle items',
        'Open a student zero-balance savings account at a nationalized bank'
      ]),
      practical_tips_ta: JSON.stringify([
        'தினசரி செலவுகளை ஒரு சிறிய டைரியில் அல்லது நமது இணையதள கால்குலேட்டரில் குறித்து வைக்கவும்',
        'ஆடம்பர செலவுகளுக்காக கடன் வாங்குவதை முற்றிலும் தவிர்க்கவும்',
        'அருகிலுள்ள பொதுத்துறை வங்கியில் ஜீரோ பேலன்ஸ் சேமிப்புக் கணக்கு தொடங்கவும்'
      ]),
      quiz_data: JSON.stringify([
        {
          question_en: 'Which of the following is considered an essential "Need" for a student?',
          question_ta: 'மாணவர்களுக்கு பின்வருவனவற்றில் எது இன்றியமையாத "தேவை" ஆகும்?',
          options_en: ['Latest iPhone', 'Textbooks and Exam Hall Ticket fee', 'Branded sunglasses', 'Expensive video games'],
          options_ta: ['விலையுயர்ந்த ஐபோன்', 'பாடப்புத்தகங்கள் மற்றும் தேர்வு கட்டணம்', 'பிராண்டட் கூலிங் கிளாஸ்', 'வீடியோ கேம்ஸ்'],
          correctIndex: 1,
          explanation_en: 'Textbooks and educational fees are core needs that directly build your future.',
          explanation_ta: 'பாடப்புத்தகங்கள் மற்றும் கல்வி கட்டணங்கள் எதிர்காலத்தை உருவாக்கும் இன்றியமையாத தேவைகள்.'
        }
      ]),
      video_url: 'https://www.youtube.com/watch?v=4j2emMn7UaI',
      audio_url: '',
      duration_mins: 15,
      icon_name: 'Coins'
    },
    {
      id: 'banking-digital-safety',
      category: 'Financial Literacy',
      title_en: 'Safe Banking, UPI & Cyber Scam Prevention',
      title_ta: 'பாதுகாப்பான வங்கிச் சேவை, UPI & இணைய மோசடி விழிப்புணர்வு',
      summary_en: 'How to use ATM cards safely, use UPI payment apps responsibly, and protect your family from cyber lottery/OTP frauds.',
      summary_ta: 'ஏடிஎம் கார்டு, யுபிஐ (UPI) செயலிகளை பாதுகாப்பாக பயன்படுத்துவது மற்றும் ஓடிபி (OTP) லாட்டரி மோசடிகளில் இருந்து உங்களைப் பாதுகாத்துக் கொள்வது எப்படி?',
      content_markdown_en: `
### Crucial Digital Banking Rules:
1. **Never Share OTP (One Time Password)**: No genuine bank official, government servant, or police officer will ever ask for your 6-digit OTP.
2. **UPI PIN is Only for SENDING Money**:
   - To RECEIVE money via Google Pay, PhonePe, or Paytm, you NEVER enter your UPI PIN!
   - If someone asks you to enter your PIN to receive a scholarship or prize, IT IS A SCAM!
3. **ATM Safety**:
   - Cover the keypad with your hand while typing your 4-digit PIN.
   - Do not accept help from strangers at ATM booths.
4. **Dial 1930 for Cyber Crime**: If any financial cyber fraud occurs, report immediately within 2 hours to 1930 or cybercrime.gov.in.
      `,
      content_markdown_ta: `
### பாதுகாப்பான டிஜிட்டல் வங்கி விதிகள்:
1. **OTP-ஐ யாரிடமும் பகிராதீர்கள்**: எந்த ஒரு வங்கி மேலாளரோ அல்லது அரசு அதிகாரியோ உங்கள் ரகசிய OTP எண்ணைக் கேட்க மாட்டார்கள்.
2. **UPI PIN பணம் அனுப்ப மட்டுமே**:
   - நீங்கள் பணம் **பெறுவதற்கு** (Receive) உங்கள் UPI PIN எண்ணை உள்ளிடத் தேவையில்லை!
   - யாராவது பரிசு விழுந்துள்ளது, உதவித்தொகை வரவு வைக்க PIN போடுங்கள் என்றால் அது 100% மோசடி!
3. **ATM பயன்பாடு**:
   - ரகசிய PIN எண்ணை டைப் செய்யும்போது மற்றொரு கையால் மறைத்துக் கொள்ளவும்.
   - அறிமுகமில்லாத நபர்களிடம் கார்டையோ ரகசிய எண்ணையோ கொடுக்காதீர்கள்.
4. **சைபர் உதவி எண் 1930**: ஏதேனும் இணைய பண மோசடி நடந்தால் உடனடியாக 1930 என்ற அவசர எண்ணிற்கு அழைக்கவும்.
      `,
      practical_tips_en: JSON.stringify([
        'Memorize your ATM PIN; never write it on the back of your card',
        'Enable SMS alerts on your mobile phone for every bank transaction',
        'Immediately report suspicious calls offering fake scholarship gifts'
      ]),
      practical_tips_ta: JSON.stringify([
        'ATM பின் எண்ணை நினைவில் வைத்துக்கொள்ளுங்கள்; கார்டின் பின்புறம் எழுதாதீர்கள்',
        'வங்கி கணக்கில் உங்கள் மொபைல் எண்ணை இணைத்து எஸ்எம்எஸ் அலர்ட் பெறுங்கள்',
        'போலி உதவித்தொகை ஆசை வார்த்தைகளை நம்பாதீர்கள்'
      ]),
      quiz_data: JSON.stringify([
        {
          question_en: 'Someone calls claiming you won a ₹50,000 scholarship and asks for your 6-digit OTP to transfer money. What should you do?',
          question_ta: 'உங்களுக்கு ₹50,000 உதவித்தொகை கிடைத்துள்ளது என கூறி OTP எண்ணைக் கேட்டால் என்ன செய்ய வேண்டும்?',
          options_en: ['Give the OTP immediately', 'Never share the OTP, disconnect the call, and alert elders', 'Share your ATM card PIN instead', 'Post it on WhatsApp'],
          options_ta: ['உடனடியாக OTP எண்ணைக் கூற வேண்டும்', 'எந்தக் காரணத்தைக் கொண்டும் OTP பகிராமல் இணைப்பைத் துண்டித்து பெரியவர்களிடம் தெரிவிக்க வேண்டும்', 'ஏடிஎம் பின் எண்ணைக் கொடுக்க வேண்டும்', 'வாட்ஸ்அப்பில் பகிர வேண்டும்'],
          correctIndex: 1,
          explanation_en: 'Never share OTP with anyone under any circumstances. Genuine transfers never require your OTP.',
          explanation_ta: 'OTP என்பது மிக ரகசியமானது. யாரிடமும் ஒருபோதும் பகிரக் கூடாது.'
        }
      ]),
      video_url: 'https://www.youtube.com/watch?v=3A0Zp0yR0nQ',
      audio_url: '',
      duration_mins: 12,
      icon_name: 'ShieldAlert'
    },
    {
      id: 'public-speaking-confidence',
      category: 'Public Speaking',
      title_en: 'Overcoming Stage Fear & Confident Public Speaking',
      title_ta: 'மேடைப் பயத்தை வென்று கம்பீரமாக உரையாற்றுவது எப்படி?',
      summary_en: 'Techniques to overcome sweating and nervousness, structure an impactful 3-minute speech, and inspire audiences.',
      summary_ta: 'மேடையில் நடுக்கம் மற்றும் தயக்கத்தை போக்கும் நுட்பங்கள், 3 நிமிட உரை தயாரிக்கும் முறை மற்றும் பார்வையாளர்களைக் கவரும் பேச்சுக்கலை.',
      content_markdown_en: `
### Conquering Stage Fright:
1. **The 4-7-8 Breathing Technique**:
   - Inhale deeply through nose for 4 seconds.
   - Hold breath for 7 seconds.
   - Exhale slowly through mouth for 8 seconds. This calms rapid heartbeat instantly!
2. **The 3-Part Speech Structure**:
   - **Hook (தொடக்கம்)**: A thought-provoking quote (e.g. Thirukkural), surprising fact, or question.
   - **Body (மையப்பகுதி)**: 2 or 3 clear points supported by personal stories or examples.
   - **Conclusion (முடிவு)**: A powerful call to action or uplifting summary.
      `,
      content_markdown_ta: `
### மேடை பயத்தை போக்கும் வழிகள்:
1. **மூச்சுப் பயிற்சி (4-7-8 முறை)**:
   - மேடை ஏறுவதற்கு முன் 4 நொடிகள் மூச்சை உள்ளிழுத்து, 7 நொடிகள் அடக்கி, 8 நொடிகள் மெதுவாக வெளிவிடவும். இது இதயத் துடிப்பை சீராக்கும்.
2. **பேச்சின் 3 தூண்கள்**:
   - **தொடக்கம்**: ஒரு சிறந்த திருக்குறள் அல்லது சிந்தனையைத் தூண்டும் கேள்வியுடன் தொடங்கவும்.
   - **உடல் பகுதி**: 2 அல்லது 3 முக்கிய கருத்துக்களை எளிய உதாரணங்களுடன் விளக்கவும்.
   - **நிறைவு**: தன்னம்பிக்கை ஊட்டும் முழக்கத்துடன் முடித்தல்.
      `,
      practical_tips_en: JSON.stringify([
        'Practice your opening line 10 times until it flows without thinking',
        'Look at friendly faces on the left, center, and right of the audience',
        'Hold speech notes gently; speak slowly and pause after key points'
      ]),
      practical_tips_ta: JSON.stringify([
        'தொடக்க வாக்கியத்தை 10 முறை பேசி பயிற்சி செய்யவும்',
        'அரங்கில் உள்ள அனைவரையும் பார்க்கும் வகையில் பார்வையை சுழற்றவும்',
        'முக்கியமான கருத்துக்களுக்குப் பின் சிறிது இடைவெளி (Pause) விட்டு பேசவும்'
      ]),
      quiz_data: JSON.stringify([
        {
          question_en: 'What is the best way to open a speech effectively?',
          question_ta: 'ஒரு உரையை சிறப்பாகத் தொடங்க சிறந்த வழி எது?',
          options_en: ['Apologizing that you did not prepare', 'With a relevant Thirukkural, story, or inspiring quote', 'Standing silent for 2 minutes', 'Speaking very fast without breathing'],
          options_ta: ['நான் தயாரிக்கவில்லை என்று மன்னிப்புக் கேட்பது', 'பொருத்தமான திருக்குறள், கதை அல்லது மேற்கோளுடன் தொடங்குவது', '2 நிமிடங்கள் அமைதியாக நிற்பது', 'மூச்சுவிடாமல் வேகமாகப் பேசுவது'],
          correctIndex: 1,
          explanation_en: 'Starting with a captivating quote or story instantly grabs the audience’s attention.',
          explanation_ta: 'பொருத்தமான திருக்குறள் அல்லது மேற்கோள் பார்வையாளர்களின் கவனத்தை உடனடியாக ஈர்க்கும்.'
        }
      ]),
      video_url: 'https://www.youtube.com/watch?v=i5mYphUoOCs',
      audio_url: '',
      duration_mins: 18,
      icon_name: 'Mic'
    },
    {
      id: 'time-management-pomodoro',
      category: 'Mindset & Confidence',
      title_en: 'Study Time Management & Board Exam Stress Relief',
      title_ta: 'நேர மேலாண்மை & பொதுத்தேர்வு பயம் நீக்கும் வழிகள்',
      summary_en: 'How to create a realistic daily study timetable, beat procrastination using the Pomodoro technique, and stay calm during exams.',
      summary_ta: 'தினசரி படிப்பு அட்டவணை தயாரித்தல், பொமோடோரோ (Pomodoro) முறை மூலம் கவனத்தை ஒருமுகப்படுத்துதல் மற்றும் தேர்வு பதட்டத்தை குறைப்பது எப்படி?',
      content_markdown_en: `
### The 25-Minute Pomodoro Technique:
1. Choose ONE topic (e.g. Physics Optics derivation or Tamil Thiruvasagam).
2. Set a timer for **25 minutes** and study with zero distractions (no mobile notifications).
3. Take a **5-minute break** (drink water, walk around, stretch).
4. After 4 cycles, take a longer 20-minute relaxing break.

### Stress Management Tips:
- Get 7 hours of quality sleep every night.
- Break heavy textbooks into bite-sized 30-minute daily targets.
      `,
      content_markdown_ta: `
### 25 நிமிட பொமோடோரோ படிப்பு முறை:
1. படிக்க வேண்டிய ஒரு பாடத் தலைப்பைத் தேர்வு செய்யவும்.
2. டைமரை **25 நிமிடங்களுக்கு** வைத்து, செல்போன் கவனச்சிதறல் ஏதுமின்றி படிக்கவும்.
3. 25 நிமிடத்திற்குப் பின் **5 நிமிடங்கள் ஓய்வு** எடுக்கவும் (தண்ணீர் குடிக்கவும், உடல் தளர்வு செய்யவும்).
4. தொடர்ந்து 4 சுற்றுகளுக்குப் பிறகு 20 நிமிடங்கள் நீண்ட இடைவெளி எடுக்கவும்.

### தேர்வு பயம் நீங்க:
- இரவு குறைந்தது 7 மணி நேரம் உறக்கம் மிக அவசியம்.
- கடைசி நேரத்தில் படிக்காமல், தினமும் குறிப்பிட்ட பகுதிகளை படித்து முடிக்கவும்.
      `,
      practical_tips_en: JSON.stringify([
        'Study difficult subjects in the early morning when your mind is freshest',
        'Solve previous 5 years question papers under timed conditions',
        'Stay hydrated and take a 10-minute evening walk'
      ]),
      practical_tips_ta: JSON.stringify([
        'கடினமான பாடங்களை அதிகாலை நேரத்தில் மனம் புத்துணர்ச்சியாக இருக்கும்போது படிக்கவும்',
        'கடந்த 5 ஆண்டுகளின் அரசு வினாத்தாள்களை எழுதிப் பார்க்கவும்',
        'நிறைய தண்ணீர் குடித்து ஆரோக்கியமாக இருக்கவும்'
      ]),
      quiz_data: JSON.stringify([
        {
          question_en: 'In the Pomodoro technique, how long is one focused study session?',
          question_ta: 'பொமோடோரோ முறையில் ஒரு படிப்பு அமர்வு எத்தனை நிமிடங்கள்?',
          options_en: ['5 minutes', '25 minutes', '4 hours without break', '10 seconds'],
          options_ta: ['5 நிமிடங்கள்', '25 நிமிடங்கள் (Focus Session)', 'இடைவேளையின்றி 4 மணி நேரம்', '10 நொடிகள்'],
          correctIndex: 1,
          explanation_en: '25 minutes of deep focus followed by a 5-minute break helps maintain peak concentration.',
          explanation_ta: '25 நிமிடங்கள் முழு கவனத்துடன் படித்து 5 நிமிடங்கள் ஓய்வெடுப்பது மூளையின் சுறுசுறுப்பை அதிகரிக்கும்.'
        }
      ]),
      video_url: 'https://www.youtube.com/watch?v=mNBmG24djoY',
      audio_url: '',
      duration_mins: 15,
      icon_name: 'Clock'
    }
  ];

  for (const m of modulesData) {
    insertModule.run(
      m.id, m.category, m.title_en, m.title_ta, m.summary_en, m.summary_ta,
      m.content_markdown_en, m.content_markdown_ta, m.practical_tips_en, m.practical_tips_ta,
      m.quiz_data, m.video_url, m.audio_url, m.duration_mins, m.icon_name
    );
  }

  // 5. Seed Learning Resources (Podcasts, YouTube, Free Portals)
  const insertResource = db.prepare(`
    INSERT INTO learning_resources (
      type, title_en, title_ta, category, url, platform, thumbnail, description_en, description_ta, is_free, duration
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const resourcesData = [
    {
      type: 'portal',
      title_en: 'Naan Mudhalvan - Tamil Nadu Skill Development Portal',
      title_ta: 'நான் முதல்வன் - தமிழ்நாடு திறன் மேம்பாட்டுத் திட்டம்',
      category: 'Skill Development & Tech',
      url: 'https://naanmudhalvan.tn.gov.in',
      platform: 'TN Govt Portal',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      description_en: 'Flagship initiative by Govt of TN offering industry-oriented skills in coding, robotics, logistics, and communication for school and college youth.',
      description_ta: 'தமிழ்நாடு அரசுப் பள்ளி மற்றும் கல்லூரி மாணவர்களுக்கு நவீன ஐடி, கோடிங், ரோபோடிக்ஸ் மற்றும் ஆங்கிலத் திறன் வழங்கும் முதன்மை தளம்.',
      is_free: 1,
      duration: 'Self-Paced'
    },
    {
      type: 'youtube',
      title_en: 'Kalvi TV (கல்வி தொலைக்காட்சி) Official Classes',
      title_ta: 'கல்வி தொலைக்காட்சி அதிகாரப்பூர்வ பாட வகுப்புகள்',
      category: 'School Academics & Guidance',
      url: 'https://www.youtube.com/@kalvitvofficial',
      platform: 'YouTube / Kalvi TV',
      thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
      description_en: 'Daily televised lessons for Classes 1 to 12 by top state board teachers, covering all subjects, career guidance series, and practicals.',
      description_ta: '1 முதல் 12ஆம் வகுப்பு மாணவர்களுக்கான பள்ளிப் பாடங்கள், மாதிரி வினாத்தாள் விளக்கங்கள் மற்றும் கரியர் வழிகாட்டி நிகழ்ச்சிகள்.',
      is_free: 1,
      duration: '30-45 mins'
    },
    {
      type: 'podcast',
      title_en: 'Tamil Career & Life Skills Audio Podcast Series',
      title_ta: 'தமிழ் மாணவர் வழிகாட்டி & ஊக்க ஆடியோ பாட்காஸ்ட்',
      category: 'Motivation & Success Stories',
      url: 'https://open.spotify.com/show/tamil-motivation',
      platform: 'Spotify / Web Audio',
      thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&auto=format&fit=crop&q=80',
      description_en: 'Inspiring audio episodes featuring IAS officers, scientists, and software leaders who graduated from Tamil Nadu government schools.',
      description_ta: 'அரசுப் பள்ளியில் படித்து ஐஏஎஸ், இஸ்ரோ விஞ்ஞானிகள் மற்றும் தொழிலதிபர்களாக உயர்ந்த தமிழர்களின் வெற்றிப் பாதையை விளக்கும் ஊக்க ஆடியோக்கள்.',
      is_free: 1,
      duration: '20 mins'
    },
    {
      type: 'course',
      title_en: 'SWAYAM - Free National Certification Courses',
      title_ta: 'ஸ்வயம் (SWAYAM) - மத்திய அரசின் இலவச சான்றிதழ் படிப்புகள்',
      category: 'Online Certifications',
      url: 'https://swayam.gov.in',
      platform: 'SWAYAM / NPTEL',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
      description_en: 'Over 2,000 free online courses created by IITs, IIMs, and Central Universities with certificate options recognized globally.',
      description_ta: 'ஐஐடி (IIT) பேராசிரியர்கள் நடத்தும் இலவச கணிதம், கணினி, அறிவியல் மற்றும் வணிகவியல் ஆன்லைன் சான்றிதழ் படிப்புகள்.',
      is_free: 1,
      duration: '4-8 Weeks'
    },
    {
      type: 'youtube',
      title_en: 'Spoken English for Tamil Medium Students',
      title_ta: 'தமிழ் வழி மாணவர்களுக்கான எளிய ஸ்போக்கன் இங்கிலீஷ்',
      category: 'Language Skills',
      url: 'https://www.youtube.com/results?search_query=spoken+english+in+tamil',
      platform: 'YouTube',
      thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=80',
      description_en: 'Step-by-step English pronunciation and sentence construction lessons taught through simple Tamil explanations.',
      description_ta: 'தமிழில் இருந்து ஆங்கில வாக்கியங்களை எளிதாக அமைத்து சரளமாக பேசக் கற்றுத்தரும் வீடியோ தொடர்.',
      is_free: 1,
      duration: '15 mins/video'
    },
    {
      type: 'portal',
      title_en: '14417 - TN School Education Department Student Helpline',
      title_ta: '14417 - தமிழ்நாடு பள்ளி கல்வித்துறை கட்டணமில்லா உதவி எண்',
      category: 'Guidance & Counseling',
      url: 'tel:14417',
      platform: 'Govt Helpline 14417',
      thumbnail: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=600&auto=format&fit=crop&q=80',
      description_en: '24x7 toll-free helpline launched by Govt of Tamil Nadu for career counseling, psychological support, and board exam queries.',
      description_ta: 'தேர்வு பயம், கரியர் வழிகாட்டுதல் மற்றும் மன நல ஆலோசனைகளுக்கு 24 மணி நேரமும் செயல்படும் தமிழ்நாடு அரசின் இலவச உதவி எண்.',
      is_free: 1,
      duration: '24x7 Toll Free'
    }
  ];

  for (const r of resourcesData) {
    insertResource.run(
      r.type, r.title_en, r.title_ta, r.category, r.url, r.platform,
      r.thumbnail, r.description_en, r.description_ta, r.is_free, r.duration
    );
  }

  // 6. Seed Sample Feedback / Inquiries
  const insertFeedback = db.prepare(`
    INSERT INTO feedback_queries (
      name, email_or_phone, district, school_name, category, message, reply, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertFeedback.run(
    'M. செல்வம் (M. Selvam)',
    '9842100000',
    'Thanjavur',
    'Govt Higher Secondary School, Pattukkottai',
    'Scholarship Help',
    'நான் 12ஆம் வகுப்பில் வணிகவியல் படிக்கிறேன். புதுமைப் பெண் திட்டம் போன்று மாணவர்களுக்கான தமிழ்ப் புதல்வன் திட்டம் எப்போது தொடங்குகிறது மற்றும் எப்படி விண்ணப்பிப்பது?',
    'வணக்கம் செல்வம், கல்லூரி அல்லது பாலிடெக்னிக் சேர்ந்தவுடன் உங்கள் கல்லூரி நோடல் அதிகாரி மூலம் தமிழ்ப் புதல்வன் திட்டத்திற்கு விண்ணப்பிக்கலாம். மாதம் ₹1,000 வங்கிக் கணக்கில் வரவு வைக்கப்படும்.',
    'resolved'
  );

  insertFeedback.run(
    'S. அனிதா (S. Anitha)',
    'anitha.s@gmail.com',
    'Salem',
    'Govt Model Girls HSS, Salem',
    'Career Counseling',
    'எனக்கு உயிரியல் பிடிக்கும், ஆனால் நீட் இல்லாமல் மருத்துவத்துறையில் என்னென்ன அரசு கல்லூரிகளில் சிறந்த வாய்ப்புகள் உள்ளன?',
    'வணக்கம் அனிதா, நீட் தேர்வு இல்லாமலே B.Sc Nursing, B.Pharm, B.Sc Radiography, B.Sc Dialysis Technology போன்ற படிப்புகளுக்கு 12ஆம் வகுப்பு கட்-ஆஃப் மதிப்பெண் அடிப்படையில் அரசு கல்லூரிகளில் 7.5% இடஒதுக்கீட்டுடன் சேரலாம்!',
    'resolved'
  );

  console.log('Seeding completed successfully!');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
