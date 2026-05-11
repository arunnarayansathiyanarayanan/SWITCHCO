import { saveOnboardingAndGenerateRoadmap } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-12">
      <h1 className="text-3xl font-semibold text-zinc-50">Build your transformation plan</h1>
      <p className="text-zinc-300">Answer quickly. We use this to generate your personalized AI-native roadmap and first project sprint.</p>

      <form action={saveOnboardingAndGenerateRoadmap} className="glass space-y-5 rounded-2xl p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="text-zinc-300">Current role</span>
            <select name="currentRole" className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2">
              <option value="product_manager">Product Manager</option>
              <option value="marketer">Marketer</option>
              <option value="recruiter">Recruiter</option>
              <option value="operations">Operations</option>
              <option value="analyst">Analyst</option>
            </select>
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-zinc-300">Desired AI path</span>
            <select name="desiredRole" className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2">
              <option value="ai_generalist">AI Generalist</option>
              <option value="ai_automation_specialist">AI Automation Specialist</option>
              <option value="ai_product_operator">AI Product Operator</option>
              <option value="ai_marketing_builder">AI Marketing Builder</option>
            </select>
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input name="aiFamiliarity" placeholder="beginner / intermediate / advanced" className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm" />
          <input name="weeklyTimeHours" type="number" min={1} max={30} defaultValue={6} className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm" />
        </div>
        <input name="interests" placeholder="Interests (comma separated)" className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm" />
        <input name="goals" placeholder="Career goals (comma separated)" className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm" />
        <Button className="w-full">Generate my AI roadmap</Button>
      </form>
    </div>
  );
}
