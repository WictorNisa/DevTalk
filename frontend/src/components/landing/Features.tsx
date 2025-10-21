import { features } from "@/data/features";

export default function Features() {
  return (
    <section id="features" className="bg-[var(--background)] py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Why Choose DevTalk?</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <Icon className="mb-3 h-6 w-6" />
              <h3 className="font-semibold">{title}</h3>
              <p className="text-white/70">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
