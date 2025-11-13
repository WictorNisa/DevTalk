import { useTranslation } from "react-i18next";

import { motion } from "framer-motion";
import { Particles } from "@/components/ui/animations/particles";
import { Button } from "../ui/button";

import Logo from "@/assets/img/devtalk-logo.svg";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ChevronDown } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Hero() {
  const { t } = useTranslation();
  const { login } = useAuthStore();

  return (
    <section
      id="home"
      className="relative -mt-24 flex min-h-[101vh] items-center justify-center overflow-hidden px-6 pt-24 text-center"
    >
      {/* Background video */}
      <motion.video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover brightness-[0.55] hue-rotate-250 saturate-[0.35] dark:brightness-45"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <source src="/media/hero-loop.mp4" type="video/mp4" />
        <source src="/media/hero-loop.webm" type="video/webm" />
      </motion.video>
      <div
        aria-hidden
        className="dark:bg-background pointer-events-none absolute inset-0 opacity-80 mix-blend-color dark:mix-blend-plus-darker"
      />
      {/* Interactive particles */}
      <Particles
        className="absolute inset-0"
        quantity={80}
        ease={60}
        staticity={60}
        color="#334753"
        size={0.8}
      />
      <div className="relative z-10 max-w-3xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 75 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-6xl font-extrabold tracking-tight text-white/90 sm:text-7xl"
        >
          <div className="relative mx-auto mb-14 w-22">
            <div className="dark:to-background to-chart-3 absolute inset-3 bg-linear-to-b from-transparent blur-xl dark:blur-lg" />
            <div className="dark:bg-background bg-foreground relative flex aspect-square items-center justify-center rounded-3xl shadow-[inset_0_4px_6px_rgba(0,200,200,0.15)] dark:shadow-[inset_0_4px_6px_rgba(0,200,200,0.15)]">
              <img
                src={Logo}
                alt="DevTalk logo"
                className="h-16 w-16 invert dark:invert-95"
              />
            </div>
          </div>
          {t("hero.title")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 75 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-lg text-white/70 sm:text-2xl"
        >
          {t("hero.subtitle")}
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
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
      <ChevronDown
        className="absolute bottom-10 left-1/2 h-10 w-10 -translate-x-1/2 animate-bounce text-white/30"
        aria-hidden
      />{" "}
    </section>
  );
}
