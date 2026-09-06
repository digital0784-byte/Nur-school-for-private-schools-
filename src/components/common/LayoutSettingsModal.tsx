import React from "react";
import { useApp } from "../../context/AppContext";
import {
  Layout,
  Columns,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Globe,
  Check,
  X,
  Sparkles,
  Sliders,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

interface LayoutSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LayoutSettingsModal: React.FC<LayoutSettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    layoutStyle,
    setLayoutStyle,
    contentWidth,
    setContentWidth,
    theme,
    toggleTheme,
    language,
    toggleLanguage,
    showToast,
  } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {language === "am" ? "የአፑ አቀማመጥ እና ገጽታ ማስተካከያ" : "Layout & Display Settings"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === "am"
                  ? "የማውጫውን አቀማመጥ፣ የስክሪኑን ስፋት እና ቀለሞችን እንደ ምርጫዎ ያስተካክሉ"
                  : "Customize navigation orientation, canvas width, and appearance"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* 1. Navigation Orientation / Layout Style */}
          <div className="space-y-3">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              {language === "am" ? "1. የማውጫ አቀማመጥ (Navigation Layout):" : "1. Navigation Layout Style:"}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Sidebar Style */}
              <button
                type="button"
                onClick={() => {
                  setLayoutStyle("sidebar");
                  showToast(
                    language === "am" ? "ወደ ሙሉ የጎን ማውጫ ተቀይሯል" : "Switched to Full Sidebar",
                    "info"
                  );
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                  layoutStyle === "sidebar"
                    ? "border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Columns className="w-5 h-5 text-emerald-600" />
                  {layoutStyle === "sidebar" && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                  {language === "am" ? "የግራ ጎን ማውጫ" : "Full Sidebar"}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                  {language === "am"
                    ? "የተመደቡ ሞጁሎች በግራ በኩል"
                    : "Structured categorized sidebar"}
                </p>
              </button>

              {/* Topbar Style */}
              <button
                type="button"
                onClick={() => {
                  setLayoutStyle("topbar");
                  showToast(
                    language === "am" ? "ወደ አግድም የበላይ ማውጫ ተቀይሯል" : "Switched to Horizontal Top Nav",
                    "info"
                  );
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                  layoutStyle === "topbar"
                    ? "border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Layout className="w-5 h-5 text-indigo-600" />
                  {layoutStyle === "topbar" && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                  {language === "am" ? "አግድም የበላይ ማውጫ" : "Top Navigation"}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                  {language === "am"
                    ? "ከላይ የተዘረጋ፣ ሰፊ ስክሪን የሚሰጥ"
                    : "Horizontal tabs with 100% width"}
                </p>
              </button>

              {/* Mini Compact Rail */}
              <button
                type="button"
                onClick={() => {
                  setLayoutStyle("mini");
                  showToast(
                    language === "am" ? "ወደ አጭር የጎን ማውጫ ተቀይሯል" : "Switched to Compact Mini-Rail",
                    "info"
                  );
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                  layoutStyle === "mini"
                    ? "border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <PanelLeftClose className="w-5 h-5 text-teal-600" />
                  {layoutStyle === "mini" && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                  {language === "am" ? "አጭር ማውጫ" : "Mini Rail"}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                  {language === "am"
                    ? "አዶዎች ብቻ (Icon-only)፣ ሰፊ የይዘት ቦታ"
                    : "Icon-only ultra compact"}
                </p>
              </button>
            </div>
          </div>

          {/* 2. Content Canvas Width */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              {language === "am" ? "2. የይዘት ስፋት (Canvas Width):" : "2. Content Canvas Width:"}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setContentWidth("contained")}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between ${
                  contentWidth === "contained"
                    ? "border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Minimize2 className="w-4 h-4 text-slate-500" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      {language === "am" ? "መደበኛ (Contained)" : "Contained"}
                    </h5>
                    <span className="text-[10px] text-slate-400">max-width: 1280px</span>
                  </div>
                </div>
                {contentWidth === "contained" && <Check className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                type="button"
                onClick={() => setContentWidth("full")}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between ${
                  contentWidth === "full"
                    ? "border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Maximize2 className="w-4 h-4 text-slate-500" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      {language === "am" ? "ሙሉ ስክሪን (Full Width)" : "Full Fluid"}
                    </h5>
                    <span className="text-[10px] text-slate-400">100% canvas width</span>
                  </div>
                </div>
                {contentWidth === "full" && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            </div>
          </div>

          {/* 3. Theme Mode & Language */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              {language === "am" ? "3. ገጽታ እና ቋንቋ (Theme & Language):" : "3. Theme & Language:"}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  {theme === "dark" ? (
                    <Moon className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500" />
                  )}
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {theme === "dark"
                      ? language === "am"
                        ? "ምሽት (Dark)"
                        : "Dark Mode"
                      : language === "am"
                      ? "ቀን (Light)"
                      : "Light Mode"}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  {language === "am" ? "ቀይር" : "Toggle"}
                </span>
              </button>

              <button
                type="button"
                onClick={toggleLanguage}
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {language === "am" ? "አማርኛ" : "English"}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  {language === "am" ? "ወደ English" : "ወደ አማርኛ"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {language === "am" ? "ምርጫዎችዎ ወዲያውኑ ተግባራዊ ይሆናሉ" : "Changes apply instantly"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-colors"
          >
            {language === "am" ? "አጠናቅቅ" : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
};
