import { motion } from "motion/react";
import { ArrowRight, Bot, Cpu, Layers, MessageSquare, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 pt-20 pb-16 md:pt-32 md:pb-24 border-b border-zinc-200 dark:border-zinc-900 transition-colors duration-200">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-teal-500/5 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Tagline */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-mono"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>{t("heroTagline")}</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 font-sans text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-tight"
          >
            {t("heroHeadingPre")}{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-500 bg-clip-text text-transparent">
              {t("heroHeadingGradient")}
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            {t("heroSubheading")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={() => scrollToSection("playroom")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              {t("heroBtnTest")}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-6 py-3 text-sm font-semibold text-zinc-800 dark:text-white backdrop-blur-sm transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer shadow-sm"
            >
              {t("heroBtnExplore")}
            </button>
          </motion.div>
        </div>

        {/* Floating Core Agent Badges / Trust Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Metric 1 */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-6 backdrop-blur-sm shadow-sm transition-colors duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white font-mono">{t("metric1Title")}</h3>
            <p className="mt-1 text-sm text-zinc-500">{t("metric1Desc")}</p>
          </div>

          {/* Metric 2 */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-6 backdrop-blur-sm shadow-sm transition-colors duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white font-mono">{t("metric2Title")}</h3>
            <p className="mt-1 text-sm text-zinc-500">{t("metric2Desc")}</p>
          </div>

          {/* Metric 3 */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-6 backdrop-blur-sm shadow-sm transition-colors duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white font-mono">{t("metric3Title")}</h3>
            <p className="mt-1 text-sm text-zinc-500">{t("metric3Desc")}</p>
          </div>

          {/* Metric 4 */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-6 backdrop-blur-sm shadow-sm transition-colors duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white font-mono">{t("metric4Title")}</h3>
            <p className="mt-1 text-sm text-zinc-500">{t("metric4Desc")}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
