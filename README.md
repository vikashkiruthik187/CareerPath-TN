# CareerPath TN | தமிழ்நாடு மாணவர் வழிகாட்டி & வாழ்வியல் திறன் தளம்
**Tamil Nadu Student Career Guidance and Life Skills Platform**

---

## 📖 Project Overview

**CareerPath TN** is a full-stack web application purpose-built to empower students studying in **Tamil Nadu Government Schools** (Classes 8–12, Polytechnic, ITI, and early college aspirants). 

The platform bridges educational inequality by providing accessible, student-friendly career guidance, higher education pathways, financial literacy, state educational welfare schemes, and essential communication life skills with **complete bilingual support (English & தமிழ்)**.

---

## 🌟 Key Modules & Core Capabilities

### 1. 🎓 Student Profile & Career Assessment Module
- **Comprehensive Student Profile**: Captures student name, district (all **38 districts of Tamil Nadu**), school name, school type (GHSS, GHS, Model School, Adi Dravidar Welfare), education level, academic stream, areas of interest, favorite subjects, skills, and career aspirations.
- **Interactive Career Aptitude Assessment**:
  - 8 scenario-based questions adapted for Tamil Nadu school students combining Holland RIASEC codes with TN academic stream affinities.
  - Multi-trait scoring algorithm calculating primary & secondary strength clusters.
  - **Personalized Guidance Report** with confetti celebration: Recommended 11th/12th groups (Bio-Maths, Pure Science, Computer Science, Commerce, Vocational, Polytechnic), top matching careers, and bilingual guidance feedback.
  - Automatically saves reports to the student's dashboard for progress tracking.

### 2. 🧭 Career Exploration Module
- **Detailed Career Roadmaps**: Engineering & AI, Medicine & Allied Health (MBBS, Siddha BSMS, Nursing, Radiography), Agriculture (B.Sc Agri at TNAU), Veterinary (B.V.Sc at TANUVAS), Fisheries (B.F.Sc at TNJFU), Government Services (TNPSC Group 4/VAO, Group 1, Sub-Inspector Police, Armed Forces), Teaching (TRB/TNTET), Law (TNDALU), Commerce & CA, and Vocational/ITI Electrician.
- **In-Depth Roadmap View**:
  - Required qualifications & step-by-step pathway diagrams.
  - Core technical and soft skills to cultivate.
  - Entrance exams with direct official portal links (NEET, JEE, TNEA, TNPSC, TANUVAS, TNDALU, etc.).
  - Top Tamil Nadu government and aided institutions (MMC, Anna University CEG, TNAU Coimbatore, Presidency College, SOEL).
  - Expected monthly salary ranges.
  - **7.5% Government School Horizontal Reservation Filter**: Instant toggle to explore courses where TN government school students receive 100% free education and hostel accommodation.

### 3. 💰 Financial Literacy & Government Scholarships Module
- **TN Welfare Schemes Directory**:
  - **Pudhumai Penn Scheme** (Moovalur Ramamirtham Ammaiyar Scheme): ₹1,000/month direct benefit transfer for girls from TN Govt schools entering higher education.
  - **Tamil Pudhalvan Scheme**: ₹1,000/month for boys from TN Govt schools entering higher education.
  - **7.5% Horizontal Reservation**: 100% free tuition, examination, and hostel fees in MBBS, Engineering, Agriculture, Veterinary, Fisheries, and Law.
  - **First Graduate Fee Concession**: Full tuition waiver for first-generation graduates.
  - **National Means-cum-Merit Scholarship (NMMS)**: ₹12,000/year for Class 9–12 students.
  - **Post-Matric Scholarship** for SC/ST/SCA students.
  - **Vidya Lakshmi Portal & CSIS**: Education loans up to ₹7.5 Lakhs without collateral + Central Sector Interest Subsidy.
- **Intelligent Scholarship Eligibility Finder**: Interactive tool where students select gender, school type, class, and community to instantly see all matching schemes.
- **Interactive Financial Tools**:
  - **Student 50/30/20 Budget Planner**: Interactive slider to allocate monthly pocket money / Pudhumai Penn stipend into Educational Needs (50%), Personal Wants (30%), and Bank Savings (20%).
  - **Education Loan EMI & Moratorium Estimator**: Calculate monthly installments and understand interest subsidies.
  - **Digital Banking & Cyber Scam Safety Guide**: Golden rules for UPI, ATM PIN protection, identifying fake scholarship lottery calls, and dialing **1930**.

### 4. 🗣️ Communication & Life Skills Module
- **Interactive Skill Lessons**:
  - *Spoken English*: Daily conversational phrases, phonetic guidance, classroom & polite greetings, 4-point self-introduction formula.
  - *Interview Mastery*: Body language, STAR method for answering questions, certificate file presentation.
  - *Public Speaking*: 4-7-8 breathing technique to conquer stage fright, 3-part speech structure.
  - *Time Management & Stress Relief*: 25-minute Pomodoro technique, timetable planning for board exams.
  - *Interactive Knowledge Check Quizzes*: Mini-quizzes with instant explanations and progress score tracking.
- **Curated Learning Resources**:
  - Official **Kalvi TV (கல்வி தொலைக்காட்சி)** classes.
  - **Naan Mudhalvan** skill portal and certifications.
  - Free **SWAYAM / NPTEL** central government courses.
  - Tamil motivation podcasts featuring successful TN government school alumni.

### 5. 📄 Student Resume & Biodata Builder
- Interactive, student-friendly resume editor built for high school, diploma, and early college students.
- Captures personal details, objective, schooling marks, skills, awards, and languages known.
- **Real-time live A4 preview** with print-ready CSS (`@media print`) for one-click PDF export and clean printing.

### 6. 📊 Student & Administrator Dashboards
- **Student Dashboard**:
  - Profile overview with live edit mode.
  - Latest career assessment snapshot and top matched domains.
  - Bookmarked careers & saved scholarships for quick review.
  - Completed life skills modules progress bar.
  - **30-Day College Prep Checklist** with interactive checkmarks.
- **Administrator Dashboard**:
  - Real-time registration metrics and **Tamil Nadu 38 districts distribution breakdown**.
  - Education level enrollment statistics.
  - Career management (Create, Read, Delete).
  - Scholarship management.
  - **Student Counseling Inquiries Helpdesk**: Review and send official counseling replies to student questions.

### 7. 📞 Helplines & Ask-A-Counselor Helpdesk
- Official State Emergency Hotlines:
  - **14417**: Tamil Nadu School Education Department 24x7 Student Helpline.
  - **1098**: Childline India Helpline.
  - **1930**: National Cyber Financial Fraud Helpline.
- "Ask a Counselor" submission form for students to submit career and admission doubts.
- Public archive of counselor-answered FAQs.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**:
  - React 18 + Vite
  - Tailwind CSS (v4) with custom Mukta Malar & Inter typography
  - Lucide React Icons
  - React Router v7
  - Canvas Confetti
  - Real-time Bilingual Language Context (`en` and `ta`)
- **Backend**:
  - Node.js + Express
  - RESTful API with structured routes (`/api/auth`, `/api/careers`, `/api/scholarships`, `/api/assessment`, `/api/skills`, `/api/student`, `/api/feedback`, `/api/admin`)
  - SQLite database (`better-sqlite3`) with schema migrations and foreign keys
  - JSON Web Tokens (`jsonwebtoken`) + Password Hashing (`bcryptjs`)
  - Full Seed Data loaded automatically

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Backend Setup
```bash
cd server
npm install
node src/index.js
```
*The backend server runs on `http://localhost:5000` and initializes `careerpath_tn.db`.*

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev -- --host
```
*The frontend development server runs on `http://localhost:3000` with API proxy configured.*

---

## 🔑 Demo Accounts (Available via 1-Click "Demo" button in UI)

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Student** | `kavitha@school.tn.gov.in` | `student123` | Class 12 Bio-Maths, GHSS Melur, Madurai |
| **Administrator** | `admin@careerpathtn.gov.in` | `admin123` | Directorate of School Education Admin |

*(Alternatively, register a new student account selecting any of the 38 districts of Tamil Nadu!)*

---

## 🏛️ Government Initiatives Highlighted

1. **Moovalur Ramamirtham Ammaiyar Pudhumai Penn Scheme** (₹1,000/month for girls)
2. **Tamil Pudhalvan Scheme** (₹1,000/month for boys)
3. **7.5% Preferential Reservation in Professional Courses** for Government School Students
4. **First Graduate Tuition Fee Exemption**
5. **14417 Student Educational & Psychological Helpline**
6. **Naan Mudhalvan Skill Development Mission**

---

*Developed with ❤️ for the students of Tamil Nadu Government Schools.*
