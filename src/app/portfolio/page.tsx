const items = [
  "AI recruiter assistant with resume scoring pipeline",
  "AI PM workflow that generates PRDs and sprint breakdowns",
  "AI support triage automation with response recommendations"
];

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-10">
      <h1 className="text-3xl font-semibold text-zinc-50">Portfolio Engine</h1>
      <p className="text-zinc-300">Auto-generate case studies, resume bullets, and shareable proof-of-work pages from your projects.</p>
      <section className="space-y-3">
        {items.map((item) => (
          <article key={item} className="glass rounded-xl p-4 text-zinc-200">
            {item}
          </article>
        ))}
      </section>
    </div>
  );
}
