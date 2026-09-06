import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Sparkles,
  BrainCircuit,
  HeartHandshake,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Loader2,
  BookOpen,
  Award,
  Lightbulb,
} from "lucide-react";

export const ParentAIInsights: React.FC = () => {
  const { language, t, showToast } = useApp();

  const [studentName, setStudentName] = useState("Dawit Tadesse");
  const [grade, setGrade] = useState("Grade 10");
  const [gpa, setGpa] = useState("3.88");
  const [attendance, setAttendance] = useState("98%");
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setInsights(null);

    try {
      const response = await fetch("/api/ai/parent-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          grade,
          gpa,
          attendance,
          recentPerformance: [
            { subject: "Physics", score: 94, notes: "Exemplary lab analysis in mechanics" },
            { subject: "Mathematics", score: 98, notes: "Mastery of quadratic functions" },
            { subject: "Chemistry", score: 88, notes: "Needs slight reinforcement in organic synthesis" },
            { subject: "Amharic Literature", score: 95, notes: "High creative articulation" },
          ],
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to contact Parent Insights service");
      }

      const data = await response.json();
      setInsights(data.insights);
      showToast(
        language === "am"
          ? "የወላጅ የአይአይ ትንታኔ በስኬት ተዘጋጅቷል!"
          : "AI Parenting & Academic Advisory synthesized!",
        "success"
      );
    } catch (err: any) {
      console.error("AI Parent Insights error:", err);
      showToast(
        language === "am"
          ? "ትንታኔውን ማመንጨት አልተቻለም። እባክዎ እንደገና ይሞክሩ።"
          : "Could not generate insights. Please retry.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="parent-ai-insights" className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-700 via-emerald-700 to-indigo-800 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3 border border-white/25">
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>Gemini 2.5 Pro Pedagogical Diagnostics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t.parent.aiInsightsTitle}
          </h2>
          <p className="text-sm text-emerald-100 mt-2 leading-relaxed">
            {language === "am"
              ? "የልጅዎን ጥንካሬዎች፣ የመሻሻያ መስኮች እና በቤት ውስጥ ሊደረጉ የሚገባቸውን አጋዥ እርምጃዎች በአይአይ ይተንትኑ።"
              : "Translating gradebook milestones and classroom attendance into tailored, actionable home study routines."}
          </p>
        </div>
      </div>

      {/* Ward Metric Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-black text-lg">
            DT
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              {studentName} • {grade}
            </h3>
            <p className="text-xs text-slate-400">
              Cumulative GPA: <strong className="text-slate-700 dark:text-slate-200">{gpa}</strong> • Attendance: <strong className="text-emerald-600">{attendance}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateInsights}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 disabled:opacity-50 transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{language === "am" ? "በመተንተን ላይ..." : "Consulting Gemini AI..."}</span>
            </>
          ) : (
            <>
              <BrainCircuit className="w-4 h-4" />
              <span>{language === "am" ? "አዲስ ትንታኔ አውጣ" : "Generate Consultation"}</span>
            </>
          )}
        </button>
      </div>

      {/* AI Insights Card Output */}
      {insights && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-500/30 dark:border-emerald-500/20 shadow-xl space-y-6">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-800 dark:text-emerald-300">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span>{language === "am" ? "የአይአይ ወላጅ ምክር እና የድርጊት መመሪያ" : "Synthesized Pedagogical Roadmap for Home"}</span>
          </div>

          <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line space-y-3">
            {insights}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Model: Gemini 2.5 Pro Multilingual</span>
            <span>Based on Term 1 Evaluative Metrics</span>
          </div>
        </div>
      )}
    </div>
  );
};
