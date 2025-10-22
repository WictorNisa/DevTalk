import { motion } from "framer-motion";
import { Link } from "react-router";
import { Button } from "../components/ui/button";

const NotFound = () => {
  return (
    <section className="items relative flex min-h-[101vh] justify-center overflow-hidden px-6 pt-24 text-center">
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
      <div className="bg-white-400 bg-opacity-50 relative z-10 -mt-10 flex h-[65vh] w-[35%] flex-col rounded-md border bg-clip-padding text-center shadow-[5px_4px_6px_0px_rgba(0,_0,_0,_0.9)] backdrop-blur-sm backdrop-filter">
        <div className="mt-0 mb-auto h-[45%]">
          <h1 className="mb -3.5 scroll-m-20 text-center font-['fira_code'] text-[11rem] tracking-[.8rem] text-balance text-white">
            404
          </h1>
          <h4 className="sm:text-1xl -mt-5 text-sm text-white">
            Looks like this page returned null.
          </h4>
        </div>

        <div className="mt-0 mb-auto flex h-[20%] flex-col items-center justify-center">
          <Button
            variant="outline"
            size="lg"
            className="dark:bg-background dark:hover:bg-secondary bg-background hover:bg-ring border-ring hover:border-secondary rounded-lg sm:w-auto"
          >
            <Link to="/">Return to a safe route</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
