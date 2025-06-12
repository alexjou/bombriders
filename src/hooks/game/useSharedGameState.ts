import { useState, useEffect } from 'react';
import useGameStore from '@/game/store/gameStore';
import { GAME_CONFIG } from '@/utils/game/grid';

/**
 * Hook que compartilha o estado do jogo entre diferentes componentes
 * como o Canvas 3D e os controles da UI
 */
export function useSharedGameState() {
  const [playerLives, setPlayerLives] = useState<number>(GAME_CONFIG.playerInitialLives);
  const [playerBombRange, setPlayerBombRange] = useState<number>(GAME_CONFIG.initialBombRange);
  const [playerMaxBombs, setPlayerMaxBombs] = useState<number>(GAME_CONFIG.initialMaxBombs);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const { gameState, player } = useGameStore();

  // Sincroniza os estados locais com o estado global
  useEffect(() => {
    if (player) {
      setPlayerLives(player.lives);
      setPlayerBombRange(player.bombRange);
      setPlayerMaxBombs(player.bombs);
    }
  }, [player]);

  // Atualiza o estado de game over
  useEffect(() => {
    setIsGameOver(gameState === 'gameOver');
  }, [gameState]);
  return {
    playerLives,
    playerBombRange,
    playerMaxBombs,
    isGameOver,
    gameState,
    enemies: player?.enemies || 0
  };
}
