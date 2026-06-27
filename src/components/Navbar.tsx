import { useState, useRef, useEffect } from "react";
import { Bot, Mail, MessageSquare, Terminal, Zap, Globe, ChevronDown, Sun, Moon } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { Language } from "../translations";
import { useTheme } from "../contexts/ThemeContext";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const languagesList: { code: Language; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" }
  ];

  const currentLangObj = languagesList.find(l => l.code === language) || languagesList[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-850 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div 
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-zinc-950 shadow-lg shadow-emerald-500/10">
            <Terminal className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-sans text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
              AI Auto <span className="text-emerald-500 dark:text-emerald-400">Agents</span>
            </span>
            <span className="block text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
              {t("logoSub")}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => scrollToSection("services")}
            className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            {t("navServices")}
          </button>
          <button 
            onClick={() => scrollToSection("playroom")}
            className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            {t("navSandbox")}
          </button>
          <button 
            onClick={() => scrollToSection("roi")}
            className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            {t("navRoi")}
          </button>
          <button 
            onClick={() => scrollToSection("dashboard")}
            className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            {t("navDashboard")}
          </button>
        </nav>

        {/* Action Button & Language Switcher */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all cursor-pointer"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4.5 w-4.5 text-amber-400" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-indigo-600" />
            )}
          </button>

          {/* Custom Language Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all cursor-pointer"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <Globe className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>{currentLangObj.flag} {currentLangObj.code.toUpperCase()}</span>
              <ChevronDown className={`h-3 w-3 text-zinc-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 origin-top-right rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1 shadow-xl focus:outline-none z-50">
                {languagesList.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors cursor-pointer ${
                      language === lang.code
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-white"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => scrollToSection("hire")}
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-zinc-950 rounded-lg group bg-gradient-to-br from-emerald-400 to-teal-400 group-hover:from-emerald-400 group-hover:to-teal-400 hover:text-white focus:ring-4 focus:outline-none focus:ring-emerald-800 cursor-pointer"
          >
            <span className="relative px-4 py-1.5 transition-all ease-in duration-75 bg-emerald-400 rounded-md group-hover:bg-opacity-0 group-hover:text-white font-semibold">
              {t("navDeploy")}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

