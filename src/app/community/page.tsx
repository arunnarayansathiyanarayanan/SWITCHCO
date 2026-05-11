const feed = [
  { name: "Aditi", role: "AI Marketing Builder", project: "Built ad-copy experimentation copilot", likes: 124 },
  { name: "Rahul", role: "AI Ops Operator", project: "Automated weekly KPI report pipeline", likes: 98 }
];

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-10">
      <h1 className="text-3xl font-semibold text-zinc-50">Community & Reputation</h1>
      <p className="text-zinc-300">Publish proof-of-work, get reviewed, and build your AI-native public identity.</p>
      <div className="space-y-4">
        {feed.map((post) => (
          <article key={post.project} className="glass rounded-2xl p-5">
            <p className="text-sm text-zinc-400">
              {post.name} · {post.role}
            </p>
            <p className="mt-2 text-zinc-100">{post.project}</p>
            <p className="mt-3 text-sm text-cyan-300">{post.likes} reputation points</p>
          </article>
        ))}
      </div>
    </div>
  );
}
