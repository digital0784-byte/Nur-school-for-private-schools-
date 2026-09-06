import React from "react";
import { useApp } from "../../context/AppContext";
import {
  ChevronRight,
  Home,
  Sliders,
  Search,
  Maximize2,
  Minimize2,
  BookOpen,
  LayoutDashboard,
  Users,
  CreditCard,
  Calendar,
  Sparkles,
  Award,
} from "lucide-react";

export const BreadcrumbsBar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    language,
    contentWidth,
    setContentWidth,
    setIsCommandPaletteOpen,
    userRole,
  } = useApp();

  const getModuleTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return language === "am" ? "የአስተዳደር ዳሽቦርድ" : "Executive Overview";
      case "students-staff":
        return language === "am" ? "የተማሪዎች እና መምህራን ማህደር" : "Students & Staff Records";
      case "finance":
        return language === "am" ? "የትምህርት ክፍያ እና ፋይናንስ" : "Tuition & Fee Collection";
      case "library":
        return language === "am" ? "የኢትዮጵያ ካሪኩለም እና ረዳት መጻሕፍት (Grades 5-12)" : "MoE Textbooks & Supplementary Guides";
      case "timetable":
        return language === "am" ? "የትምህርት እና የፈረቃ የጊዜ ሰሌዳ" : "Master Class Schedule";
      case "transport":
        return language === "am" ? "የትምህርት ቤት አውቶቡስ ክትትል" : "School Bus Fleet Tracking";
      case "announcements":
        return language === "am" ? "የማስታወቂያ ሰሌዳ" : "Official Notice Board";

      case "classes":
        return language === "am" ? "የክፍል አቴንዳንስ እና ክትትል" : "Class Attendance & Roster";
      case "assignments":
        return language === "am" ? "የቤት ስራ እና የፕሮጀክት ማዕከል" : "Assignments & Submissions";
      case "ai-quiz":
        return language === "am" ? "የጀሚኒ AI ፈተና አውጪ" : "AI Quiz & Test Generator";
      case "gradebook":
        return language === "am" ? "የውጤት መዝገብ እና ሪፖርት ካርድ" : "Gradebook & Academic Reports";

      case "learning-hub":
        return language === "am" ? "የተማሪ መማሪያ ማዕከል" : "Student Learning Hub";
      case "ai-tutor":
        return language === "am" ? "የጀሚኒ AI ሶክራቲክ መምህር" : "Socratic AI Study Tutor";
      case "cbt-exam":
        return language === "am" ? "የኦንላይን ፈተና ሲሙሌተር" : "CBT Exam Engine";
      case "focus-timer":
        return language === "am" ? "የትኩረት ጥናት ሰዓት (Pomodoro)" : "Focus Study Timer";
      case "lessons":
        return language === "am" ? "ተከታታይ የቪዲዮ እና የድምፅ ትምህርቶች" : "Interactive Media Lessons";

      case "parent-child":
        return language === "am" ? "የልጆች የትምህርት ክትትል" : "Child Academic Overview";
      case "parent-fees":
        return language === "am" ? "የትምህርት ክፍያ መክፈያ (ቴሌብር / ሲቢኢ)" : "Tuition Payment & Invoices";
      case "parent-ai":
        return language === "am" ? "የ AI የልጆች የስነ-ባህሪ ምክረ-ሀሳብ" : "Parent AI Insights & Advice";
      case "parent-teachers":
        return language === "am" ? "ከመምህራን ጋር ቀጥታ ውይይት" : "Parent-Teacher Chat";

      default:
        return language === "am" ? "ዳሽቦርድ" : "Dashboard";
    }
  };

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/70 dark:border-slate-800/80">
      {/* Breadcrumbs & Section Title */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-semibold mb-1">
          <button
            onClick={() => {
              if (userRole === "admin") setActiveTab("dashboard");
              else if (userRole === "teacher") setActiveTab("classes");
              else if (userRole === "student") setActiveTab("learning-hub");
              else if (userRole === "parent") setActiveTab("parent-child");
            }}
            className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{language === "am" ? "መነሻ" : "Home"}</span>
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
          <span className="text-slate-600 dark:text-slate-300 font-bold capitalize">
            {activeTab.replace("-", " ")}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {getModuleTitle()}
        </h1>
      </div>

      {/* Quick utility controls */}
      <div className="flex items-center gap-2 self-start sm:self-auto">
        {/* Academic Calendar Tag */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 text-xs font-bold text-slate-700 dark:text-slate-300">
          <span className="text-xs">📅</span>
          <span>
            {language === "am" ? "2017 ዓ.ም • 1ኛ ወሰነ-ትምህርት" : "2024-2025 • Term 1"}
          </span>
        </div>

        {/* Content Width Toggle */}
        <button
          onClick={() => setContentWidth(contentWidth === "contained" ? "full" : "contained")}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/70 dark:border-slate-700/60 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors"
          title={
            contentWidth === "contained"
              ? language === "am"
                ? "ስክሪኑን አሰፋ (Full Width)"
                : "Expand to Full Width"
              : language === "am"
              ? "ስክሪኑን አጥብብ (Contained)"
              : "Switch to Contained"
          }
        >
          {contentWidth === "contained" ? (
            <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Minimize2 className="w-3.5 h-3.5 text-indigo-600" />
          )}
          <span className="hidden sm:inline">
            {contentWidth === "contained"
              ? language === "am"
                ? "ሙሉ ስክሪን"
                : "Full Width"
              : language === "am"
              ? "መደበኛ ስክሪን"
              : "Contained"}
          </span>
        </button>

        {/* Fast Search */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/70 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 transition-colors"
          title={language === "am" ? "ፈጣን ፍለጋ (⌘K)" : "Quick Jump (⌘K)"}
        >
          <Search className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </div>
  );
};
