import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { features } from "@/data/features";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

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

export default function Features() {
  const { t } = useTranslation("landing");

  return (
    <section id="features" className="relative border-b py-32">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            {t("features.title")}
          </h2>
          <p className="text-primary/70 mt-3 text-base">
            {t("features.description")}
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-8 sm:grid-cols-3"
        >
          {features.map(({ icon: Icon, key }) => (
            <motion.div key={key} variants={cardVariants}>
              <motion.div>
                <Card className="bg-muted/50 border-foreground/5 flex h-full flex-col border-2 text-left shadow-md transition-all duration-200 hover:shadow-lg">
                  {" "}
                  <CardHeader className="space-y-3">
                    <div className="text-muted-foreground flex items-center gap-3 text-sm">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-foreground text-lg">
                        {t(`features.items.${key}.title`)}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-muted-foreground flex-1 py-2 text-sm">
                    <p>{t(`features.items.${key}.desc`)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <ChevronDown
        className="text-foreground/30 absolute bottom-10 left-1/2 h-10 w-10 -translate-x-1/2 animate-bounce cursor-pointer"
        aria-hidden
        onClick={() => {
          const element = document.getElementById("how-it-works");
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }}
      />
    </section>
  );
}
