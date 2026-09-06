/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";
import { Header } from "./components/common/Header";
import { Sidebar } from "./components/common/Sidebar";
import { NotificationDrawer } from "./components/common/NotificationDrawer";
import { ReceiptModal } from "./components/common/ReceiptModal";
import { AnnouncementsBoard } from "./components/common/AnnouncementsBoard";
import { CommandPaletteModal } from "./components/common/CommandPaletteModal";
import { BreadcrumbsBar } from "./components/common/BreadcrumbsBar";

// ERP Modules
import { AdminDashboard } from "./components/erp/AdminDashboard";
import { StudentStaffManagement } from "./components/erp/StudentStaffManagement";
import { FinancialFeeEngine } from "./components/erp/FinancialFeeEngine";
import { TimetableScheduler } from "./components/erp/TimetableScheduler";
import { TransportBusTracking } from "./components/erp/TransportBusTracking";
import { LibraryManagement } from "./components/erp/LibraryManagement";

// Teacher Modules
import { ClassAttendance } from "./components/teacher/ClassAttendance";
import { AssignmentHub } from "./components/teacher/AssignmentHub";
import { AIQuizGenerator } from "./components/teacher/AIQuizGenerator";
import { GradebookReportCards } from "./components/teacher/GradebookReportCards";

// Student LMS Modules
import { StudentLearningHub } from "./components/student/StudentLearningHub";
import { AITutorChat } from "./components/student/AITutorChat";
import { CBTExamEngine } from "./components/student/CBTExamEngine";
import { FocusTimer } from "./components/student/FocusTimer";
import { InteractiveLessons } from "./components/student/InteractiveLessons";

// Parent Portal Modules
import { ParentChildOverview } from "./components/parent/ParentChildOverview";
import { ParentFeePayment } from "./components/parent/ParentFeePayment";
import { ParentAIInsights } from "./components/parent/ParentAIInsights";
import { ParentTeacherChat } from "./components/parent/ParentTeacherChat";

import { CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

const AppContent: React.FC = () => {
  const { activeTab, toasts, contentWidth, userRole, setUserRole } = useApp();
  const { user, isAuthModalOpen, authModalMode, closeAuthModal, openLoginModal, openRegisterModal } = useAuth();
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Synchronize active user role when logged-in account changes
  useEffect(() => {
    if (user && user.role && user.role !== userRole) {
      setUserRole(user.role);
    }
  }, [user]);

  // If user is not logged in, render authentication portal
  if (!user) {
    if (authView === "register") {
      return <RegisterPage onSwitchToLogin={() => setAuthView("login")} />;
    }
    return <LoginPage onSwitchToRegister={() => setAuthView("register")} />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      // ERP & Admin
      case "dashboard":
      case "admin-dashboard":
        return <AdminDashboard />;
      case "students-staff":
        return <StudentStaffManagement />;
      case "finance":
        return <FinancialFeeEngine />;
      case "timetable":
        return <TimetableScheduler />;
      case "transport":
        return <TransportBusTracking />;
      case "library":
        return <LibraryManagement />;
      case "announcements":
        return <AnnouncementsBoard />;

      // Teacher Workspace
      case "classes":
      case "teacher-attendance":
        return <ClassAttendance />;
      case "assignments":
      case "teacher-assignments":
        return <AssignmentHub />;
      case "ai-quiz":
      case "teacher-quiz-gen":
        return <AIQuizGenerator />;
      case "gradebook":
      case "teacher-gradebook":
        return <GradebookReportCards />;

      // Student LMS & AI
      case "learning-hub":
      case "student-portal":
        return <StudentLearningHub />;
      case "ai-tutor":
        return <AITutorChat />;
      case "cbt-exam":
        return <CBTExamEngine />;
      case "focus-timer":
        return <FocusTimer />;
      case "lessons":
        return <InteractiveLessons />;

      // Parent Portal
      case "parent-child":
      case "parent-overview":
        return <ParentChildOverview />;
      case "parent-fees":
        return <ParentFeePayment />;
      case "parent-ai":
        return <ParentAIInsights />;
      case "parent-teachers":
      case "parent-chat":
        return <ParentTeacherChat />;

      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-['Plus_Jakarta_Sans','Noto_Sans_Ethiopic',sans-serif]">
      {/* Sidebar */}
      <Sidebar isOpenMobile={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />

      {/* Main Column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header onToggleMobileMenu={() => setSidebarOpen(!sidebarOpen)} />

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className={contentWidth === "full" ? "w-full max-w-none" : "max-w-7xl mx-auto"}>
            <BreadcrumbsBar />
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Quick Search & Command Center (⌘K) */}
      <CommandPaletteModal />

      {/* Global Notifications Drawer */}
      <NotificationDrawer />

      {/* Official Receipt Modal */}
      <ReceiptModal />

      {/* Auth Modal Overlay when opened while logged in */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 z-10 transition-colors font-bold text-sm"
              title="Close"
            >
              ✕
            </button>
            <div className="max-h-[90vh] overflow-y-auto">
              {authModalMode === "register" ? (
                <RegisterPage onSwitchToLogin={() => openLoginModal()} />
              ) : (
                <LoginPage onSwitchToRegister={() => openRegisterModal()} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating System Toasts */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300 ${
                t.type === "success"
                  ? "bg-emerald-900/90 border-emerald-500/40 text-emerald-100"
                  : t.type === "error"
                  ? "bg-rose-900/90 border-rose-500/40 text-rose-100"
                  : "bg-slate-900/90 border-slate-700 text-slate-100"
              }`}
            >
              {t.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {t.type === "error" && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              {t.type === "info" && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
              <span>{t.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
