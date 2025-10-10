import { useState } from "react";
import { Link } from "react-router";
import { List, X } from "lucide-react";

const GITHUB_REPO = "https://github.com/WictorNisa/DevTalk";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0B0E14]/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 font-bold">
            DT
          </span>
          <span className="text-lg font-semibold tracking-tight">DevTalk</span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-white/80 transition hover:text-white"
            >
              {l.label}
            </a>
          ))}

          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-white/80 transition hover:text-white"
          >
            Github
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-[#0B0E14] md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-white/90 transition hover:bg-white/10"
              >
                {l.label}
              </a>
            ))}

            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-white/10 px-3 py-2 font-medium text-white transition hover:bg-white/20"
            >
              Sign in with GitHub
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
