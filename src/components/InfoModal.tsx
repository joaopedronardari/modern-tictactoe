'use client';

import { useState } from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gradient">Sobre o Jogo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-gray-300">
          <section>
            <h3 className="font-bold mb-2">Regras do Jogo</h3>
            <p>
              O Jogo da Velha é jogado em um tabuleiro 3x3. Você joga com &quot;X&quot; contra a IA que usa &quot;O&quot;.
              O objetivo é formar uma linha horizontal, vertical ou diagonal com seus símbolos.
            </p>
          </section>

          <section>
            <h3 className="font-bold mb-2">Sistema de Pontuação</h3>
            <ul className="space-y-2">
              <li className="text-green-400">Vitória: +50 pontos</li>
              <li className="text-yellow-400">Empate: +10 pontos</li>
              <li className="text-red-400">Derrota: -10 pontos</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold mb-2">Níveis de Dificuldade</h3>
            <p>
              O jogo possui 5 níveis de dificuldade. A cada 2 vitórias consecutivas,
              o nível aumenta automaticamente, tornando a IA mais desafiadora.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
