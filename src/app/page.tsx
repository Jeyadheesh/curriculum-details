import CurriculumFramework from "@/components/CurriculumFramework";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-5xl">
        <CurriculumFramework />
      </div>
    </main>
  );
}
