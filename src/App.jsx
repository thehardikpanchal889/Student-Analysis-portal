import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  isCloudEnabled,
  fetchStudentsFromCloud,
  insertStudentToCloud,
  updateStudentInCloud,
  deleteStudentFromCloud
} from './supabase';
import {
  Users, GraduationCap, TrendingUp, AlertTriangle, Search, Plus, Trash2, Edit3,
  Sparkles, BrainCircuit, Download, CheckCircle2, BarChart3, X, Send, ChevronDown,
  ChevronUp, Eye, MessageCircle, ArrowUpDown, BookOpen, Activity, Target, Zap,
  Shield, Clock, Star, FileText, UserCheck, AlertCircle, Info, Menu, Home,
  LogOut, Settings, Bell, Calendar, Award, CheckSquare, Compass, RefreshCw, Cloud, Database
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// INITIAL MOCK DATA — Mirrors your MySQL `students` table schema
// Extended with academic metrics for ML-driven AI diagnostics
// ═══════════════════════════════════════════════════════════════
const INITIAL_STUDENTS = [
  { id: 1, name: "Aarav Sharma", rollno: "CS2024001", password: "password123", father: "Rajesh Sharma", phone: "9876543210", email: "aarav.s@college.edu", passing_year: 2028, college: "NIT Trichy", university: "Anna University", marks: 458, percentage: 91.6, department: "Computer Science", semester: 5, attendance: 92, midterm: 88, labScore: 95, assignmentsCompleted: 98 },
  { id: 2, name: "Priya Patel", rollno: "CS2024002", password: "password123", father: "Vikram Patel", phone: "9876543211", email: "priya.p@college.edu", passing_year: 2028, college: "NIT Trichy", university: "Anna University", marks: 472, percentage: 94.4, department: "Computer Science", semester: 5, attendance: 96, midterm: 94, labScore: 97, assignmentsCompleted: 100 },
  { id: 3, name: "Rahul Verma", rollno: "EC2024003", password: "password123", father: "Suresh Verma", phone: "9876543212", email: "rahul.v@college.edu", passing_year: 2028, college: "NIT Trichy", university: "Anna University", marks: 312, percentage: 62.4, department: "Electronics", semester: 5, attendance: 58, midterm: 52, labScore: 48, assignmentsCompleted: 45 },
  { id: 4, name: "Sneha Gupta", rollno: "ME2024004", password: "password123", father: "Anil Gupta", phone: "9876543213", email: "sneha.g@college.edu", passing_year: 2028, college: "NIT Trichy", university: "Anna University", marks: 389, percentage: 77.8, department: "Mechanical", semester: 5, attendance: 78, midterm: 72, labScore: 80, assignmentsCompleted: 85 },
  { id: 5, name: "Karan Singh", rollno: "CS2024005", password: "password123", father: "Harpreet Singh", phone: "9876543214", email: "karan.s@college.edu", passing_year: 2028, college: "NIT Trichy", university: "Anna University", marks: 278, percentage: 55.6, department: "Computer Science", semester: 5, attendance: 48, midterm: 42, labScore: 38, assignmentsCompleted: 35 },
  { id: 6, name: "Ananya Reddy", rollno: "EC2024006", password: "password123", father: "Krishna Reddy", phone: "9876543215", email: "ananya.r@college.edu", passing_year: 2028, college: "NIT Trichy", university: "Anna University", marks: 425, percentage: 85.0, department: "Electronics", semester: 5, attendance: 88, midterm: 82, labScore: 90, assignmentsCompleted: 92 },
  { id: 7, name: "Vikash Kumar", rollno: "ME2024007", password: "password123", father: "Ramesh Kumar", phone: "9876543216", email: "vikash.k@college.edu", passing_year: 2028, college: "NIT Trichy", university: "Anna University", marks: 345, percentage: 69.0, department: "Mechanical", semester: 5, attendance: 65, midterm: 60, labScore: 55, assignmentsCompleted: 62 },
  { id: 8, name: "Divya Nair", rollno: "CS2024008", password: "password123", father: "Sunil Nair", phone: "9876543217", email: "divya.n@college.edu", passing_year: 2028, college: "NIT Trichy", university: "Anna University", marks: 445, percentage: 89.0, department: "Computer Science", semester: 5, attendance: 91, midterm: 86, labScore: 92, assignmentsCompleted: 95 },
  { id: 9, name: "Arjun Mehta", rollno: "EC2024009", password: "password123", father: "Prakash Mehta", phone: "9876543218", email: "arjun.m@college.edu", passing_year: 2028, college: "NIT Trichy", university: "Anna University", marks: 298, percentage: 59.6, department: "Electronics", semester: 5, attendance: 55, midterm: 48, labScore: 45, assignmentsCompleted: 50 },
  { id: 10, name: "Meera Joshi", rollno: "ME2024010", password: "password123", father: "Deepak Joshi", phone: "9876543219", email: "meera.j@college.edu", passing_year: 2028, college: "NIT Trichy", university: "Anna University", marks: 410, percentage: 82.0, department: "Mechanical", semester: 5, attendance: 84, midterm: 78, labScore: 85, assignmentsCompleted: 88 },
];

// Helper to safely load and sync localStorage
function getStoredStudents() {
  try {
    const data = localStorage.getItem('STUDENT_PORTAL_DATA_V2');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse localStorage students", e);
  }
  return INITIAL_STUDENTS;
}

function saveStoredStudents(students) {
  try {
    localStorage.setItem('STUDENT_PORTAL_DATA_V2', JSON.stringify(students));
  } catch (e) {
    console.error("Failed to save to localStorage", e);
  }
}

// ═══════════════════════════════════════════════════════════════
// AI RISK SCORING ENGINE
// ═══════════════════════════════════════════════════════════════
function computeRiskScore(s) {
  let score = 0;
  // Attendance weight: 35%
  if (s.attendance < 50) score += 35;
  else if (s.attendance < 65) score += 28;
  else if (s.attendance < 75) score += 18;
  else if (s.attendance < 85) score += 8;

  // Midterm weight: 25%
  if (s.midterm < 40) score += 25;
  else if (s.midterm < 55) score += 20;
  else if (s.midterm < 70) score += 12;
  else if (s.midterm < 80) score += 5;

  // Lab Score weight: 20%
  if (s.labScore < 40) score += 20;
  else if (s.labScore < 55) score += 16;
  else if (s.labScore < 70) score += 10;
  else if (s.labScore < 80) score += 4;

  // Assignments weight: 20%
  if (s.assignmentsCompleted < 40) score += 20;
  else if (s.assignmentsCompleted < 55) score += 16;
  else if (s.assignmentsCompleted < 70) score += 10;
  else if (s.assignmentsCompleted < 80) score += 4;

  return Math.min(100, score);
}

function getRiskCategory(score) {
  if (score >= 60) return { label: "Critical", color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/40", pill: "bg-red-500/30 text-red-300" };
  if (score >= 35) return { label: "Watchlist", color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/40", pill: "bg-amber-500/30 text-amber-300" };
  if (score >= 15) return { label: "Moderate", color: "text-cyan-400", bg: "bg-cyan-500/20", border: "border-cyan-500/40", pill: "bg-cyan-500/30 text-cyan-300" };
  return { label: "Safe", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/40", pill: "bg-emerald-500/30 text-emerald-300" };
}

function getPerformanceLabel(pct) {
  if (pct >= 90) return "O";
  if (pct >= 80) return "A+";
  if (pct >= 70) return "A";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  return "F";
}

function getGradeColor(grade) {
  const map = { "O": "text-emerald-400", "A+": "text-cyan-400", "A": "text-blue-400", "B": "text-indigo-400", "C": "text-amber-400", "F": "text-red-400" };
  return map[grade] || "text-slate-400";
}

// ═══════════════════════════════════════════════════════════════
// AI DIAGNOSTIC ENGINE (Personalized Root Cause & Roadmap)
// ═══════════════════════════════════════════════════════════════
function generateDiagnostic(s) {
  const risk = computeRiskScore(s);
  const cat = getRiskCategory(risk);
  const grade = getPerformanceLabel(s.percentage);

  // Predicted performance
  const adjustedPct = (s.percentage * 0.4 + s.midterm * 0.25 + s.labScore * 0.2 + s.assignmentsCompleted * 0.15);
  const predictedGrade = getPerformanceLabel(adjustedPct);
  const confidence = s.attendance >= 80 ? "High (±3%)" : s.attendance >= 65 ? "Medium (±8%)" : "Low (±15%)";

  // Root cause analysis
  const causes = [];
  if (s.attendance < 75 && s.midterm >= 60) causes.push(`Attendance at ${s.attendance}% is critically below the 75% cutoff despite respectable theory marks (${s.midterm}%). This reveals an engagement or attendance barrier rather than an academic difficulty.`);
  if (s.attendance >= 80 && s.midterm < 55) causes.push(`Despite excellent lecture attendance (${s.attendance}%), mid-term exam marks (${s.midterm}%) indicate concept gaps during active testing. Shift from passive listening to active problem recall.`);
  if (s.labScore < 55 && s.midterm >= 65) causes.push(`Sharp dip in laboratory/practical scores (${s.labScore}%) compared to ${s.midterm}% in theory. Hands-on laboratory practice sessions need urgent priority.`);
  if (s.assignmentsCompleted < 60) causes.push(`Assignment submission rate (${s.assignmentsCompleted}%) is severely lagging. Missing continuous internal assessments directly pulls down semester CGPA.`);
  if (s.attendance < 50) causes.push(`Attendance below 50% (${s.attendance}%) puts you in immediate debarment danger under university guidelines. Urgent academic council clearance required.`);
  if (causes.length === 0 && risk < 20) causes.push(`Outstanding consistency across attendance (${s.attendance}%), lab work (${s.labScore}%), and theory (${s.midterm}%). On track for top-tier academic honors or Dean's list.`);
  if (causes.length === 0) causes.push(`Balanced performance across semesters. Consolidating lab work and completing remaining assignments will readily elevate final marks into the next higher grade bracket.`);

  // 4-week recovery plan
  const plan = [];
  if (s.attendance < 75) {
    plan.push({ week: "Week 1", action: "Establish 100% daily lecture attendance. Meet department coordinator to clear attendance condonation requirements." });
    plan.push({ week: "Week 2", action: "Enroll in evening remedial tutorial classes. Track daily lecture sign-ins with class advisor." });
  } else {
    plan.push({ week: "Week 1", action: "Review core lecture modules. Outline concept maps for heavy-weight topics in " + s.department + "." });
    plan.push({ week: "Week 2", action: "Solve past 3 years university question papers. Participate actively in study group seminars." });
  }

  if (s.labScore < 65 || s.midterm < 60) {
    plan.push({ week: "Week 3", action: `Book 3 supplementary lab slots. Re-run experiments in ${s.department} labs with peer assistance to master practical viva voce questions.` });
  } else {
    plan.push({ week: "Week 3", action: "Take full-length simulated mock exam. Focus on speed, diagram clarity, and high-mark numerical questions." });
  }

  if (s.assignmentsCompleted < 70) {
    plan.push({ week: "Week 4", action: "Submit backlog assignments to instructors for partial internal assessment recovery before the university portal lock date." });
  } else {
    plan.push({ week: "Week 4", action: "Final revision cycle: Consolidate lab records, formulas, and flashcards for comprehensive semester exam readiness." });
  }

  // Teacher recommendations
  const recommendations = [];
  if (risk >= 60) {
    recommendations.push("Schedule an immediate academic counseling session with the head of department.");
    recommendations.push("Assign dedicated faculty mentor for weekly progress validation.");
    recommendations.push("Issue formal attendance warning notice to ensure parents/guardians are informed.");
  }
  if (s.labScore < 55) recommendations.push(`Provide additional lab equipment access and pair with a lab topper for practical guidance in ${s.department}.`);
  if (s.attendance < 65) recommendations.push("Submit medical or legitimate exemption certificates if applicable to avoid semester debarment.");
  if (s.midterm < 55) recommendations.push("Provide solved question banks and chapter-wise summary notes for core subjects.");
  if (recommendations.length === 0) {
    recommendations.push("Commendable performance. Consider nominating for department peer tutoring or research project lead.");
    recommendations.push("Encourage participating in national technical symposiums and competitive hackathons.");
  }

  return { risk, category: cat, predictedGrade, predictedPct: adjustedPct.toFixed(1), confidence, causes, plan, recommendations, grade };
}

// ═══════════════════════════════════════════════════════════════
// AI COPILOT ENGINE (Works for Admin & Individual Students)
// ═══════════════════════════════════════════════════════════════
function generateCopilotResponse(query, context, isStudent = false) {
  const q = query.toLowerCase();

  // If query is from an individual student view:
  if (isStudent && context) {
    const s = context;
    const diag = generateDiagnostic(s);

    if (q.includes("attendance") || q.includes("75") || q.includes("classes") || q.includes("debar")) {
      if (s.attendance >= 75) {
        return `✅ **Your Attendance is Safe (${s.attendance}%)**\nYou are comfortably above the university's 75% cutoff! To maintain your buffer:\n- Avoid missing consecutive lab/theory classes.\n- If you attend the next 10 classes, your attendance can rise to approximately **${Math.min(100, s.attendance + 3)}%**.`;
      }
      const neededClasses = Math.max(4, Math.ceil((75 - s.attendance) * 1.5));
      return `⚠️ **Attendance Recovery Strategy for ${s.name}:**\n\nYour current attendance is **${s.attendance}%** (needs to reach **75%**).\n\n📌 **Action Required:**\n- You must attend the next **${neededClasses} to ${neededClasses + 4} consecutive lecture sessions** without missing.\n- Submit any valid medical certificates to your department advisor.\n- Sign the daily attendance register at the HOD cabin to prevent semester debarment.`;
    }

    if (q.includes("cgpa") || q.includes("grade") || q.includes("improve") || q.includes("o grade") || q.includes("marks")) {
      return `🎯 **Score Improvement Roadmap for ${s.name}:**\n\n- Current Score: **${s.percentage}%** (Grade: **${diag.grade}**)\n- AI Predicted Final Grade: **${diag.predictedGrade}** (~${diag.predictedPct}%)\n\n💡 **Fastest ways to raise your GPA:**\n1. **Practical Labs (${s.labScore}%):** Labs carry 20% weight. Improving lab viva can easily add +3% to your overall aggregate.\n2. **Internal Assignments (${s.assignmentsCompleted}%):** Completing 100% of internal submissions gives you guaranteed scoring points.\n3. Target scoring 80+ in the upcoming end-semester theory exam to push yourself into the **${s.percentage >= 75 ? 'O Grade' : 'A+ Grade'}** bracket!`;
    }

    if (q.includes("schedule") || q.includes("timetable") || q.includes("study plan") || q.includes("revision")) {
      return `📅 **Personalized 7-Day Study Timetable (${s.department} - Sem ${s.semester}):**\n\n- **Mon & Tue (6:00 PM - 8:30 PM):** Core Theory revision & previous year question papers.\n- **Wed & Thu (6:00 PM - 8:00 PM):** Lab experiment write-ups, code debugging & circuit simulations.\n- **Friday (6:00 PM - 8:00 PM):** Assignment backlog completion and formula sheet memorization.\n- **Saturday:** Full-length 3-hour practice mock test on weak topics.\n- **Sunday:** Rest & review mistakes from mock test.\n\nStick to this for 3 weeks to see immediate improvement!`;
    }

    if (q.includes("weak") || q.includes("risk") || q.includes("struggle") || q.includes("diagnostic")) {
      return `🔍 **AI Academic Diagnostic Summary for ${s.name}:**\n\n- **Risk Status:** ${diag.category.label} (${diag.risk}/100)\n- **Primary Bottleneck:** ${diag.causes[0]}\n- **Key Faculty Advice:** ${diag.recommendations[0]}\n\nFocus on Week 1 of your recovery roadmap to turn this around!`;
    }

    return `👋 Hi **${s.name}**! I'm your AI Academic Study Advisor. Ask me anything like:\n• *"How do I raise my attendance to 75%?"*\n• *"How can I improve my score before finals?"*\n• *"Generate a 7-day study timetable for me"*\n• *"What are my weakest areas based on current marks?"*`;
  }

  // Admin / Batch mode context:
  const students = Array.isArray(context) ? context : [];
  const enriched = students.map(s => ({ ...s, riskScore: computeRiskScore(s), riskCat: getRiskCategory(computeRiskScore(s)) }));

  if (q.includes("urgent") || q.includes("attendance warning") || q.includes("low attendance")) {
    const atRisk = enriched.filter(s => s.attendance < 75).sort((a, b) => a.attendance - b.attendance);
    if (atRisk.length === 0) return "✅ Great news! All students currently have attendance above 75%. No urgent warnings needed.";
    let resp = `🚨 **Attendance Alert — ${atRisk.length} student(s) need urgent warnings:**\n\n`;
    atRisk.forEach((s, i) => {
      resp += `${i + 1}. **${s.name}** (${s.rollno}) — ${s.department}\n   📊 Attendance: **${s.attendance}%** | Risk: **${s.riskCat.label}**\n   ${s.attendance < 50 ? '⛔ CRITICAL: Below 50% — debarment threshold!' : '⚠️ Below 75% minimum — formal warning required.'}\n\n`;
    });
    resp += `\n**Recommended Action:** Issue attendance warning letters immediately and schedule advisor meetings within 48 hours.`;
    return resp;
  }

  if (q.includes("batch") || q.includes("strength") || q.includes("weakness") || q.includes("overall") || q.includes("summarize")) {
    const avgAtt = (enriched.reduce((a, s) => a + s.attendance, 0) / (enriched.length || 1)).toFixed(1);
    const avgPct = (enriched.reduce((a, s) => a + s.percentage, 0) / (enriched.length || 1)).toFixed(1);
    const avgMid = (enriched.reduce((a, s) => a + s.midterm, 0) / (enriched.length || 1)).toFixed(1);
    const avgLab = (enriched.reduce((a, s) => a + s.labScore, 0) / (enriched.length || 1)).toFixed(1);
    const critical = enriched.filter(s => s.riskScore >= 60).length;
    const toppers = enriched.filter(s => s.percentage >= 85).length;

    return `📊 **Batch Analytics Summary**\n\n**Overall Metrics:**\n- Average Attendance: **${avgAtt}%**\n- Average Percentage: **${avgPct}%**\n- Average Mid-Term: **${avgMid}%**\n- Average Lab Score: **${avgLab}%**\n\n**🟢 Strengths:**\n- ${toppers} students (${((toppers / (enriched.length || 1)) * 100).toFixed(0)}%) are performing at 85%+ — solid top tier\n- Lab scores are generally strong across Computer Science department\n- Assignment completion rates are healthy for top performers\n\n**🔴 Weaknesses:**\n- ${critical} student(s) in Critical risk zone needing immediate intervention\n- Attendance remains a systemic issue — ${enriched.filter(s => s.attendance < 75).length} students below 75%\n- Gap between theory and practical scores suggests lab reinforcement needed.`;
  }

  if (q.includes("remedial") || q.includes("study plan") || q.includes("recovery") || q.includes("at-risk")) {
    const atRisk = enriched.filter(s => s.riskScore >= 35).sort((a, b) => b.riskScore - a.riskScore);
    if (atRisk.length === 0) return "✅ No students currently qualify for remedial intervention. All risk scores are below the threshold.";
    let resp = `📋 **Remedial Study Plan — ${atRisk.length} Students Identified**\n\n`;
    atRisk.forEach((s, i) => {
      resp += `**${i + 1}. ${s.name}** (Risk: ${s.riskScore}/100 — ${s.riskCat.label})\n`;
      if (s.attendance < 65) resp += `   → Priority: Attendance recovery (current: ${s.attendance}%)\n`;
      if (s.labScore < 55) resp += `   → Priority: Lab remediation sessions (current: ${s.labScore}%)\n`;
      if (s.midterm < 55) resp += `   → Priority: Concept revision & tutoring (midterm: ${s.midterm}%)\n`;
      resp += `\n`;
    });
    return resp;
  }

  if (q.includes("peer tutor") || q.includes("top candidate") || q.includes("mentor")) {
    const top = enriched.filter(s => s.percentage >= 82 && s.attendance >= 85).sort((a, b) => b.percentage - a.percentage);
    let resp = `🌟 **Top Peer Tutoring Candidates:**\n\n`;
    top.forEach((s, i) => {
      resp += `${i + 1}. **${s.name}** — ${s.department} (${s.percentage}% | Att: ${s.attendance}%)\n`;
    });
    return resp;
  }

  return `🤖 I can help analyze your student batch!\n\n• **"Who needs urgent attendance warnings?"**\n• **"Summarize overall batch strengths & weaknesses"**\n• **"Generate remedial study plan for at-risk students"**\n• **"Identify top candidates for peer tutoring"**`;
}

// ═══════════════════════════════════════════════════════════════
// CSV EXPORT HELPER
// ═══════════════════════════════════════════════════════════════
function exportToCSV(students) {
  const headers = ["ID", "Name", "Roll No", "Department", "Semester", "Attendance %", "Mid-Term", "Lab Score", "Assignments %", "Marks", "Percentage", "Risk Score", "Risk Category"];
  const rows = students.map(s => {
    const risk = computeRiskScore(s);
    return [s.id, `"${s.name}"`, s.rollno, s.department, s.semester, s.attendance, s.midterm, s.labScore, s.assignmentsCompleted, s.marks, s.percentage, risk, getRiskCategory(risk).label];
  });
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "student_academic_analysis.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════════════
// KPI CARD COMPONENT
// ═══════════════════════════════════════════════════════════════
function KPICard({ icon: Icon, label, value, subtitle, color, trend }) {
  return (
    <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${color} bg-opacity-20`}>
          <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-').replace('/20', '')}`} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend.includes('+') || trend.includes('▲') || trend.includes('Healthy') || trend.includes('Safe') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        <p className="text-sm text-slate-400 mt-0.5">{label}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// VISUAL ANALYTICS: GRADE DISTRIBUTION
// ═══════════════════════════════════════════════════════════════
function GradeDistribution({ students }) {
  const grades = { O: 0, "A+": 0, A: 0, B: 0, C: 0, F: 0 };
  students.forEach(s => { grades[getPerformanceLabel(s.percentage)]++; });
  const max = Math.max(...Object.values(grades), 1);
  const colors = { O: "bg-emerald-500", "A+": "bg-cyan-500", A: "bg-blue-500", B: "bg-indigo-500", C: "bg-amber-500", F: "bg-red-500" };

  return (
    <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Grade Distribution</h3>
      </div>
      <div className="flex items-end gap-3 h-40">
        {Object.entries(grades).map(([grade, count]) => (
          <div key={grade} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-xs font-bold text-slate-300">{count}</span>
            <div className="w-full rounded-t-lg transition-all duration-700 ease-out" style={{ height: `${(count / max) * 100}%`, minHeight: count > 0 ? '8px' : '2px' }}>
              <div className={`w-full h-full rounded-t-lg ${colors[grade]} opacity-80`} />
            </div>
            <span className={`text-xs font-semibold ${getGradeColor(grade)}`}>{grade}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// VISUAL ANALYTICS: ATTENDANCE VS PERFORMANCE
// ═══════════════════════════════════════════════════════════════
function AttendancePerformanceMatrix({ students }) {
  const quadrants = {
    "Consistent Achievers": { students: [], color: "text-emerald-400", bg: "bg-emerald-500/10", icon: "🏆" },
    "High Potential": { students: [], color: "text-cyan-400", bg: "bg-cyan-500/10", icon: "💡" },
    "Needs Tutoring": { students: [], color: "text-amber-400", bg: "bg-amber-500/10", icon: "📚" },
    "High Dropout Risk": { students: [], color: "text-red-400", bg: "bg-red-500/10", icon: "🚨" },
  };

  students.forEach(s => {
    const highAtt = s.attendance >= 75;
    const highScore = s.percentage >= 70;
    if (highAtt && highScore) quadrants["Consistent Achievers"].students.push(s);
    else if (!highAtt && highScore) quadrants["High Potential"].students.push(s);
    else if (highAtt && !highScore) quadrants["Needs Tutoring"].students.push(s);
    else quadrants["High Dropout Risk"].students.push(s);
  });

  return (
    <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Target className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Performance Matrix</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(quadrants).map(([label, data]) => (
          <div key={label} className={`${data.bg} rounded-xl p-3 border border-slate-800`}>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-sm">{data.icon}</span>
              <span className={`text-xs font-semibold ${data.color}`}>{label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{data.students.length}</p>
            <div className="mt-1.5 space-y-0.5">
              {data.students.slice(0, 2).map(s => (
                <p key={s.id} className="text-[10px] text-slate-500 truncate">{s.name}</p>
              ))}
              {data.students.length > 2 && <p className="text-[10px] text-slate-600">+{data.students.length - 2} more</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// VISUAL ANALYTICS: DEPARTMENT MASTERY
// ═══════════════════════════════════════════════════════════════
function SubjectMastery({ students }) {
  const depts = {};
  students.forEach(s => {
    if (!depts[s.department]) depts[s.department] = { midterm: [], lab: [], assignments: [], attendance: [] };
    depts[s.department].midterm.push(s.midterm);
    depts[s.department].lab.push(s.labScore);
    depts[s.department].assignments.push(s.assignmentsCompleted);
    depts[s.department].attendance.push(s.attendance);
  });

  const avg = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(0) : 0;
  const barColor = v => v >= 80 ? "bg-emerald-500" : v >= 65 ? "bg-cyan-500" : v >= 50 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <BookOpen className="w-5 h-5 text-violet-400" />
        <h3 className="text-lg font-semibold text-white">Department Mastery</h3>
      </div>
      <div className="space-y-4">
        {Object.entries(depts).map(([dept, data]) => {
          const metrics = [
            { label: "Theory", val: avg(data.midterm) },
            { label: "Labs", val: avg(data.lab) },
            { label: "Assignments", val: avg(data.assignments) },
            { label: "Attendance", val: avg(data.attendance) },
          ];
          return (
            <div key={dept}>
              <p className="text-sm font-semibold text-slate-300 mb-2">{dept}</p>
              <div className="space-y-1.5">
                {metrics.map(m => (
                  <div key={m.label} className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 w-16">{m.label}</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-2">
                      <div className={`h-full rounded-full ${barColor(m.val)} transition-all duration-700`} style={{ width: `${m.val}%` }} />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 w-8 text-right">{m.val}%</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ADD / EDIT STUDENT MODAL (For Admin)
// ═══════════════════════════════════════════════════════════════
function StudentModal({ student, onSave, onClose }) {
  const [form, setForm] = useState(student || {
    name: "", rollno: "", father: "", phone: "", email: "", passing_year: 2028,
    college: "NIT Trichy", university: "Anna University", marks: 380, percentage: 76,
    department: "Computer Science", semester: 5, attendance: 75, midterm: 70,
    labScore: 70, assignmentsCompleted: 80, password: "password123"
  });

  const handleChange = (field, value) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      if (field === "marks") {
        const p = Math.min(100, (parseFloat(value || 0) / 500) * 100);
        updated.percentage = parseFloat(p.toFixed(1));
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.rollno.trim()) return;
    onSave({
      ...form,
      marks: parseInt(form.marks) || 0,
      percentage: parseFloat(form.percentage) || 0,
      attendance: parseInt(form.attendance) || 0,
      midterm: parseInt(form.midterm) || 0,
      labScore: parseInt(form.labScore) || 0,
      assignmentsCompleted: parseInt(form.assignmentsCompleted) || 0,
      semester: parseInt(form.semester) || 1,
      passing_year: parseInt(form.passing_year) || 2028,
      password: form.password || "password123"
    });
  };

  const fields = [
    { label: "Student Full Name *", key: "name", type: "text" },
    { label: "Roll Number / ID *", key: "rollno", type: "text" },
    { label: "Father's Name", key: "father", type: "text" },
    { label: "Phone Number", key: "phone", type: "text" },
    { label: "Email Address", key: "email", type: "email" },
    { label: "Department / Branch", key: "department", type: "select", options: ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical"] },
    { label: "Semester", key: "semester", type: "number", min: 1, max: 8 },
    { label: "Total Marks (out of 500)", key: "marks", type: "number", min: 0, max: 500 },
    { label: "Attendance %", key: "attendance", type: "number", min: 0, max: 100 },
    { label: "Mid-Term Score %", key: "midterm", type: "number", min: 0, max: 100 },
    { label: "Lab / Practical %", key: "labScore", type: "number", min: 0, max: 100 },
    { label: "Assignments Done %", key: "assignmentsCompleted", type: "number", min: 0, max: 100 },
    { label: "College Name", key: "college", type: "text" },
    { label: "University Name", key: "university", type: "text" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-5 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {student ? <Edit3 className="w-5 h-5 text-cyan-400" /> : <Plus className="w-5 h-5 text-emerald-400" />}
            {student ? "Edit Student Profile" : "Add New Student Record"}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg transition"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {fields.map(f => (
              <div key={f.key}>
                <label className="text-xs font-medium text-slate-400 mb-1 block">{f.label}</label>
                {f.type === "select" ? (
                  <select value={form[f.key]} onChange={e => handleChange(f.key, e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition">
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={f.type} value={form[f.key]} onChange={e => handleChange(f.key, e.target.value)} min={f.min} max={f.max} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition placeholder-slate-600" />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-3 border-t border-slate-800">
            <button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {student ? "Save Changes" : "Create Student Record"}
            </button>
            <button type="button" onClick={onClose} className="px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// AI DIAGNOSTIC MODAL (Deep-Dive Analysis)
// ═══════════════════════════════════════════════════════════════
function DiagnosticModal({ student, onClose }) {
  const diag = generateDiagnostic(student);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-violet-600/20 via-cyan-600/20 to-indigo-600/20 border-b border-slate-800 p-5 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/20 rounded-xl">
              <BrainCircuit className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AI Academic Diagnostic</h2>
              <p className="text-sm text-slate-400">{student.name} — {student.rollno} ({student.department})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg transition"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Top Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className={`${diag.category.bg} border ${diag.category.border} rounded-xl p-4`}>
              <p className="text-xs text-slate-400 mb-1">Academic Risk Score</p>
              <p className={`text-3xl font-black ${diag.category.color}`}>{diag.risk}/100</p>
              <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${diag.category.pill}`}>{diag.category.label}</span>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Predicted Final Grade</p>
              <p className={`text-3xl font-black ${getGradeColor(diag.predictedGrade)}`}>{diag.predictedGrade}</p>
              <p className="text-xs text-slate-400 mt-1">~{diag.predictedPct}% (Confidence: {diag.confidence})</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Current Standing</p>
              <div className="space-y-1 mt-1">
                <div className="flex justify-between text-xs"><span className="text-slate-400">Attendance</span><span className={student.attendance < 75 ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>{student.attendance}%</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-400">Mid-Term</span><span className="text-slate-200">{student.midterm}%</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-400">Lab Score</span><span className="text-slate-200">{student.labScore}%</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-400">Assignments</span><span className="text-slate-200">{student.assignmentsCompleted}%</span></div>
              </div>
            </div>
          </div>

          {/* Root Cause Analysis */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-400" /> AI Root Cause Analysis
            </h3>
            <div className="space-y-2.5">
              {diag.causes.map((c, i) => (
                <p key={i} className="text-sm text-slate-300 leading-relaxed pl-3.5 border-l-2 border-amber-500/50">{c}</p>
              ))}
            </div>
          </div>

          {/* 4-Week Roadmap */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-cyan-400" /> Personalized 4-Week Academic Recovery Plan
            </h3>
            <div className="space-y-3">
              {diag.plan.map((p, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800/60">
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2 py-1 rounded border border-cyan-800/50 flex-shrink-0">{p.week}</span>
                  <p className="text-sm text-slate-300 leading-relaxed">{p.action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher Recommendations */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <UserCheck className="w-4 h-4 text-violet-400" /> Advisor & Mentor Guidance
            </h3>
            <ul className="space-y-2">
              {diag.recommendations.map((r, i) => (
                <li key={i} className="text-sm text-slate-300 leading-relaxed flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// AI COPILOT CHAT DRAWER
// ═══════════════════════════════════════════════════════════════
function CopilotDrawer({ open, onClose, context, isStudent = false }) {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: isStudent
        ? `👋 Hello **${context?.name || 'Student'}**! I'm your personalized AI Academic Copilot. Ask me about your attendance recovery, study schedules, or tips to boost your CGPA!`
        : "👋 Hello! I'm your batch AI Academic Copilot. Ask me about batch statistics, urgent attendance warnings, remedial recommendations, or top peer tutors."
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const quickPrompts = isStudent
    ? [
        "How do I raise my attendance to 75%?",
        "How can I improve my score before finals?",
        "Generate a 7-day study timetable for me",
        "What are my weakest areas based on current marks?"
      ]
    : [
        "Who needs urgent attendance warnings?",
        "Summarize overall batch strengths & weaknesses",
        "Generate remedial study plan for at-risk students",
        "Identify top candidates for peer tutoring"
      ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text) => {
    const query = text || input.trim();
    if (!query) return;
    setMessages(prev => [...prev, { role: "user", text: query }]);
    setInput("");
    setTimeout(() => {
      const response = generateCopilotResponse(query, context, isStudent);
      setMessages(prev => [...prev, { role: "ai", text: response }]);
    }, 450);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600/20 via-indigo-600/20 to-violet-600/20 border-b border-slate-800 p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/20 rounded-xl">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Academic Copilot</h3>
              <p className="text-[11px] text-slate-400">
                {isStudent ? `Personalized for ${context?.name}` : "Batch Intelligence Engine"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg transition"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-cyan-600/30 text-cyan-100 rounded-br-md border border-cyan-500/30" : "bg-slate-800/90 text-slate-200 rounded-bl-md border border-slate-700"}`}>
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0 border-t border-slate-800/60 bg-slate-950/40">
          {quickPrompts.map((p, i) => (
            <button key={i} onClick={() => handleSend(p)} className="flex-shrink-0 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700 rounded-full px-3 py-1.5 transition whitespace-nowrap">
              {p}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-800 flex-shrink-0 bg-slate-900">
          <div className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder={isStudent ? "Ask your AI academic tutor..." : "Ask about your students..."} className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition placeholder-slate-500" />
            <button onClick={() => handleSend()} className="bg-cyan-600 hover:bg-cyan-500 p-2.5 rounded-xl transition text-white">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DEDICATED STUDENT PERFORMANCE PORTAL (When Student Logs In)
// ═══════════════════════════════════════════════════════════════
function StudentDashboard({ student, onLogout }) {
  const [copilotOpen, setCopilotOpen] = useState(false);
  const diag = useMemo(() => generateDiagnostic(student), [student]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-xl">
              <GraduationCap className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Student Academic Portal</h1>
              <p className="text-[11px] text-slate-400">{student.college} • {student.university}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border ${isCloudEnabled ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${isCloudEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              {isCloudEnabled ? 'Cloud Database Connected' : 'Local Storage Mode'}
            </div>
            <button onClick={() => setCopilotOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-lg shadow-cyan-900/40">
              <Sparkles className="w-4 h-4" /> AI Study Mentor
            </button>
            <button onClick={onLogout} className="p-2 hover:bg-slate-800 rounded-xl transition text-slate-400 hover:text-white" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-cyan-500/20">
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold text-white">{student.name}</h2>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${diag.category.pill}`}>
                  {diag.category.label} ({diag.risk} Risk)
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Roll No: <span className="text-slate-200 font-mono font-medium">{student.rollno}</span> • Department: <span className="text-slate-200 font-medium">{student.department}</span> • Semester: <span className="text-slate-200 font-medium">{student.semester}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400">Class Standing</p>
              <p className="text-lg font-bold text-cyan-400">{student.percentage >= 85 ? "Dean's Honors" : student.percentage >= 70 ? "Good Standing" : "Remedial Track"}</p>
            </div>
          </div>
        </div>

        {/* Attendance Alert Banner if < 75% */}
        {student.attendance < 75 ? (
          <div className="bg-red-500/15 border border-red-500/40 rounded-2xl p-4 flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-300">Urgent Attendance Warning ({student.attendance}% Current)</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Your attendance has fallen below the mandatory 75% university eligibility requirement. You are currently at risk of debarment from the final semester examinations. Please attend all upcoming lectures and submit relevant condonation requests.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-2xl p-4 flex items-start gap-3.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-emerald-300">Attendance in Good Standing ({student.attendance}%)</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                You comfortably exceed the minimum 75% university attendance threshold. Keep up this regular attendance for continuous internal assessment bonus marks.
              </p>
            </div>
          </div>
        )}

        {/* 4 Personal KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            icon={Award}
            label="Overall Score / CGPA"
            value={`${student.percentage}%`}
            subtitle={`Grade: ${getPerformanceLabel(student.percentage)} (${student.marks}/500 Marks)`}
            color="bg-cyan-500/20"
            trend={student.percentage >= 75 ? "▲ First Class" : "Needs Push"}
          />
          <KPICard
            icon={Activity}
            label="Lecture Attendance"
            value={`${student.attendance}%`}
            subtitle={student.attendance >= 75 ? "Eligible for Exams" : "Debarment Threshold"}
            color={student.attendance >= 75 ? "bg-emerald-500/20" : "bg-red-500/20"}
            trend={student.attendance >= 75 ? "✓ Safe" : "⚠ Urgent"}
          />
          <KPICard
            icon={BrainCircuit}
            label="Predicted Final Grade"
            value={diag.predictedGrade}
            subtitle={`Projected ~${diag.predictedPct}% (${diag.confidence})`}
            color="bg-violet-500/20"
            trend="AI Model"
          />
          <KPICard
            icon={Shield}
            label="Academic Health Risk"
            value={`${diag.risk}/100`}
            subtitle={`Status: ${diag.category.label}`}
            color={diag.risk >= 60 ? "bg-red-500/20" : diag.risk >= 35 ? "bg-amber-500/20" : "bg-emerald-500/20"}
            trend={diag.risk < 35 ? "Low Risk" : "Critical"}
          />
        </div>

        {/* Score Breakdown Bars */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" /> Internal Performance Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-400">Mid-Term Examination</span>
                <span className="font-bold text-white">{student.midterm}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5">
                <div className={`h-full rounded-full ${student.midterm >= 75 ? 'bg-emerald-500' : student.midterm >= 55 ? 'bg-cyan-500' : 'bg-red-500'}`} style={{ width: `${student.midterm}%` }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Weightage: 25% of internal aggregate</p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-400">Practical & Laboratory</span>
                <span className="font-bold text-white">{student.labScore}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5">
                <div className={`h-full rounded-full ${student.labScore >= 75 ? 'bg-emerald-500' : student.labScore >= 55 ? 'bg-cyan-500' : 'bg-red-500'}`} style={{ width: `${student.labScore}%` }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Weightage: 20% of practical assessment</p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-400">Assignments Completed</span>
                <span className="font-bold text-white">{student.assignmentsCompleted}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5">
                <div className={`h-full rounded-full ${student.assignmentsCompleted >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${student.assignmentsCompleted}%` }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Continuous internal assessment records</p>
            </div>
          </div>
        </div>

        {/* AI Diagnostic + Action Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Diagnostic Root Cause */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-violet-400" /> AI Root Cause Analysis
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Derived by our academic evaluation heuristic analyzing your theory vs lab discrepancies.
              </p>
              <div className="space-y-3">
                {diag.causes.map((cause, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 text-sm text-slate-300 leading-relaxed flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{cause}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 p-4 rounded-xl bg-violet-950/20 border border-violet-800/40">
              <h4 className="text-xs font-bold text-violet-300 mb-1 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" /> Advisor Recommendation:
              </h4>
              <p className="text-xs text-slate-300">{diag.recommendations[0]}</p>
            </div>
          </div>

          {/* 4-Week Roadmap */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" /> Personalized 4-Week Action Roadmap
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Step-by-step roadmap tailored to push your performance into the next grade tier.
            </p>
            <div className="space-y-3">
              {diag.plan.map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-3">
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-800/50 px-2 py-1 rounded flex-shrink-0">
                    {item.week}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed pt-0.5">{item.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Student Metadata Registry Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" /> College Registration Details
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-slate-500">Father's Name</p>
              <p className="text-slate-200 font-medium mt-0.5">{student.father || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500">Contact Phone</p>
              <p className="text-slate-200 font-medium mt-0.5">{student.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500">Institutional Email</p>
              <p className="text-slate-200 font-medium mt-0.5">{student.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500">Expected Graduation</p>
              <p className="text-slate-200 font-medium mt-0.5">{student.passing_year || 2028}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating AI Study Mentor Button */}
      <button onClick={() => setCopilotOpen(true)} className="fixed bottom-6 right-6 z-30 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white p-3.5 rounded-2xl shadow-xl shadow-cyan-900/40 transition-all hover:scale-105 flex items-center gap-2">
        <Sparkles className="w-5 h-5" />
        <span className="text-xs font-semibold">Ask AI Tutor</span>
      </button>

      {/* AI Copilot Drawer */}
      {copilotOpen && (
        <CopilotDrawer open={copilotOpen} onClose={() => setCopilotOpen(false)} context={student} isStudent={true} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ADMIN DASHBOARD (Batch Oversight, CRUD & Analytics)
// ═══════════════════════════════════════════════════════════════
function AdminDashboard({ students, setStudents, onLogout }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [modalStudent, setModalStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [diagStudent, setDiagStudent] = useState(null);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // Automatically fetch latest live records from Cloud when Admin Dashboard mounts
  useEffect(() => {
    async function syncLatestFromCloud() {
      if (isCloudEnabled) {
        setSyncing(true);
        const fresh = await fetchStudentsFromCloud();
        if (fresh && fresh.length > 0) {
          setStudents(fresh);
          saveStoredStudents(fresh);
        }
        setSyncing(false);
      }
    }
    syncLatestFromCloud();
  }, []);

  // Enriched students with risk scores
  const enriched = useMemo(() => students.map(s => ({
    ...s, riskScore: computeRiskScore(s), riskCategory: getRiskCategory(computeRiskScore(s))
  })), [students]);

  // Filtered & sorted
  const displayed = useMemo(() => {
    let list = enriched;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.rollno.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
      );
    }

    if (filter === "critical") list = list.filter(s => s.riskScore >= 60);
    else if (filter === "watchlist") list = list.filter(s => s.riskScore >= 35 && s.riskScore < 60);
    else if (filter === "top") list = list.filter(s => s.percentage >= 85);

    if (sortField) {
      list = [...list].sort((a, b) => {
        const va = a[sortField], vb = b[sortField];
        if (typeof va === "number") return sortDir === "asc" ? va - vb : vb - va;
        return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
      });
    }

    return list;
  }, [enriched, search, filter, sortField, sortDir]);

  // KPI calculations
  const avgPct = useMemo(() => students.length ? (students.reduce((a, s) => a + s.percentage, 0) / students.length).toFixed(1) : "0.0", [students]);
  const avgAtt = useMemo(() => students.length ? (students.reduce((a, s) => a + s.attendance, 0) / students.length).toFixed(1) : "0.0", [students]);
  const atRiskCount = useMemo(() => enriched.filter(s => s.riskScore >= 60).length, [enriched]);

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const handleSave = async (data) => {
    let updated;
    if (data.id) {
      updated = students.map(s => s.id === data.id ? data : s);
      setStudents(updated);
      saveStoredStudents(updated);
      if (isCloudEnabled) {
        await updateStudentInCloud(data.id, data);
        const fresh = await fetchStudentsFromCloud();
        if (fresh && fresh.length > 0) setStudents(fresh);
      }
    } else {
      const newId = students.length ? Math.max(...students.map(s => s.id)) + 1 : 1;
      const created = { ...data, id: newId };
      updated = [...students, created];
      setStudents(updated);
      saveStoredStudents(updated);
      if (isCloudEnabled) {
        await insertStudentToCloud(created);
        const fresh = await fetchStudentsFromCloud();
        if (fresh && fresh.length > 0) setStudents(fresh);
      }
    }
    setShowAddModal(false);
    setModalStudent(null);
  };

  const handleDelete = async (id) => {
    const target = students.find(s => s.id === id);
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    saveStoredStudents(updated);
    if (isCloudEnabled) {
      await deleteStudentFromCloud(id, target?.rollno);
    }
    setDeleteConfirm(null);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-slate-600" />;
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3 text-cyan-400" /> : <ChevronDown className="w-3 h-3 text-cyan-400" />;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Topbar */}
      <nav className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-cyan-400" />
            <h1 className="text-sm font-bold text-white hidden sm:block">AI Student Analysis Portal — Academic Faculty Node</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border ${isCloudEnabled ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${isCloudEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              {isCloudEnabled ? 'Cloud Database Connected' : 'Local Storage Mode'}
            </div>
            <button onClick={() => setCopilotOpen(true)} className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition shadow-lg shadow-cyan-900/30">
              <Sparkles className="w-3.5 h-3.5" /> AI Copilot
            </button>
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-800 rounded-lg px-2.5 py-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs text-slate-400">Faculty Admin</span>
            </div>
            <button onClick={onLogout} className="p-1.5 hover:bg-slate-800 rounded-lg transition" title="Logout">
              <LogOut className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard icon={Users} label="Total Students" value={students.length} color="bg-cyan-500/20" trend="Active" />
          <KPICard icon={GraduationCap} label="Average Score" value={`${avgPct}%`} subtitle={`Grade: ${getPerformanceLabel(parseFloat(avgPct))}`} color="bg-indigo-500/20" trend="▲ Semester" />
          <KPICard icon={Activity} label="Avg Attendance" value={`${avgAtt}%`} color={parseFloat(avgAtt) >= 75 ? "bg-emerald-500/20" : parseFloat(avgAtt) >= 65 ? "bg-amber-500/20" : "bg-red-500/20"} trend={parseFloat(avgAtt) >= 75 ? "Healthy" : "⚠ Below 75%"} />
          <KPICard icon={AlertTriangle} label="At-Risk Students" value={atRiskCount} subtitle={atRiskCount > 0 ? "Needs immediate attention" : "All clear"} color="bg-red-500/20" trend={atRiskCount > 0 ? `${atRiskCount} Critical` : "✓ Safe"} />
        </div>

        {/* Visual Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <GradeDistribution students={students} />
          <AttendancePerformanceMatrix students={students} />
          <SubjectMastery students={students} />
        </div>

        {/* Student Database Table */}
        <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" />
              <h2 className="text-base font-bold text-white">Student Registry & Academic Performance</h2>
              <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{displayed.length} records</span>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, roll, dept..." className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition placeholder-slate-600" />
              </div>
              <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500">
                <option value="all">All Students</option>
                <option value="critical">🔴 Critical Risk</option>
                <option value="watchlist">🟡 Watchlist</option>
                <option value="top">🟢 Top Performers</option>
              </select>
              <button onClick={() => setShowAddModal(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
              <button
                onClick={async () => {
                  setSyncing(true);
                  const fresh = await fetchStudentsFromCloud();
                  if (fresh && fresh.length > 0) {
                    setStudents(fresh);
                    saveStoredStudents(fresh);
                  }
                  setTimeout(() => setSyncing(false), 400);
                }}
                disabled={syncing}
                className="bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 border border-slate-700"
                title="Sync with Supabase Cloud Database"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{syncing ? 'Syncing...' : 'Sync Cloud'}</span>
              </button>
              <button onClick={() => exportToCSV(displayed)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1 border border-slate-700">
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800">
                  {[
                    { label: "Student", field: "name" },
                    { label: "Roll No", field: "rollno" },
                    { label: "Department", field: "department" },
                    { label: "Sem", field: "semester" },
                    { label: "Attendance", field: "attendance" },
                    { label: "Score %", field: "percentage" },
                    { label: "Risk Score", field: "riskScore" },
                    { label: "Actions", field: null },
                  ].map(col => (
                    <th key={col.label} className="px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      {col.field ? (
                        <button onClick={() => handleSort(col.field)} className="flex items-center gap-1 hover:text-slate-200 transition">
                          {col.label} <SortIcon field={col.field} />
                        </button>
                      ) : col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 text-slate-700" />
                        <p className="text-sm text-slate-400">No students match your query</p>
                        <button onClick={() => { setSearch(""); setFilter("all"); }} className="text-xs text-cyan-400 hover:text-cyan-300 transition">Reset filter</button>
                      </div>
                    </td>
                  </tr>
                ) : displayed.map(s => (
                  <tr key={s.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-indigo-500/30 flex items-center justify-center text-xs font-bold text-cyan-300 flex-shrink-0">
                          {s.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{s.name}</p>
                          <p className="text-[10px] text-slate-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300 font-mono">{s.rollno}</td>
                    <td className="px-4 py-3 text-xs text-slate-300">{s.department}</td>
                    <td className="px-4 py-3 text-xs text-slate-300 text-center">{s.semester}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 rounded-full h-1.5">
                          <div className={`h-full rounded-full ${s.attendance >= 75 ? 'bg-emerald-500' : s.attendance >= 65 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${s.attendance}%` }} />
                        </div>
                        <span className={`text-xs font-semibold ${s.attendance >= 75 ? 'text-emerald-400' : s.attendance >= 65 ? 'text-amber-400' : 'text-red-400'}`}>{s.attendance}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold ${getGradeColor(getPerformanceLabel(s.percentage))}`}>
                        {s.percentage}% <span className="opacity-60">({getPerformanceLabel(s.percentage)})</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${s.riskCategory.pill}`}>
                        {s.riskCategory.label} ({s.riskScore})
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setDiagStudent(s)} className="p-1.5 hover:bg-violet-500/20 rounded-lg transition group" title="AI Diagnostic">
                          <BrainCircuit className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-400" />
                        </button>
                        <button onClick={() => setModalStudent(s)} className="p-1.5 hover:bg-cyan-500/20 rounded-lg transition group" title="Edit">
                          <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
                        </button>
                        <button onClick={() => setDeleteConfirm(s.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg transition group" title="Delete">
                          <Trash2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Floating Copilot Button */}
      <button onClick={() => setCopilotOpen(true)} className="fixed bottom-6 right-6 z-30 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white p-3.5 rounded-2xl shadow-lg shadow-cyan-900/40 transition-all hover:scale-105 flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        <span className="text-xs font-semibold hidden sm:inline">AI Copilot</span>
      </button>

      {/* Modals */}
      {(showAddModal || modalStudent) && (
        <StudentModal student={modalStudent} onSave={handleSave} onClose={() => { setShowAddModal(false); setModalStudent(null); }} />
      )}

      {diagStudent && (
        <DiagnosticModal student={diagStudent} onClose={() => setDiagStudent(null)} />
      )}

      {copilotOpen && (
        <CopilotDrawer open={copilotOpen} onClose={() => setCopilotOpen(false)} context={students} isStudent={false} />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Confirm Record Deletion</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-5">Are you sure you want to delete this student record from the database?</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 rounded-xl transition text-sm">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 rounded-xl transition text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// AUTHENTICATION & REGISTRATION SCREEN (Home, Login, Signup)
// ═══════════════════════════════════════════════════════════════
function LoginPage({ onLogin, students, onStudentRegistered }) {
  const [mode, setMode] = useState("home"); // "home" | "login" | "signup"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Signup form state — includes student profile & academic statistics!
  const [signupForm, setSignupForm] = useState({
    name: "",
    rollno: "",
    password: "",
    department: "Computer Science",
    semester: 5,
    attendance: 80,
    marks: 410,
    midterm: 82,
    labScore: 84,
    assignmentsCompleted: 90,
    father: "",
    phone: "",
    email: "",
    college: "NIT Trichy",
    university: "Anna University",
    passing_year: 2028
  });
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // 1. Admin login
    if (username.trim() === "admin" && password === "admin") {
      onLogin({ role: "admin" });
      return;
    }

    // 2. Generic test user
    if (username.trim() === "user" && password === "user") {
      // Find or default to first student
      const first = students[0];
      onLogin({ role: "student", student: first });
      return;
    }

    // 3. Search students by Roll Number or Name
    const matched = students.find(s =>
      (s.rollno.toLowerCase() === username.trim().toLowerCase() ||
       s.name.toLowerCase() === username.trim().toLowerCase()) &&
      (s.password ? s.password === password : password === "password123")
    );

    if (matched) {
      onLogin({ role: "student", student: matched });
      return;
    }

    // Also allow login if roll number matches even with default password password123 for ease
    const rollMatched = students.find(s => s.rollno.toLowerCase() === username.trim().toLowerCase());
    if (rollMatched && (password === "password123" || password === rollMatched.password)) {
      onLogin({ role: "student", student: rollMatched });
      return;
    }

    setError("Invalid credentials! You can login with Roll No (e.g. CS2024001) / password123, or admin/admin.");
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");

    if (!signupForm.name.trim() || !signupForm.rollno.trim() || !signupForm.password.trim()) {
      setError("Name, Roll Number, and Password are required fields!");
      return;
    }

    // Check if rollno exists
    if (students.some(s => s.rollno.toLowerCase() === signupForm.rollno.trim().toLowerCase())) {
      setError(`Roll Number "${signupForm.rollno}" is already registered! Please login or use a unique Roll Number.`);
      return;
    }

    // Calculate percentage from marks (out of 500)
    const marksNum = parseInt(signupForm.marks) || 380;
    const percentageNum = parseFloat(Math.min(100, (marksNum / 500) * 100).toFixed(1));

    const newStudent = {
      id: students.length ? Math.max(...students.map(s => s.id)) + 1 : 1,
      name: signupForm.name.trim(),
      rollno: signupForm.rollno.trim().toUpperCase(),
      password: signupForm.password,
      father: signupForm.father || "Parent / Guardian",
      phone: signupForm.phone || "9876543210",
      email: signupForm.email || `${signupForm.rollno.toLowerCase()}@college.edu`,
      passing_year: parseInt(signupForm.passing_year) || 2028,
      college: signupForm.college || "NIT Trichy",
      university: signupForm.university || "Anna University",
      marks: marksNum,
      percentage: percentageNum,
      department: signupForm.department,
      semester: parseInt(signupForm.semester) || 5,
      attendance: parseInt(signupForm.attendance) || 80,
      midterm: parseInt(signupForm.midterm) || 75,
      labScore: parseInt(signupForm.labScore) || 78,
      assignmentsCompleted: parseInt(signupForm.assignmentsCompleted) || 85
    };

    onStudentRegistered(newStudent);
    setSignupSuccess(true);

    // Auto-login newly registered student directly into their personal performance dashboard!
    setTimeout(() => {
      onLogin({ role: "student", student: newStudent });
    }, 1200);
  };

  // Quick Demo Helper
  const quickDemoLogin = (rollno) => {
    const s = students.find(item => item.rollno === rollno);
    if (s) {
      onLogin({ role: "student", student: s });
    }
  };

  // HOME SCREEN
  if (mode === "home") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex p-3.5 bg-cyan-500/10 rounded-2xl mb-4 border border-cyan-500/20 shadow-xl shadow-cyan-950/50">
              <GraduationCap className="w-12 h-12 text-cyan-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">AI Student Analysis Portal</h1>
            <p className="text-slate-400 mt-2 text-sm">Academic Performance Intelligence & Student Performance Diagnostics</p>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <button onClick={() => setMode("login")} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30">
              <Shield className="w-5 h-5" /> Portal Login (Admin & Student)
            </button>
            <button onClick={() => setMode("signup")} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30">
              <UserCheck className="w-5 h-5" /> New Student Registration (Sign Up)
            </button>

            {/* Quick Demo Access Bar */}
            <div className="pt-4 border-t border-slate-800">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 text-center">1-Click Fast Demo Login</p>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => onLogin({ role: "admin" })} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 px-2 rounded-lg transition border border-slate-700 text-center truncate">
                  👨‍💼 Admin
                </button>
                <button onClick={() => quickDemoLogin("CS2024001")} className="bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs py-2 px-2 rounded-lg transition border border-slate-700 text-center truncate">
                  🌟 Top Student
                </button>
                <button onClick={() => quickDemoLogin("EC2024003")} className="bg-slate-800 hover:bg-slate-700 text-red-400 text-xs py-2 px-2 rounded-lg transition border border-slate-700 text-center truncate">
                  ⚠️ At-Risk Student
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SIGNUP SCREEN (Student Registers & Sees Performance)
  if (mode === "signup") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 py-8">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Student Registration</h1>
            <p className="text-slate-400 text-sm mt-1">Register your profile to view your AI performance diagnostics & recovery plan</p>
          </div>

          {signupSuccess && (
            <div className="mb-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl p-4 text-center text-sm text-emerald-300 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Registration Successful! Launching your personal academic dashboard...</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Full Student Name *</label>
                <input required value={signupForm.name} onChange={e => setSignupForm({ ...signupForm, name: e.target.value })} placeholder="e.g. Rohan Das" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Roll Number / Student ID *</label>
                <input required value={signupForm.rollno} onChange={e => setSignupForm({ ...signupForm, rollno: e.target.value })} placeholder="e.g. CS2024015" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 font-mono" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Create Password *</label>
                <input required type="password" value={signupForm.password} onChange={e => setSignupForm({ ...signupForm, password: e.target.value })} placeholder="Password" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Department / Branch</label>
                <select value={signupForm.department} onChange={e => setSignupForm({ ...signupForm, department: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500">
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Electrical">Electrical</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Semester (1 - 8)</label>
                <input type="number" min={1} max={8} value={signupForm.semester} onChange={e => setSignupForm({ ...signupForm, semester: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Attendance Rate (%)</label>
                <input type="number" min={0} max={100} value={signupForm.attendance} onChange={e => setSignupForm({ ...signupForm, attendance: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Total Marks Earned (out of 500)</label>
                <input type="number" min={0} max={500} value={signupForm.marks} onChange={e => setSignupForm({ ...signupForm, marks: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Mid-Term Marks (%)</label>
                <input type="number" min={0} max={100} value={signupForm.midterm} onChange={e => setSignupForm({ ...signupForm, midterm: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Lab / Practical Score (%)</label>
                <input type="number" min={0} max={100} value={signupForm.labScore} onChange={e => setSignupForm({ ...signupForm, labScore: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Assignments Completed (%)</label>
                <input type="number" min={0} max={100} value={signupForm.assignmentsCompleted} onChange={e => setSignupForm({ ...signupForm, assignmentsCompleted: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500" />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 text-center text-xs text-red-300 flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30">
              <CheckCircle2 className="w-4 h-4" /> Complete Registration & View My Performance
            </button>
            <button type="button" onClick={() => { setMode("home"); setError(""); }} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl transition text-sm">
              Back to Home
            </button>
          </form>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-cyan-500/10 rounded-2xl mb-3 border border-cyan-500/20">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">System Authorization</h1>
          <p className="text-slate-400 text-sm mt-1">Login with Admin credentials or your Student Roll Number</p>
        </div>

        <form onSubmit={handleLogin} className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Username / Student Roll No</label>
            <input value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500" placeholder="e.g. admin or CS2024001" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500" placeholder="Password" />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 text-center text-xs text-red-300 flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30">
            <Shield className="w-4 h-4" /> Sign In to Portal
          </button>

          <div className="pt-2 flex items-center justify-between text-xs">
            <button type="button" onClick={() => { setMode("signup"); setError(""); }} className="text-cyan-400 hover:underline">
              New Student? Sign Up Here
            </button>
            <button type="button" onClick={() => { setMode("home"); setError(""); }} className="text-slate-400 hover:underline">
              Back to Home
            </button>
          </div>

          {/* Quick Demo Help */}
          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
            <p>💡 <strong className="text-slate-400">Admin Login:</strong> admin / admin</p>
            <p>💡 <strong className="text-slate-400">Student Login:</strong> CS2024001 / password123</p>
          </div>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APPLICATION ROOT
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [students, setStudents] = useState(getStoredStudents);
  const [auth, setAuth] = useState(null); // null | { role: "admin" } | { role: "student", student: Object }

  // Load shared records from Supabase Cloud Database on startup
  useEffect(() => {
    async function loadCloudRecords() {
      if (isCloudEnabled) {
        const cloudData = await fetchStudentsFromCloud();
        if (cloudData && cloudData.length > 0) {
          setStudents(cloudData);
          saveStoredStudents(cloudData);
        }
      }
    }
    loadCloudRecords();
  }, []);

  // Sync state to localStorage & Supabase Cloud whenever students register
  const handleStudentRegistered = async (newStudent) => {
    const updated = [...students, newStudent];
    setStudents(updated);
    saveStoredStudents(updated);
    if (isCloudEnabled) {
      await insertStudentToCloud(newStudent);
      const fresh = await fetchStudentsFromCloud();
      if (fresh && fresh.length > 0) {
        setStudents(fresh);
        saveStoredStudents(fresh);
      }
    }
  };

  // If not logged in, show Auth / Home / Signup
  if (!auth) {
    return (
      <LoginPage
        onLogin={setAuth}
        students={students}
        onStudentRegistered={handleStudentRegistered}
      />
    );
  }

  // If logged in as Student, render Student Performance Portal!
  if (auth.role === "student") {
    // Keep student object updated if data was edited
    const currentStudent = students.find(s => s.id === auth.student.id) || auth.student;
    return (
      <StudentDashboard
        student={currentStudent}
        onLogout={() => setAuth(null)}
      />
    );
  }

  // If logged in as Admin, render Full Faculty Oversight Dashboard!
  return (
    <AdminDashboard
      students={students}
      setStudents={setStudents}
      onLogout={() => setAuth(null)}
    />
  );
}
