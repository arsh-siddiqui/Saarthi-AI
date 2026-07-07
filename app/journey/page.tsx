import JourneyPlanner from "@/components/journey/JourneyPlanner";

export const metadata = {
  title: "AI Citizen Journey | Saarthi AI",
  description: "Generate personalized step-by-step roadmaps for your civic needs.",
};

export default function JourneyPage() {
  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-12">
      <div className="mx-auto max-w-[1600px]">
        <JourneyPlanner />
      </div>
    </main>
  );
}
