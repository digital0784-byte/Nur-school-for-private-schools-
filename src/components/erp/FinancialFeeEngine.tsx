import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  CreditCard,
  Smartphone,
  Building2,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
  DollarSign,
  Printer,
  ShieldCheck,
  X,
} from "lucide-react";
import { FeeItem } from "../../types";

export const FinancialFeeEngine: React.FC = () => {
  const { fees, payFee, setActiveReceipt, language, t, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");

  // Payment Modal State
  const [selectedFeeForPayment, setSelectedFeeForPayment] = useState<FeeItem | null>(null);
  const [paymentGateway, setPaymentGateway] = useState<"Telebirr" | "CBE Birr" | "Chapa">("Telebirr");
  const [payerPhone, setPayerPhone] = useState("+251 911 234 567");
  const [payAmountInput, setPayAmountInput] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalExpected = fees.reduce((acc, curr) => acc + curr.amount, 0);
  const totalCollected = fees.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalOutstanding = totalExpected - totalCollected;

  const filteredFees = fees.filter((f) => {
    const matchesSearch =
      f.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.grade.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All" || f.status === filterStatus;
    const matchesType = filterType === "All" || f.feeType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleOpenPayment = (fee: FeeItem) => {
    setSelectedFeeForPayment(fee);
    setPayAmountInput(fee.amount - fee.paidAmount);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeeForPayment) return;
    if (payAmountInput <= 0) {
      showToast(language === "am" ? "እባክዎ ትክክለኛ የክፍያ መጠን ያስገቡ" : "Please enter a valid amount", "error");
      return;
    }

    setIsProcessing(true);

    // Simulate instant mobile/gateway network transaction
    setTimeout(() => {
      const updatedFee = payFee(selectedFeeForPayment.id, paymentGateway, payAmountInput);
      setIsProcessing(false);
      setSelectedFeeForPayment(null);
      if (updatedFee) {
        setActiveReceipt(updatedFee);
      }
    }, 1200);
  };

  return (
    <div id="financial-fee-engine" className="space-y-6">
      {/* Title & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.finance.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === "am"
              ? "የቴሌብር፣ ሲቢኢ ብር እና ቻፓ ክፍያዎችን በራስ-ሰር ደረሰኝ ያመቻቹ"
              : "Integrated Ethiopian gateways (Telebirr, CBE Birr, Chapa) with automated digital receipts"}
          </p>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <span>{t.finance.totalRevenue}</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {totalExpected.toLocaleString()} ETB
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {language === "am" ? "የሙሉ ሴሚስተር እቅድ" : "Total term invoices billed"}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <span>{t.finance.collectedAmount}</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {totalCollected.toLocaleString()} ETB
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {Math.round((totalCollected / (totalExpected || 1)) * 100)}% {language === "am" ? "የተሰበሰበ" : "Collected to date"}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <span>{t.finance.outstandingAmount}</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {totalOutstanding.toLocaleString()} ETB
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {language === "am" ? "ያልተከፈለ ቀሪ ሂሳብ" : "Pending collection balance"}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === "am" ? "በተማሪ ስም ወይም ደረሰኝ ፈልግ..." : "Search by student name or invoice..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
          >
            <option value="All">{language === "am" ? "ሁሉም ሁኔታዎች" : "All Statuses"}</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Pending">Pending</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
          >
            <option value="All">{language === "am" ? "ሁሉም ዓይነቶች" : "All Fee Types"}</option>
            <option value="Tuition">Tuition</option>
            <option value="Transport">Transport</option>
            <option value="Lab & STEM">Lab & STEM</option>
            <option value="Uniform">Uniform</option>
          </select>
        </div>
      </div>

      {/* Fees List Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">{language === "am" ? "የክፍያ መጠየቂያ #" : "Invoice #"}</th>
                <th className="p-4">{language === "am" ? "ተማሪ / ክፍል" : "Student / Grade"}</th>
                <th className="p-4">{language === "am" ? "የክፍያ ዓይነት" : "Fee Type"}</th>
                <th className="p-4">{language === "am" ? "የሚፈለግ / የተከፈለ" : "Amount / Paid"}</th>
                <th className="p-4">{language === "am" ? "የመጨረሻ ቀን" : "Due Date"}</th>
                <th className="p-4">{language === "am" ? "ሁኔታ" : "Status"}</th>
                <th className="p-4 text-right">{language === "am" ? "ተግባር" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    {language === "am" ? "ምንም የክፍያ መዝገብ አልተገኘም" : "No fee invoices match filter"}
                  </td>
                </tr>
              ) : (
                filteredFees.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                      {item.invoiceNumber}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white">{item.studentName}</p>
                      <p className="text-[10px] text-slate-400">{item.grade}</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                      {item.feeType}
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                      <div>
                        {item.paidAmount.toLocaleString()} / {item.amount.toLocaleString()} ETB
                      </div>
                      {item.amount > item.paidAmount && (
                        <div className="text-[10px] text-amber-600 dark:text-amber-400">
                          Remain: {(item.amount - item.paidAmount).toLocaleString()} ETB
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{item.dueDate}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          item.status === "Paid"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : item.status === "Partial"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.status !== "Paid" && (
                          <button
                            onClick={() => handleOpenPayment(item)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm shadow-emerald-600/20"
                          >
                            {language === "am" ? "ክፈል" : "Pay Now"}
                          </button>
                        )}
                        {item.paidAmount > 0 && (
                          <button
                            onClick={() => setActiveReceipt(item)}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                            title="View / Print Receipt"
                          >
                            <Receipt className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Processing Modal */}
      {selectedFeeForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {language === "am" ? "የትምህርት ክፍያ መክፈያ" : "Process School Fee Payment"}
                </h3>
              </div>
              <button
                onClick={() => setSelectedFeeForPayment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Item summary */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs">
              <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                <span>{selectedFeeForPayment.studentName} ({selectedFeeForPayment.grade})</span>
                <span>{selectedFeeForPayment.feeType}</span>
              </div>
              <div className="flex justify-between text-slate-500 mt-1 font-mono">
                <span>Invoice: {selectedFeeForPayment.invoiceNumber}</span>
                <span>Due: {selectedFeeForPayment.dueDate}</span>
              </div>
            </div>

            {/* Ethiopian Payment Gateway Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {t.finance.selectGateway}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {/* Telebirr */}
                <button
                  type="button"
                  onClick={() => setPaymentGateway("Telebirr")}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    paymentGateway === "Telebirr"
                      ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Smartphone className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
                  <span className="block text-xs font-bold">Telebirr</span>
                  <span className="text-[10px] text-slate-400">Mobile Wallet</span>
                </button>

                {/* CBE Birr */}
                <button
                  type="button"
                  onClick={() => setPaymentGateway("CBE Birr")}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    paymentGateway === "CBE Birr"
                      ? "border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 ring-2 ring-purple-500/20"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Building2 className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                  <span className="block text-xs font-bold">CBE Birr</span>
                  <span className="text-[10px] text-slate-400">Commercial Bank</span>
                </button>

                {/* Chapa */}
                <button
                  type="button"
                  onClick={() => setPaymentGateway("Chapa")}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    paymentGateway === "Chapa"
                      ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                  <span className="block text-xs font-bold">Chapa</span>
                  <span className="text-[10px] text-slate-400">Cards & Online</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {paymentGateway === "Telebirr" || paymentGateway === "CBE Birr"
                    ? language === "am"
                      ? "የተመዘገበ የሞባይል ስልክ ቁጥር (+251)"
                      : "Payer Mobile Number (+251)"
                    : "Cardholder Mobile / Email"}
                </label>
                <input
                  type="text"
                  required
                  value={payerPhone}
                  onChange={(e) => setPayerPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "am" ? "የሚከፈለው መጠን (ብር / ETB)" : "Amount to Pay (ETB)"}
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  max={selectedFeeForPayment.amount - selectedFeeForPayment.paidAmount}
                  value={payAmountInput}
                  onChange={(e) => setPayAmountInput(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-slate-100"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Remaining balance: {(selectedFeeForPayment.amount - selectedFeeForPayment.paidAmount).toLocaleString()} ETB
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 text-[11px] text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                {paymentGateway === "Telebirr"
                  ? t.finance.telebirrNote
                  : paymentGateway === "CBE Birr"
                  ? t.finance.cbeBirrNote
                  : t.finance.chapaNote}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setSelectedFeeForPayment(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>{language === "am" ? "በማስኬድ ላይ..." : "Processing Transaction..."}</span>
                  ) : (
                    <>
                      <span>
                        {language === "am" ? "ክፍያውን አጽድቅ" : `Authorize ${payAmountInput.toLocaleString()} ETB`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
