'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ACHIEVEMENTS, Achievement } from '@/utils/achievements';

interface GameContextType {
  difficulty: number;
  setDifficulty: (value: number) => void;
  unlockedAchievements: Achievement[];
  checkAchievements: (stats: {
    victories: number;
    consecutiveWins: number;
    draws: number;
    score: number;
    difficulty: number;
  }) => void;
  score: number;
  setScore: (value: number) => void;
  lastAchievement: Achievement | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [difficulty, setDifficulty] = useState(1);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [score, setScore] = useState(0);
  const [lastAchievement, setLastAchievement] = useState<Achievement | null>(null);

  const checkAchievements = (stats: {
    victories: number;
    consecutiveWins: number;
    draws: number;
    score: number;
    difficulty: number;
  }) => {
    ACHIEVEMENTS.forEach(achievement => {
      // Verifica se a conquista já foi desbloqueada
      if (unlockedAchievements.find(a => a.id === achievement.id)) {
        return;
      }

      // Verifica se as condições foram atingidas
      let achieved = false;
      switch (achievement.condition.type) {
        case 'victories':
          achieved = stats.victories >= achievement.condition.value;
          break;
        case 'consecutive_wins':
          achieved = stats.consecutiveWins >= achievement.condition.value;
          break;
        case 'draws':
          achieved = stats.draws >= achievement.condition.value;
          break;
        case 'score':
          achieved = stats.score >= achievement.condition.value;
          break;
        case 'difficulty_win':
          achieved = stats.difficulty >= achievement.condition.value;
          break;
      }

      if (achieved) {
        setUnlockedAchievements(prev => [...prev, achievement]);
        setLastAchievement(achievement);
        // Mostra notificação de conquista
        const notification = new Notification('Nova Conquista!', {
          body: `${achievement.icon} ${achievement.title} - ${achievement.description}`,
        });
      }
    });
  };

  // Solicita permissão para notificações
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <GameContext.Provider 
      value={{ 
        difficulty, 
        setDifficulty, 
        unlockedAchievements,
        checkAchievements,
        score,
        setScore,
        lastAchievement
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
