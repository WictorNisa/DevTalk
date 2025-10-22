import { motion } from "framer-motion";
import { Rss, FileCode2 } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <section id="how-it-works" className="border-b py-32">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold sm:text-4xl">How it works</h2>
        <p className="text-primary/70 mt-3 text-base">
          Getting started is simple.
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 grid gap-8 sm:grid-cols-3"
        >
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <Card key={title} className="flex h-full flex-col text-left">
              <CardHeader className="space-y-3">
                <div className="text-muted-foreground flex items-center gap-3 text-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span>Step {i + 1}</span>
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground flex-1 text-sm">
                <p>{desc}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
