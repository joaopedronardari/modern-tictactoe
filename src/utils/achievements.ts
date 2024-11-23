export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  condition: {
    type: 'victories' | 'consecutive_wins' | 'draws' | 'score' | 'difficulty_win';
    value: number;
  };
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    title: 'Primeiro Passo',
    description: 'Vença sua primeira partida',
    icon: '🎯',
    condition: { type: 'victories', value: 1 }
  },
  {
    id: 2,
    title: 'Invicto',
    description: 'Vença 3 partidas consecutivas',
    icon: '🏆',
    condition: { type: 'consecutive_wins', value: 3 }
  },
  {
    id: 3,
    title: 'Estrategista',
    description: 'Alcance 100 pontos',
    icon: '🧠',
    condition: { type: 'score', value: 100 }
  },
  {
    id: 4,
    title: 'Mestre do Empate',
    description: 'Consiga 5 empates',
    icon: '🤝',
    condition: { type: 'draws', value: 5 }
  },
  {
    id: 5,
    title: 'Desafiador',
    description: 'Vença uma partida no nível Difícil',
    icon: '⚔️',
    condition: { type: 'difficulty_win', value: 4 }
  },
  {
    id: 6,
    title: 'Lendário',
    description: 'Vença uma partida no nível Impossível',
    icon: '👑',
    condition: { type: 'difficulty_win', value: 5 }
  },
  {
    id: 7,
    title: 'Veterano',
    description: 'Vença 10 partidas no total',
    icon: '🎮',
    condition: { type: 'victories', value: 10 }
  },
  {
    id: 8,
    title: 'Imparável',
    description: 'Vença 5 partidas consecutivas',
    icon: '🔥',
    condition: { type: 'consecutive_wins', value: 5 }
  },
  {
    id: 9,
    title: 'Centurião',
    description: 'Alcance 500 pontos',
    icon: '💯',
    condition: { type: 'score', value: 500 }
  },
  {
    id: 10,
    title: 'Imortal',
    description: 'Vença 3 partidas seguidas no nível Impossível',
    icon: '⭐',
    condition: { type: 'consecutive_wins', value: 3 }
  }
];
