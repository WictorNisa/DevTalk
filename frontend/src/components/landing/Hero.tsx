import { Github } from "lucide-react";
import { Link } from "react-router";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[85vh] items-center justify-center bg-gradient-to-b from-[#0B0E14] to-[#121625] px-6 text-center"
    >
      <div className="max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          DevTalk
        </h1>
        <p className="mt-4 text-lg text-white/70 sm:text-xl">
          Talk code. Share wisdom. Grow together.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-full bg-white/10 px-8 py-3 text-base font-semibold text-white transition hover:bg-white/20"
          >
            Sign in with GitHub
            <Github className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* dekorativa blobs kan läggas här senare */}
    </section>
  );
}
