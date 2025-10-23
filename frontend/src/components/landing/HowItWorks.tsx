import { motion } from "framer-motion";
import { Rss, FileCode2 } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const steps = [
  {
    icon: GitHubLogoIcon,
    key: "signin",
  },
  {
    icon: Rss,
    key: "join",
  },
  {
    icon: FileCode2,
    key: "share",
  },
] as const;

export default function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="border-b py-32">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold sm:text-4xl">
          {t("howItWorks.title")}
        </h2>
        <p className="text-primary/70 mt-3 text-base">
          {t("howItWorks.subtitle")}
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          transition={{ ease: "easeIn", duration: 0.35 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 grid gap-8 sm:grid-cols-3"
        >
          {steps.map(({ icon: Icon, key }, index) => (
            <Card key={key} className="flex h-full flex-col text-left">
              <CardHeader className="space-y-3">
                <div className="text-muted-foreground flex items-center gap-3 text-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span>
                    {t("howItWorks.stepLabel", { number: index + 1 })}
                  </span>
                </div>
                <CardTitle className="text-lg">
                  {t(`howItWorks.steps.${key}.title`)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground flex-1 text-sm">
                <p>{t(`howItWorks.steps.${key}.desc`)}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
