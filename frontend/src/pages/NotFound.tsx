import { motion } from "framer-motion";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  // SORRY FÖR KOMMENTARER MEN HÅLLER INTE KOLL PÅ VAD SOM ÄR VAD MED JEVLA TAILPOOP
  return (
    <section className="relative m-auto flex min-h-[100vh] items-center justify-center overflow-hidden px-4 py-8 text-center sm:px-6 lg:px-8">
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
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center justify-center rounded-lg border border-slate-800 bg-white/5 bg-clip-padding text-center shadow-[6px_5px_7px_0px_rgba(0,_0,_0,_0.9)] backdrop-blur-sm backdrop-filter sm:max-w-md md:max-w-lg lg:max-w-2xl">
        {/* Inner Card */}
        <div className="w-full p-6 sm:p-8 lg:p-12">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:mb-6">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" color="red" />
            <span className="text-xs text-red-400 sm:text-sm">ERROR_404</span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-slate-500 sm:text-sm">
              RESOURCE_NOT_FOUND
            </span>
          </div>

          {/* Main 404 Card */}
          <div className="flex flex-col items-center justify-center">
            <h1 className="mb-3 scroll-m-20 text-center font-['fira_code'] text-[6rem] tracking-[.4rem] text-balance text-slate-300 sm:mb-4 sm:text-[8rem] sm:tracking-[.6rem] md:text-[10rem] md:tracking-[.7rem] lg:text-[12rem] lg:tracking-[.8rem]">
              404
            </h1>
            <div className="space-y-2 px-2 sm:px-0">
              <p className="text-lg font-medium text-slate-300 sm:text-xl md:text-2xl">
                Looks like this page returned null.
              </p>
              <p className="text-xs text-slate-400 sm:text-sm">
                The requested endpoint does not exist in our database.
              </p>
            </div>
          </div>

          {/* Container for Code-style error message */}
          <div className="my-6 rounded-lg border border-slate-700/30 bg-slate-950/50 p-3 text-left text-xs sm:my-8 sm:p-4 sm:text-sm">
            <div className="text-red-400">
              <span className="text-slate-600">{">"}</span> Error: Page not
              found
            </div>
            <div className="ml-2 text-slate-500 sm:ml-4">
              at Route.render (app.tsx:404)
            </div>
            <div className="ml-2 text-slate-500 sm:ml-4">
              at navigate (/src/router/index.tsx:127)
            </div>
          </div>

          {/* Button Container */}
          <div className="flex h-auto flex-col items-center justify-center">
            <Button
              variant="outline"
              size="lg"
              className="border-ring bg-background hover:border-secondary hover:bg-ring dark:bg-background dark:hover:bg-secondary w-full rounded-lg sm:w-auto"
            >
              <Link to="/" className="block w-full">
                Return to a safe route
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
