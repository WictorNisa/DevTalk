import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Link } from "react-router";
import { Button } from "../ui/button";

export default function CTA() {
  return (
    <section className="relative bg-[var(--background)] py-20 text-center text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Ready To Connect With Other Developers?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-white/70">
          Join DevTalk today – discuss code, share tips, and grow together.
        </p>

        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            asChild
            size="lg"
            className="rounded-md bg-white/10 text-white hover:bg-white/20"
          >
            <Link to="/login">
              <GitHubLogoIcon className="h-5 w-5" />
              Sign in with GitHub
            </Link>
          </Button>
        </div>
      </div>

      {/* gradientglow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0B0E14] to-transparent opacity-60" />
    </section>
  );
}
