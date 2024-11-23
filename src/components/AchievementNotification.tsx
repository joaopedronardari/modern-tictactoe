'use client';

import { Achievement } from '@/utils/achievements';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AchievementNotificationProps {
  achievement: Achievement | null;
}

export function AchievementNotification({ achievement }: AchievementNotificationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (achievement) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  return (
    <AnimatePresence>
      {show && achievement && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.3 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          }}
          exit={{ 
            opacity: 0,
            y: -20,
            scale: 0.5,
            transition: { duration: 0.2 }
          }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[200]"
        >
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 flex items-center gap-4 min-w-[300px]">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                rotate: [0, -10, 10, 0]
              }}
              transition={{ 
                duration: 0.5,
                times: [0, 0.5, 0.8, 1]
              }}
              className="text-4xl"
            >
              {achievement.icon}
            </motion.div>
            <div className="flex-1">
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-bold text-gradient mb-1">
                  Nova Conquista!
                </h3>
                <h4 className="font-semibold text-white mb-1">
                  {achievement.title}
                </h4>
                <p className="text-sm text-gray-400">
                  {achievement.description}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
