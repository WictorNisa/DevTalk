import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Link } from "react-router";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[85vh] items-center justify-center bg-[var(--background)] px-6 text-center"
    >
      <div className="max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          DevTalk
        </h1>
        <p className="mt-4 text-lg text-white/70 sm:text-xl">
          Talk code. Share wisdom. Grow together.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-4">
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

      {/* dekorativa blobs kan läggas här senare */}
    </section>
  );
}
