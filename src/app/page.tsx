'use client';

import { useState } from 'react';
import { Game } from '@/components/Game';
import { OnlineGame } from '@/components/OnlineGame';
import { GameProvider } from '@/contexts/GameContext';
import { Header } from '@/components/Header';

export default function Home() {
  const [gameMode, setGameMode] = useState<'ai' | 'online' | null>(null);

  return (
    <GameProvider>
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Header />
        {!gameMode ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] gap-4">
            <button
              onClick={() => setGameMode('ai')}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg text-xl hover:bg-blue-700 transition-colors"
            >
              Play vs AI
            </button>
            <button
              onClick={() => setGameMode('online')}
              className="px-8 py-4 bg-green-600 text-white rounded-lg text-xl hover:bg-green-700 transition-colors"
            >
              Play Online
            </button>
          </div>
        ) : (
          gameMode === 'ai' ? <Game /> : <OnlineGame />
        )}
      </main>
    </GameProvider>
  );
}
