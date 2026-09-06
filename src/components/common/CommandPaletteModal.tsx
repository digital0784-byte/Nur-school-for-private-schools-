import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  Search,
  BookOpen,
  Users,
  CreditCard,
  Calendar,
  Sparkles,
  Award,
  Clock,
  Video,
  X,
  ArrowRight,
  Shield,
  GraduationCap,
  HeartHandshake,
  CheckSquare,
  FileSpreadsheet,
  Megaphone,
} from "lucide-react";

export const CommandPaletteModal: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveTab,
    userRole,
    setUserRole,
    language,
    toggleLanguage,
    theme,
    toggleTheme,
    layoutStyle,
    setLayoutStyle,
  } = useApp();

  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === "Escape" && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const quickActions = [
    {
      id: "library",
      title: language === "am" ? "የመማሪያ እና ረዳት መጻሕፍት (Grades 5-12)" : "Textbooks & Extreme Guides (5-12)",
      desc: language === "am" ? "የአዲሱ ካሪኩለም መጻሕፍት እና ኤክስትሪም ረዳቶች" : "Curriculum textbooks & supplementary guides",
      category: "Academic",
      icon: <BookOpen className="w-4 h-4 text-emerald-500" />,
      action: () => {
        setActiveTab("library");
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: "ai-tutor",
      title: language === "am" ? "የጀሚኒ AI መምህር (Socratic Tutor)" : "Gemini AI Socratic Tutor",
      desc: language === "am" ? "የቤት ስራ ጥያቄዎች እና የፅንሰ-ሀሳብ ማብራሪያ" : "Interactive homework and problem assistance",
      category: "AI Tools",
      icon: <Sparkles className="w-4 h-4 text-indigo-500" />,
      action: () => {
        setActiveTab("ai-tutor");
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: "cbt-exam",
      title: language === "am" ? "የኦንላይን ፈተና (CBT Exam Suite)" : "CBT Online Exam Simulator",
      desc: language === "am" ? "በሰዓት የተገደበ ፈተና እና ፈጣን ውጤት" : "Timed exam engine with instant scoring",
      category: "Examination",
      icon: <Award className="w-4 h-4 text-rose-500" />,
      action: () => {
        setActiveTab("cbt-exam");
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: "dashboard",
      title: language === "am" ? "ዋና አስተዳደር ዳሽቦርድ" : "Administrative Dashboard",
      desc: language === "am" ? "የተማሪዎች ቁጥር፣ የክፍያ ገቢ እና አጠቃላይ ሁኔታ" : "School KPIs, analytics and overview",
      category: "Administration",
      icon: <Shield className="w-4 h-4 text-blue-500" />,
      action: () => {
        setActiveTab("dashboard");
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: "finance",
      title: language === "am" ? "የክፍያ እና ፋይናንስ አስተዳደር" : "Tuition Fees & Payments",
      desc: language === "am" ? "ቴሌብር፣ ሲቢኢ ብር እና ቻፓ ደረሰኝ" : "Telebirr, CBE Birr & invoices",
      category: "Finance",
      icon: <CreditCard className="w-4 h-4 text-amber-500" />,
      action: () => {
        setActiveTab("finance");
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: "focus-timer",
      title: language === "am" ? "የትኩረት ጥናት ሰዓት (Pomodoro)" : "Focus Study Timer",
      desc: language === "am" ? "የድምፅ ታጅቦ የ 25 ደቂቃ ጥናት ዑደት" : "25min focus cycles with ambient music",
      category: "Student Tools",
      icon: <Clock className="w-4 h-4 text-teal-500" />,
      action: () => {
        setActiveTab("focus-timer");
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: "switch-layout",
      title:
        language === "am"
          ? `የአቀማመጥ ስታይል ይቀይሩ (አሁን፡ ${
              layoutStyle === "sidebar"
                ? "የግራ ጎን ማውጫ"
                : layoutStyle === "topbar"
                ? "የበላይ አግድም ማውጫ"
                : "አጭር ማውጫ"
            })`
          : `Toggle Layout Style (Current: ${layoutStyle.toUpperCase()})`,
      desc:
        language === "am"
          ? "በጎን ማውጫ (Sidebar) እና በበላይ አግድም ማውጫ (Top-nav) መካከል ይቀያይሩ"
          : "Switch between modern sidebar, topbar, or compact rail",
      category: "Preferences",
      icon: <ArrowRight className="w-4 h-4 text-purple-500" />,
      action: () => {
        setLayoutStyle(
          layoutStyle === "sidebar" ? "topbar" : layoutStyle === "topbar" ? "mini" : "sidebar"
        );
        setIsCommandPaletteOpen(false);
      },
    },
  ];

  const filtered = quickActions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.desc.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={
              language === "am"
                ? "ወደ የትኛውም ሞጁል፣ መጽሐፍ ወይም ክፍል በፍጥነት ይሂዱ..."
                : "Jump to any module, textbook, exam, or tool..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full text-left p-3 rounded-2xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 font-medium">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              {language === "am" ? "ምንም ውጤት አልተገኘም" : "No matching tools or modules found"}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>{language === "am" ? "ፈጣን አቋራጭ መቆጣጠሪያ" : "Universal Command Center"}</span>
          <div className="flex items-center gap-2">
            <span>{language === "am" ? "አቀማመጥ ለመቀየር" : "Toggle layout"}: Tab</span>
          </div>
        </div>
      </div>
    </div>
  );
};
