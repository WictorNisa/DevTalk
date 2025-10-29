export type TeamRoleKey = "frontend" | "backend" | "scrum";

export const team = [
  {
    name: "Nicholas Sjöstrand",
    role: "frontend" satisfies TeamRoleKey,
    githubUser: "kaigan94",
    linkedin: "https://www.linkedin.com/in/nicholas-sjostrand/",
  },
  {
    name: "Jonas Jönsson",
    role: "frontend" satisfies TeamRoleKey,
    githubUser: "adhSwede",
    linkedin: "https://www.linkedin.com/in/jonas-j-57858b320/",
  },
  {
    name: "Luke Salem",
    role: "backend" satisfies TeamRoleKey,
    githubUser: "lukebike",
    linkedin: "https://www.linkedin.com/in/luke-salem-17051a231/",
  },
  {
    name: "Oskar Lindahl",
    role: "backend" satisfies TeamRoleKey,
    githubUser: "Oskarlindahl03",
    linkedin: "https://www.linkedin.com/in/oskar-lindahl-a91a30284/",
  },
  {
    name: "Wictor Niså",
    role: "scrum" satisfies TeamRoleKey,
    githubUser: "WictorNisa",
    linkedin: "https://www.linkedin.com/in/wictor-nis%C3%A5-9b8bab183/",
  },
];
