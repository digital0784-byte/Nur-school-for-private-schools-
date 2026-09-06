import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Calendar, Clock, Plus, Filter, BookOpen, MapPin, User, X } from "lucide-react";
import { initialTimetable } from "../../data/mockData";
import { TimetableSlot } from "../../types";

export const TimetableScheduler: React.FC = () => {
  const { language, t, showToast } = useApp();

  const [timetable, setTimetable] = useState<TimetableSlot[]>(initialTimetable);
  const [selectedGrade, setSelectedGrade] = useState("Grade 10");
  const [selectedSection, setSelectedSection] = useState("A");

  // Modal
  const [isAddSlotModalOpen, setIsAddSlotModalOpen] = useState(false);
  const [slotDay, setSlotDay] = useState<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday">("Monday");
  const [slotPeriod, setSlotPeriod] = useState(1);
  const [slotSubject, setSlotSubject] = useState("Physics");
  const [slotSubjectAm, setSlotSubjectAm] = useState("ፊዚክስ");
  const [slotTeacher, setSlotTeacher] = useState("Dawit Bekele");
  const [slotRoom, setSlotRoom] = useState("Room 102");
  const [slotTime, setSlotTime] = useState("08:15 - 09:00");

  const days: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday")[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const daysAm: Record<string, string> = {
    Monday: "ሰኞ (Monday)",
    Tuesday: "ማክሰኞ (Tuesday)",
    Wednesday: "ረቡዕ (Wednesday)",
    Thursday: "ሐሙስ (Thursday)",
    Friday: "አርብ (Friday)",
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: TimetableSlot = {
      id: "tt-" + Date.now(),
      day: slotDay,
      period: slotPeriod,
      time: slotTime,
      grade: selectedGrade,
      section: selectedSection,
      subject: slotSubject,
      subjectAm: slotSubjectAm || slotSubject,
      teacherName: slotTeacher,
      room: slotRoom,
      color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    };

    setTimetable((prev) => [...prev, newSlot]);
    setIsAddSlotModalOpen(false);
    showToast(
      language === "am"
        ? `${slotSubject} ለ${slotDay} በሰሌዳው ላይ ተመዝግቧል`
        : `Class scheduled for ${slotDay} period ${slotPeriod}`,
      "success"
    );
  };

  return (
    <div id="timetable-scheduler" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.nav.timetable}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === "am"
              ? "ሳምንታዊ የትምህርት ሰሌዳ፣ የላብራቶሪ ምደባ እና የመምህራን ክፍለ-ጊዜ"
              : "Master weekly academic schedule, period timings, and classroom allocations"}
          </p>
        </div>

        {/* Grade & Section Filter + Add Slot Button */}
        <div className="flex items-center gap-2">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold border border-slate-200 dark:border-slate-700"
          >
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 12">Grade 12</option>
          </select>

          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold border border-slate-200 dark:border-slate-700"
          >
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>

          <button
            onClick={() => setIsAddSlotModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>{language === "am" ? "ክፍለ-ጊዜ ጨምር" : "Add Period"}</span>
          </button>
        </div>
      </div>

      {/* Interactive Weekly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {days.map((day) => {
          const slotsForDay = timetable
            .filter((s) => s.day === day && s.grade === selectedGrade && s.section === selectedSection)
            .sort((a, b) => a.period - b.period);

          return (
            <div
              key={day}
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col"
            >
              {/* Day Header */}
              <div className="pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    {language === "am" ? daysAm[day] : day}
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    {slotsForDay.length} {language === "am" ? "ክፍለ-ጊዜያት" : "Periods"}
                  </span>
                </div>
                <Calendar className="w-4 h-4 text-slate-400" />
              </div>

              {/* Day Slots */}
              <div className="space-y-3 flex-1">
                {slotsForDay.length === 0 ? (
                  <div className="py-8 text-center text-[11px] text-slate-400">
                    {language === "am" ? "ክፍለ-ጊዜ አልተመደበም" : "No scheduled periods"}
                  </div>
                ) : (
                  slotsForDay.map((slot) => (
                    <div
                      key={slot.id}
                      className={`p-3 rounded-2xl border transition-transform hover:-translate-y-0.5 ${slot.color}`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold opacity-80 mb-1">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {slot.time}
                        </span>
                        <span>P{slot.period}</span>
                      </div>

                      <h4 className="font-extrabold text-xs">
                        {language === "am" ? slot.subjectAm : slot.subject}
                      </h4>

                      <div className="mt-2 text-[10px] space-y-0.5 opacity-90">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{slot.teacherName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{slot.room}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Slot Modal */}
      {isAddSlotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {language === "am" ? "አዲስ ክፍለ-ጊዜ መመደቢያ" : "Schedule New Timetable Slot"}
              </h3>
              <button
                onClick={() => setIsAddSlotModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSlot} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Day</label>
                  <select
                    value={slotDay}
                    onChange={(e) => setSlotDay(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Period</label>
                  <select
                    value={slotPeriod}
                    onChange={(e) => setSlotPeriod(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                      <option key={p} value={p}>
                        Period {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={slotSubject}
                  onChange={(e) => setSlotSubject(e.target.value)}
                  placeholder="e.g. Physics, Mathematics, ICT"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Teacher</label>
                  <input
                    type="text"
                    required
                    value={slotTeacher}
                    onChange={(e) => setSlotTeacher(e.target.value)}
                    placeholder="Instructor name"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Room / Lab</label>
                  <input
                    type="text"
                    required
                    value={slotRoom}
                    onChange={(e) => setSlotRoom(e.target.value)}
                    placeholder="e.g. Lab 3, Room 102"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddSlotModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                >
                  {language === "am" ? "ሰሌዳውን አሻሽል" : "Save Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
