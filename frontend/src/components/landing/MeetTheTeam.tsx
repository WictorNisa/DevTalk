import { Github, Linkedin } from "lucide-react";

const team = [
  {
    name: "Nicholas Sjöstrand",
    role: "Frontend Developer",
    githubUser: "kaigan94",
    linkedin: "https://www.linkedin.com/in/nicholas-sjostrand/",
  },
  {
    name: "Jonas Jönsson",
    role: "Frontend Developer",
    githubUser: "adhSwede",
    linkedin: "https://www.linkedin.com/in/jonas-j-57858b320/",
  },
  {
    name: "Luke Salem",
    role: "Backend Developer",
    githubUser: "lukebike",
    linkedin: "https://www.linkedin.com/in/luke-salem-17051a231/",
  },
  {
    name: "Oskar Lindahl",
    role: "Backend Developer",
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
    <section id="team" className="bg-[#0B0E14] py-20 text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          The Team Behind DevTalk
        </h2>
        <p className="mt-3 text-white/70">
          A small team of passionate dev-students building a place for coders to
          connect, learn, and grow.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="flex flex-col items-center rounded-xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              {/* Profilbild från GitHub */}
              <img
                src={`https://github.com/${member.githubUser}.png`}
                alt={member.name}
                className="mb-4 h-20 w-20 rounded-full border border-white/10 object-cover"
              />

              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-white/70">{member.role}</p>

              <div className="mt-4 flex justify-center gap-4">
                <a
                  href={`https://github.com/${member.githubUser}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/70 transition hover:text-white"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/70 transition hover:text-white"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
