'use client';

import { useGame } from "@/contexts/GameContext";
import { ACHIEVEMENTS } from "@/utils/achievements";
import { motion, AnimatePresence } from "framer-motion";

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementsModal({ isOpen, onClose }: AchievementsModalProps) {
  const { unlockedAchievements } = useGame();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl border border-gray-700 mt-16"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gradient">Conquistas</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="grid gap-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2 custom-scrollbar">
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = unlockedAchievements.some(
                (a) => a.id === achievement.id
              );

              return (
                <motion.div
                  key={achievement.id}
                  initial={false}
                  animate={{
                    opacity: isUnlocked ? 1 : 0.5,
                    scale: isUnlocked ? 1 : 0.98,
                  }}
                  whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
                  className={`
                    relative p-4 rounded-lg border
                    ${
                      isUnlocked
                        ? "bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 hover:border-gray-500"
                        : "bg-gray-800/50 border-gray-700"
                    }
                    transition-all duration-200
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-1">
                        {achievement.title}
                        {isUnlocked && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="inline-block ml-2 text-green-400"
                          >
                            ✓
                          </motion.span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
