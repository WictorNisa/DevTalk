import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Link } from "react-router";
import { Button } from "../ui/button";

export default function CTA() {
  return (
    <section className="relative bg-[var(--background)] py-32 text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-semibold sm:text-4xl">
          Ready To Connect With Other Developers?
        </h2>

        <p className="text-primary/70 mx-auto mt-3 max-w-2xl text-base">
          Join DevTalk today and start networking
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Button
            variant="outline"
            asChild
            size="lg"
            className="dark:bg-background dark:hover:bg-accent w-auto rounded-md sm:w-auto"
          >
            <Link to="/login">
              <GitHubLogoIcon className="h-5 w-5" />
              Sign In With GitHub
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
