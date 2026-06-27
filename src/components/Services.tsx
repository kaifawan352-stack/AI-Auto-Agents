import { motion } from "motion/react";
import { MessageSquare, MessageCircle, Mail, Users, CheckCircle, ShieldCheck, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface ServiceProps {
  onSelectAgent: (agentId: string) => void;
}

export default function Services({ onSelectAgent }: ServiceProps) {
  const { t } = useLanguage();

  const servicesList = [
    {
      id: "web_chatbot",
      title: t("servicesAgent1Title"),
      description: t("servicesAgent1Desc"),
      icon: MessageSquare,
      color: "from-emerald-500/20 to-teal-500/5",
      iconColor: "text-emerald-400",
      badge: t("servicesBadge1"),
      features: [
        t("s1f1"),
        t("s1f2"),
        t("s1f3"),
        t("s1f4")
      ]
    },
    {
      id: "whatsapp_insta",
      title: t("servicesAgent2Title"),
      description: t("servicesAgent2Desc"),
      icon: MessageCircle,
      color: "from-teal-500/20 to-emerald-500/5",
      iconColor: "text-teal-400",
      badge: t("servicesBadge2"),
      features: [
        t("s2f1"),
        t("s2f2"),
        t("s2f3"),
        t("s2f4")
      ]
    },
    {
      id: "email_chatbot",
      title: t("servicesAgent3Title"),
      description: t("servicesAgent3Desc"),
      icon: Mail,
      color: "from-emerald-500/20 to-teal-500/5",
      iconColor: "text-emerald-300",
      features: [
        t("s3f1"),
        t("s3f2"),
        t("s3f3"),
        t("s3f4"),
        t("s3f5")
      ]
    },
    {
      id: "b2b_leadgen",
      title: t("servicesAgent4Title"),
      description: t("servicesAgent4Desc"),
      icon: Users,
      color: "from-teal-500/20 to-emerald-500/5",
      iconColor: "text-emerald-400",
      badge: t("servicesBadge4"),
      features: [
        t("s4f1"),
        t("s4f2"),
        t("s4f3")
      ]
    },
    {
      id: "lead_qualification",
      title: t("servicesAgent5Title"),
      description: t("servicesAgent5Desc"),
      icon: ShieldCheck,
      color: "from-emerald-500/20 to-teal-500/5",
      iconColor: "text-teal-400",
      badge: t("servicesBadge5"),
      features: [
        t("s5f1"),
        t("s5f2"),
        t("s5f3")
      ]
    }
  ];

  return (
    <section id="services" className="bg-zinc-50 dark:bg-zinc-950 py-24 border-b border-zinc-200 dark:border-zinc-900 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">
            {t("servicesHeading")}
          </h2>
          <p className="mt-4 font-sans text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
            {t("servicesOfferings")}
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            {t("servicesClickPlayground")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="flex flex-wrap justify-center gap-8">
          {servicesList.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`flex flex-col justify-between rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-gradient-to-br ${service.color} p-8 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 group w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)]`}
              >
                <div>
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 border border-zinc-200 dark:border-zinc-800`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    {service.badge && (
                      <span className="rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Text Content */}
                  <h3 className="mt-6 text-xl font-bold text-zinc-950 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Bullet points */}
                  <ul className="mt-6 space-y-2.5">
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2.5 text-xs text-zinc-500">
                        <CheckCircle className="h-4 w-4 text-emerald-500/80 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Action */}
                <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-900/50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                    {service.id === "web_chatbot" ? t("servicesBtnDemo") : t("servicesBtnCustom")}
                  </span>
                  <button
                    onClick={() => {
                      if (service.id === "web_chatbot") {
                        onSelectAgent(service.id);
                        document.getElementById("playroom")?.scrollIntoView({ behavior: "smooth" });
                      } else {
                        document.getElementById("hire")?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:bg-emerald-400 group-hover:text-zinc-950 group-hover:border-emerald-400 transition-all cursor-pointer"
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
