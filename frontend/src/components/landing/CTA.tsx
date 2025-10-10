import { Github } from "lucide-react";
import { Link } from "react-router";

export default function CTA() {
  return (
    <section className="relative bg-[#0E1320] py-20 text-center text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Ready To Connect With Other Developers?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-white/70">
          Join DevTalk today – discuss code, share tips, and grow together.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-full bg-white/10 px-8 py-3 text-base font-semibold text-white transition hover:bg-white/20"
          >
            Sign in with GitHub
            <Github className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* gradientglow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0B0E14] to-transparent opacity-60" />
    </section>
  );
}
