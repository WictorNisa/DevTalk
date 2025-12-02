import { motion } from "framer-motion";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { ChevronDown } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { team } from "@/data/team";
import { useTranslation } from "react-i18next";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(3px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function MeetTheTeam() {
  const { t } = useTranslation("landing");

  return (
    <section id="team" className="relative border-b py-24 sm:py-32">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold sm:text-4xl">{t("team.title")}</h2>
        <p className="text-primary/70 mt-3 text-base">
          {t("team.description")}
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {team.map(({ name, role, githubUser, linkedin }) => (
            <motion.div key={githubUser || name} variants={cardVariants}>
              <Card className="bg-muted/50 border-foreground/5 flex h-full flex-col border-2 text-left shadow-md transition-all duration-200">
                <CardContent className="flex flex-1 flex-col rounded-lg px-8 py-7 sm:py-8">
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
                          {t(`team.roles.${role}`)}
                        </p>
                      </div>
                      <div className="text-muted-foreground mt-2 flex gap-4">
                        <a
                          href={`https://github.com/${githubUser}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-foreground transition-colors duration-150 hover:scale-106 hover:animate-pulse"
                        >
                          <GitHubLogoIcon className="h-5 w-5" />
                        </a>
                        <a
                          href={linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-foreground transition-colors duration-150 hover:scale-106 hover:animate-pulse"
                        >
                          <LinkedInLogoIcon className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <ChevronDown
        className="text-foreground/30 absolute bottom-10 left-1/2 h-10 w-10 -translate-x-1/2 animate-bounce cursor-pointer"
        aria-hidden
        onClick={() => {
          const element = document.getElementById("CTA");
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }}
      />
    </section>
  );
}
