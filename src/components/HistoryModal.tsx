'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

type HistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  history: Array<{ result: string; timestamp: string }>;
};

export function HistoryModal({ isOpen, onClose, history }: HistoryModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900/90 p-6 rounded-xl backdrop-blur-sm shadow-xl max-w-md w-full mx-4 max-h-[80vh] relative"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gradient">Histórico Completo</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[60vh] custom-scrollbar pr-2">
            {history.slice().reverse().map((entry, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={index}
                className="text-sm bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700"
              >
                <span className={`font-medium capitalize ${
                  entry.result === 'vitória' ? 'text-blue-400' : 
                  entry.result === 'derrota' ? 'text-red-400' : 
                  'text-yellow-400'
                }`}>{entry.result}</span>
                <span className="mx-2 text-gray-600">•</span>
                <span className="text-gray-400">{entry.timestamp}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
