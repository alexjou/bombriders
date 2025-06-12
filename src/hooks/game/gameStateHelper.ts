import { GameState } from '@/types/game';
import useGameStore from '@/game/store/gameStore';

/**
 * Verifica se o nível foi concluído (todos os inimigos eliminados)
 * @param enemies Lista atual de inimigos
 * @param isGameOver Flag indicando se o jogo acabou
 * @param gameState Estado atual do jogo
 * @param setGameState Função para alterar o estado do jogo
 */
export function checkLevelCompletion(
  enemies: any[],
  isGameOver: boolean,
  gameState: GameState,
  setGameState: (state: GameState) => void
): void {
  // Transição para levelComplete se todos os inimigos foram eliminados
  if (enemies.length === 0 && !isGameOver && gameState === 'playing') {
    // Adiciona um pequeno delay para garantir que todas as atualizações de estado sejam processadas
    setTimeout(() => {
      setGameState('levelComplete');

      // Também atualiza o estado global no store
      useGameStore.setState({ gameState: 'levelComplete' });
    }, 150);
  }
}

/**
 * Atualiza o estado do jogo quando o jogador morre
 * @param isGameOver Flag indicando se o jogo acabou
 * @param gameState Estado atual do jogo
 * @param setGameState Função para alterar o estado do jogo
 */
export function checkGameOver(
  isGameOver: boolean,
  gameState: GameState,
  setGameState: (state: GameState) => void
): void {
  // Se o jogo acabar, atualize o estado do jogo
  if (isGameOver && gameState !== 'gameOver') {
    setGameState('gameOver');

    // Também atualiza o estado global no store
    useGameStore.setState({ gameState: 'gameOver' });
  }
}
