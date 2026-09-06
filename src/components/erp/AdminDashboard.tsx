import React from "react";
import { useApp } from "../../context/AppContext";
import {
  Users,
  GraduationCap,
  TrendingUp,
  Clock,
  ArrowUpRight,
  UserPlus,
  CreditCard,
  Megaphone,
  Bus,
  CheckCircle2,
  Calendar,
  AlertTriangle,
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const { students, staffList, fees, busRoutes, setActiveTab, setActiveReceipt, language, t } = useApp();

  const totalStudentsCount = 1420; // Enterprise active enrollment
  const facultyCount = staffList.length;

  const totalFeeExpected = fees.reduce((acc, curr) => acc + curr.amount, 0);
  const totalFeeCollected = fees.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const collectionPercentage = Math.round((totalFeeCollected / (totalFeeExpected || 1)) * 100);

  const avgAttendance = 96.4;

  return (
    <div id="admin-dashboard-container" className="space-y-6">
      {/* Top Banner / Executive Greeting */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              {language === "am"
                ? "የትምህርት ዘመን 2019 ዓ.ም • 1ኛ ወሰነ-ትምህርት"
                : "Academic Term 2019 E.C. (2026/2027) • Q1 Active"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {language === "am"
              ? "የኑር ትምህርት ቤት አስተዳደር ዳሽቦርድ"
              : "NUR School Executive ERP Overview"}
          </h1>
          <p className="text-sm text-emerald-100 mt-2 leading-relaxed">
            {language === "am"
              ? "የትምህርት ጥራት፣ የተማሪዎች እና መምህራን እንቅስቃሴ፣ የክፍያ አሰባሰብ እና የትራንስፖርት ሁኔታዎችን በአንድ ቦታ ይቆጣጠሩ።"
              : "Real-time institutional oversight across student rosters, faculty workflows, fee processing, and autonomous bus telematics."}
          </p>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Students */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.dashboard.totalStudents}
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {totalStudentsCount.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +8.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {language === "am" ? "ከመዋዕለ-ህጻናት እስከ 12ኛ ክፍል" : "KG to Grade 12 enrolled"}
          </p>
        </div>

        {/* Card 2: Faculty */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.dashboard.activeFaculty}
            </span>
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              86
            </span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              {language === "am" ? "ሙሉ ሰዓት" : "100% Certified"}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {language === "am" ? "1:16 የመምህርና ተማሪ ጥምርታ" : "1:16 Teacher-to-student ratio"}
          </p>
        </div>

        {/* Card 3: Fee Progress */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.dashboard.feeCollectionRate}
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {collectionPercentage}%
            </span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {totalFeeCollected.toLocaleString()} ETB
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${collectionPercentage}%` }}
            />
          </div>
        </div>

        {/* Card 4: Attendance */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.dashboard.liveAttendance}
            </span>
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {avgAttendance}%
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {language === "am" ? "ከፍተኛ" : "Optimal"}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {language === "am" ? "ራስ-ሰር SMS ለቀሪ ወላጆች ተልኳል" : "Automated SMS dispatched for absentees"}
          </p>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
          {t.dashboard.quickActions}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab("students-staff")}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {t.dashboard.registerStudent}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {language === "am" ? "አዲስ መዝገብ ፍጠር" : "Enroll new scholar"}
            </p>
          </button>

          <button
            onClick={() => setActiveTab("finance")}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {t.dashboard.collectFees}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {language === "am" ? "ቴሌብር / ሲቢኢ" : "Telebirr & CBE Birr"}
            </p>
          </button>

          <button
            onClick={() => setActiveTab("announcements")}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Megaphone className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {t.dashboard.broadcastNotice}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {language === "am" ? "ለተማሪዎችና ወላጆች" : "Publish to bulletin"}
            </p>
          </button>

          <button
            onClick={() => setActiveTab("transport")}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Bus className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {t.dashboard.busTrackingStatus}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {language === "am" ? "ቀጥታ ጂፒኤስ ካርታ" : "Live GPS telemetry"}
            </p>
          </button>
        </div>
      </div>

      {/* Two-Column Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Fee Transactions */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                {language === "am" ? "የቅርብ ጊዜ የክፍያ እንቅስቃሴዎች" : "Recent Tuition & Fee Transactions"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === "am" ? "በቴሌብር፣ ሲቢኢ እና ቻፓ የተከናወኑ" : "Processed via Telebirr, CBE Birr & Chapa"}
              </p>
            </div>
            <button
              onClick={() => setActiveTab("finance")}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>{language === "am" ? "ሁሉንም ተመልከት" : "View All"}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {fees.slice(0, 4).map((fee) => (
              <div
                key={fee.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      fee.status === "Paid"
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                        : fee.status === "Partial"
                        ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                        : "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                    }`}
                  >
                    {fee.paymentMethod ? fee.paymentMethod.substring(0, 3).toUpperCase() : "INV"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {fee.studentName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {fee.feeType} • {fee.grade}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-mono font-black text-slate-900 dark:text-white">
                    {fee.paidAmount.toLocaleString()} / {fee.amount.toLocaleString()} ETB
                  </p>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        fee.status === "Paid"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : fee.status === "Partial"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      {fee.status}
                    </span>
                    {fee.paidAmount > 0 && (
                      <button
                        onClick={() => setActiveReceipt(fee)}
                        className="text-[10px] font-semibold text-emerald-600 hover:underline"
                      >
                        {language === "am" ? "ደረሰኝ" : "Receipt"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Transport Fleet Summary */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                {t.transport.title}
              </h3>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-3">
              {busRoutes.slice(0, 3).map((bus) => (
                <div
                  key={bus.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {bus.routeNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-semibold">
                      {bus.currentLocation.status}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">
                    {language === "am" ? bus.routeNameAm : bus.routeName}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span>Next: {bus.currentLocation.nextStop}</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {bus.currentLocation.speed} km/h
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab("transport")}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Bus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{language === "am" ? "የሙሉ መስመሮች ጂፒኤስ ካርታ" : "Open Full GPS Fleet Tracker"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
