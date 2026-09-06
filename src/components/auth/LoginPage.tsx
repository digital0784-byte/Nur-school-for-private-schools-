import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { UserRole } from "../../types";
import {
  GraduationCap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  School,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface LoginPageProps {
  onSwitchToRegister?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const { login, loginAsDemo, isLoading, openRegisterModal } = useAuth();
  const { language, setLanguage, t, addToast } = useApp();

  const [email, setEmail] = useState("admin@nurschool.et");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const demoAccounts: { role: UserRole; title: string; titleAm: string; email: string; icon: string; color: string }[] = [
    {
      role: "admin",
      title: "Super Admin",
      titleAm: "ዋና አስተዳዳሪ",
      email: "admin@nurschool.et",
      icon: "👔",
      color: "border-indigo-500/40 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300",
    },
    {
      role: "teacher",
      title: "Teacher",
      titleAm: "መምህር",
      email: "teacher@nurschool.et",
      icon: "👩‍🏫",
      color: "border-emerald-500/40 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
    },
    {
      role: "student",
      title: "Student",
      titleAm: "ተማሪ",
      email: "student@nurschool.et",
      icon: "🎒",
      color: "border-blue-500/40 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",
    },
    {
      role: "parent",
      title: "Parent",
      titleAm: "ወላጅ",
      email: "parent@nurschool.et",
      icon: "👨‍👩‍👧",
      color: "border-amber-500/40 bg-amber-50/70 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const res = await login(email, password);
    if (!res.success) {
      setErrorMessage(res.error || (language === "am" ? "የመግቢያ መረጃው ትክክል አይደለም" : "Invalid email or password"));
      addToast(
        language === "am" ? "የመግቢያ መረጃው ትክክል አይደለም" : "Invalid login credentials",
        "error"
      );
    } else {
      addToast(
        language === "am" ? "እንኳን በደህና መጡ!" : "Welcome back to NUR School Portal!",
        "success"
      );
    }
  };

  const handleSelectDemo = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword("password123");
    loginAsDemo(acc.role);
    addToast(
      language === "am"
        ? `እንደ ${acc.titleAm} በተሳካ ሁኔታ ገብተዋል`
        : `Switched to ${acc.title} role demo`,
      "success"
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      {/* Background Decorative Rings */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top bar with language switcher */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm">
          <span>🇪🇹</span>
          <span>{language === "am" ? "2019 ዓ.ም" : "2019 E.C. (2026-2027)"}</span>
        </div>

        <button
          onClick={() => setLanguage(language === "am" ? "en" : "am")}
          className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:border-emerald-500 transition-colors shadow-sm"
        >
          {language === "am" ? "English" : "አማርኛ"}
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* School Logo */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-600/30 text-white mb-3">
          <GraduationCap className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {language === "am" ? "የኑር ትምህርት ቤት ፖርታል" : "NUR School Portal"}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {language === "am"
            ? "የላቀ የትምህርት ጥራትና የ AI ቴክኖሎጂ ማዕከል"
            : "Enterprise School Management & Socratic AI Learning"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-3xl border border-slate-200/80 dark:border-slate-800">
          
          {/* Quick 1-Click Role Switcher */}
          <div className="mb-6">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 text-center">
              {language === "am" ? "የፈጣን ሞካሪ አካውንቶች (1-Click Login)" : "Fast Role Selector (Demo)"}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleSelectDemo(acc)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-left text-xs font-bold transition-all duration-150 hover:scale-[1.02] active:scale-95 ${acc.color}`}
                >
                  <span className="text-base">{acc.icon}</span>
                  <div className="min-w-0">
                    <p className="truncate leading-tight">
                      {language === "am" ? acc.titleAm : acc.title}
                    </p>
                    <p className="text-[9px] opacity-70 truncate font-mono">1-Click</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 text-[10px] font-bold tracking-wider">
                {language === "am" ? "ወይም በኢሜይል ይግቡ" : "Or sign in with email"}
              </span>
            </div>
          </div>

          {/* Error notice */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === "am" ? "የኢሜይል አድራሻ" : "Email Address"}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nurschool.et"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === "am" ? "የይለፍ ቃል" : "Password"}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>{language === "am" ? "አስታውሰኝ" : "Remember me"}</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setPassword("password123");
                  addToast(language === "am" ? "የይለፍ ቃል ወደ 'password123' ተስተካክሏል" : "Password set to default 'password123'", "info");
                }}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
              >
                {language === "am" ? "የይለፍ ቃል ረሱ?" : "Reset Demo Password"}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{language === "am" ? "ወደ ፖርታሉ ግባ" : "Sign In to Portal"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration link */}
          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            <span>{language === "am" ? "አዲስ ተማሪ ወይም ወላጅ ነዎት?" : "New student or parent?"} </span>
            <button
              onClick={() => {
                if (onSwitchToRegister) onSwitchToRegister();
                else openRegisterModal();
              }}
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline ml-1"
            >
              {language === "am" ? "አካውንት ይክፈቱ (Register)" : "Create an Account"}
            </button>
          </div>
        </div>

        {/* Footnote */}
        <div className="mt-6 text-center text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-2">
          <span>🛡️ 256-bit Encrypted</span>
          <span>•</span>
          <span>🇪🇹 Addis Ababa, Ethiopia</span>
          <span>•</span>
          <span>v3.5 Enterprise</span>
        </div>
      </div>
    </div>
  );
};
