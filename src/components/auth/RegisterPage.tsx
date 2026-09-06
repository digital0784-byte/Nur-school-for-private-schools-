import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { UserRole } from "../../types";
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  Phone,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface RegisterPageProps {
  onSwitchToLogin?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
  const { register, isLoading, openLoginModal } = useAuth();
  const { language, setLanguage, addToast } = useApp();

  const [role, setRole] = useState<UserRole>("student");
  const [name, setName] = useState("");
  const [nameAm, setNameAm] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+251 9");
  const [grade, setGrade] = useState("Grade 10");
  const [section, setSection] = useState("A");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      const err = language === "am" ? "የይለፍ ቃሎቹ አይመሳሰሉም" : "Passwords do not match";
      setErrorMessage(err);
      addToast(err, "error");
      return;
    }

    if (password.length < 6) {
      const err = language === "am" ? "የይለፍ ቃል ቢያንስ 6 ፊደላት/ቁጥሮች መሆን አለበት" : "Password must be at least 6 characters";
      setErrorMessage(err);
      addToast(err, "error");
      return;
    }

    const res = await register({
      name,
      nameAm: nameAm || name,
      email,
      password,
      role,
      grade: role === "student" ? grade : undefined,
      section: role === "student" ? section : undefined,
      phone,
    });

    if (res.success) {
      addToast(
        language === "am"
          ? "ምዝገባዎ በተሳካ ሁኔታ ተጠናቋል! እንኳን በደህና መጡ"
          : "Account created successfully! Welcome to NUR School",
        "success"
      );
    } else {
      setErrorMessage(res.error || (language === "am" ? "ምዝገባው አልተሳካም" : "Registration failed"));
      addToast(res.error || "Registration error", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top utility bar */}
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
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-600/30 text-white mb-3">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {language === "am" ? "አዲስ አካውንት መመዝገቢያ" : "Create NUR Account"}
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {language === "am"
            ? "የኑር ትምህርት ቤት ማህበረሰብን ይቀላቀሉ"
            : "Join the NUR School Digital Learning Community"}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-7 px-6 sm:px-10 shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-3xl border border-slate-200/80 dark:border-slate-800">
          
          {/* Role selector buttons */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === "am" ? "የትምህርት ቤት ሚናዎን ይምረጡ" : "Select Your Role"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "student" as UserRole, label: language === "am" ? "ተማሪ" : "Student", icon: "🎒" },
                { id: "parent" as UserRole, label: language === "am" ? "ወላጅ" : "Parent", icon: "👨‍👩‍👧" },
                { id: "teacher" as UserRole, label: language === "am" ? "መምህር" : "Teacher", icon: "👩‍🏫" },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    role === r.id
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/30"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500"
                  }`}
                >
                  <span>{r.icon}</span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-3.5" onSubmit={handleSubmit}>
            {/* Full Name English */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === "am" ? "ሙሉ ስም (እንግሊዝኛ)" : "Full Name (English)"}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sara Mohammed"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Full Name Amharic */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === "am" ? "ሙሉ ስም (አማርኛ - አማራጭ)" : "Full Name (Amharic - Optional)"}
              </label>
              <div className="relative">
                <span className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold">🇪🇹</span>
                <input
                  type="text"
                  value={nameAm}
                  onChange={(e) => setNameAm(e.target.value)}
                  placeholder="ለምሳሌ፡ ሳራ መሐመድ"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Email */}
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
                  placeholder="sara@example.com"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* If Student, Grade and Section */}
            {role === "student" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === "am" ? "የክፍል ደረጃ" : "Grade"}
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {[5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                      <option key={g} value={`Grade ${g}`}>
                        Grade {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === "am" ? "ሴክሽን" : "Section"}
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {["A", "B", "C", "D"].map((s) => (
                      <option key={s} value={s}>
                        Section {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === "am" ? "ስልክ ቁጥር" : "Phone Number"}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251 911 000 000"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "am" ? "የይለፍ ቃል" : "Password"}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "am" ? "የይለፍ ቃል አረጋግጥ" : "Confirm"}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === "am" ? "አካውንት ክፈት (Complete Registration)" : "Complete Registration"}</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to login */}
          <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
            <span>{language === "am" ? "ቀደም ሲል አካውንት አለዎት?" : "Already have an account?"} </span>
            <button
              onClick={() => {
                if (onSwitchToLogin) onSwitchToLogin();
                else openLoginModal();
              }}
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline ml-1"
            >
              {language === "am" ? "ወደ ፖርታሉ ግባ (Sign In)" : "Sign In here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
