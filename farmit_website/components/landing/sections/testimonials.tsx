const testimonials = [
  {
    quote:
      "I sent a photo of my maize leaves and got clear advice the same afternoon. Before FarmIT AI I would wait days for someone to visit.",
    name: "Tendai Moyo",
    place: "Mazowe District",
    role: "Smallholder farmer",
    initials: "TM",
  },
  {
    quote:
      "WhatsApp is already on my phone. FarmIT AI felt easy — no new app, no confusing screens. Just a chat that helps protect my crop.",
    name: "Chiedza Ncube",
    place: "Gweru Rural",
    role: "Maize grower",
    initials: "CN",
  },
  {
    quote:
      "The guidance listed both chemical and organic options. That mattered for my budget, and I acted before the spots spread further.",
    name: "Blessing Dube",
    place: "Mutare District",
    role: "Family farm",
    initials: "BD",
  },
  {
    quote:
      "I used to guess what was wrong with my plants. Now I send a picture and know what to do next.",
    name: "Rudo Chikafu",
    place: "Bindura",
    role: "Market gardener",
    initials: "RC",
  },
  {
    quote:
      "FarmIT AI replied while I was still in the field. That speed saved me from treating the wrong problem.",
    name: "Farai Sibanda",
    place: "Bulawayo Rural",
    role: "Maize grower",
    initials: "FS",
  },
  {
    quote:
      "My mother and I both use it. The advice is plain and practical — not full of complicated words.",
    name: "Nyasha Mhlanga",
    place: "Chinhoyi",
    role: "Family farm",
    initials: "NM",
  },
  {
    quote:
      "Extension officers are far from us. FarmIT AI fills that gap when we need help the same day.",
    name: "Tafadzwa Gumbo",
    place: "Murehwa",
    role: "Smallholder farmer",
    initials: "TG",
  },
  {
    quote:
      "I liked that it gave organic options too. Not everyone can buy expensive chemicals right away.",
    name: "Patience Mlambo",
    place: "Masvingo",
    role: "Vegetable farmer",
    initials: "PM",
  },
  {
    quote:
      "Simple. Fast. On WhatsApp. That is exactly what farmers around here need.",
    name: "Kudzai Mutasa",
    place: "Marondera",
    role: "Youth farmer",
    initials: "KM",
  },
];

const columns = [
  testimonials.filter((_, i) => i % 3 === 0),
  testimonials.filter((_, i) => i % 3 === 1),
  testimonials.filter((_, i) => i % 3 === 2),
];

function TestimonialCard({
  quote,
  name,
  place,
  role,
  initials,
}: (typeof testimonials)[number]) {
  return (
    <article className="rounded-xl border border-border bg-white p-4 sm:p-5">
      <p className="text-sm leading-relaxed text-ink/80">“{quote}”</p>
      <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-lime text-[11px] font-bold text-ink">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {role} · {place}
          </p>
        </div>
      </div>
    </article>
  );
}

function MarqueeColumn({
  items,
  direction,
  duration,
}: {
  items: typeof testimonials;
  direction: "up" | "down";
  duration: string;
}) {
  const loop = [...items, ...items];

  return (
    <div className="relative h-[26rem] overflow-hidden lg:h-[32rem] xl:h-[36rem]">
      <div
        className={`flex flex-col gap-3 ${
          direction === "up" ? "animate-marquee-up" : "animate-marquee-down"
        }`}
        style={{ animationDuration: duration }}
      >
        {loop.map((item, index) => (
          <TestimonialCard key={`${item.name}-${index}`} {...item} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="overflow-hidden bg-soft py-16 sm:py-20 lg:py-24">
      <div className="page-container">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
              Farmer stories
            </p>
            <h2 className="section-heading mt-3 text-ink">
              Trusted in the field.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Feedback from farmers using FarmIT AI on WhatsApp across Zimbabwe.
          </p>
        </div>

        <div className="relative mt-10 sm:mt-12">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-soft to-transparent lg:h-16" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-soft to-transparent lg:h-16" />

          <div className="lg:hidden">
            <MarqueeColumn
              items={testimonials}
              direction="up"
              duration="48s"
            />
          </div>

          <div className="hidden gap-3 lg:grid lg:grid-cols-3">
            <MarqueeColumn items={columns[0]} direction="up" duration="32s" />
            <MarqueeColumn items={columns[1]} direction="down" duration="38s" />
            <MarqueeColumn items={columns[2]} direction="up" duration="35s" />
          </div>
        </div>
      </div>
    </section>
  );
}
