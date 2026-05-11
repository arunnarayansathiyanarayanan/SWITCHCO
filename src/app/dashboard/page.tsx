import Link from "next/link";

import { Button } from "@/components/ui/button";
import { normalizeMilestones } from "@/lib/roadmap-milestones";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type RoadmapRow = {
  title: string;
  mission: string;
  next_action: string;
  milestones?: unknown;
};

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  const { data: roadmapRows } = userId
    ? await supabase
        .from("career_roadmaps")
        .select("title,mission,next_action,milestones")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(1)
    : { data: null as RoadmapRow[] | null };

  const typedRoadmap = (roadmapRows?.[0] ?? null) as RoadmapRow | null;
  const milestones = typedRoadmap ? normalizeMilestones(typedRoadmap.milestones) : [];

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
        <h2 className="text-xl font-medium text-zinc-100">Transformation roadmap</h2>
        {typedRoadmap ? (
          <>
            <p className="mt-2 text-zinc-300">{typedRoadmap.mission}</p>
            <p className="mt-4 text-sm font-medium text-cyan-300">Next: {typedRoadmap.next_action}</p>
            {milestones.length > 0 ? (
              <ul className="mt-6 space-y-3 border-t border-zinc-800 pt-6">
                {milestones.map((m) => (
                  <li key={`${m.week}-${m.title}`} className="flex gap-4 text-sm">
                    <span className="shrink-0 rounded-lg bg-violet-500/20 px-2 py-1 text-xs font-medium text-violet-200">
                      W{m.week}
                    </span>
                    <div>
                      <p className="font-medium text-zinc-100">{m.title}</p>
                      <p className="mt-1 text-zinc-400">{m.outcome}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : (
          <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-400">
            <p>No roadmap saved yet. Complete onboarding to generate one from your profile and goals.</p>
            <Link href="/onboarding" className="mt-3 inline-block text-cyan-400 hover:text-cyan-300">
              Go to onboarding →
            </Link>
          </div>
        )}
      </section>

      <section className="glass rounded-2xl p-6">
        <h3 className="text-lg font-medium text-zinc-100">Capability graph</h3>
        <p className="mt-2 text-sm text-zinc-400">
          No capability graph data in the database yet. This will aggregate signals from completed projects and mentor
          feedback once the graph schema and jobs are implemented.
        </p>
        <p className="mt-4 text-xs text-zinc-500">Until then, only execution metrics above reflect real stored projects.</p>
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

      <div className="flex flex-wrap gap-3">
        <Link href="/onboarding">
          <Button variant="outline">Open onboarding</Button>
        </Link>
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
