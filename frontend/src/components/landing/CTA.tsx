import { motion } from "framer-motion";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

export default function CTA() {
  const { t } = useTranslation();

  return (
    <section className="bg-background relative py-32 text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-semibold sm:text-4xl">
          {t("cta.title")}
        </h2>

        <p className="text-primary/70 mx-auto mt-3 max-w-2xl text-base">
          {t("cta.description")}
        </p>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
        >
          <Button
            variant="outline"
            asChild
            size="lg"
            className="w-auto rounded-lg sm:w-auto"
          >
            <Link to="/login">
              <GitHubLogoIcon className="h-5 w-5" />
              {t("cta.ctaGithub")}
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
