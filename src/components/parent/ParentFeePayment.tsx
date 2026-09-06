import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  CreditCard,
  Smartphone,
  Building2,
  Receipt,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Download,
  Printer,
  X,
} from "lucide-react";
import { FeeItem } from "../../types";

export const ParentFeePayment: React.FC = () => {
  const { fees, payFee, setActiveReceipt, language, t, showToast } = useApp();

  const [paymentGateway, setPaymentGateway] = useState<"Telebirr" | "CBE Birr" | "Chapa">("Telebirr");
  const [selectedFee, setSelectedFee] = useState<FeeItem | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("+251 911 234 567");
  const [isProcessing, setIsProcessing] = useState(false);

  // Dawit's fees
  const parentInvoices = fees.filter((f) => f.studentName.includes("Dawit"));

  const handleOpenPay = (fee: FeeItem) => {
    setSelectedFee(fee);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFee) return;

    setIsProcessing(true);
    setTimeout(() => {
      const amountToPay = selectedFee.amount - selectedFee.paidAmount;
      const updated = payFee(selectedFee.id, paymentGateway, amountToPay);
      setIsProcessing(false);
      setSelectedFee(null);
      if (updated) {
        setActiveReceipt(updated);
      }
    }, 1200);
  };

  return (
    <div id="parent-fee-payment" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.parent.feePaymentTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === "am"
              ? "የልጆችዎን የትምህርት፣ የትራንስፖርት እና የላብራቶሪ ክፍያዎች በቴሌብር ወይም በሲቢኢ ይክፈሉ"
              : "Settle tuition, laboratory, and bus transit invoices securely via Telebirr, CBE Birr & Chapa"}
          </p>
        </div>
      </div>

      {/* Invoice Cards */}
      <div className="space-y-4">
        {parentInvoices.map((inv) => (
          <div
            key={inv.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-400 font-bold">{inv.invoiceNumber}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    inv.status === "Paid"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : inv.status === "Partial"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                  }`}
                >
                  {inv.status}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {inv.feeType} Tuition & Operational Fee
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Student: <strong className="text-slate-700 dark:text-slate-200">{inv.studentName}</strong> • Due: {inv.dueDate}
              </p>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-center">
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Bill</span>
                <span className="text-base font-black font-mono text-slate-900 dark:text-white">
                  {inv.paidAmount.toLocaleString()} / {inv.amount.toLocaleString()} ETB
                </span>
              </div>

              <div className="flex items-center gap-2">
                {inv.status !== "Paid" && (
                  <button
                    onClick={() => handleOpenPay(inv)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-colors"
                  >
                    {language === "am" ? "በቴሌብር ክፈል" : "Pay Remaining"}
                  </button>
                )}

                {inv.paidAmount > 0 && (
                  <button
                    onClick={() => setActiveReceipt(inv)}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <Receipt className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{language === "am" ? "ይፋዊ ደረሰኝ" : "Official Receipt"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {selectedFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {language === "am" ? "የክፍያ ማረጋገጫ" : "Settle Tuition via Ethiopian Gateway"}
              </h3>
              <button
                onClick={() => setSelectedFee(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{selectedFee.feeType}</p>
                <p className="text-slate-400">{selectedFee.studentName} ({selectedFee.grade})</p>
              </div>
              <span className="font-mono font-black text-emerald-600 text-sm">
                {(selectedFee.amount - selectedFee.paidAmount).toLocaleString()} ETB
              </span>
            </div>

            {/* Gateway choices */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentGateway("Telebirr")}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentGateway === "Telebirr"
                    ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <Smartphone className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
                <span className="block text-xs font-bold">Telebirr</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentGateway("CBE Birr")}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentGateway === "CBE Birr"
                    ? "border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <Building2 className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                <span className="block text-xs font-bold">CBE Birr</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentGateway("Chapa")}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentGateway === "Chapa"
                    ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                <span className="block text-xs font-bold">Chapa</span>
              </button>
            </div>

            <form onSubmit={handlePay} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Registered Mobile Number (+251)
                </label>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedFee(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-50"
                >
                  {isProcessing ? "Authorizing via Gateway..." : "Confirm Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
