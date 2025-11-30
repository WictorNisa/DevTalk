import { motion } from "framer-motion";
import { Rss, FileCode2 } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ChevronDown } from "lucide-react";
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

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(3px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function HowItWorks() {
  const { t } = useTranslation("landing");

  return (
    <section id="how-it-works" className="relative border-b py-32">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold sm:text-4xl">
          {t("howItWorks.title")}
        </h2>
        <p className="text-primary/70 mt-3 text-base">
          {t("howItWorks.subtitle")}
        </p>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-8 sm:grid-cols-3"
        >
          {steps.map(({ icon: Icon, key }, index) => (
            <motion.div
              key={key}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-muted/50 hover:border-foreground/5 flex h-full flex-col border-2 border-transparent text-left shadow-md transition-all duration-200 hover:shadow-lg">
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
                <CardContent className="text-muted-foreground flex-1 py-2 text-sm">
                  <p>
                    {t(`howItWorks.steps.${key}.desc`)}
                    {index === 0 && (
                      <>
                        {" "}
                        <a
                          className="text-primary/80 hover:text-primary underline"
                          href="https://www.github.com/signup"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <br />
                          {t(`howItWorks.steps.${key}.signUp`)}
                        </a>
                      </>
                    )}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <ChevronDown
        className="text-foreground/30 absolute bottom-10 left-1/2 h-10 w-10 -translate-x-1/2 animate-bounce cursor-pointer"
        aria-hidden
        onClick={() => {
          const element = document.getElementById("team");
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }}
      />
    </section>
  );
}
