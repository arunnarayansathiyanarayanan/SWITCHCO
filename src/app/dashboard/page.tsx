import Link from "next/link";

import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: roadmap } = await supabase.from("career_roadmaps").select("*").maybeSingle();
  const { data: projects } = await supabase
    .from("projects")
    .select("id,status,progress_percent,is_public")
    .order("updated_at", { ascending: false });

  const totalProjects = projects?.length ?? 0;
  const completedProjects = projects?.filter((project) => project.status === "completed").length ?? 0;
  const publicProjects = projects?.filter((project) => project.is_public).length ?? 0;
  const avgProgress = totalProjects
    ? Math.round((projects?.reduce((sum, project) => sum + (project.progress_percent ?? 0), 0) ?? 0) / totalProjects)
    : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold text-zinc-50">Transformation Dashboard</h1>
        <span className="rounded-full border border-cyan-500/40 px-3 py-1 text-xs text-cyan-300">{userData.user?.email}</span>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="glass rounded-2xl p-5">
          <p className="text-sm text-zinc-400">Average Progress</p>
          <p className="mt-3 text-2xl font-semibold">{avgProgress}%</p>
          <div className="mt-3 h-2 rounded-full bg-zinc-800">
            <div className="h-2 rounded-full bg-cyan-400" style={{ width: `${avgProgress}%` }} />
          </div>
        </article>
        <article className="glass rounded-2xl p-5">
          <p className="text-sm text-zinc-400">Projects Built</p>
          <p className="mt-3 text-2xl font-semibold">{totalProjects}</p>
          <p className="mt-2 text-xs text-zinc-400">{completedProjects} completed</p>
        </article>
        <article className="glass rounded-2xl p-5">
          <p className="text-sm text-zinc-400">Public Proof-of-Work</p>
          <p className="mt-3 text-2xl font-semibold">{publicProjects}</p>
          <p className="mt-2 text-xs text-zinc-400">Shareable portfolio artifacts</p>
        </article>
      </section>

      <section className="glass rounded-2xl p-6">
        <h2 className="text-xl font-medium text-zinc-100">{roadmap?.title ?? "Your roadmap will appear after onboarding"}</h2>
        <p className="mt-2 text-zinc-300">{roadmap?.mission ?? "Complete onboarding to generate transformation milestones."}</p>
        <p className="mt-4 text-sm text-cyan-300">{roadmap?.next_action ?? "Next: Generate roadmap and build first automation."}</p>
      </section>

      <section className="glass rounded-2xl p-6">
        <h3 className="text-lg font-medium text-zinc-100">Execution Snapshot</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {["draft", "active", "completed"].map((status) => {
            const count = projects?.filter((project) => project.status === status).length ?? 0;
            const percentage = totalProjects === 0 ? 0 : Math.round((count / totalProjects) * 100);
            return (
              <article key={status} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-400">{status}</p>
                <p className="mt-2 text-2xl font-semibold">{count}</p>
                <p className="text-sm text-zinc-400">{percentage}% of projects</p>
              </article>
            );
          })}
        </div>
      </section>

      <div className="flex gap-3">
        <Link href="/workspace">
          <Button>Open Builder Workspace</Button>
        </Link>
        <Link href="/portfolio">
          <Button variant="outline">View Portfolio Engine</Button>
        </Link>
      </div>
    </div>
  );
}
