import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Award,
  Download,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  X,
} from "lucide-react";

export const GradebookReportCards: React.FC = () => {
  const { students, language, t, showToast } = useApp();

  const [selectedClass, setSelectedClass] = useState("Grade 10A");
  const [activeReportStudent, setActiveReportStudent] = useState<(typeof students)[0] | null>(null);

  const studentsInClass = students.filter((s) => s.grade === "Grade 10");

  const sampleSubjects = [
    { name: "Physics", teacher: "Dawit Bekele", test1: 18, mid: 27, final: 46, total: 91, grade: "A" },
    { name: "Mathematics", teacher: "Tigist Alemu", test1: 19, mid: 28, final: 48, total: 95, grade: "A+" },
    { name: "Chemistry", teacher: "Abebe Kebede", test1: 16, mid: 25, final: 42, total: 83, grade: "B+" },
    { name: "English", teacher: "Bethlehem Assefa", test1: 18, mid: 28, final: 45, total: 91, grade: "A" },
    { name: "Amharic", teacher: "Solomon Desta", test1: 19, mid: 29, final: 47, total: 95, grade: "A+" },
    { name: "ICT & Coding", teacher: "Yared Tesfaye", test1: 20, mid: 30, final: 49, total: 99, grade: "A+" },
  ];

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div id="gradebook-report-cards" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.nav.teacherGradebook}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === "am"
              ? "የፈተና እና የማጠቃለያ ውጤቶች፣ የጂፒኤ ሂሳብ እና የዲጂታል ሪፖርት ካርድ ማመንጫ"
              : "Continuous formative evaluations, cumulative GPA analytics, and digital official transcripts"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold border border-slate-200 dark:border-slate-700"
          >
            <option value="Grade 10A">Grade 10 - Section A</option>
            <option value="Grade 10B">Grade 10 - Section B</option>
            <option value="Grade 11A">Grade 11 - Section A</option>
          </select>
        </div>
      </div>

      {/* Gradebook Matrix Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            {selectedClass} — Master Academic Roster
          </h3>
          <span className="text-[11px] text-slate-400">
            Academic Term Q1 • Scale 4.0
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Student Name</th>
                <th className="p-4">ID Number</th>
                <th className="p-4">Quiz / Tests (20%)</th>
                <th className="p-4">Midterm Exam (30%)</th>
                <th className="p-4">Final Exam (50%)</th>
                <th className="p-4">Total (100%)</th>
                <th className="p-4">GPA</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {studentsInClass.map((std, idx) => {
                const totalScore = Math.floor(82 + (idx % 3) * 6);
                return (
                  <tr
                    key={std.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={std.avatar}
                          alt={std.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-emerald-500/30"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {language === "am" ? std.fullNameAm : std.fullName}
                          </p>
                          <p className="text-[10px] text-slate-400">{std.grade} ({std.section})</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-500 dark:text-slate-400">
                      {std.idNumber}
                    </td>
                    <td className="p-4 font-mono">18 / 20</td>
                    <td className="p-4 font-mono">27 / 30</td>
                    <td className="p-4 font-mono">46 / 50</td>
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                      {totalScore}%
                    </td>
                    <td className="p-4 font-mono font-black text-emerald-600 dark:text-emerald-400">
                      {std.gpa}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setActiveReportStudent(std)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-300 font-bold text-xs transition-colors"
                      >
                        {language === "am" ? "ሪፖርት ካርድ" : "View Report Card"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Digital Report Card Modal */}
      {activeReportStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
            {/* Top Bar */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {language === "am" ? "ይፋዊ የትምህርት ሪፖርት ካርድ" : "Official Academic Report Card"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintReport}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-600 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t.common.print}</span>
                </button>
                <button
                  onClick={() => setActiveReportStudent(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Transcript */}
            <div id="printable-report-card" className="p-6 sm:p-8 space-y-6 text-xs text-slate-800 dark:text-slate-200">
              <div className="text-center border-b border-dashed border-slate-300 dark:border-slate-700 pb-5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-xl mb-2">
                  NUR
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {language === "am" ? "ኑር ትምህርት ቤት - አዲስ አበባ" : "NUR SCHOOL — ADDIS ABABA"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Comprehensive Secondary Education Transcript • Q1 2026/2027
                </p>
              </div>

              {/* Student Metadata Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Name</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeReportStudent.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Student ID</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{activeReportStudent.idNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Grade & Section</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeReportStudent.grade} ({activeReportStudent.section})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Cumulative GPA</span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">{activeReportStudent.gpa} / 4.0</span>
                </div>
              </div>

              {/* Subject Breakdown Table */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3">Course / Subject</th>
                      <th className="p-3">Instructor</th>
                      <th className="p-3 text-right">Tests (20%)</th>
                      <th className="p-3 text-right">Mid (30%)</th>
                      <th className="p-3 text-right">Final (50%)</th>
                      <th className="p-3 text-right">Total (100%)</th>
                      <th className="p-3 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {sampleSubjects.map((sub, sIdx) => (
                      <tr key={sIdx}>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{sub.name}</td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">{sub.teacher}</td>
                        <td className="p-3 text-right font-mono">{sub.test1}</td>
                        <td className="p-3 text-right font-mono">{sub.mid}</td>
                        <td className="p-3 text-right font-mono">{sub.final}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">{sub.total}%</td>
                        <td className="p-3 text-center font-black text-emerald-600 dark:text-emerald-400">{sub.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Head of School Endorsement */}
              <div className="flex items-center justify-between pt-4 border-t border-dashed border-slate-300 dark:border-slate-700 text-[11px]">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Director of Academic Affairs</p>
                  <p className="text-slate-400">Dr. Asefa Mengesha, Ph.D.</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-slate-400">Date Issued: {new Date().toISOString().split("T")[0]}</span>
                  <div className="mt-1 text-emerald-600 font-bold">✓ OFFICIALLY SEALED</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
