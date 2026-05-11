export type UserRole =
  | "product_manager"
  | "marketer"
  | "recruiter"
  | "operations"
  | "support_engineer"
  | "analyst"
  | "freelancer"
  | "creator"
  | "student";

export type CareerPath =
  | "ai_product_operator"
  | "ai_automation_specialist"
  | "ai_marketing_builder"
  | "ai_recruiting_operator"
  | "ai_growth_analyst"
  | "ai_generalist";

export interface OnboardingProfile {
  currentRole: UserRole;
  desiredRole: CareerPath;
  aiFamiliarity: "beginner" | "intermediate" | "advanced";
  weeklyTimeHours: number;
  interests: string[];
  goals: string[];
}

export interface TransformationRoadmap {
  title: string;
  mission: string;
  milestones: Array<{
    title: string;
    week: number;
    outcome: string;
  }>;
  nextAction: string;
}
