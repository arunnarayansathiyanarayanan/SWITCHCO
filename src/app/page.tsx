import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  "Execution-first AI career roadmap",
  "Weekly project and automation builds",
  "Proof-of-work portfolio generation",
  "AI mentor with contextual guidance"
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-20 px-6 py-12">
      <section className="grid gap-10 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-10 md:grid-cols-2">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-violet-500/40 px-3 py-1 text-xs uppercase tracking-wider text-violet-300">
            <Sparkles className="h-4 w-4" /> AI-native career transformation
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-zinc-50 md:text-5xl">
            Become AI-native. <br />
            Learn less. Build more.
          </h1>
          <p className="max-w-lg text-zinc-300">
            AI Career OS transforms ambitious professionals into AI operators through weekly building, real automation delivery, and public proof-of-work.
          </p>
          <div className="flex gap-3">
            <Link href="/auth">
              <Button size="lg">
                Start your AI transformation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                Explore dashboard
              </Button>
            </Link>
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-medium text-zinc-100">Your first 15 minutes</h3>
          <ul className="mt-4 space-y-3 text-sm text-zinc-300">
            <li>1. Generate your personalized AI roadmap</li>
            <li>2. Build your first workflow in Builder Workspace</li>
            <li>3. Publish your first proof-of-work project</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <article key={feature} className="glass rounded-2xl p-5">
            <p className="flex items-center gap-2 text-zinc-100">
              <CheckCircle2 className="h-4 w-4 text-cyan-300" />
              {feature}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
