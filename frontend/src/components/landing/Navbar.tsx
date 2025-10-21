import Logo from "@/assets/img/devtalk-logo.svg";
import { GitHubLogoIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const GITHUB_REPO = "https://github.com/WictorNisa/DevTalk";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Meet The Team", href: "#team" },
];

export default function Navbar() {
  return (
    <header className="dark:text-foreground bg-foreground/50 text-foreground sticky top-0 z-50 w-full border-b border-[var(--muted-foreground)]/30 backdrop-blur-md dark:border-[var(--border)]/70 dark:bg-[var(--background)]/40">
      <nav className="max-w-8xl mx-auto flex items-center justify-between px-5 py-5">
        <a href="#home" className="flex">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--foreground)]/50 transition-colors hover:border-[var(--)]/60 dark:border-none dark:bg-transparent">
            <img src={Logo} className="h-8 w-8 invert" alt="DevTalk logo" />
          </span>
        </a>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="hidden cursor-pointer items-center gap-2 md:inline-flex"
              >
                Menu
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="hidden w-48 md:block">
              {navLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <a
                    href={link.href}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    {link.label}
                  </a>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a
                  href={GITHUB_REPO}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer"
                >
                  <GitHubLogoIcon /> View Project
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-ring md:hidden"
                aria-label="Open navigation menu"
              >
                <HamburgerMenuIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 md:hidden">
              {navLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 text-base"
                  >
                    {link.label}
                  </a>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a
                  href={GITHUB_REPO}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-base"
                >
                  <GitHubLogoIcon /> GitHub Repo
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
