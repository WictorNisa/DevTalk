import { Rss, FileCode2 } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

const steps = [
  {
    icon: GitHubLogoIcon,
    title: "Sign in with GitHub",
    desc: "Log in with ease using your GitHub account.",
  },
  {
    icon: Rss,
    title: "Join a channel",
    desc: "Find or create a channel for your favorite dev topics.",
  },
  {
    icon: FileCode2,
    title: "Share code & get help",
    desc: "Post snippets, ask questions, and learn from other developers in real time.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-[var(--background)] py-20 text-white"
    >
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">How it works</h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="text-sm text-white/50">Step {i + 1}</span>
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-white/70">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
