type Board = (string | null)[];

interface MinimaxResult {
  score: number;
  index?: number;
}

export const calculateWinner = (squares: Board): string | null => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const getAvailableMoves = (board: Board): number[] => {
  return board.reduce<number[]>((moves, cell, index) => {
    if (cell === null) moves.push(index);
    return moves;
  }, []);
};

export const minimax = (
  board: Board,
  player: string,
  depth: number = 0,
  maxDepth: number = -1,
  alpha: number = -Infinity,
  beta: number = Infinity
): MinimaxResult => {
  const availableMoves = getAvailableMoves(board);
  const winner = calculateWinner(board);

  // Base cases
  if (winner === 'O') return { score: 10 - depth };
  if (winner === 'X') return { score: depth - 10 };
  if (availableMoves.length === 0) return { score: 0 };
  if (maxDepth !== -1 && depth >= maxDepth) {
    return { score: evaluatePosition(board) };
  }

  if (player === 'O') {
    let bestScore = -Infinity;
    let bestMove;

    for (const move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = player;
      const result = minimax(newBoard, 'X', depth + 1, maxDepth, alpha, beta);
      
      if (result.score > bestScore) {
        bestScore = result.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break;
    }

    return { score: bestScore, index: bestMove };
  } else {
    let bestScore = Infinity;
    let bestMove;

    for (const move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = player;
      const result = minimax(newBoard, 'O', depth + 1, maxDepth, alpha, beta);
      
      if (result.score < bestScore) {
        bestScore = result.score;
        bestMove = move;
      }
      beta = Math.min(beta, bestScore);
      if (beta <= alpha) break;
    }

    return { score: bestScore, index: bestMove };
  }
};

// Evaluate the current position for non-terminal states
const evaluatePosition = (board: Board): number => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let score = 0;

  // Evaluate each line
  for (const [a, b, c] of lines) {
    const lineState = [board[a], board[b], board[c]];
    const oCount = lineState.filter(cell => cell === 'O').length;
    const xCount = lineState.filter(cell => cell === 'X').length;
    const nullCount = lineState.filter(cell => cell === null).length;

    // Score based on potential winning lines
    if (oCount === 2 && nullCount === 1) score += 3;
    else if (xCount === 2 && nullCount === 1) score -= 3;
    else if (oCount === 1 && nullCount === 2) score += 1;
    else if (xCount === 1 && nullCount === 2) score -= 1;
  }

  // Extra points for center control
  if (board[4] === 'O') score += 2;
  else if (board[4] === 'X') score -= 2;

  return score;
};

export const getDifficultyDepth = (level: number): number => {
  switch (level) {
    case 1: // Fácil
      return 1;
    case 2: // Médio
      return 2;
    case 3: // Difícil
      return 3;
    case 4: // Muito Difícil
      return 4;
    case 5: // Impossível
      return -1; // Sem limite de profundidade
    default:
      return 1;
  }
};

export const getDifficultyName = (level: number): string => {
  switch (level) {
    case 1:
      return "Fácil";
    case 2:
      return "Médio";
    case 3:
      return "Difícil";
    case 4:
      return "Muito Difícil";
    case 5:
      return "Impossível";
    default:
      return "Fácil";
  }
};
