import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

import { team } from "@/data/team";

export default function MeetTheTeam() {
  return (
    <section id="team" className="border-b py-24 sm:py-32">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold sm:text-4xl">
          The Team Behind DevTalk
        </h2>
        <p className="text-primary/70 mt-3 text-base">
          A small team of passionate dev-students building a place for coders to
          connect, learn, and grow.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map(({ name, role, githubUser, linkedin }) => (
            <Card key={githubUser || name} className="flex h-full flex-col">
              <CardContent className="flex flex-1 flex-col px-6 py-5 sm:py-6">
                <div className="grid grid-cols-[auto_1fr] items-start gap-4 text-left">
                  <div className="dark:bg-foreground/10 dark:border-primary/10 border-border flex h-20 w-20 items-center justify-center rounded-full border bg-(--background)/80">
                    <Avatar className="h-16 w-16 rounded-full">
                      <AvatarImage
                        src={`https://github.com/${githubUser}.png`}
                        alt={name}
                        className="rounded-full"
                      />
                      <AvatarFallback className="rounded-full text-base font-medium">
                        {name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <CardTitle className="dark:text-foreground/90 text-foreground text-xl">
                        {name}
                      </CardTitle>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {role}
                      </p>
                    </div>
                    <div className="text-muted-foreground mt-2 flex gap-4">
                      <a
                        href={`https://github.com/${githubUser}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-foreground transition-colors"
                      >
                        <GitHubLogoIcon className="h-5 w-5" />
                      </a>
                      <a
                        href={linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-foreground transition-colors"
                      >
                        <LinkedInLogoIcon className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
