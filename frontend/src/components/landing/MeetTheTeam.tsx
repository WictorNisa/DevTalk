import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const team = [
  {
    name: "Nicholas Sjöstrand",
    role: "Frontend, UI/UX",
    githubUser: "kaigan94",
    linkedin: "https://www.linkedin.com/in/nicholas-sjostrand/",
  },
  {
    name: "Jonas Jönsson",
    role: "Frontend, UI/UX",
    githubUser: "adhSwede",
    linkedin: "https://www.linkedin.com/in/jonas-j-57858b320/",
  },
  {
    name: "Luke Salem",
    role: "Backend, Database Design",
    githubUser: "lukebike",
    linkedin: "https://www.linkedin.com/in/luke-salem-17051a231/",
  },
  {
    name: "Oskar Lindahl",
    role: "Backend, Database Design",
    githubUser: "Oskarlindahl03",
    linkedin: "https://www.linkedin.com/in/oskar-lindahl-a91a30284/",
  },
  {
    name: "Wictor Niså",
    role: "Scrum Master",
    githubUser: "WictorNisa",
    linkedin: "https://www.linkedin.com/in/wictor-nis%C3%A5-9b8bab183/",
  },
];

export default function MeetTheTeam() {
  return (
    <section id="team" className="border-b py-32">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          The Team Behind DevTalk
        </h2>
        <p className="text-primary/70 mt-3 text-base">
          A small team of passionate dev-students building a place for coders to
          connect, learn, and grow.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <Card key={member.name} className="flex h-full flex-col text-left">
              <CardHeader className="space-y-3">
                <div className="text-muted-foreground flex items-center gap-3 text-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`https://github.com/${member.githubUser}.png`}
                        alt={member.name}
                      />
                      <AvatarFallback className="text-[0.75rem] font-medium">
                        {member.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <span>Team</span>
                </div>
                <CardTitle className="text-lg">{member.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground flex-1 text-sm">
                <p>{member.role}</p>
                <div className="mt-4 flex gap-4">
                  <a
                    href={`https://github.com/${member.githubUser}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <GitHubLogoIcon className="h-5 w-5" />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <LinkedInLogoIcon className="h-5 w-5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
