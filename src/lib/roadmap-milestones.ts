export type RoadmapMilestone = { week: number; title: string; outcome: string };

export function normalizeMilestones(raw: unknown): RoadmapMilestone[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      const week = Number(o.week);
      const title = typeof o.title === "string" ? o.title : "";
      const outcome = typeof o.outcome === "string" ? o.outcome : "";
      if (!title) return null;
      return { week: Number.isFinite(week) ? week : 0, title, outcome };
    })
    .filter((x): x is RoadmapMilestone => x !== null);
}
