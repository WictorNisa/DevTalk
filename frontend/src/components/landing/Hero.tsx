import { motion } from "framer-motion";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Link } from "react-router";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-6 text-center"
    >
      <motion.video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover brightness-[0.65] hue-rotate-[250deg] saturate-[0.3] dark:brightness-65 dark:saturate-30"
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
      <div className="pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative z-10 max-w-3xl text-center">
        <h1 className="text-6xl font-extrabold tracking-tight text-white sm:text-7xl">
          DevTalk
        </h1>
        <p className="mt-4 text-lg text-white sm:text-xl">
          Talk code. Share wisdom. Grow together.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Button
            variant="outline"
            asChild
            size="lg"
            className="dark:bg-background dark:hover:bg-accent w-auto rounded-md sm:w-auto"
          >
            <Link to="/login">
              <GitHubLogoIcon className="h-5 w-5" />
              Sign In With GitHub
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
