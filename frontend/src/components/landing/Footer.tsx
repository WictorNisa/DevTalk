import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 text-center sm:flex-row sm:text-left">
        <p className="text-primary/70 flex items-center gap-1 text-sm">
          © {new Date().getFullYear()} DevTalk
        </p>
        <a
          href="https://github.com/WictorNisa/DevTalk"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm transition hover:scale-102"
        >
          <GitHubLogoIcon className="text-primary/70 h-5 w-5" />
          <span className="text-primary/70">GitHub</span>
        </a>
      </div>
    </footer>
  );
}
