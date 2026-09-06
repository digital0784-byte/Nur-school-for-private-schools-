import React from "react";
import { useApp } from "../../context/AppContext";
import { X, Printer, Download, CheckCircle2, ShieldCheck, QrCode } from "lucide-react";

export const ReceiptModal: React.FC = () => {
  const { activeReceipt, setActiveReceipt, language, t } = useApp();

  if (!activeReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Top actions bar */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
              {language === "am" ? "ይፋዊ የክፍያ ደረሰኝ" : "Official Payment Receipt"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-600 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.common.print}</span>
            </button>
            <button
              onClick={() => setActiveReceipt(null)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div id="printable-receipt-area" className="p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-200">
          {/* Header & School Identity */}
          <div className="text-center border-b border-dashed border-slate-300 dark:border-slate-700 pb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-xl mb-2 shadow-md shadow-emerald-600/20">
              NUR
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {language === "am" ? "ኑር ትምህርት ቤት" : "NUR SCHOOL ADDIS ABABA"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ministry of Education Accredited • Bole Sub-City, Addis Ababa, Ethiopia
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              Tel: +251 11 662 0041 • finance@nurschool.edu.et
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                {language === "am" ? "የደረሰኝ ቁጥር" : "Receipt Number"}
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                {activeReceipt.receiptNumber || "REC-2026-NUR091"}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                {language === "am" ? "የተከፈለበት ቀን" : "Payment Date"}
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {activeReceipt.paidDate || new Date().toISOString().split("T")[0]}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                {language === "am" ? "የተማሪ ስም" : "Student Name"}
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {activeReceipt.studentName}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                {language === "am" ? "ክፍል / ደረጃ" : "Grade & Class"}
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {activeReceipt.grade}
              </span>
            </div>
          </div>

          {/* Payment gateway badge */}
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  {language === "am" ? "የክፍያ ዘዴ" : "Payment Channel"}
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                  {activeReceipt.paymentMethod || "Telebirr Mobile Pay"}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wide">
              {activeReceipt.status}
            </span>
          </div>

          {/* Table Breakdown */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">{language === "am" ? "የክፍያው ዓይነት" : "Description / Fee Item"}</th>
                  <th className="p-3 text-right">{language === "am" ? "የተከፈለ" : "Amount (ETB)"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                <tr>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">
                    {activeReceipt.feeType} Tuition / Academic Term
                  </td>
                  <td className="p-3 text-right font-mono font-bold">
                    {activeReceipt.paidAmount.toLocaleString()} ETB
                  </td>
                </tr>
                {activeReceipt.amount > activeReceipt.paidAmount && (
                  <tr className="text-amber-600 dark:text-amber-400 text-[11px]">
                    <td className="p-3">{language === "am" ? "ቀሪ ያልተከፈለ" : "Remaining Balance"}</td>
                    <td className="p-3 text-right font-mono">
                      {(activeReceipt.amount - activeReceipt.paidAmount).toLocaleString()} ETB
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-slate-50 dark:bg-slate-800 font-bold border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                <tr>
                  <td className="p-3 text-sm">{language === "am" ? "ጠቅላላ የተከፈለ" : "Total Amount Paid"}</td>
                  <td className="p-3 text-right text-base text-emerald-600 dark:text-emerald-400 font-mono">
                    {activeReceipt.paidAmount.toLocaleString()} ETB
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Verification Barcode & School Seal */}
          <div className="flex items-center justify-between pt-4 border-t border-dashed border-slate-300 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
                <QrCode className="w-9 h-9 text-slate-800 dark:text-slate-200" />
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                <p className="font-semibold text-slate-600 dark:text-slate-300">Digital QR Verification</p>
                <p>Hash: {activeReceipt.invoiceNumber}</p>
                <p>NUR-VERIFIED-SYSTEM</p>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-block border-2 border-dashed border-emerald-600/40 rounded-xl px-3 py-1 rotate-[-4deg]">
                <span className="text-[10px] font-black tracking-wider text-emerald-700 dark:text-emerald-400 uppercase">
                  ✓ VERIFIED PAID
                </span>
                <span className="block text-[8px] text-slate-400">FINANCE OFFICE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
