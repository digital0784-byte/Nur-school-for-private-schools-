import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  CheckSquare,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

export const ClassAttendance: React.FC = () => {
  const { students, language, t, showToast } = useApp();

  const [selectedClass, setSelectedClass] = useState("Grade 10 - Section A");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);

  // Local attendance state mapped by student ID
  const [attendanceMap, setAttendanceMap] = useState<Record<string, "Present" | "Absent" | "Late" | "Excused">>(() => {
    const map: Record<string, "Present" | "Absent" | "Late" | "Excused"> = {};
    students.forEach((s) => {
      map[s.id] = "Present";
    });
    return map;
  });

  const classStudents = students.filter((s) => s.grade === "Grade 10" && s.section === "A");

  const handleMarkStatus = (studentId: string, status: "Present" | "Absent" | "Late" | "Excused") => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, "Present" | "Absent" | "Late" | "Excused"> = {};
    classStudents.forEach((s) => {
      updated[s.id] = "Present";
    });
    setAttendanceMap((prev) => ({ ...prev, ...updated }));
    showToast(
      language === "am" ? "ሁሉም ተማሪዎች ተገኝተዋል ተብለው ተመዝግበዋል" : "All students marked as Present",
      "success"
    );
  };

  const handleSaveAndNotify = () => {
    const absentees = classStudents.filter((s) => attendanceMap[s.id] === "Absent");
    if (absentees.length > 0) {
      showToast(
        language === "am"
          ? `የመገኘት መዝገብ ጸድቋል! ለ${absentees.length} ቀሪ ተማሪዎች ወላጆች አፋጣኝ SMS ተልኳል።`
          : `Attendance committed! Automated SMS dispatched to ${absentees.length} absentee parents.`,
        "success"
      );
    } else {
      showToast(
        language === "am" ? "የመገኘት መዝገብ በተሳካ ሁኔታ ተቀምጧል!" : "Attendance record successfully saved!",
        "success"
      );
    }
  };

  const presentCount = classStudents.filter((s) => (attendanceMap[s.id] || "Present") === "Present").length;
  const absentCount = classStudents.filter((s) => attendanceMap[s.id] === "Absent").length;
  const lateCount = classStudents.filter((s) => attendanceMap[s.id] === "Late").length;

  return (
    <div id="class-attendance-module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.teacher.attendanceTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === "am"
              ? "የቀን መገኘት መቆጣጠሪያ ከወላጅ አፋጣኝ የኤስኤምኤስ ማንቂያ ጋር"
              : "Live digital attendance taking with instant automated parent SMS notifications"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllPresent}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700"
          >
            {t.teacher.markAllPresent}
          </button>
          <button
            onClick={handleSaveAndNotify}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
          >
            <Send className="w-4 h-4" />
            <span>{t.teacher.saveAndNotify}</span>
          </button>
        </div>
      </div>

      {/* Control Strip & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {language === "am" ? "የተመረጠ ክፍል" : "Class Roster"}
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold border border-slate-200 dark:border-slate-700"
          >
            <option value="Grade 10 - Section A">Grade 10 - Section A (Physics)</option>
            <option value="Grade 11 - Section B">Grade 11 - Section B (Advanced Math)</option>
            <option value="Grade 8 - Section A">Grade 8 - Section A (General Science)</option>
          </select>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {language === "am" ? "ቀን" : "Attendance Date"}
          </label>
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold border border-slate-200 dark:border-slate-700"
          />
        </div>

        <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">
              {language === "am" ? "የተገኙ" : "Present"}
            </span>
            <p className="text-2xl font-black text-emerald-700 dark:text-emerald-200">
              {presentCount}
            </p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 opacity-60" />
        </div>

        <div className="p-4 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-rose-800 dark:text-rose-300 uppercase">
              {language === "am" ? "ቀሪዎች" : "Absentees"}
            </span>
            <p className="text-2xl font-black text-rose-700 dark:text-rose-200">
              {absentCount}
            </p>
          </div>
          <AlertTriangle className="w-8 h-8 text-rose-600 dark:text-rose-400 opacity-60" />
        </div>
      </div>

      {/* Student Attendance Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">{language === "am" ? "ተማሪ / መለያ" : "Student"}</th>
                <th className="p-4">{language === "am" ? "የወላጅ ስልክ" : "Emergency Contact"}</th>
                <th className="p-4">{language === "am" ? "አማካይ መገኘት" : "Term Rate"}</th>
                <th className="p-4 text-right">{language === "am" ? "የዛሬ ሁኔታ" : "Status Action"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {classStudents.map((std) => {
                const currentStatus = attendanceMap[std.id] || "Present";
                return (
                  <tr
                    key={std.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={std.avatar}
                          alt={std.fullName}
                          className="w-9 h-9 rounded-full object-cover border border-emerald-500/30"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {language === "am" ? std.fullNameAm : std.fullName}
                          </p>
                          <p className="font-mono text-[10px] text-slate-400">{std.idNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-600 dark:text-slate-400">
                      {std.parentPhone}
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {std.attendanceRate}%
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => handleMarkStatus(std.id, "Present")}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                            currentStatus === "Present"
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                          }`}
                        >
                          {t.teacher.present}
                        </button>
                        <button
                          onClick={() => handleMarkStatus(std.id, "Absent")}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                            currentStatus === "Absent"
                              ? "bg-rose-600 text-white shadow-sm"
                              : "text-slate-600 dark:text-slate-400 hover:text-rose-600"
                          }`}
                        >
                          {t.teacher.absent}
                        </button>
                        <button
                          onClick={() => handleMarkStatus(std.id, "Late")}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                            currentStatus === "Late"
                              ? "bg-amber-600 text-white shadow-sm"
                              : "text-slate-600 dark:text-slate-400 hover:text-amber-600"
                          }`}
                        >
                          {t.teacher.late}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
