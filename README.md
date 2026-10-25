# 🎓 AI-Powered Student Analysis Portal

> **An intelligent, modern academic diagnostic and student performance tracking web application built with React, Vite, and Tailwind CSS.**

[![Live Demo on Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📌 Project Overview

The **AI-Powered Student Analysis Portal** is a dual-perspective academic management platform designed for universities and colleges. It bridges the gap between raw examination scores and actionable student guidance:

1. **Self-Service Student Performance Portal**: When a student signs up or logs in, they are immediately presented with their personalized academic dashboard, university attendance compliance warnings, AI predicted semester grades, root-cause diagnostics, and a tailored 4-week recovery roadmap.
2. **Faculty & Administrative Oversight Dashboard**: Institutional mentors and department heads can track overall batch KPIs, grade distributions, department subject mastery, and identify high-dropout-risk students using our rule-based ML scoring heuristic.

---

## ✨ Key Features

### 👨‍🎓 1. Personalized Student Portal
- **Instant Student Onboarding**: Simple self-registration form capturing Roll Number, Department, Semester, Marks, Attendance, and Lab practical metrics.
- **University Attendance Monitor**: Real-time compliance tracking against the mandatory 75% cutoff with urgent visual alerts for debarment avoidance.
- **Personal Academic KPIs**:
  - Overall CGPA / Percentage with Letter Grade classification (O, A+, A, B, C, F)
  - Attendance Status & buffer calculation
  - AI Projected End-Semester Grade (with confidence rating)
  - Academic Health Risk Score (Safe, Watchlist, Critical)
- **Score Component Breakdown**: Interactive progress indicators distinguishing Mid-Term Theory, Practical Laboratory, and Continuous Internal Assignments.
- **Personalized 4-Week Action Roadmap**: Concrete, week-by-week remedial roadmap to target weak subjects.
- **AI Study Mentor**: Context-aware chatbot giving tips on attendance recovery, examination timetables, and grade optimization.

---

### 👨‍💼 2. Faculty & Administrative Dashboard
- **Executive Batch KPIs**:
  - Total Active Student Count
  - Average Batch Score & Letter Grade
  - Department Attendance Average (color-coded)
  - Critical At-Risk Student Count
- **Visual Analytics Suite**:
  - **Grade Distribution Chart**: Interactive bar distribution across academic grades.
  - **Attendance vs. Performance Matrix**: 4-quadrant scatter mapping students into *Consistent Achievers*, *High Potential*, *Needs Tutoring*, and *High Dropout Risk*.
  - **Department Mastery**: Visual progress bars breaking down theory vs. practical competencies across Computer Science, Electronics, Mechanical, and Electrical branches.
- **Student Database & CRUD Operations**:
  - Live multi-field search (by Name, Roll Number, or Department)
  - Status filters (*Critical Risk*, *Watchlist*, *Top Performers*)
  - Click-to-sort headers (Roll Number, Attendance, Score)
  - Modal-based Add & Edit forms
  - Record deletion with confirmation guard
  - One-click **Export to CSV** for university reports.

---

### 🧠 3. Automated AI Diagnostic & Risk Scoring Engine
- **Heuristic ML Risk Formula (0–100 Score)**:
  - Attendance Weightage: **35%** (heavy penalty under 75% cutoff)
  - Mid-Term Theory Weightage: **25%**
  - Laboratory & Practicals: **20%**
  - Assignment Submissions: **20%**
- **Deep-Dive Diagnostic Modal**:
  - Pinpoints practical vs. theory comprehension gaps
  - Automated generation of mentor feedback notes
  - 4-week structured recovery schedule

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18 (Functional Components, Hooks) |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS (Dark Mode, Glassmorphic UI) |
| **Icons** | Lucide React |
| **State & Persistence** | Browser LocalStorage (Synchronized data store) |
| **Hosting & CI/CD** | Vercel |

---

## 🚀 Quick Start / Local Installation

Ensure you have **Node.js** (v18 or higher) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/thehardikpanchal889/Student-Analysis-portal.git
cd Student-Analysis-portal
```

### 2. Install dependencies
```bash
npm install
```

### 3. Launch local development server
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🔑 Demo Access Credentials

The application includes convenient **1-Click Quick Demo Buttons** on the landing page for rapid evaluation:

| User Role | Username / Identifier | Password | Access Level |
|---|---|---|---|
| **Faculty Admin** | `admin` | `admin` | Full Batch Oversight & CRUD Table |
| **Top Performer** | `CS2024001` | `password123` | Student View (Aarav Sharma - 91.6%) |
| **At-Risk Student** | `EC2024003` | `password123` | Student View (Rahul Verma - 62.4%) |
| **New Student** | *Sign up via registration form* | *Custom* | Personalized Self-Service View |

---

## ☁️ Deployment on Vercel

This repository is pre-configured with `vercel.json` for seamless Single Page Application (SPA) routing.

1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Click **Import** next to `thehardikpanchal889/Student-Analysis-portal`.
3. Keep the default settings (Framework Preset: **Vite**).
4. Click **Deploy**.

---

## 📂 Project Structure

```
Student-Analysis-portal/
├── index.html              # HTML Entry Point
├── package.json            # Project dependencies & scripts
├── postcss.config.js       # PostCSS plugins
├── tailwind.config.js      # Tailwind theme configuration
├── vercel.json             # Vercel SPA routing rewrites
├── vite.config.js          # Vite build config
├── src/
│   ├── App.jsx             # Complete, self-contained application architecture
│   ├── index.css           # Global stylesheet & scrollbar styles
│   └── main.jsx            # React root mount
└── README.md               # Project documentation
```

---

## 👨‍💻 Author

- **Hardik Panchal** - [@thehardikpanchal889](https://github.com/thehardikpanchal889)
- Academic Mini-Project Submission

---

## 📄 License

This project is licensed under the MIT License - feel free to use and adapt it for academic and non-commercial purposes.
