'use client';

import { GameProvider } from '@/contexts/GameContext';
import { Game } from './Game';
import { Header } from "./Header";
import { AchievementNotification } from "./AchievementNotification";
import { useGame } from "@/contexts/GameContext";

export function GameWrapper() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

function GameContent() {
  const { lastAchievement } = useGame();
  
  return (
    <>
      <Header />
      <AchievementNotification achievement={lastAchievement} />
      <div className="mt-32 w-full max-w-5xl">
        <Game />
      </div>
    </>
  );
}
