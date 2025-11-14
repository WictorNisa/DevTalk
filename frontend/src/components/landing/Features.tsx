import { useTranslation } from "react-i18next";

import { motion } from "framer-motion";
import { features } from "@/data/features";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Features() {
  const { t } = useTranslation("landing");
  return (
    <section id="features" className="border-b py-32">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            {" "}
            {t("features.title")}
          </h2>
          <p className="text-primary/70 mt-3 text-base">
            {t("features.description")}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          transition={{ ease: "easeIn", duration: 0.4 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 grid gap-8 sm:grid-cols-3"
        >
          {features.map(({ icon: Icon, key }) => (
            <Card key={key} className="flex h-full flex-col text-left">
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
              <CardContent className="text-muted-foreground flex-1 text-sm">
                <p>{t(`features.items.${key}.desc`)}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
