import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Users,
  GraduationCap,
  Search,
  Plus,
  Download,
  Filter,
  ArrowUpDown,
  Mail,
  Phone,
  CheckCircle2,
  X,
  MoreVertical,
  Edit2,
  Trash2,
  Send,
} from "lucide-react";
import { Student, Staff } from "../../types";

export const StudentStaffManagement: React.FC = () => {
  const {
    students,
    setStudents,
    staffList,
    setStaffList,
    language,
    t,
    showToast,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<"students" | "staff">("students");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");

  // Modal states
  const [isRegisterStudentModalOpen, setIsRegisterStudentModalOpen] = useState(false);
  const [isRegisterStaffModalOpen, setIsRegisterStaffModalOpen] = useState(false);
  const [selectedStudentForAction, setSelectedStudentForAction] = useState<Student | null>(null);

  // New student form state
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentNameAm, setNewStudentNameAm] = useState("");
  const [newStudentGrade, setNewStudentGrade] = useState("Grade 10");
  const [newStudentSection, setNewStudentSection] = useState("A");
  const [newStudentGender, setNewStudentGender] = useState<"Male" | "Female">("Male");
  const [newStudentParent, setNewStudentParent] = useState("");
  const [newStudentPhone, setNewStudentPhone] = useState("+251 ");

  // New staff form state
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffNameAm, setNewStaffNameAm] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("Teacher");
  const [newStaffDept, setNewStaffDept] = useState("Natural Sciences");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("+251 ");

  // Filtering students
  const filteredStudents = students.filter((std) => {
    const matchesSearch =
      std.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.fullNameAm.includes(searchQuery) ||
      std.idNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = selectedGrade === "All" || std.grade === selectedGrade;
    const matchesSection = selectedSection === "All" || std.section === selectedSection;
    return matchesSearch && matchesGrade && matchesSection;
  });

  // Filtering staff
  const filteredStaff = staffList.filter((stf) => {
    const matchesSearch =
      stf.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stf.fullNameAm.includes(searchQuery) ||
      stf.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stf.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) {
      showToast(language === "am" ? "እባክዎ የተማሪውን ሙሉ ስም ያስገቡ" : "Please enter student's full name", "error");
      return;
    }

    const newStudent: Student = {
      id: "std-" + Date.now(),
      idNumber: `NUR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: newStudentName,
      fullNameAm: newStudentNameAm || newStudentName,
      grade: newStudentGrade,
      section: newStudentSection,
      gender: newStudentGender,
      dateOfBirth: "2011-01-01",
      parentName: newStudentParent || "Guardian",
      parentPhone: newStudentPhone || "+251 911 000 000",
      status: "Active",
      attendanceRate: 100,
      gpa: 4.0,
      feeStatus: "Pending",
      avatar:
        newStudentGender === "Male"
          ? "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    };

    setStudents((prev) => [newStudent, ...prev]);
    setIsRegisterStudentModalOpen(false);
    setNewStudentName("");
    setNewStudentNameAm("");
    showToast(
      language === "am"
        ? `ተማሪ ${newStudent.fullName} በተሳካ ሁኔታ ተመዝግቧል!`
        : `Student ${newStudent.fullName} registered successfully!`,
      "success"
    );
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) {
      showToast(language === "am" ? "እባክዎ የመምህሩን ሙሉ ስም ያስገቡ" : "Please enter staff member's name", "error");
      return;
    }

    const newStaff: Staff = {
      id: "stf-" + Date.now(),
      staffId: `NUR-FAC-${Math.floor(100 + Math.random() * 900)}`,
      fullName: newStaffName,
      fullNameAm: newStaffNameAm || newStaffName,
      role: newStaffRole,
      department: newStaffDept,
      email: newStaffEmail || `${newStaffName.toLowerCase().replace(/\s+/g, ".")}@nurschool.edu.et`,
      phone: newStaffPhone,
      assignedClasses: ["Grade 10A"],
      qualification: "B.Sc. / B.Ed. in Education",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    };

    setStaffList((prev) => [newStaff, ...prev]);
    setIsRegisterStaffModalOpen(false);
    setNewStaffName("");
    setNewStaffNameAm("");
    showToast(
      language === "am"
        ? `መምህር/ሰራተኛ ${newStaff.fullName} በተሳካ ሁኔታ ተመዝግቧል!`
        : `Staff member ${newStaff.fullName} registered successfully!`,
      "success"
    );
  };

  const handleExportCSV = () => {
    const headers = "ID Number,Full Name,Grade,Section,Gender,Parent Phone,Attendance Rate,GPA,Fee Status\n";
    const rows = filteredStudents
      .map(
        (s) =>
          `"${s.idNumber}","${s.fullName}","${s.grade}","${s.section}","${s.gender}","${s.parentPhone}",${s.attendanceRate}%,${s.gpa},"${s.feeStatus}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `NUR_School_Students_Roster_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(language === "am" ? "የተማሪዎች መዝገብ (CSV) ወርዷል" : "Student roster CSV downloaded", "success");
  };

  const handlePromoteStudent = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            grade: s.grade === "Grade 10" ? "Grade 11" : s.grade === "Grade 6" ? "Grade 7" : s.grade,
          };
        }
        return s;
      })
    );
    showToast(
      language === "am" ? "ተማሪው ወደ ቀጣዩ የትምህርት ክፍል ተዘዋውሯል!" : "Student promoted to next academic grade level!",
      "success"
    );
    setSelectedStudentForAction(null);
  };

  return (
    <div id="student-staff-management" className="space-y-6">
      {/* Header with Title and Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === "am" ? "የተማሪዎች እና ሰራተኞች ማኔጅመንት" : "Students & Faculty Directory"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === "am"
              ? "የተማሪዎችን ምዝገባ፣ የክፍል ምደባ፣ የውጤት ሁኔታ እና የሰራተኞች መዝገብ ይቆጣጠሩ"
              : "Comprehensive academic records, grade enrollment filters, and credential tracking"}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            onClick={() => setActiveSubTab("students")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeSubTab === "students"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>
              {language === "am" ? "ተማሪዎች" : "Students"} ({students.length})
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab("staff")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeSubTab === "staff"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>
              {language === "am" ? "መምህራን እና ሰራተኞች" : "Faculty & Staff"} ({staffList.length})
            </span>
          </button>
        </div>
      </div>

      {/* Control bar: Search, Filter, Export, Add */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              language === "am" ? "በስም ወይም በመለያ ቁጥር ፈልግ..." : "Search by name or ID number..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Dropdown Filters (For Students) */}
        {activeSubTab === "students" && (
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            >
              <option value="All">{language === "am" ? "ሁሉም ክፍሎች" : "All Grades"}</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>

            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            >
              <option value="All">{language === "am" ? "ሁሉም ሴክሽኖች" : "All Sections"}</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="Natural Science">Natural Science</option>
              <option value="Social Science">Social Science</option>
            </select>
          </div>
        )}

        {/* Actions: Export & Add */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {activeSubTab === "students" && (
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700"
              title="Export roster to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === "am" ? "CSV አውርድ" : "Export CSV"}</span>
            </button>
          )}

          <button
            onClick={() =>
              activeSubTab === "students"
                ? setIsRegisterStudentModalOpen(true)
                : setIsRegisterStaffModalOpen(true)
            }
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>
              {activeSubTab === "students"
                ? language === "am"
                  ? "አዲስ ተማሪ መዝግብ"
                  : "Register Student"
                : language === "am"
                ? "አዲስ መምህር መዝግብ"
                : "Add Faculty Member"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Roster Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {activeSubTab === "students" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">{language === "am" ? "ተማሪ / መለያ" : "Student / ID"}</th>
                  <th className="p-4">{language === "am" ? "ክፍል እና ሴክሽን" : "Class & Section"}</th>
                  <th className="p-4">{language === "am" ? "የወላጅ ስልክ" : "Parent Phone"}</th>
                  <th className="p-4">{language === "am" ? "መገኘት" : "Attendance"}</th>
                  <th className="p-4">{language === "am" ? "የክፍያ ሁኔታ" : "Fee Status"}</th>
                  <th className="p-4">{language === "am" ? "ውጤት (GPA)" : "GPA"}</th>
                  <th className="p-4 text-right">{language === "am" ? "ተግባራት" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      {language === "am" ? "ምንም የተማሪ መዝገብ አልተገኘም" : "No student records match criteria"}
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((std) => (
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
                      <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                        {std.grade} ({std.section})
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 font-mono">
                        {std.parentPhone}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${std.attendanceRate}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {std.attendanceRate}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            std.feeStatus === "Paid"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : std.feeStatus === "Partial"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          {std.feeStatus}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {std.gpa}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handlePromoteStudent(std.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-slate-200 dark:border-slate-700"
                            title="Promote to next grade"
                          >
                            {language === "am" ? "አሻግር" : "Promote"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">{language === "am" ? "መምህር / ሰራተኛ" : "Faculty Member"}</th>
                  <th className="p-4">{language === "am" ? "ክፍል / ዲፓርትመንት" : "Department"}</th>
                  <th className="p-4">{language === "am" ? "የተመደቡ ክፍሎች" : "Assigned Classes"}</th>
                  <th className="p-4">{language === "am" ? "የትምህርት ደረጃ" : "Qualification"}</th>
                  <th className="p-4">{language === "am" ? "ኢሜይል" : "Email & Phone"}</th>
                  <th className="p-4 text-right">{language === "am" ? "ሁኔታ" : "Status"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStaff.map((stf) => (
                  <tr
                    key={stf.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={stf.avatar}
                          alt={stf.fullName}
                          className="w-9 h-9 rounded-full object-cover border border-blue-500/30"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {language === "am" ? stf.fullNameAm : stf.fullName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">{stf.staffId} • {stf.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                      {stf.department}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {stf.assignedClasses.map((cls, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium"
                          >
                            {cls}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {stf.qualification}
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      <div>{stf.email}</div>
                      <div>{stf.phone}</div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                        {stf.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Register Student */}
      {isRegisterStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {language === "am" ? "አዲስ ተማሪ መመዝገቢያ" : "Register New Student"}
              </h3>
              <button
                onClick={() => setIsRegisterStudentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dawit Tadesse"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ሙሉ ስም (አማርኛ)
                  </label>
                  <input
                    type="text"
                    placeholder="ምሳሌ፡ ዳዊት ታደሰ"
                    value={newStudentNameAm}
                    onChange={(e) => setNewStudentNameAm(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Grade
                  </label>
                  <select
                    value={newStudentGrade}
                    onChange={(e) => setNewStudentGrade(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  >
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Section
                  </label>
                  <select
                    value={newStudentSection}
                    onChange={(e) => setNewStudentSection(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="Natural Science">Natural Science</option>
                    <option value="Social Science">Social Science</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={newStudentGender}
                    onChange={(e) => setNewStudentGender(e.target.value as "Male" | "Female")}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Parent / Guardian Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Almaz Tefera"
                    value={newStudentParent}
                    onChange={(e) => setNewStudentParent(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Emergency Phone (+251)
                  </label>
                  <input
                    type="text"
                    placeholder="+251 911 234 567"
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRegisterStudentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                >
                  {language === "am" ? "ተማሪውን መዝግብ" : "Save & Enroll"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Register Staff */}
      {isRegisterStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {language === "am" ? "አዲስ መምህር / ሰራተኛ መመዝገቢያ" : "Register Faculty Member"}
              </h3>
              <button
                onClick={() => setIsRegisterStaffModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kenenisa Tulu"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={newStaffDept}
                    onChange={(e) => setNewStaffDept(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  >
                    <option value="Natural Sciences">Natural Sciences</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Languages & Humanities">Languages & Humanities</option>
                    <option value="Social Sciences">Social Sciences</option>
                    <option value="Information Technology">Information Technology</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    placeholder="name@nurschool.edu.et"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+251 911 000 000"
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRegisterStaffModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                >
                  {language === "am" ? "ሰራተኛውን መዝግብ" : "Register Faculty"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
