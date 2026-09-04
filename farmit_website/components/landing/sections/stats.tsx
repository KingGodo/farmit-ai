import { ArrowUpRight, Leaf, MessageCircle, Sprout, Users } from "lucide-react";

const pillars = [
  {
    icon: MessageCircle,
    title: "WhatsApp crop advice",
    detail:
      "Registration, image intake, and AI replies run in the chat farmers already use.",
  },
  {
    icon: Leaf,
    title: "Maize disease focus",
    detail:
      "Detects blight, gray leaf spot, and rust — and confirms when a crop looks healthy.",
  },
  {
    icon: Sprout,
    title: "Chemical + organic options",
    detail:
      "Practical next steps farmers can act on, with alternatives that fit different budgets.",
  },
  {
    icon: Users,
    title: "Insight for partners",
    detail:
      "Anonymised crop-health trends can support early outbreak awareness across districts.",
  },
];

const diseases = ["Blight", "Gray leaf spot", "Rust", "Healthy check"];

export default function Stats() {
  return (
    <section id="impact" className="bg-soft py-20 sm:py-24">
      <div className="page-container">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-end lg:gap-14">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
              Impact
            </p>
            <h2 className="section-heading mt-3 text-ink">
              Built to protect harvests.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            FarmIT AI helps Zimbabwean farmers cut crop losses with faster
            advice — before disease spreads.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl bg-forest text-white">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="border-b border-white/10 p-8 sm:p-10 lg:border-b-0 lg:border-r">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-lime">
                What changes in the field
              </p>
              <p className="mt-3 max-w-lg text-lg font-bold tracking-tight sm:text-xl lg:text-[1.5rem] lg:leading-[1.25]">
                Same-day crop advice on the phone farmers already carry.
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
                When extension visits are days away, a leaf photo on WhatsApp can
                mean treating the right problem before the season is lost.
              </p>
            </div>
            <div className="flex flex-col justify-between gap-8 p-8 sm:p-10">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
                  Detects today
                </p>
                <ul className="mt-4 space-y-3">
                  {diseases.map((name) => (
                    <li
                      key={name}
                      className="flex items-center justify-between border-b border-white/10 pb-3 text-sm last:border-b-0 last:pb-0"
                    >
                      <span className="font-medium text-white/90">{name}</span>
                      <span className="font-mono text-[11px] tabular-nums text-lime">
                        AI
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-sm font-semibold text-lime transition-[gap] duration-150 ease-[var(--ease-craft)] hover:gap-3"
              >
                See how it works
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {pillars.map((item, i) => {
            const Icon = item.icon;
            const accent = i === 1;

            return (
              <article
                key={item.title}
                className={`flex flex-col justify-between rounded-2xl p-6 sm:p-7 ${
                  accent ? "bg-lime" : "bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      accent ? "bg-ink text-white" : "bg-soft text-ink"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span
                    className={`font-mono text-xs font-medium tabular-nums ${
                      accent ? "text-ink/45" : "text-faint"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-10">
                  <h3 className="text-lg font-bold tracking-tight text-ink sm:text-xl">
                    {item.title}
                  </h3>
                  <p
                    className={`mt-2 text-sm leading-relaxed ${
                      accent ? "text-ink/70" : "text-muted-foreground"
                    }`}
                  >
                    {item.detail}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
