import { motion } from "framer-motion";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  // SORRY FÖR KOMMENTARER MEN HÅLLER INTE KOLL PÅ VAD SOM ÄR VAD MED JEVLA TAILPOOP
  return (
    <section className="items relative m-auto flex h-100 min-h-[100vh] justify-center overflow-hidden px-6 pt-24 text-center">
      <motion.video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover brightness-[0.55] hue-rotate-[250deg] saturate-[0.35] dark:brightness-100"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        initial={{ scale: 1.2, opacity: 1 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <source src="/media/404-video.mp4" type="video/mp4" />
      </motion.video>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80 mix-blend-color dark:bg-[var(--background)] dark:mix-blend-plus-darker"
      />
      {/* Outer Card */}
      <div className="bg-white-400 bg-opacity-50 flex-c relative z-10 flex h-[70%] w-full max-w-2xl flex-col items-center justify-center rounded-md border border-slate-800 bg-clip-padding text-center shadow-[6px_5px_7px_0px_rgba(0,_0,_0,_0.9)] backdrop-blur-sm backdrop-filter">
        {/* Inner Card */}
        <div className="h-[90%] w-[90%]">
          <div className="mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" color="red" />
            <span className="text-sm text-red-400">ERROR_404</span>
            <span className="text-slate-600">|</span>
            <span className="text-sm text-slate-500">RESOURCE_NOT_FOUND</span>
          </div>

          {/* Main 404 Card */}
          <div className="flex flex-col items-center justify-center">
            <h1 className="mb-4 scroll-m-20 text-center font-['fira_code'] text-[12rem] tracking-[.8rem] text-balance text-slate-300">
              404
            </h1>
            <div className="space-y-2">
              <p className="text-xl font-medium text-slate-300 md:text-2xl">
                Looks like this page returned null.
              </p>
              <p className="text-sm text-slate-400">
                The requested endpoint does not exist in our database.
              </p>
            </div>
          </div>

          {/* Container for Code-style error message */}
          <div className="mt-15 mb-15 rounded-lg border border-slate-700/30 bg-slate-950/50 p-4 text-left text-sm">
            <div className="text-red-400">
              <span className="text-slate-600">{">"}</span> Error: Page not
              found
            </div>
            <div className="ml-4 text-slate-500">
              at Route.render (app.tsx:404)
            </div>
            <div className="ml-4 text-slate-500">
              at navigate (/src/router/index.tsx:127)
            </div>
          </div>

          {/* Button Container */}
          <div className="flex h-auto flex-col items-center justify-center">
            <Button
              variant="outline"
              size="lg"
              className="dark:bg-background dark:hover:bg-secondary bg-background hover:bg-ring border-ring hover:border-secondary rounded-lg sm:w-auto"
            >
              <Link to="/">Return to a safe route</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
