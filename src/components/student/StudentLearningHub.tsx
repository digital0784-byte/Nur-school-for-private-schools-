import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  BookOpen,
  BrainCircuit,
  Award,
  Clock,
  Video,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowRight,
  Flame,
  FileText,
  Megaphone,
  GraduationCap,
  Timer,
  AlertCircle,
  Layers,
} from "lucide-react";
import { ethiopianCurriculumBooks } from "../../data/ethiopianCurriculumBooks";
import { ethiopianSupplementaryBooks } from "../../data/ethiopianSupplementaryBooks";

export const StudentLearningHub: React.FC = () => {
  const { currentUser, setActiveTab, language, t, assignments } = useApp();

  const studentName =
    language === "am"
      ? currentUser?.nameAm || currentUser?.name || "አበበ ታደሰ"
      : currentUser?.name || "Abebe Tadesse";

  const studentRole = currentUser?.grade || "Grade 10";
  const studentSection = currentUser?.section || "A";
  const [selectedCurriculumGrade, setSelectedCurriculumGrade] = useState<string>("Grade 10");
  const [selectedBookType, setSelectedBookType] = useState<string>("All");

  const enrolledCourses = [
    {
      title: language === "am" ? "የላቀ ፊዚክስ (ሜካኒክስ እና ሞገዶች)" : "Advanced Physics (Mechanics & Waves)",
      teacher: language === "am" ? "አቶ ዳዊት በቀለ" : "Dawit Bekele",
      progress: 78,
      nextLesson: language === "am" ? "የዶፕለር ውጤት እና የድምፅ ሞገድ" : "Doppler Effect & Sound Waves",
      color: "from-emerald-600 to-teal-700",
      badge: "Physics",
    },
    {
      title: language === "am" ? "የ 10ኛ ክፍል ንፁህ ሂሳብ" : "Grade 10 Pure Mathematics",
      teacher: language === "am" ? "ወ/ሪት ትዕግስት አለሙ" : "Tigist Alemu",
      progress: 85,
      nextLesson: language === "am" ? "የኳድራቲክ እኩልታዎች እና ፓራቦላ" : "Quadratic Functions & Parabola",
      color: "from-blue-600 to-indigo-700",
      badge: "Math",
    },
    {
      title: language === "am" ? "ኦርጋኒክ እና ፊዚካል ኬሚስትሪ" : "Organic & Physical Chemistry",
      teacher: language === "am" ? "አቶ አበበ ከበደ" : "Abebe Kebede",
      progress: 64,
      nextLesson: language === "am" ? "ሃይድሮካርቦኖች እና አልኬኖች" : "Hydrocarbons and Alkanes",
      color: "from-amber-600 to-orange-700",
      badge: "Chemistry",
    },
    {
      title: language === "am" ? "የኢትዮጵያ ታሪክ እና ቅርስ" : "Ethiopian History & Heritage",
      teacher: language === "am" ? "አቶ ሰለሞን ደስታ" : "Solomon Desta",
      progress: 92,
      nextLesson: language === "am" ? "የአድዋ ድል (1896 ዓ.ም)" : "The Victory of Adwa (1896)",
      color: "from-purple-600 to-pink-700",
      badge: "History",
    },
  ];

  const todayClasses = [
    {
      period: "Period 1",
      time: "08:30 - 09:15",
      subject: language === "am" ? "ንፁህ ሂሳብ" : "Pure Mathematics",
      teacher: language === "am" ? "ትዕግስት አለሙ" : "Tigist Alemu",
      room: "Room 102",
      status: "Completed",
    },
    {
      period: "Period 2",
      time: "09:20 - 10:05",
      subject: language === "am" ? "ፊዚክስ ላብራቶሪ" : "Physics Laboratory",
      teacher: language === "am" ? "ዳዊት በቀለ" : "Dawit Bekele",
      room: "Science Lab B",
      status: "In Progress",
    },
    {
      period: "Period 3",
      time: "10:20 - 11:05",
      subject: language === "am" ? "የእንግሊዝኛ ቋንቋ" : "English Language",
      teacher: language === "am" ? "ሄለን ታደሰ" : "Helen Tadesse",
      room: "Room 102",
      status: "Upcoming",
    },
    {
      period: "Period 4",
      time: "11:10 - 11:55",
      subject: language === "am" ? "የኢትዮጵያ ታሪክ" : "Ethiopian History",
      teacher: language === "am" ? "ሰለሞን ደስታ" : "Solomon Desta",
      room: "Room 102",
      status: "Upcoming",
    },
  ];

  return (
    <div id="student-learning-hub" className="space-y-6">
      {/* Student Profile Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>
                {language === "am" ? "እንኳን ደህና መጣህ/ሽ" : "Welcome back"},{" "}
                {studentName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t?.student?.overviewTitle || (language === "am" ? "የተማሪዎች የመማሪያ እና የፈተና ዝግጅት ማዕከል" : "Personalized Learning & Academic Mastery Hub")}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed">
              {language === "am"
                ? "የ 24/7 Gemini AI አስተማሪን ይጠይቁ፣ በሰዓት የተገደቡ የCBT ፈተናዎችን ይለማመዱ፣ እና የትምህርት ክፍለ-ጊዜዎችዎን በፖሞዶሮ ሰዓት ያቀናብሩ።"
                : "Consult your 24/7 Gemini Socratic Tutor, take timed national CBT mock tests, and optimize study intervals with focus routines."}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15">
                {studentRole} - {studentSection}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15">
                ID: NUR-2026-0142
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {language === "am" ? "የዛሬ አቴንዳንስ፡ ተገኝቷል (07:55)" : "Attendance: Present (07:55 AM)"}
              </span>
            </div>
          </div>

          {/* Quick Academic Key Metrics */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[110px]">
              <div className="flex items-center justify-center gap-1 text-amber-300 mb-1">
                <Award className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-wider">GPA</span>
              </div>
              <div className="text-2xl font-black font-mono">3.92</div>
              <div className="text-[10px] text-emerald-200">
                {language === "am" ? "ደረጃ፡ 2ኛ / 38 ተማሪዎች" : "Rank: 2nd of 38"}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[110px]">
              <div className="flex items-center justify-center gap-1 text-orange-300 mb-1">
                <Flame className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Streak</span>
              </div>
              <div className="text-2xl font-black font-mono">12 {language === "am" ? "ቀን" : "Days"}</div>
              <div className="text-[10px] text-emerald-200">
                {language === "am" ? "ተከታታይ ጥናት" : "Active Streak"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Interactive Launch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* 1. Gemini AI Tutor */}
        <div
          id="btn-launch-ai-tutor"
          onClick={() => setActiveTab("ai-tutor")}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-0.5"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            {t?.student?.aiTutor || (language === "am" ? "የጀሚኒ AI መምህር" : "Gemini AI Tutor")}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === "am" ? "በአማርኛ እና በእንግሊዝኛ የቤት ስራ ጥያቄዎች አጋዥ" : "24/7 Socratic homework & concept guide"}
          </p>
          <div className="mt-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span>{language === "am" ? "መምህሩን አናግር" : "Launch Tutor"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 2. CBT Exam Engine */}
        <div
          id="btn-launch-cbt-exam"
          onClick={() => setActiveTab("cbt-exam")}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-0.5"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            {t?.student?.cbtExam || (language === "am" ? "የኦንላይን ፈተና (CBT)" : "CBT Exam Suite")}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === "am" ? "በሰዓት የተገደበ የፈተና ማስመሰያና ፈጣን ውጤት" : "Real-time timed exams with instant grading"}
          </p>
          <div className="mt-3 text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <span>{language === "am" ? "ፈተና ጀምር" : "Start Exam"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 3. Pomodoro Focus Timer */}
        <div
          id="btn-launch-focus-timer"
          onClick={() => setActiveTab("focus-timer")}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-0.5"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            {t?.student?.focusTimer || (language === "am" ? "የትኩረት ጥናት ሰዓት" : "Focus Study Timer")}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === "am" ? "25 ደቂቃ ጥናት + 5 ደቂቃ እረፍት በድምፅ የታገዘ" : "Pomodoro focus cycles with ambient sounds"}
          </p>
          <div className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
            <span>{language === "am" ? "ሰዓት ቆጣሪውን ክፈት" : "Open Timer"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 4. Interactive Lessons */}
        <div
          id="btn-launch-lessons"
          onClick={() => setActiveTab("lessons")}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-0.5"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Video className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            {t?.student?.lessons || (language === "am" ? "የትምህርት ቪዲዮ እና ኦዲዮ" : "Course Lessons & Media")}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === "am" ? "የቪዲዮ ትምህርቶች እና የአይአይ ማጠቃለያ ማስታወሻ" : "Curated video lectures & AI summarizer"}
          </p>
          <div className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <span>{language === "am" ? "ትምህርቶችን ተመልከት" : "Watch Lessons"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 5. Ethiopian Curriculum Textbooks */}
        <div
          id="btn-launch-curriculum"
          onClick={() => setActiveTab("library")}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-0.5"
        >
          <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {language === "am" ? "የመማሪያ እና ረዳት መጻሕፍት" : "Textbooks & Extreme Guides"}
            </h3>
            <span className="text-xs">🇪🇹</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === "am"
              ? "ከ 5ኛ - 12ኛ ክፍል ሙሉ መማሪያ እና ረዳት መጻሕፍት"
              : "Grades 5-12 Textbooks, Extreme Guides & UEE Prep"}
          </p>
          <div className="mt-3 text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1">
            <span>{language === "am" ? "መጻሕፍትን አንብብ" : "Read Books"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Two-Column Middle Section: Today's Schedule & Pending Homework */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                {language === "am" ? "የዛሬ የትምህርት ክፍለ-ጊዜዎች" : "Today's Class Schedule"}
              </h2>
            </div>
            <span className="text-xs text-slate-400">Grade 10A • Term 1</span>
          </div>

          <div className="space-y-2.5">
            {todayClasses.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60"
              >
                <div className="flex items-center gap-3">
                  <div className="text-center w-16 py-1 px-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200/80 dark:border-slate-600">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      {item.period}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200">
                      {item.time.split(" - ")[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.subject}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.teacher} • {item.room}
                    </p>
                  </div>
                </div>

                <div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === "Completed"
                        ? "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                        : item.status === "In Progress"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 animate-pulse"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300"
                    }`}
                  >
                    {item.status === "Completed"
                      ? language === "am"
                        ? "ተጠናቋል"
                        : "Done"
                      : item.status === "In Progress"
                      ? language === "am"
                        ? "በሂደት ላይ"
                        : "Live Now"
                      : language === "am"
                      ? "ቀጣይ"
                      : "Upcoming"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Assignments & Homework */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                {language === "am" ? "የቤት ስራዎች እና ምደባዎች" : "Active Homework & Assignments"}
              </h2>
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              {assignments.length} {language === "am" ? "የተመደቡ" : "Total"}
            </span>
          </div>

          <div className="space-y-2.5">
            {assignments.slice(0, 3).map((asg) => (
              <div
                key={asg.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {asg.subject}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {language === "am" ? "የማስረከቢያ ቀን፡" : "Due:"} {asg.dueDate}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {language === "am" ? asg.titleAm || asg.title : asg.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {language === "am" ? "መምህር፡" : "Teacher:"} {asg.teacherName} • {asg.totalPoints} pts
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("lessons")}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors"
                >
                  {language === "am" ? "ተመልከት" : "View"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Academic Enrolled Courses Grid */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              {language === "am" ? "የተመዘገቡ የትምህርት ዓይነቶች" : "Active Enrolled Courses & Milestones"}
            </h2>
            <p className="text-xs text-slate-400">
              {language === "am"
                ? "የመጀመሪያው ወሰነ-ትምህርት ይዘት ሽፋን እና ግስጋሴ"
                : "Term 1 syllabus completion & learning milestones"}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Overall GPA: 3.92 / 4.0
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrolledCourses.map((course, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                    {course.badge} • {language === "am" ? "አስተማሪ፡" : "Instructor:"} {course.teacher}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    {course.progress}% {language === "am" ? "ተጠናቋል" : "Complete"}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {language === "am" ? "ቀጣይ ርዕስ፡" : "Next Up:"}{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    {course.nextLesson}
                  </strong>
                </p>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-4">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-end">
                <button
                  onClick={() => setActiveTab("lessons")}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>{language === "am" ? "ትምህርቱን ቀጥል" : "Resume Learning"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ethiopian Curriculum Textbooks & Supplementary Guides (Grades 5 - 12) Showcase */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">🇪🇹</span>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                {language === "am"
                  ? "አዲሱ የኢትዮጵያ ካሪኩለም የመማሪያ እና ረዳት መጻሕፍት (Grades 5-12)"
                  : "New Ethiopian Curriculum Textbooks & Extreme Study Guides (Grades 5-12)"}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === "am"
                ? "ኦፊሴላዊ የተማሪ መማሪያ መጻሕፍት፣ የኤክስትሪም (Extreme) እና የማስተር ረዳት መጻሕፍት፣ እና የፈተና ጥያቄዎች ባንክ"
                : "Official MoE e-Textbooks, Extreme & Master Series supplementary problem solvers & UEE question banks"}
            </p>
          </div>

          <button
            onClick={() => setActiveTab("library")}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
          >
            <span>{language === "am" ? "ሁሉንም በቤተ-መጽሐፍት ተመልከት" : "View Full Repository"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Grade Selection Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {["Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map((gr) => (
            <button
              key={gr}
              onClick={() => setSelectedCurriculumGrade(gr)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCurriculumGrade === gr
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {language === "am" ? gr.replace("Grade ", "") + "ኛ ክፍል" : gr}
            </button>
          ))}
        </div>

        {/* Book Type Filter Pills (All / Textbook / Supplementary / Exam Prep) */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "All", label: language === "am" ? "ሁሉም መጻሕፍት" : "All Books" },
            { id: "textbook", label: language === "am" ? "📘 የመማሪያ መጻሕፍት" : "📘 Textbooks" },
            { id: "supplementary", label: language === "am" ? "📙 ረዳት መጻሕፍት (Extreme Series)" : "📙 Supplementary" },
            { id: "exam_prep", label: language === "am" ? "📝 የፈተና ዝግጅት" : "📝 Exam Prep" },
          ].map((typeItem) => (
            <button
              key={typeItem.id}
              onClick={() => setSelectedBookType(typeItem.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                selectedBookType === typeItem.id
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {typeItem.label}
            </button>
          ))}
        </div>

        {/* Textbooks Cards Grid for the selected grade and type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
          {[...ethiopianCurriculumBooks, ...ethiopianSupplementaryBooks]
            .filter((b) => {
              const matchesGrade = b.grade === selectedCurriculumGrade;
              const matchesType =
                selectedBookType === "All" ||
                (selectedBookType === "textbook" && (!b.bookType || b.bookType === "textbook")) ||
                b.bookType === selectedBookType;
              return matchesGrade && matchesType;
            })
            .map((book) => (
              <div
                key={book.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  <div className="relative h-36 rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-bold">
                        {book.grade}
                      </span>
                      {book.bookType === "supplementary" && (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-500/90 text-white text-[8px] font-black uppercase">
                          {language === "am" ? "📙 ረዳት" : "📙 Extreme"}
                        </span>
                      )}
                      {book.bookType === "exam_prep" && (
                        <span className="px-1.5 py-0.5 rounded-md bg-rose-600/90 text-white text-[8px] font-black uppercase">
                          {language === "am" ? "📝 ፈተና" : "📝 Exam"}
                        </span>
                      )}
                      {(!book.bookType || book.bookType === "textbook") && (
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-600/90 text-white text-[8px] font-black uppercase">
                          {language === "am" ? "📘 መማሪያ" : "📘 MoE"}
                        </span>
                      )}
                    </div>
                    {book.stream && book.stream !== "General" && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-indigo-600/90 text-white text-[8px] font-bold">
                        {book.stream === "Natural Science" ? "Natural" : "Social"}
                      </span>
                    )}
                    {book.units && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[9px] font-bold flex items-center gap-1">
                        <Layers className="w-2.5 h-2.5 text-amber-400" />
                        {book.units.length} {language === "am" ? "ምዕራፎች" : "Units"}
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                    {language === "am" ? book.titleAm || book.title : book.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {book.publisher || book.author}
                  </p>

                  {book.units && book.units[0] && (
                    <div className="mt-2 text-[10px] text-slate-600 dark:text-slate-300 line-clamp-1 bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                      <strong>Unit 1:</strong>{" "}
                      {language === "am"
                        ? book.units[0].titleAm || book.units[0].title
                        : book.units[0].title}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("library")}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors ${
                      book.bookType === "supplementary"
                        ? "bg-amber-600 hover:bg-amber-700"
                        : book.bookType === "exam_prep"
                        ? "bg-rose-600 hover:bg-rose-700"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>
                      {book.bookType === "supplementary"
                        ? language === "am"
                          ? "ረዳት መጽሐፍ አንብብ"
                          : "Read Guide"
                        : language === "am"
                        ? "አንብብ"
                        : "Read e-Book"}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab("ai-tutor")}
                    className="py-1.5 px-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold flex items-center gap-1 transition-colors"
                    title={language === "am" ? "ከ AI መምህር ጋር ተማር" : "Study with AI"}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>AI</span>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
