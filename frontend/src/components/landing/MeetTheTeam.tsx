import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";

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
    <section id="team" className="py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold sm:text-4xl">
          The Team Behind DevTalk
        </h2>
        <p className="mt-3">
          A small team of passionate dev-students building a place for coders to
          connect, learn, and grow.
        </p>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-card flex flex-col items-center rounded-3xl border p-6 transition"
            >
              {/* Profile Picture from GitHub */}
              <img
                src={`https://github.com/${member.githubUser}.png`}
                alt={member.name}
                className="mb-4 h-20 w-20 rounded-full border object-cover"
              />

              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p>{member.role}</p>

              <div className="mt-4 flex justify-center gap-4">
                <a
                  href={`https://github.com/${member.githubUser}`}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:scale-102"
                >
                  <GitHubLogoIcon className="h-6 w-6" />
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:scale-102"
                >
                  <LinkedInLogoIcon className="h-6 w-6" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
