import { Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0B0E14] py-8 text-white/70">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 text-center sm:flex-row sm:text-left">
        <p className="flex items-center gap-1 text-sm">
          © {new Date().getFullYear()} DevTalk. Built with
          <Heart className="h-4 w-4 text-pink-500" aria-label="love" />
          by students.
        </p>

        <a
          href="https://github.com/WictorNisa/DevTalk"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm transition hover:text-white"
        >
          <Github className="h-4 w-4" />
          <span>GitHub</span>
        </a>
      </div>
    </footer>
  );
}
