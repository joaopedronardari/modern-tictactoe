'use client';

import { InfoModal } from './InfoModal';
import { AchievementsModal } from './AchievementsModal';
import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { ACHIEVEMENTS } from '@/utils/achievements';
import { TbTicTac } from 'react-icons/tb';

const difficultyNames = ['Fácil', 'Iniciante', 'Intermediário', 'Difícil', 'Impossível'];

export function Header() {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const { difficulty, unlockedAchievements, score } = useGame();

  return (
    <>
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
      <AchievementsModal isOpen={isAchievementsModalOpen} onClose={() => setIsAchievementsModalOpen(false)} />
      <div className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm p-3 z-50">
        <div className="max-w-5xl mx-auto flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TbTicTac className="w-8 h-8 text-gradient animate-pulse" />
              <h1 className="text-2xl font-bold text-gradient">Jogo da Velha</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Pontuação:</span>
              <span className="text-xl font-bold text-gradient">{score}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-400">
            <div className="flex items-center gap-4">
              <span>Nível {difficulty} - {difficultyNames[difficulty - 1]}</span>
              <button
                onClick={() => setIsAchievementsModalOpen(true)}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-200 border border-gray-700 hover:border-gray-600 hover:scale-105"
              >
                <span>Conquistas: {unlockedAchievements.length}/{ACHIEVEMENTS.length}</span>
                {unlockedAchievements.length > 0 && (
                  <span className="text-lg transform group-hover:scale-110 transition-transform duration-200">
                    {unlockedAchievements[unlockedAchievements.length - 1].icon}
                  </span>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer" onClick={() => setIsInfoModalOpen(true)}>
              <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center">
                ?
              </div>
              <span>Sobre o jogo</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
