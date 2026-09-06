import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  FileSpreadsheet,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  Upload,
  UserCheck,
  X,
} from "lucide-react";
import { initialAssignments } from "../../data/mockData";
import { Assignment } from "../../types";

export const AssignmentHub: React.FC = () => {
  const { language, t, showToast } = useApp();

  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeReviewAssignment, setActiveReviewAssignment] = useState<Assignment | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Physics");
  const [newClass, setNewClass] = useState("Grade 10A");
  const [newDueDate, setNewDueDate] = useState("2026-09-20");
  const [newPoints, setNewPoints] = useState(100);
  const [newDescription, setNewDescription] = useState("");

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAss: Assignment = {
      id: "asg-" + Date.now(),
      title: newTitle,
      titleAm: newTitle,
      subject: newSubject,
      grade: newClass,
      section: "A",
      teacherName: "Dawit Bekele",
      status: "Open",
      dueDate: newDueDate,
      totalPoints: newPoints,
      submissionsCount: 0,
      totalStudents: 32,
      description: newDescription || "Complete the assigned exercises in accordance with curriculum specifications.",
    };

    setAssignments((prev) => [newAss, ...prev]);
    setIsCreateModalOpen(false);
    setNewTitle("");
    setNewDescription("");
    showToast(
      language === "am"
        ? `የቤት ስራ "${newAss.title}" በተሳካ ሁኔታ ተለቋል!`
        : `Assignment "${newAss.title}" posted to class portal!`,
      "success"
    );
  };

  return (
    <div id="assignment-hub" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.nav.teacherAssignments}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === "am"
              ? "የቤት ስራዎችን መፍጠር፣ የተማሪዎችን ምላሽ ማየት እና ውጤት መመዝገብ"
              : "Coursework dissemination, automated deadlines, and criterion-based grading"}
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>{language === "am" ? "አዲስ የቤት ስራ ፍጠር" : "Create Assignment"}</span>
        </button>
      </div>

      {/* Assignment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map((ass) => {
          const submissionPercentage = Math.round((ass.submissionsCount / ass.totalStudents) * 100);

          return (
            <div
              key={ass.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                    {ass.subject}
                  </span>
                  <span className="font-semibold text-slate-400">{ass.grade}</span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {language === "am" ? ass.titleAm : ass.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {ass.description}
                </p>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Due: {ass.dueDate}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {ass.totalPoints} Pts
                  </span>
                </div>

                {/* Submissions progress */}
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    <span>Submissions</span>
                    <span>
                      {ass.submissionsCount} / {ass.totalStudents} ({submissionPercentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${submissionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setActiveReviewAssignment(ass)}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{language === "am" ? "የተማሪዎችን ስራ ገምግም" : "Review & Grade Submissions"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Assignment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {language === "am" ? "አዲስ የቤት ስራ ማውጫ" : "Create New Coursework Assignment"}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thermodynamics and Specific Heat Lab Report"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="Amharic">Amharic</option>
                    <option value="History">History</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Class
                  </label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  >
                    <option value="Grade 10A">Grade 10A</option>
                    <option value="Grade 10B">Grade 10B</option>
                    <option value="Grade 11 Natural">Grade 11 Natural</option>
                    <option value="Grade 12 Natural">Grade 12 Natural</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Points
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={newPoints}
                    onChange={(e) => setNewPoints(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Instructions & Criteria
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide explicit directions and submission formatting guidelines..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                >
                  {language === "am" ? "ስራውን አውጣ" : "Publish Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Submissions Modal */}
      {activeReviewAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {activeReviewAssignment.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {activeReviewAssignment.submissionsCount} submissions received for grading
                </p>
              </div>
              <button
                onClick={() => setActiveReviewAssignment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sample Student Submissions */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {[
                { name: "Dawit Tadesse", file: "Physics_Lab3_Dawit.pdf", score: 94, status: "Graded" },
                { name: "Selamawit Bekele", file: "Selam_Thermodynamics.pdf", score: 98, status: "Graded" },
                { name: "Natnael Haile", file: "Lab_Report_Natnael.pdf", score: 88, status: "Graded" },
                { name: "Hanna Yilma", file: "Hanna_Y_Physics.pdf", score: 0, status: "Needs Grading" },
              ].map((sub, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{sub.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{sub.file}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {sub.status === "Graded" ? (
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {sub.score} / 100 Pts
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          showToast(
                            language === "am"
                              ? "ውጤቱ 95/100 ተብሎ ተመዝግቧል"
                              : "Grade 95/100 recorded for student!",
                            "success"
                          )
                        }
                        className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold"
                      >
                        Grade (95)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveReviewAssignment(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                {t.common.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
