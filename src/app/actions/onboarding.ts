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
  if (!userData.user) {
    redirect("/auth");
  }

  let roadmap;
  try {
    roadmap = await generateRoadmap(payload);
  } catch (err) {
    redirect(`/onboarding?error=${encodeURIComponent(err instanceof Error ? err.message : "Roadmap generation failed.")}`);
  }

  const userId = userData.user.id;

  const { error: profileError } = await supabase.from("onboarding_profiles").upsert({
    user_id: userId,
    current_role: payload.currentRole,
    desired_role: payload.desiredRole,
    ai_familiarity: payload.aiFamiliarity,
    weekly_time_hours: payload.weeklyTimeHours,
    interests: payload.interests,
    goals: payload.goals
  });
  if (profileError) {
    redirect(`/onboarding?error=${encodeURIComponent(profileError.message)}`);
  }

  const { data: existingRoadmap } = await supabase
    .from("career_roadmaps")
    .select("id")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const roadmapPayload = {
    title: roadmap.title,
    mission: roadmap.mission,
    milestones: roadmap.milestones,
    next_action: roadmap.nextAction,
    updated_at: new Date().toISOString()
  };

  if (existingRoadmap?.id) {
    const { error: roadmapError } = await supabase.from("career_roadmaps").update(roadmapPayload).eq("id", existingRoadmap.id);
    if (roadmapError) {
      redirect(`/onboarding?error=${encodeURIComponent(roadmapError.message)}`);
    }
  } else {
    const { error: roadmapError } = await supabase.from("career_roadmaps").insert({
      user_id: userId,
      ...roadmapPayload
    });
    if (roadmapError) {
      redirect(`/onboarding?error=${encodeURIComponent(roadmapError.message)}`);
    }
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
