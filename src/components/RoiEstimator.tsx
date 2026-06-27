import { useState } from "react";
import { DollarSign, Clock, ShieldCheck, TrendingUp, Sparkles, Plus, Check } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface RoiEstimatorProps {
  onPreFillForm: (budget: string, notes: string, roi: number) => void;
}

export default function RoiEstimator({ onPreFillForm }: RoiEstimatorProps) {
  const { t } = useLanguage();
  const [leads, setLeads] = useState(500);
  const [dealValue, setDealValue] = useState(1500);
  const [conversionRate, setConversionRate] = useState(3); // 3%
  const [hoursPerLead, setHoursPerLead] = useState(1.5);
  const [hasApplied, setHasApplied] = useState(false);

  // Constants
  const HOURLY_LABOR_RATE = 30; // $30/hr loaded rate
  const AUTOMATION_EFFICIENCY = 0.75; // AI handles 75% of support/qualification hours
  const REVENUE_CONVERSION_BOOST = 0.018; // +1.8% absolute conversion increase from 24/7 sub-minute response

  // Calculated benefits
  const monthlyHoursSaved = Math.round(leads * hoursPerLead * AUTOMATION_EFFICIENCY);
  const annualTimeSavingsValue = Math.round(monthlyHoursSaved * HOURLY_LABOR_RATE * 12);

  const currentMonthlyConversions = (leads * conversionRate) / 100;
  const currentMonthlyRevenue = currentMonthlyConversions * dealValue;

  const newMonthlyConversions = (leads * (conversionRate + (REVENUE_CONVERSION_BOOST * 100))) / 100;
  const newMonthlyRevenue = newMonthlyConversions * dealValue;

  const monthlyExtraRevenue = Math.max(0, newMonthlyRevenue - currentMonthlyRevenue);
  const annualExtraRevenue = Math.round(monthlyExtraRevenue * 12);

  const totalAnnualValue = annualTimeSavingsValue + annualExtraRevenue;

  // Investment (simulated monthly agency fee + setup)
  const estimatedMonthlyFee = Math.max(799, Math.round(leads * 1.6 + 400));
  const estimatedSetupFee = Math.max(1499, Math.round(dealValue * 0.8 + 900));
  const totalAnnualCost = (estimatedMonthlyFee * 12) + estimatedSetupFee;

  const netAnnualBenefit = Math.max(0, totalAnnualValue - totalAnnualCost);
  const roiMultiplier = totalAnnualCost > 0 ? (totalAnnualValue / totalAnnualCost).toFixed(1) : "0.0";

  const handleApplyToForm = () => {
    const budgetRange = estimatedMonthlyFee < 1000 
      ? "$500 - $1,000/mo" 
      : estimatedMonthlyFee < 2500 
      ? "$1,000 - $2,500/mo" 
      : "$2,500+/mo";
    
    const notesMessage = `Calculated with ROI Estimator. Leads/mo: ${leads}, Deal Value: $${dealValue}, Current Conv: ${conversionRate}%. Target: Saving ${monthlyHoursSaved}h/mo and unlocking ~$${annualExtraRevenue.toLocaleString()}/yr revenue.`;
    
    onPreFillForm(budgetRange, notesMessage, totalAnnualValue);
    setHasApplied(true);
    setTimeout(() => setHasApplied(false), 3000);

    // Scroll to form smoothly
    document.getElementById("hire")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="roi" className="bg-zinc-50 dark:bg-zinc-950 py-24 border-b border-zinc-200 dark:border-zinc-900 relative transition-colors duration-200">
      <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 font-mono">
            {t("roiSectionTitle")}
          </h2>
          <p className="mt-4 font-sans text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
            {t("roiSectionSubtitle")}
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            {t("roiSectionDesc")}
          </p>
        </div>

        {/* Dashboard Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sliders Input Panel */}
          <div className="lg:col-span-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/10 p-6 sm:p-8 backdrop-blur-sm space-y-6 shadow-sm">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              {t("roiAdjustParams")}
            </span>

            {/* Parameter 1: Leads */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{t("roiIncomingLeads")}</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-0.5 rounded-md font-bold">
                  {leads.toLocaleString()} /mo
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={leads}
                onChange={(e) => setLeads(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 dark:accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 dark:text-zinc-600 font-mono">
                <span>50 leads</span>
                <span>5,000 leads</span>
              </div>
            </div>

            {/* Parameter 2: Ticket Price */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{t("roiDealValue")}</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-0.5 rounded-md font-bold">
                  ${dealValue.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="20000"
                step="100"
                value={dealValue}
                onChange={(e) => setDealValue(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 dark:accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 dark:text-zinc-600 font-mono">
                <span>$100</span>
                <span>$20,000</span>
              </div>
            </div>

            {/* Parameter 3: Conversion Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{t("roiConvRate")}</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-0.5 rounded-md font-bold">
                  {conversionRate}%
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="0.5"
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 dark:accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 dark:text-zinc-600 font-mono">
                <span>1%</span>
                <span>25%</span>
              </div>
            </div>

            {/* Parameter 4: Hours Spent */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{t("roiHoursPerLead")}</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-0.5 rounded-md font-bold">
                  {hoursPerLead} hrs
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={hoursPerLead}
                onChange={(e) => setHoursPerLead(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 dark:accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 dark:text-zinc-600 font-mono">
                <span>0.5 hrs</span>
                <span>5.0 hrs</span>
              </div>
            </div>

            {/* Automation Assumption Footnote */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/80 text-[11px] text-zinc-500 leading-relaxed space-y-1">
              <p>{t("roiFootnote1")}</p>
              <p>{t("roiFootnote2")}</p>
            </div>
          </div>

          {/* Results Display Panel */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Primary KPI Box */}
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-white dark:from-zinc-900/60 to-emerald-50 dark:to-emerald-950/20 p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-2">
                  {t("roiProjectedValue")}
                </span>
                <span className="text-4xl sm:text-5xl font-extrabold text-zinc-950 dark:text-white tracking-tight font-sans">
                  ${totalAnnualValue.toLocaleString()}
                </span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400 block mt-2.5 leading-relaxed">
                  {t("roiCombiningText")}{" "}
                  <span className="text-emerald-600 dark:text-emerald-300 font-semibold">${annualTimeSavingsValue.toLocaleString()}</span>{" "}
                  {t("roiInRecovered")}{" "}
                  <span className="text-emerald-600 dark:text-emerald-300 font-semibold">${annualExtraRevenue.toLocaleString()}</span>{" "}
                  {t("roiInAutomated")}
                </span>
              </div>

              {/* Sub Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800/80">
                <div>
                  <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs">
                    <Clock className="h-4 w-4 text-emerald-500/80" />
                    <span>{t("roiMonthlyHours")}</span>
                  </div>
                  <span className="text-lg font-bold text-zinc-900 dark:text-white font-mono block mt-1">
                    {monthlyHoursSaved} hrs
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs">
                    <TrendingUp className="h-4 w-4 text-teal-400" />
                    <span>{t("roiExtraConversions")}</span>
                  </div>
                  <span className="text-lg font-bold text-zinc-900 dark:text-white font-mono block mt-1">
                    +{Math.round(leads * REVENUE_CONVERSION_BOOST * 12)} /yr
                  </span>
                </div>
              </div>
            </div>

            {/* Financial ROI and Setup Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 p-5 shadow-sm">
                <span className="text-[10px] font-mono text-zinc-500 block">{t("roiEstAgencyFee")}</span>
                <span className="text-xl font-bold text-zinc-900 dark:text-white block mt-1">
                  ${estimatedMonthlyFee.toLocaleString()} <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">/mo</span>
                </span>
                <span className="text-[10px] text-zinc-500 mt-1.5 block">
                  {t("roiEstAgencyFeeDesc")}
                </span>
              </div>

              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 p-5 shadow-sm">
                <span className="text-[10px] font-mono text-zinc-500 block">{t("roiEstMultiplier")}</span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 block mt-1">
                  {roiMultiplier}x ROI
                </span>
                <span className="text-[10px] text-zinc-500 mt-1.5 block">
                  {t("roiEstMultiplierDesc")}
                </span>
              </div>

            </div>

            {/* Action Trigger -> Apply details directly to lead form */}
            <button
              onClick={handleApplyToForm}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-sm transition-all shadow-md cursor-pointer border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/50"
            >
              {hasApplied ? (
                <>
                  <Check className="h-4 w-4 stroke-[2.5]" />
                  {t("roiPrefilledBtn")}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  {t("roiPrefillBtn")}
                </>
              )}
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}
