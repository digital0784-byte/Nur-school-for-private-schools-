import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  HeartHandshake,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Bus,
  Award,
  BookOpen,
  ArrowUpRight,
  Clock,
  Sparkles,
  CreditCard,
} from "lucide-react";

export const ParentChildOverview: React.FC = () => {
  const { students, setActiveTab, setActiveReceipt, fees, language, t } = useApp();

  // Multi-child switcher state
  const children = [
    {
      id: "child-1",
      name: "Dawit Tadesse",
      nameAm: "ዳዊት ታደሰ",
      grade: "Grade 10 - Section A",
      idNumber: "NUR-2026-0891",
      gpa: 3.88,
      rank: "3rd of 38 Students",
      attendanceToday: "Present (07:55 AM Check-in)",
      busStatus: "Route 1 Bole • On Route (ETA 8 mins)",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: "child-2",
      name: "Bethlehem Tadesse",
      nameAm: "ቤተልሔም ታደሰ",
      grade: "Grade 6 - Section B",
      idNumber: "NUR-2026-1042",
      gpa: 3.95,
      rank: "1st of 34 Students",
      attendanceToday: "Present (08:02 AM Check-in)",
      busStatus: "Route 1 Bole • Arrived Campus",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    },
  ];

  const [selectedChildId, setSelectedChildId] = useState(children[0].id);
  const activeChild = children.find((c) => c.id === selectedChildId) || children[0];

  const childFees = fees.filter((f) => f.studentName.includes("Dawit"));

  return (
    <div id="parent-child-overview" className="space-y-6">
      {/* Header & Multi-Child Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.parent.overviewTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === "am"
              ? "የልጆችዎን የትምህርት እንቅስቃሴ፣ የቀን መገኘት እና የትራንስፖርት ሁኔታ ይከታተሉ"
              : "Holistic multi-ward scholastic progress, live attendance check-ins, and tuition ledger"}
          </p>
        </div>

        {/* Child Pills */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          {children.map((child) => {
            const isSelected = child.id === selectedChildId;
            return (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                <img
                  src={child.avatar}
                  alt={child.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span>{language === "am" ? child.nameAm : child.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ward Profile Banner Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={activeChild.avatar}
            alt={activeChild.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {language === "am" ? activeChild.nameAm : activeChild.name}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                {activeChild.grade}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              ID: {activeChild.idNumber} • Term Rank: {activeChild.rank}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("parent-ai")}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === "am" ? "የአይአይ ወላጅ ምክር" : "AI Ward Insights"}</span>
          </button>

          <button
            onClick={() => setActiveTab("parent-fees")}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
          >
            <CreditCard className="w-4 h-4" />
            <span>{language === "am" ? "ክፍያዎችን ክፈል" : "Pay Tuition"}</span>
          </button>
        </div>
      </div>

      {/* Real-time Status Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Live Daily Attendance */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>{language === "am" ? "የዛሬ መገኘት" : "Daily Attendance"}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-2">
            {activeChild.attendanceToday}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            ✓ Gate scanner RFID authenticated
          </p>
        </div>

        {/* Metric 2: Academic GPA */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>{language === "am" ? "የሴሚስተር ውጤት" : "Academic GPA"}</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {activeChild.gpa} <span className="text-xs text-slate-400 font-normal">/ 4.0</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Rank: {activeChild.rank}
          </p>
        </div>

        {/* Metric 3: Bus Telematics */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>{language === "am" ? "የትራንስፖርት ሁኔታ" : "School Bus GPS"}</span>
            <Bus className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white mt-2">
            {activeChild.busStatus}
          </p>
          <button
            onClick={() => setActiveTab("transport")}
            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline mt-1 block"
          >
            Track on Live Radar →
          </button>
        </div>
      </div>

      {/* Recent Subject Performance Matrix */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
          {language === "am" ? "የቅርብ ጊዜ የፈተና እና የቤት ስራ ውጤቶች" : "Recent Course Evaluations & Milestones"}
        </h4>

        <div className="space-y-2">
          {[
            { subject: "Physics", topic: "Newton's 3rd Law & Momentum Lab", date: "Sep 04", score: "94 / 100", grade: "A", teacher: "Dawit Bekele" },
            { subject: "Pure Mathematics", topic: "Quadratic Equations Midterm", date: "Sep 02", score: "98 / 100", grade: "A+", teacher: "Tigist Alemu" },
            { subject: "Chemistry", topic: "Organic Compounds Quiz", date: "Aug 28", score: "88 / 100", grade: "B+", teacher: "Abebe Kebede" },
            { subject: "Amharic Literature", topic: "Classical Poetry Analysis", date: "Aug 25", score: "95 / 100", grade: "A+", teacher: "Solomon Desta" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 dark:text-white">{item.subject}</span>
                  <span className="text-[10px] text-slate-400">• {item.topic}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Instructor: {item.teacher} • {item.date}
                </p>
              </div>

              <div className="text-right">
                <span className="font-mono font-bold text-slate-900 dark:text-white block">
                  {item.score}
                </span>
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                  Grade {item.grade}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
