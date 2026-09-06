import React from "react";
import { useApp } from "../../context/AppContext";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Calendar,
  Bus,
  BookOpen,
  CheckSquare,
  FileSpreadsheet,
  BrainCircuit,
  Sparkles,
  Award,
  Clock,
  Video,
  HeartHandshake,
  MessageSquare,
  Megaphone,
  X,
  PanelLeftClose,
  PanelLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavGroup {
  groupTitle: string;
  groupTitleAm: string;
  items: {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { userRole, activeTab, setActiveTab, t, language, layoutStyle, setLayoutStyle } = useApp();

  // If user selected topbar layout and it's desktop, hide the desktop sidebar
  const isDesktopHidden = layoutStyle === "topbar";
  const isMini = layoutStyle === "mini";

  const getNavGroups = (): NavGroup[] => {
    switch (userRole) {
      case "admin":
        return [
          {
            groupTitle: "Core Operations",
            groupTitleAm: "ዋና አስተዳደር",
            items: [
              { id: "dashboard", label: t.nav.dashboard, icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: "students-staff", label: t.nav.studentsStaff, icon: <Users className="w-4 h-4" /> },
              { id: "announcements", label: t.nav.announcements, icon: <Megaphone className="w-4 h-4 text-rose-500" /> },
            ],
          },
          {
            groupTitle: "Academics & Resources",
            groupTitleAm: "አካዳሚክ እና ካሪኩለም",
            items: [
              {
                id: "library",
                label: language === "am" ? "መማሪያ እና ረዳት መጻሕፍት" : "Textbooks & Guides",
                icon: <BookOpen className="w-4 h-4 text-emerald-500" />,
                badge: "Grades 5-12",
              },
              { id: "timetable", label: t.nav.timetable, icon: <Calendar className="w-4 h-4" /> },
            ],
          },
          {
            groupTitle: "Finance & Logistics",
            groupTitleAm: "ፋይናንስ እና ትራንስፖርት",
            items: [
              { id: "finance", label: t.nav.finance, icon: <CreditCard className="w-4 h-4 text-amber-500" /> },
              { id: "transport", label: t.nav.transport, icon: <Bus className="w-4 h-4 text-teal-500" /> },
            ],
          },
        ];

      case "teacher":
        return [
          {
            groupTitle: "Classroom Workspace",
            groupTitleAm: "የክፍል ውስጥ ስራዎች",
            items: [
              { id: "classes", label: t.nav.teacherClasses, icon: <CheckSquare className="w-4 h-4 text-emerald-500" /> },
              { id: "assignments", label: t.nav.teacherAssignments, icon: <FileSpreadsheet className="w-4 h-4" /> },
              { id: "gradebook", label: t.nav.teacherGradebook, icon: <Award className="w-4 h-4 text-indigo-500" /> },
            ],
          },
          {
            groupTitle: "AI & Teaching Aids",
            groupTitleAm: "የ AI ረዳቶች እና ካሪኩለም",
            items: [
              { id: "ai-quiz", label: t.nav.teacherAIQuiz, icon: <Sparkles className="w-4 h-4 text-amber-500" />, badge: "AI" },
              {
                id: "library",
                label: language === "am" ? "የመማሪያ እና ረዳት መጻሕፍት" : "e-Textbooks & Guides",
                icon: <BookOpen className="w-4 h-4 text-teal-500" />,
              },
              { id: "timetable", label: t.nav.timetable, icon: <Calendar className="w-4 h-4" /> },
              { id: "announcements", label: t.nav.announcements, icon: <Megaphone className="w-4 h-4 text-rose-500" /> },
            ],
          },
        ];

      case "student":
        return [
          {
            groupTitle: "My Learning Hub",
            groupTitleAm: "የተማሪ ገጽ",
            items: [
              { id: "learning-hub", label: t.nav.studentOverview, icon: <LayoutDashboard className="w-4 h-4 text-emerald-500" /> },
              {
                id: "library",
                label: language === "am" ? "የመማሪያ እና ረዳት መጻሕፍት" : "Textbooks & Extreme Guides",
                icon: <BookOpen className="w-4 h-4 text-teal-500" />,
                badge: "5-12",
              },
              { id: "lessons", label: t.nav.studentLessons, icon: <Video className="w-4 h-4 text-blue-500" /> },
            ],
          },
          {
            groupTitle: "Smart AI & Assessments",
            groupTitleAm: "AI ረዳት እና ፈተናዎች",
            items: [
              { id: "ai-tutor", label: t.nav.studentAITutor, icon: <BrainCircuit className="w-4 h-4 text-indigo-500" />, badge: "AI" },
              { id: "cbt-exam", label: t.nav.studentCBTExam, icon: <Award className="w-4 h-4 text-rose-500" /> },
              { id: "focus-timer", label: t.nav.studentFocusTimer, icon: <Clock className="w-4 h-4 text-amber-500" /> },
              { id: "announcements", label: t.nav.announcements, icon: <Megaphone className="w-4 h-4" /> },
            ],
          },
        ];

      case "parent":
        return [
          {
            groupTitle: "Child Monitoring",
            groupTitleAm: "የልጆች ክትትል",
            items: [
              { id: "parent-child", label: t.nav.parentOverview, icon: <HeartHandshake className="w-4 h-4 text-rose-500" /> },
              { id: "parent-fees", label: t.nav.parentFees, icon: <CreditCard className="w-4 h-4 text-emerald-500" /> },
            ],
          },
          {
            groupTitle: "Communication & AI",
            groupTitleAm: "ግንኙነት እና AI",
            items: [
              { id: "parent-ai", label: t.nav.parentAIInsights, icon: <Sparkles className="w-4 h-4 text-amber-500" />, badge: "AI" },
              { id: "parent-teachers", label: t.nav.parentTeachers, icon: <MessageSquare className="w-4 h-4 text-blue-500" /> },
              { id: "announcements", label: t.nav.announcements, icon: <Megaphone className="w-4 h-4" /> },
            ],
          },
        ];

      default:
        return [];
    }
  };

  const navGroups = getNavGroups();

  const handleItemClick = (id: string) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  // Render content for full width sidebar
  const renderFullContent = () => (
    <div className="h-full flex flex-col justify-between py-5 px-3">
      <div className="space-y-6">
        {/* Header with collapse toggle */}
        <div className="px-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {language === "am" ? "የስራ ክፍሎች" : "Modules & Tools"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {/* Desktop collapse toggle */}
            <button
              onClick={() => setLayoutStyle("mini")}
              className="hidden lg:flex p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={language === "am" ? "ማውጫውን አሳንስ" : "Collapse Sidebar"}
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
            {/* Mobile close */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Grouped Nav Items */}
        <div className="space-y-5">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {language === "am" ? group.groupTitleAm : group.groupTitle}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`sidebar-item-${item.id}`}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 text-left group ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? "text-white" : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ml-1 ${
                            isActive
                              ? "bg-emerald-700 text-white"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* School Badge Card */}
      <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/20 text-center mt-4">
        <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">
          {t.schoolName}
        </p>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 italic">
          "{t.schoolMotto}"
        </p>
        <div className="mt-2 text-[9px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
          <span>🇪🇹 Addis Ababa</span>
          <span>•</span>
          <span>v3.5 Enterprise</span>
        </div>
      </div>
    </div>
  );

  // Render content for compact mini rail
  const renderMiniContent = () => (
    <div className="h-full flex flex-col justify-between py-4 items-center">
      <div className="space-y-4 flex flex-col items-center">
        {/* Expand button */}
        <button
          onClick={() => setLayoutStyle("sidebar")}
          className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={language === "am" ? "ማውጫውን አሰፋ" : "Expand Sidebar"}
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <div className="w-8 h-px bg-slate-200 dark:border-slate-800" />

        {/* Flat list of all module icons */}
        <div className="space-y-2 flex flex-col items-center">
          {navGroups
            .flatMap((g) => g.items)
            .map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`p-2.5 rounded-2xl transition-all relative group ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  title={item.label}
                >
                  {item.icon}
                  {/* Floating tooltip on hover */}
                  <span className="absolute left-full ml-3 px-2 py-1 bg-slate-900 text-white text-[11px] font-bold rounded-lg shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                    {item.label}
                  </span>
                </button>
              );
            })}
        </div>
      </div>

      <div className="text-[10px] font-extrabold text-slate-400">
        🇪🇹
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar (Only when not in topbar mode) */}
      {!isDesktopHidden && (
        <aside
          className={`hidden lg:block shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-200 ${
            isMini ? "w-16" : "w-64"
          }`}
        >
          {isMini ? renderMiniContent() : renderFullContent()}
        </aside>
      )}

      {/* Mobile Drawer (Always full view) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto">
            {renderFullContent()}
          </div>
        </div>
      )}
    </>
  );
};
