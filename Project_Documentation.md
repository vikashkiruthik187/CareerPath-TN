# Project Documentation

**Ex.No: 14**
**Date: 13/10/26**

---

## 1. Project Title

**CareerPath TN – Tamil Nadu Student Career Guidance and Life Skills Platform**
*தமிழ்நாடு மாணவர் வழிகாட்டி & வாழ்வியல் திறன் தளம்*

---

## 2. Abstract

CareerPath TN is a full-stack bilingual web application purpose-built to empower students studying in Tamil Nadu Government Schools (Classes 8–12, Polytechnic, ITI, and early college aspirants). The platform bridges educational inequality by providing accessible, student-friendly career guidance, higher education pathways, financial literacy, state educational welfare schemes, and essential life skills — all with complete bilingual support in English and Tamil (தமிழ்).

The application allows students to register, complete career aptitude assessments, explore career roadmaps, discover government scholarships, build resumes, and learn communication skills through interactive modules. Administrators can manage career and scholarship data, monitor student registrations district-wise, and respond to student counseling queries.

The project is developed using React, Node.js, Express.js, and SQLite, with JWT-based authentication and bcrypt password hashing for security.

---

## 3. Introduction

Tamil Nadu has a large number of government school students who often lack access to proper career counseling, guidance on higher education options, and information about government welfare schemes. Many students are unaware of reservations like the 7.5% horizontal reservation in professional courses, monthly stipend schemes like Pudhumai Penn and Tamil Pudhalvan, or portals like Naan Mudhalvan for skill development.

CareerPath TN addresses this gap by bringing all relevant information and tools into a single, easy-to-use platform. Students can assess their aptitude through scenario-based questions, explore career roadmaps with step-by-step pathways, learn about scholarships and how to apply, and practice life skills such as spoken English, time management, and interview preparation.

The platform also provides an administrator dashboard for managing content, tracking student registrations across all 38 districts of Tamil Nadu, and handling student counseling inquiries.

---

## 4. Problem Statement

Government school students in Tamil Nadu face several challenges when planning their career paths:

- Lack of personalized career guidance tailored to Tamil Nadu's academic streams and entrance exams.
- Limited awareness of government welfare schemes, scholarships, and reservations available exclusively to government school students.
- Difficulty in accessing life skills training such as spoken English, public speaking, and interview preparation.
- No centralized platform to explore career roadmaps, institutions, and entrance examinations specific to Tamil Nadu.
- Students rely on scattered sources such as notice boards, social media, or word-of-mouth, leading to missed opportunities.

There is a need for a single platform that integrates career guidance, scholarship discovery, financial literacy, life skills training, and resume building — with bilingual (English and Tamil) support — specifically designed for Tamil Nadu government school students.

---

## 5. Objectives

The main objectives of CareerPath TN are:

- To provide an aptitude-based career assessment specifically calibrated for Tamil Nadu students using RIASEC codes and TN academic stream affinities.
- To offer detailed career roadmaps including required qualifications, entrance exams, top Tamil Nadu institutions, and expected salary ranges.
- To make students aware of government welfare schemes, scholarships, and reservations such as Pudhumai Penn, Tamil Pudhalvan, and the 7.5% horizontal reservation.
- To teach practical life skills through interactive lessons and quizzes (spoken English, interview skills, public speaking, time management).
- To provide a student-friendly resume and biodata builder with a printable A4 preview.
- To offer a student dashboard for tracking career assessments, saved careers, scholarships, and skill module progress.
- To provide an administrator dashboard for managing platform content and responding to student counseling inquiries.
- To support both English and Tamil languages throughout the entire platform.

---

## 6. Modules

### 6.1 User Authentication Module

Allows students and administrators to register, log in, and securely access their accounts. Registration captures the student's name, email, district (all 38 districts of Tamil Nadu), school name, school type, education level, academic stream, interests, favourite subjects, skills, and career aspirations. Passwords are hashed using bcrypt and access is controlled through JSON Web Tokens (JWT) with a 7-day expiry.

### 6.2 Career Aptitude Assessment Module

Provides an interactive career aptitude assessment with 8 scenario-based questions designed for Tamil Nadu school students. The assessment uses Holland RIASEC codes combined with TN academic stream affinities. A multi-trait scoring algorithm calculates primary and secondary strength clusters and generates a personalized guidance report with recommended 11th/12th academic groups, top matching careers, and bilingual feedback. Results are automatically saved to the student's dashboard.

### 6.3 Career Exploration Module

Allows students to browse and explore detailed career roadmaps across diverse fields:
- Engineering & AI
- Medicine & Allied Health (MBBS, Siddha BSMS, Nursing, Radiography)
- Agriculture (B.Sc Agri at TNAU)
- Veterinary (B.V.Sc at TANUVAS)
- Fisheries (B.F.Sc at TNJFU)
- Government Services (TNPSC Group 4/VAO, Group 1, Sub-Inspector, Armed Forces)
- Teaching (TRB/TNTET)
- Law (TNDALU)
- Commerce & CA
- Vocational/ITI

Each roadmap includes required qualifications, step-by-step pathway diagrams, core skills, entrance exams with official portal links, top Tamil Nadu institutions, expected monthly salary ranges, and a toggle for the 7.5% Government School Horizontal Reservation filter.

### 6.4 Financial Literacy & Scholarships Module

Provides information on Tamil Nadu government welfare schemes and scholarships:
- **Pudhumai Penn Scheme** (₹1,000/month for girls from TN Govt schools entering higher education)
- **Tamil Pudhalvan Scheme** (₹1,000/month for boys)
- **7.5% Horizontal Reservation** in MBBS, Engineering, Agriculture, Veterinary, Fisheries, and Law
- **First Graduate Fee Concession** (Full tuition waiver)
- **NMMS Scholarship** (₹12,000/year for Class 9–12)
- **Post-Matric Scholarship** for SC/ST/SCA students
- **Vidya Lakshmi Portal & CSIS** for education loans up to ₹7.5 Lakhs

An Intelligent Scholarship Eligibility Finder allows students to filter schemes by gender, school type, class, and community. Interactive financial tools include a 50/30/20 Budget Planner, Education Loan EMI Estimator, and a Digital Banking & Cyber Scam Safety Guide.

### 6.5 Life Skills Module

Provides interactive bilingual lessons with quizzes on:
- Spoken English (daily conversational phrases, phonetic guidance, self-introduction formula)
- Interview Mastery (body language, STAR method, document preparation)
- Public Speaking (4-7-8 breathing technique, 3-part speech structure)
- Time Management & Stress Relief (Pomodoro technique, board exam timetable planning)

Each module includes a mini-quiz with instant explanations and score tracking. Curated external resources include Kalvi TV (கல்வி தொலைக்காட்சி) classes, Naan Mudhalvan skill portal, SWAYAM/NPTEL courses, and Tamil motivation podcasts.

### 6.6 Student Resume Builder Module

An interactive, student-friendly resume editor that captures personal details, objective statement, schooling marks, skills, awards, and languages known. Features a real-time live A4 preview with print-ready CSS for one-click PDF export.

### 6.7 Student Dashboard Module

A personalized student dashboard providing:
- Profile overview with a live edit mode
- Latest career assessment snapshot and top matched career domains
- Bookmarked careers and saved scholarships
- Completed life skills modules with a progress bar
- An interactive 30-Day College Prep Checklist

### 6.8 Administrator Dashboard Module

A management interface for administrators providing:
- Real-time student registration metrics and Tamil Nadu 38 districts distribution breakdown
- Education level enrollment statistics
- Career management (Create, Read, Delete)
- Scholarship management (Create, Read, Delete)
- Student Counseling Inquiries Helpdesk for reviewing and replying to student questions

### 6.9 Helpdesk & Counseling Module

Provides an "Ask a Counselor" form for students to submit career and admission doubts. Displays a public archive of counselor-answered FAQs. Includes official state emergency helplines:
- **14417**: Tamil Nadu School Education Department 24×7 Student Helpline
- **1098**: Childline India Helpline
- **1930**: National Cyber Financial Fraud Helpline

---

## 7. System Requirements

### Hardware Requirements

- Computer or laptop
- Minimum 4 GB RAM recommended
- Internet connection for accessing the web application

### Software Requirements

| Component | Technology |
|:--|:--|
| Operating System | Windows, Linux, or macOS |
| Frontend Framework | React 19 with Vite 8 |
| Styling | Tailwind CSS v4 |
| Backend Framework | Node.js with Express.js 5 |
| Database | SQLite (better-sqlite3) |
| Authentication | JSON Web Tokens (jsonwebtoken), bcryptjs |
| Programming Language | JavaScript (ES Modules on client, CommonJS on server) |
| Browser | Chrome, Firefox, or any modern browser |

---

## 8. Technology Stack

### Frontend
- **React 19** + **Vite 8** — Component-based UI with fast HMR builds
- **Tailwind CSS v4** — Utility-first styling with custom Mukta Malar and Inter typography
- **React Router v7** — Client-side routing with 11 defined routes
- **Lucide React** — Icon library
- **Canvas Confetti** — Celebration animation on assessment completion
- **Language Context** — Real-time bilingual switching between English (`en`) and Tamil (`ta`)
- **Auth Context** — Global JWT-based authentication state management

### Backend
- **Node.js** + **Express.js 5** — RESTful API server running on port 5000
- **better-sqlite3** — Embedded SQLite database with foreign key enforcement
- **bcryptjs** — Password hashing with salt rounds
- **jsonwebtoken** — JWT generation and verification with 7-day expiry
- **morgan** — HTTP request logging middleware
- **dotenv** — Environment variable management

### Database Tables

| Table | Purpose |
|:--|:--|
| `users` | Student and administrator accounts |
| `assessment_results` | Career aptitude assessment responses and scores |
| `careers` | Career roadmap data (bilingual) |
| `scholarships` | Scholarship and welfare scheme details (bilingual) |
| `life_skills_modules` | Life skills lesson content, quizzes (bilingual) |
| `learning_resources` | Curated external learning links |
| `student_saved_items` | Student bookmarked careers and scholarships |
| `student_progress` | Life skills module completion tracking |
| `feedback_queries` | Student counseling inquiries and admin replies |

---

## 9. System Architecture

The application follows a **three-tier client-server architecture**:

```
┌─────────────────────────────────────┐
│           CLIENT (Browser)          │
│   React 19 + Vite + Tailwind CSS    │
│   Routes: /, /assessment, /careers, │
│   /finance, /skills, /resume,       │
│   /dashboard, /admin, /counseling,  │
│   /login, /register                 │
└────────────────┬────────────────────┘
                 │  HTTP REST API (JSON)
                 │  JWT Bearer Token
                 ▼
┌─────────────────────────────────────┐
│          SERVER (Node.js)           │
│       Express.js REST API           │
│  /api/auth    → Authentication      │
│  /api/careers → Career Roadmaps     │
│  /api/scholarships → Scholarships   │
│  /api/assessment → Aptitude Test    │
│  /api/skills  → Life Skills         │
│  /api/student → Dashboard Data      │
│  /api/feedback → Counseling Queries │
│  /api/admin   → Admin Operations    │
└────────────────┬────────────────────┘
                 │  better-sqlite3
                 ▼
┌─────────────────────────────────────┐
│        DATABASE (SQLite)            │
│       careerpath_tn.db              │
│  9 Tables: users, careers,          │
│  scholarships, assessment_results,  │
│  life_skills_modules, etc.          │
└─────────────────────────────────────┘
```

---

## 10. Working of the System

1. A student visits the platform and registers by entering their name, district, school details, academic stream, and interests.
2. The backend hashes the password using bcrypt, saves the student record, and returns a JWT token.
3. The student logs in; the token is stored and attached to all subsequent API requests as a Bearer token.
4. The student completes the career aptitude assessment by answering 8 scenario-based questions. The RIASEC scoring algorithm calculates the best-fitting career domains and saves the result to the database.
5. The student browses career roadmaps, filters by the 7.5% Reservation toggle, and bookmarks careers of interest.
6. The student uses the Scholarship Eligibility Finder by selecting gender, class, school type, and community to view all applicable welfare schemes.
7. The student explores life skills modules, reads lesson content in English or Tamil, and takes mini-quizzes. Completed modules are tracked in the database.
8. The student builds a resume using the Resume Builder and downloads it as a printable PDF.
9. The student submits a counseling query through the Helpdesk form.
10. The administrator logs into the admin dashboard, reviews student registration statistics district-wise, manages career and scholarship data, and replies to student counseling inquiries.
11. The student can toggle the interface language between English and Tamil at any time using the bilingual Language Context.

---

## 11. API Endpoints

| Method | Endpoint | Description |
|:--|:--|:--|
| POST | `/api/auth/register` | Register a new student account |
| POST | `/api/auth/login` | Student or admin login |
| GET | `/api/auth/me` | Fetch current logged-in user profile |
| PUT | `/api/auth/profile` | Update student profile details |
| GET | `/api/careers` | List all career roadmaps |
| POST | `/api/careers` | Admin: Create a new career entry |
| DELETE | `/api/careers/:id` | Admin: Delete a career entry |
| GET | `/api/scholarships` | List all scholarships |
| POST | `/api/scholarships` | Admin: Create a scholarship entry |
| DELETE | `/api/scholarships/:id` | Admin: Delete a scholarship |
| POST | `/api/assessment` | Submit assessment answers and get results |
| GET | `/api/assessment/history` | Fetch student's past assessments |
| GET | `/api/skills` | List all life skills modules |
| GET | `/api/skills/:id` | Fetch a specific skills module |
| POST | `/api/student/save` | Bookmark a career or scholarship |
| GET | `/api/student/saved` | Retrieve student's saved items |
| POST | `/api/student/progress` | Mark a skills module as completed |
| GET | `/api/student/progress` | Fetch skills module completion progress |
| POST | `/api/feedback` | Submit a student counseling query |
| GET | `/api/feedback` | Admin: List all counseling queries |
| PUT | `/api/feedback/:id/reply` | Admin: Reply to a counseling query |
| GET | `/api/admin/stats` | Admin: Registration metrics and district data |
| GET | `/api/health` | Server health check |

---

## 12. Government Initiatives Highlighted

| Scheme | Benefit |
|:--|:--|
| Pudhumai Penn (Moovalur Ramamirtham Ammaiyar Scheme) | ₹1,000/month DBT for girls from TN Govt schools in higher education |
| Tamil Pudhalvan Scheme | ₹1,000/month for boys from TN Govt schools in higher education |
| 7.5% Horizontal Reservation | 100% free tuition, examination, and hostel in MBBS, Engineering, Agriculture, Veterinary, Fisheries, Law |
| First Graduate Fee Concession | Full tuition waiver for first-generation graduates |
| National Means-cum-Merit Scholarship (NMMS) | ₹12,000/year for Class 9–12 students |
| Post-Matric Scholarship | For SC/ST/SCA students |
| Vidya Lakshmi Portal + CSIS | Education loans up to ₹7.5 Lakhs without collateral + interest subsidy |
| 14417 Student Helpline | 24×7 psychological and educational support helpline |
| Naan Mudhalvan Mission | Free skill certification portal for TN students |

---

*Developed with ❤️ for the students of Tamil Nadu Government Schools.*
