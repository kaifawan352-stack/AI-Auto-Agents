import { Bot, Terminal, ShieldCheck, Cpu, Mail } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Block */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400 text-zinc-950">
                <Terminal className="h-4.5 w-4.5 stroke-[2.5]" />
              </div>
              <span className="font-sans text-lg font-bold tracking-tight text-white">
                AI Auto <span className="text-emerald-400">Agents</span>
              </span>
            </div>
            <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
              {t("footerDesc")}
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-zinc-400">
              <Mail className="h-4 w-4 text-emerald-400" />
              <a href="mailto:aiautomationagents2@gmail.com" className="hover:text-emerald-300 transition-colors font-mono">
                aiautomationagents2@gmail.com
              </a>
            </div>
          </div>

          {/* Offerings Column */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              {t("footerOfferings")}
            </h4>
            <ul className="mt-4 space-y-2 text-xs text-zinc-500">
              <li>{t("pWebTitle")}</li>
              <li>{t("pSocialTitle")}</li>
              <li>{t("pEmailTitle")}</li>
              <li>{t("pB2bTitle")}</li>
              <li>{t("pBantTitle")}</li>
            </ul>
          </div>

          {/* Tech Stack Column */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              {t("footerSolutions")}
            </h4>
            <ul className="mt-4 space-y-2 text-xs text-zinc-500">
              <li>Multi-Language LLMs</li>
              <li>Secure SSL Storage</li>
              <li>REST Webhook Syncing</li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright segment */}
        <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-zinc-600">
          <p>© {new Date().getFullYear()} AI Auto Agents. {t("footerRights")}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-400 transition-colors">{t("footerPrivacy")}</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">{t("footerTerms")}</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Status: Online</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
