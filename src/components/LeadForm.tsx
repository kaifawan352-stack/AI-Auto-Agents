import { useState, useEffect, FormEvent } from "react";
import { Send, CheckCircle2, Bot, Mail, Sparkles, Phone, User, AlertCircle } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface LeadFormProps {
  preFilledBudget: string;
  preFilledNotes: string;
  preFilledRoi: number | null;
  onFormSubmitted: () => void;
}

export default function LeadForm({ preFilledBudget, preFilledNotes, preFilledRoi, onFormSubmitted }: LeadFormProps) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("web_chatbot");
  const [budget, setBudget] = useState("$1,000 - $2,500/mo");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Apply pre-filled data when it updates
  useEffect(() => {
    if (preFilledBudget) {
      setBudget(preFilledBudget);
    }
    if (preFilledNotes) {
      setNotes(preFilledNotes);
    }
  }, [preFilledBudget, preFilledNotes]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg("Please enter both your name and email address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const payload = {
      name,
      email,
      company,
      phone,
      selectedAgent,
      budget,
      notes,
      roiEstimated: preFilledRoi
    };

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to submit inquiry. Please try again.");
      }

      setIsSuccess(true);
      onFormSubmitted();

      // Clear standard fields
      setName("");
      setEmail("");
      setCompany("");
      setPhone("");
      setNotes("");
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please check your network connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="hire" className="bg-zinc-50 dark:bg-zinc-950 py-24 border-b border-zinc-200 dark:border-zinc-900 relative transition-colors duration-200">
      <div className="absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[130px]" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title block */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-base font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">
            {t("formPreheading")}
          </h2>
          <p className="mt-4 font-sans text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
            {t("formTitle")}
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
            {t("formSub")}
          </p>
        </div>

        {/* Success Dialog */}
        {isSuccess ? (
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center space-y-4 max-w-xl mx-auto">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto border border-emerald-500/20">
              <CheckCircle2 className="h-8 w-8 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{t("formSuccess")}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                {t("formSuccessSub")}
              </p>
            </div>
            <button
              onClick={() => setIsSuccess(false)}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-white underline underline-offset-4 cursor-pointer"
            >
              {t("formSubmitAnother")}
            </button>
          </div>
        ) : (
          /* Main Form Frame */
          <form onSubmit={handleSubmit} className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/10 p-6 sm:p-10 backdrop-blur-sm space-y-6 shadow-sm">
            
            {errorMsg && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex gap-3 text-red-500 dark:text-red-400 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {preFilledRoi && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
                <span className="flex items-center gap-1.5 font-mono">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  {t("formRoiApplied")}
                </span>
                <span className="font-bold">
                  {t("formValueEst")}: ~${preFilledRoi.toLocaleString()}/yr
                </span>
              </div>
            )}

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block font-mono uppercase tracking-wider">
                  {t("formFullName")} <span className="text-emerald-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400 dark:text-zinc-500">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarah Jenkins"
                    className="w-full bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 rounded-xl pl-9 pr-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block font-mono uppercase tracking-wider">
                  {t("formEmail")} <span className="text-emerald-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400 dark:text-zinc-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="type"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@company.com"
                    className="w-full bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 rounded-xl pl-9 pr-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Company */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block font-mono uppercase tracking-wider">
                  {t("formCompany")}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400 dark:text-zinc-500">
                    <Bot className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Jenkins Logistics"
                    className="w-full bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 rounded-xl pl-9 pr-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block font-mono uppercase tracking-wider">
                  {t("formPhone")}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400 dark:text-zinc-500">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 rounded-xl pl-9 pr-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Preferred Agent Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block font-mono uppercase tracking-wider">
                  {t("formSelectAgent")}
                </label>
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 rounded-xl px-4 py-3 text-sm text-zinc-800 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="web_chatbot" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">{t("pWebTitle")}</option>
                  <option value="whatsapp_insta" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">{t("pSocialTitle")}</option>
                  <option value="email_chatbot" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">{t("pEmailTitle")}</option>
                  <option value="b2b_leadgen" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">{t("pB2bTitle")}</option>
                  <option value="lead_qualification" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">{t("pBantTitle")}</option>
                </select>
              </div>

              {/* Monthly Budget Range */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block font-mono uppercase tracking-wider">
                  {t("formEstimatedBudget")}
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 rounded-xl px-4 py-3 text-sm text-zinc-800 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="<$500/mo" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">Less than $500/mo</option>
                  <option value="$500 - $1,000/mo" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">$500 - $1,000/mo</option>
                  <option value="$1,000 - $2,500/mo" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">$1,000 - $2,500/mo</option>
                  <option value="$2,500 - $5,000/mo" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">$2,500 - $5,000/mo</option>
                  <option value="$5,000+/mo" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">$5,000+/mo</option>
                </select>
              </div>

            </div>

            {/* Notes Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block font-mono uppercase tracking-wider">
                {t("formNotes")}
              </label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("formNotesPlaceholder")}
                className="w-full bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-8 py-3.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? t("formBtnSubmitting") : t("formBtnSubmit")}
                <Send className="h-4 w-4 stroke-[2.2]" />
              </button>
            </div>

          </form>
        )}

      </div>
    </section>
  );
}
