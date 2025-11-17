import { motion } from "framer-motion";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/useAuthStore";

export default function CTA() {
  const { t } = useTranslation();
  const { login } = useAuthStore();

  return (
    <section className="bg-background relative py-32 text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-semibold sm:text-4xl">{t("cta.title")}</h2>

        <p className="text-primary/70 mx-auto mt-3 max-w-2xl text-base">
          {t("cta.description")}
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          transition={{ ease: "easeIn", duration: 0.4 }}
          whileInView={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
        >
          <Button
            variant="outline"
            size="lg"
            className="border-input/20 text-secondary hover:text-secondary hover:bg-secondary/10 dark:text-primary bg-accent/5 w-auto cursor-pointer rounded-lg sm:w-auto"
            onClick={login}
          >
            <GitHubLogoIcon className="mr-2 h-5 w-5" />
            {t("hero.ctaGithub")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
