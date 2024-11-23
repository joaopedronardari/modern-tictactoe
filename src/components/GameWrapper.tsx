'use client';

import { GameProvider } from '@/contexts/GameContext';
import { Game } from './Game';
import { Header } from "./Header";
import { AchievementNotification } from "./AchievementNotification";
import { useGame } from "@/contexts/GameContext";

export function GameWrapper() {
  const { lastAchievement } = useGame();

  return (
    <GameProvider>
      <Header />
      <AchievementNotification achievement={lastAchievement} />
      <div className="mt-32 w-full max-w-5xl">
        <Game />
      </div>
    </GameProvider>
  );
}
