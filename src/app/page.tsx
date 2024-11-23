import { GameWrapper } from "@/components/GameWrapper";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="w-full flex justify-center">
        <GameWrapper />
      </div>
    </main>
  );
}
