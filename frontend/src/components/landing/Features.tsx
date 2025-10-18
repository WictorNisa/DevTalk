import { features } from "@/data/features";

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Why Choose DevTalk?</h2>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card rounded-3xl border p-6">
              <Icon className="mx-auto mb-4 h-6 w-6" />
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-5">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
