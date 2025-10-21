import { motion } from "framer-motion";
import { Particles } from "@/components/ui/animations/particles";

import Logo from "@/assets/img/devtalk-logo.svg";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative -mt-24 flex min-h-[101vh] items-center justify-center overflow-hidden px-6 pt-24 text-center"
    >
      {/* Background video loop */}
      <motion.video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover brightness-[0.55] hue-rotate-[250deg] saturate-[0.35] dark:brightness-45"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        initial={{ scale: 1.2, opacity: 1 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <source src="/media/hero-loop.mp4" type="video/mp4" />
        <source src="/media/hero-loop.webm" type="video/webm" />
      </motion.video>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80 mix-blend-color dark:bg-[var(--background)] dark:mix-blend-plus-darker"
      />
      {/* Interactive particles */}
      <Particles
        className="absolute inset-0"
        quantity={80}
        ease={60}
        staticity={60}
        color="#1A313F"
        size={0.8}
      />
      <div className="relative z-10 max-w-3xl text-center">
        <h1 className="text-6xl font-extrabold tracking-tight text-white/90 sm:text-7xl">
          <div className="relative mx-auto mb-16 w-22">
            <div className="dark:to-background to-chart-3 absolute inset-3 bg-gradient-to-b from-transparent blur-xl dark:blur-lg" />
            <div className="dark:bg-background bg-foreground relative flex aspect-square items-center justify-center rounded-3xl shadow-[inset_0_4px_6px_rgba(0,200,200,0.15)] dark:shadow-[inset_0_4px_6px_rgba(0,200,200,0.15)]">
              <img
                src={Logo}
                alt="DevTalk logo"
                className="h-16 w-16 invert dark:invert-95"
              />
            </div>
          </div>
          DevTalk
        </h1>
        <p className="mt-4 text-lg text-white/70 sm:text-2xl">
          Talk code. Share wisdom. Grow together.
        </p>
        <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Button
            variant="outline"
            asChild
            size="lg"
            className="dark:bg-background dark:hover:bg-secondary bg-background hover:bg-ring border-ring hover:border-secondary w-auto rounded-lg sm:w-auto"
          >
            <Link to="/login">
              <GitHubLogoIcon className="h-5 w-5" />
              Sign In With GitHub
            </Link>
          </Button>
        </div>
      </div>
      <ChevronDown
        className="absolute bottom-10 left-1/2 h-10 w-10 -translate-x-1/2 animate-bounce text-white/30"
        aria-hidden
      />{" "}
    </section>
  );
}
