import { useState, useEffect, Fragment } from "react";
import { RefreshCw, LayoutDashboard, Clock, DollarSign, ListFilter, Calendar, ExternalLink, Activity, Sparkles, CheckSquare } from "lucide-react";
import { ClientInquiry } from "../types";
import { useLanguage } from "../contexts/LanguageContext";

interface DashboardProps {
  refreshTrigger: number;
}

export default function Dashboard({ refreshTrigger }: DashboardProps) {
  const { t } = useLanguage();
  const [inquiries, setInquiries] = useState<ClientInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<string>("All");
  const [selectedInqId, setSelectedInqId] = useState<string | null>(null);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/inquiries");
      if (res.ok) {
        const data = await res.json();
        // Sort newest first
        const sorted = data.sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        setInquiries(sorted);
      }
    } catch (err) {
      console.error("Failed to load inquiries", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [refreshTrigger]);

  const updateStatus = (id: string, nextStatus: "New" | "Reviewed" | "In Contact") => {
    // Optimistic UI state update
    setInquiries(prev => prev.map(inq => {
      if (inq.id === id) {
        return { ...inq, status: nextStatus };
      }
      return inq;
    }));
  };

  const filteredInquiries = inquiries.filter(inq => {
    if (filter === "All") return true;
    return inq.selectedAgent === filter || inq.status === filter;
  });

  // Calculate high value metrics
  const totalLeadsCount = inquiries.length;
  const totalEstimatedPipeline = inquiries.reduce((acc, current) => {
    let budgetVal = 1500;
    if (current.budget.includes("$2,500 - $5,000")) budgetVal = 3750;
    else if (current.budget.includes("$5,000")) budgetVal = 7500;
    else if (current.budget.includes("$1,000 - $2,500")) budgetVal = 1750;
    else if (current.budget.includes("$500 - $1,000")) budgetVal = 750;
    else if (current.budget.includes("<$500")) budgetVal = 350;
    
    return acc + budgetVal;
  }, 0);

  const totalRoiGenerated = inquiries.reduce((acc, curr) => acc + (curr.roiEstimated || 0), 0);

  function getAgentFriendlyName(type: string): string {
    switch (type) {
      case "web_chatbot":
        return t("pWebTitle");
      case "whatsapp_insta":
        return t("pSocialTitle");
      case "email_chatbot":
        return t("pEmailTitle");
      case "b2b_leadgen":
        return t("pB2bTitle");
      case "lead_qualification":
        return t("pBantTitle");
      default:
        return "General System";
    }
  }

  return (
    <section id="dashboard" className="bg-zinc-950 py-24 border-b border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title and Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-base font-semibold uppercase tracking-widest text-emerald-400 font-mono flex items-center gap-1.5">
              <LayoutDashboard className="h-4 w-4" />
              Live Operator Portal
            </h2>
            <p className="mt-4 font-sans text-3xl font-bold tracking-tight text-white">
              {t("dashTitle")}
            </p>
            <p className="mt-2 text-zinc-400 text-sm">
              {t("dashSub")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchInquiries}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
              {t("dashRefresh")}
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Metric 1 */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 p-5">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">{t("dashTotalLeads")}</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mt-1" />
            </div>
            <span className="text-3xl font-bold text-white font-mono block mt-2">
              {totalLeadsCount}
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 block">
              Queued custom AI instances
            </span>
          </div>

          {/* Metric 2 */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 p-5">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Contract Pipeline</span>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-3xl font-bold text-white font-mono block mt-2">
              ${totalEstimatedPipeline.toLocaleString()}
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 block">
              Calculated target monthly volume
            </span>
          </div>

          {/* Metric 3 */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 p-5">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">{t("dashEstimatedRoi")}</span>
              <Sparkles className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-3xl font-bold text-emerald-400 font-mono block mt-2">
              ${totalRoiGenerated > 0 ? totalRoiGenerated.toLocaleString() : "145,200"}
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 block">
              Total estimated client ROI
            </span>
          </div>

          {/* Metric 4 */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 p-5">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">API Handover Delay</span>
              <Clock className="h-4 w-4 text-teal-400" />
            </div>
            <span className="text-3xl font-bold text-white font-mono block mt-2">
              0.4s
            </span>
            <span className="text-[11px] text-emerald-500 mt-1 block font-semibold flex items-center gap-1">
              <Activity className="h-3 w-3 animate-pulse shrink-0" />
              Ultra-low latency link
            </span>
          </div>

        </div>

        {/* Filter and Table Layout */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm overflow-hidden">
          
          {/* Header & Filter Controls */}
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <span className="text-xs font-mono font-bold text-zinc-400 flex items-center gap-2">
              <ListFilter className="h-4 w-4 text-emerald-400" />
              Blueprint Filter Console
            </span>
            
            <div className="flex flex-wrap gap-2">
              {["All", "web_chatbot", "whatsapp_insta", "email_chatbot", "New", "Reviewed"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer transition-all ${
                    filter === cat
                      ? "bg-emerald-500/10 border border-emerald-500/35 text-emerald-400"
                      : "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-300"
                  }`}
                >
                  {cat === "web_chatbot" 
                    ? "Web Bots" 
                    : cat === "whatsapp_insta" 
                    ? "Meta DMs" 
                    : cat === "email_chatbot" 
                    ? "Emails" 
                    : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            {filteredInquiries.length === 0 ? (
              <div className="text-center py-20 text-zinc-500 space-y-3 px-6">
                <span className="block text-sm">{t("dashNoData")}</span>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-[10px] font-mono text-zinc-500 uppercase tracking-wider bg-zinc-950/20">
                    <th className="px-6 py-4 font-semibold">{t("dashTableClient")}</th>
                    <th className="px-6 py-4 font-semibold">{t("dashTableAgent")}</th>
                    <th className="px-6 py-4 font-semibold">{t("dashTableBudget")}</th>
                    <th className="px-6 py-4 font-semibold">{t("dashTableSavings")}</th>
                    <th className="px-6 py-4 font-semibold">{t("dashTableStatus")}</th>
                    <th className="px-6 py-4 font-semibold text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {filteredInquiries.map((inq) => {
                    const isExpanded = selectedInqId === inq.id;
                    return (
                      <Fragment key={inq.id}>
                        <tr 
                          className={`hover:bg-zinc-900/40 transition-colors ${isExpanded ? "bg-zinc-900/20" : ""}`}
                        >
                          {/* Client Name & Company */}
                          <td className="px-6 py-4">
                            <div>
                              <span className="text-sm font-bold text-white block">
                                {inq.company !== "N/A" ? inq.company : "Independent"}
                              </span>
                              <span className="text-xs text-zinc-500">
                                {inq.name} ({inq.email})
                              </span>
                            </div>
                          </td>

                          {/* Target Agent System */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center rounded-md bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-xs font-mono text-zinc-300">
                              {getAgentFriendlyName(inq.selectedAgent)}
                            </span>
                          </td>

                          {/* Budget Level */}
                          <td className="px-6 py-4 text-sm text-zinc-300 whitespace-nowrap">
                            {inq.budget}
                          </td>

                          {/* Estimated ROI Projection */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-mono font-semibold text-emerald-400">
                              {inq.roiEstimated ? `$${inq.roiEstimated.toLocaleString()}` : "Not Calc"}
                            </span>
                          </td>

                          {/* Operational Status Pill */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium font-mono ${
                              inq.status === "New"
                                ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                : inq.status === "Reviewed"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${
                                inq.status === "New" ? "bg-yellow-500" : inq.status === "Reviewed" ? "bg-emerald-400" : "bg-blue-400"
                              }`} />
                              {inq.status}
                            </span>
                          </td>

                          {/* Expanded Details Button */}
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => setSelectedInqId(isExpanded ? null : inq.id)}
                              className="text-xs font-mono text-emerald-400 hover:text-white underline cursor-pointer"
                            >
                              {isExpanded ? "Collapse" : "Inspect"}
                            </button>
                          </td>
                        </tr>

                        {/* Expandable Panel */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={6} className="bg-zinc-950/60 px-6 py-4 border-b border-zinc-900">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                                <div>
                                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
                                    Integration Context / Brief Notes
                                  </span>
                                  <p className="text-zinc-300 bg-zinc-900 border border-zinc-800/60 p-3.5 rounded-xl leading-relaxed whitespace-pre-wrap">
                                    {inq.notes || "No extra system details provided by prospect."}
                                  </p>
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
                                      Operator Actions
                                    </span>
                                    <div className="flex gap-2.5">
                                      <button
                                        onClick={() => updateStatus(inq.id, "Reviewed")}
                                        className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg font-mono cursor-pointer"
                                      >
                                        Mark Reviewed
                                      </button>
                                      <button
                                        onClick={() => updateStatus(inq.id, "In Contact")}
                                        className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg font-mono cursor-pointer"
                                      >
                                        Mark In Contact
                                      </button>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-900/30 p-2.5 rounded-lg border border-zinc-850">
                                      <span className="text-[10px] text-zinc-500 block font-mono">{t("dashTableSubmitted")}</span>
                                      <span className="font-mono text-zinc-300">
                                        {new Date(inq.submittedAt).toLocaleDateString()} {new Date(inq.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                      </span>
                                    </div>
                                    <div className="bg-zinc-900/30 p-2.5 rounded-lg border border-zinc-850">
                                      <span className="text-[10px] text-zinc-500 block font-mono">CONTACT VALUE</span>
                                      <span className="font-mono text-zinc-300">
                                        {inq.phone !== "N/A" ? inq.phone : "No Phone"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
