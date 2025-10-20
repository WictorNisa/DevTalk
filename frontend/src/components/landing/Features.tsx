import { features } from "@/data/features";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Features() {
  return (
    <section id="features" className="border-b py-32">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Why Choose DevTalk?
          </h2>
          <p className="dark:text-primary/70 mt-3 text-base">
            Join a developer community built for sharing knowledge, learning and
            growth.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="flex h-full flex-col text-left">
              <CardHeader className="space-y-3">
                <div className="text-muted-foreground flex items-center gap-3 text-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span>Feature</span>
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground flex-1 text-sm">
                <p>{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
