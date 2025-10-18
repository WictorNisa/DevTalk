import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";

const GITHUB_REPO = "https://github.com/WictorNisa/DevTalk";

const navLinks = [
  { label: "Features", href: "#fe atures" },
  { label: "How It Works", href: "#how-it-works" },
];

export default function Navbar() {
  return (
    <header className="dark:text-foreground sticky top-0 z-50 w-full border-b bg-[var(--background)]/95 text-[var(--foreground)] backdrop-blur-md dark:border-[var(--border)] dark:bg-[var(--background)]/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-2 py-6">
        <a href="#home" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg font-bold">
            DT
          </span>
          <span className="text-lg font-semibold tracking-tight">DevTalk</span>
        </a>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="items-center gap-4">
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink asChild className="text-sm">
                  <a href={link.href}>{link.label}</a>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuLink asChild className="text-sm">
                <a href={GITHUB_REPO} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="top"
            className="w-auto border-b backdrop-blur-sm sm:w-auto"
          >
            <div className="flex items-center justify-between">
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <span className="sr-only">Close menu</span>
                </Button>
              </SheetClose>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <SheetClose asChild key={link.href}>
                  <a
                    href={link.href}
                    className="rounded-lg px-5 py-2 text-sm font-medium"
                  >
                    {link.label}
                  </a>
                </SheetClose>
              ))}

              <SheetClose asChild>
                <a
                  href={GITHUB_REPO}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg px-5 py-2 text-sm font-medium"
                >
                  GitHub
                </a>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
