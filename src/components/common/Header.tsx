import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  GraduationCap,
  Bell,
  Sun,
  Moon,
  Globe,
  UserCheck,
  BookOpen,
  Users,
  Shield,
  Menu,
  Search,
  Sliders,
  Layout,
  Columns,
  PanelLeftClose,
  Sparkles,
} from "lucide-react";
import { UserRole } from "../../types";
import { LayoutSettingsModal } from "./LayoutSettingsModal";

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const {
    userRole,
    setUserRole,
    currentUser,
    language,
    toggleLanguage,
    theme,
    toggleTheme,
    unreadNotificationsCount,
    setIsNotificationDrawerOpen,
    t,
    layoutStyle,
    setLayoutStyle,
    setIsCommandPaletteOpen,
    activeTab,
    setActiveTab,
  } = useApp();

  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false);

  const rolesList: { role: UserRole; labelEn: string; labelAm: string; icon: React.ReactNode }[] = [
    { role: "admin", labelEn: "Super Admin", labelAm: "አስተዳዳሪ", icon: <Shield className="w-4 h-4" /> },
    { role: "teacher", labelEn: "Teacher", labelAm: "መምህር", icon: <BookOpen className="w-4 h-4" /> },
    { role: "student", labelEn: "Student", labelAm: "ተማሪ", icon: <GraduationCap className="w-4 h-4" /> },
    { role: "parent", labelEn: "Parent", labelAm: "ወላጅ", icon: <Users className="w-4 h-4" /> },
  ];

  // Top navigation items when topbar layout is selected
  const getTopNavItems = () => {
    switch (userRole) {
      case "admin":
        return [
          { id: "dashboard", label: t.nav.dashboard },
          { id: "students-staff", label: t.nav.studentsStaff },
          { id: "finance", label: t.nav.finance },
          { id: "library", label: language === "am" ? "መማሪያ እና ረዳት መጻሕፍት" : "Textbooks & Library" },
          { id: "timetable", label: t.nav.timetable },
          { id: "transport", label: t.nav.transport },
          { id: "announcements", label: t.nav.announcements },
        ];
      case "teacher":
        return [
          { id: "classes", label: t.nav.teacherClasses },
          { id: "assignments", label: t.nav.teacherAssignments },
          { id: "ai-quiz", label: t.nav.teacherAIQuiz },
          { id: "gradebook", label: t.nav.teacherGradebook },
          { id: "library", label: language === "am" ? "የመማሪያ መጻሕፍት" : "Curriculum e-Books" },
          { id: "announcements", label: t.nav.announcements },
        ];
      case "student":
        return [
          { id: "learning-hub", label: t.nav.studentOverview },
          { id: "library", label: language === "am" ? "መማሪያ እና ረዳት መጻሕፍት (5-12)" : "Textbooks & Guides" },
          { id: "ai-tutor", label: t.nav.studentAITutor },
          { id: "cbt-exam", label: t.nav.studentCBTExam },
          { id: "focus-timer", label: t.nav.studentFocusTimer },
          { id: "lessons", label: t.nav.studentLessons },
          { id: "announcements", label: t.nav.announcements },
        ];
      case "parent":
        return [
          { id: "parent-child", label: t.nav.parentOverview },
          { id: "parent-fees", label: t.nav.parentFees },
          { id: "parent-ai", label: t.nav.parentAIInsights },
          { id: "parent-teachers", label: t.nav.parentTeachers },
          { id: "announcements", label: t.nav.announcements },
        ];
      default:
        return [];
    }
  };

  return (
    <>
      <header
        id="main-app-header"
        className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Left: Brand / Logo */}
          <div className="flex items-center gap-3">
            {onToggleMobileMenu && (
              <button
                id="btn-toggle-mobile-menu"
                onClick={onToggleMobileMenu}
                className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div
              onClick={() => {
                if (userRole === "admin") setActiveTab("dashboard");
                else if (userRole === "teacher") setActiveTab("classes");
                else if (userRole === "student") setActiveTab("learning-hub");
                else if (userRole === "parent") setActiveTab("parent-child");
              }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                    {t.schoolName}
                  </span>
                  <span className="hidden xl:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-700/50">
                    <span>🇪🇹</span>
                    <span>2017 ዓ.ም • Term 1</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  {language === "am" ? "የዘመናዊ ትምህርት ቤት አስተዳደርና መማሪያ" : "All-in-One School ERP & LMS"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Search Trigger (Cmd + K) */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 text-xs hover:bg-slate-200/70 dark:hover:bg-slate-700/70 transition-colors w-48 lg:w-64"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="flex-1 text-left truncate">
              {language === "am" ? "ፈልግ ወይም ዝለል..." : "Quick search or jump..."}
            </span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs">
              ⌘K
            </kbd>
          </button>

          {/* Center: Quick Role Switcher */}
          <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-inner">
            {rolesList.map((item) => {
              const isActive = userRole === item.role;
              return (
                <button
                  key={item.role}
                  id={`btn-role-${item.role}`}
                  onClick={() => setUserRole(item.role)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm shadow-slate-300/30 font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  {item.icon}
                  <span>{language === "am" ? item.labelAm : item.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: Layout Switcher, Language, Theme, Notifications & User */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mobile role select */}
            <div className="lg:hidden">
              <select
                id="select-mobile-role"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="bg-slate-100 dark:bg-slate-800 text-xs font-semibold px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                {rolesList.map((r) => (
                  <option key={r.role} value={r.role}>
                    {language === "am" ? r.labelAm : r.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Layout Customizer Button */}
            <button
              id="btn-layout-settings"
              onClick={() => setIsLayoutModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700"
              title={language === "am" ? "የአፑ አቀማመጥ ስታይል ቀይር" : "Change Layout Style"}
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">
                {language === "am" ? "አቀማመጥ" : "Layout"}
              </span>
            </button>

            {/* Bilingual Language Switcher */}
            <button
              id="btn-language-toggle"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700"
              title="Toggle Amharic / English"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">{language === "en" ? "አማርኛ" : "English"}</span>
            </button>

            {/* Theme Toggle */}
            <button
              id="btn-theme-toggle"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Notification Bell */}
            <button
              id="btn-open-notifications"
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Profile pill */}
            <div
              id="user-profile-pill"
              className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-emerald-500/40"
              />
              <div className="text-left hidden xl:block">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {language === "am" ? currentUser.nameAm : currentUser.name}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {t.roles[userRole]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Topbar Navigation Strip (Active when layoutStyle === "topbar") */}
        {layoutStyle === "topbar" && (
          <div className="hidden lg:block border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 px-6 py-2">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              {getTopNavItems().map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Layout Settings Modal */}
      <LayoutSettingsModal
        isOpen={isLayoutModalOpen}
        onClose={() => setIsLayoutModalOpen(false)}
      />
    </>
  );
};
