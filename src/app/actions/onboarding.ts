"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { generateRoadmap } from "@/lib/ai/roadmap";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { OnboardingProfile } from "@/types/domain";

export async function saveOnboardingAndGenerateRoadmap(formData: FormData) {
  const payload: OnboardingProfile = {
    currentRole: String(formData.get("currentRole")) as OnboardingProfile["currentRole"],
    desiredRole: String(formData.get("desiredRole")) as OnboardingProfile["desiredRole"],
    aiFamiliarity: String(formData.get("aiFamiliarity")) as OnboardingProfile["aiFamiliarity"],
    weeklyTimeHours: Number(formData.get("weeklyTimeHours") ?? 4),
    interests: String(formData.get("interests") ?? "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
    goals: String(formData.get("goals") ?? "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
  };

  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/auth");

  const roadmap = await generateRoadmap(payload);

  await supabase.from("onboarding_profiles").upsert({
    user_id: userData.user.id,
    current_role: payload.currentRole,
    desired_role: payload.desiredRole,
    ai_familiarity: payload.aiFamiliarity,
    weekly_time_hours: payload.weeklyTimeHours,
    interests: payload.interests,
    goals: payload.goals
  });

  await supabase.from("career_roadmaps").upsert({
    user_id: userData.user.id,
    title: roadmap.title,
    mission: roadmap.mission,
    milestones: roadmap.milestones,
    next_action: roadmap.nextAction
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
