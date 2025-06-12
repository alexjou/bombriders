import { useEffect } from 'react';
import { GameState } from '@/types/game';
import useGameStore from '@/game/store/gameStore';
import { createInitialGrid, GAME_CONFIG } from '@/utils/game/grid';
import { createGuaranteedEnemies } from '@/utils/game/enemyGenerator';
import { checkLevelCompletion, checkGameOver } from './gameStateHelper';

interface UseGameStateProps {
  playerLives: number;
  isPlayerInvincible: boolean;
  isGameOver: boolean;
  playerBombRange: number;
  playerMaxBombs: number;
  enemies: any[];
  setGameState: (state: GameState) => void;
  setEnemies: (enemies: any[]) => void;
  setGrid: (grid: any) => void;
  setPlayerPosition: (position: [number, number]) => void;
  setBombs: (bombs: any[]) => void;
  setExplosions: (explosions: any[]) => void;
  setPlayerLives: (lives: number) => void;
  setIsPlayerInvincible: (isInvincible: boolean) => void;
  setIsGameOver: (isGameOver: boolean) => void;
  setPlayerBombRange: (range: number) => void;
  setPlayerMaxBombs: (maxBombs: number) => void;
  setPlayerTargetPosition: (position: [number, number, number] | undefined) => void;
  initialEnemies: React.MutableRefObject<any[]>;
  bombsRef: React.MutableRefObject<any[]>;
  chainReactionTimeoutsRef?: React.MutableRefObject<number[]>;
  invincibilityTimerRef: React.MutableRefObject<number | null>;
  recentlyExplodedOrScheduledBombIdsRef?: React.MutableRefObject<Set<string>>;
  isGameOverRef: React.MutableRefObject<boolean>;
}

/**
 * Hook que gerencia o estado geral do jogo e sua sincronização com o gameStore
 */
export function useGameState({
  playerLives,
  isPlayerInvincible,
  isGameOver,
  playerBombRange,
  playerMaxBombs,
  enemies,
  setGameState,
  setEnemies,
  setGrid,
  setPlayerPosition,
  setBombs,
  setExplosions,
  setPlayerLives,
  setIsPlayerInvincible,
  setIsGameOver,
  setPlayerBombRange,
  setPlayerMaxBombs,
  setPlayerTargetPosition,
  initialEnemies,
  bombsRef,
  chainReactionTimeoutsRef,
  invincibilityTimerRef,
  recentlyExplodedOrScheduledBombIdsRef,
  isGameOverRef
}: UseGameStateProps) {
  // Acessa as funções do gameStore
  const gameStore = useGameStore();
  const { gameState } = gameStore;  // Sincroniza o estado do jogador com o gameStore
  useEffect(() => {
    // Atualizando os dados do jogador no store global
    const player = useGameStore.getState().player;

    useGameStore.setState({
      player: {
        ...player,
        lives: playerLives,
        bombRange: playerBombRange,
        bombs: playerMaxBombs,
        isInvincible: isPlayerInvincible
      }
    });

    // Usa as funções auxiliares para verificar conclusão do nível e game over
    checkLevelCompletion(enemies, isGameOver, gameState, setGameState);
    checkGameOver(isGameOver, gameState, setGameState);
  }, [
    playerLives,
    isPlayerInvincible,
    isGameOver,
    playerBombRange,
    playerMaxBombs,
    enemies,
    setGameState
  ]);  // Efeito específico para verificar se não restam inimigos (verificação adicional)
  useEffect(() => {
    // Este efeito é separado para garantir que a verificação de vitória aconteça quando o número de inimigos muda
    if (enemies.length === 0 && !isGameOver && gameState === 'playing') {
      // Adiciona um pequeno delay para garantir a consistência do estado
      setTimeout(() => {
        // Verifica novamente para garantir que o estado ainda é válido
        if (enemies.length === 0 && !isGameOverRef.current && gameState === 'playing') {
          setGameState('levelComplete');

          // Também atualiza o estado global no store
          useGameStore.setState({ gameState: 'levelComplete' });
        }
      }, 250); // Aumentamos o tempo para dar mais margem
    }
  }, [enemies.length, isGameOver, isGameOverRef, gameState, setGameState]);  // Efeito que monitora mudanças no estado do jogo global
  useEffect(() => {
    // Quando o gameState muda para 'menu', reiniciar o jogo
    if (gameState === 'menu') {

      // Criar novos inimigos
      const newEnemies = createGuaranteedEnemies();
      initialEnemies.current = newEnemies;
      setEnemies(newEnemies);

      // Recriar grid
      const newGrid = createInitialGrid(newEnemies);
      setGrid(newGrid);

      // Resetar posição do jogador
      setPlayerPosition([GAME_CONFIG.playerStartCol, GAME_CONFIG.playerStartRow]);
      setPlayerTargetPosition(undefined);

      // Resetar bombas
      setBombs([]);
      bombsRef.current = [];

      // Resetar explosões
      setExplosions([]);

      // Resetar vida do jogador
      setPlayerLives(GAME_CONFIG.playerInitialLives);
      setIsPlayerInvincible(false);

      // Resetar bombas e alcance
      setPlayerBombRange(GAME_CONFIG.initialBombRange);
      setPlayerMaxBombs(GAME_CONFIG.initialMaxBombs);

      // Resetar estado de jogo
      setIsGameOver(false);
      isGameOverRef.current = false;

      // Limpar todos os timeouts pendentes
      if (chainReactionTimeoutsRef) {
        chainReactionTimeoutsRef.current.forEach(clearTimeout);
        chainReactionTimeoutsRef.current = [];
      }

      if (invincibilityTimerRef.current) {
        clearTimeout(invincibilityTimerRef.current);
        invincibilityTimerRef.current = null;
      }

      // Limpar set de bombas
      if (recentlyExplodedOrScheduledBombIdsRef) {
        recentlyExplodedOrScheduledBombIdsRef.current.clear();
      }
    }
  }, [
    gameState,
    initialEnemies,
    setEnemies,
    setGrid,
    setPlayerPosition,
    setPlayerTargetPosition,
    setBombs,
    bombsRef,
    setExplosions,
    setPlayerLives,
    setIsPlayerInvincible,
    setPlayerBombRange,
    setPlayerMaxBombs,
    setIsGameOver,
    isGameOverRef,
    chainReactionTimeoutsRef,
    invincibilityTimerRef,
    recentlyExplodedOrScheduledBombIdsRef
  ]);

  return {
    gameState
  };
}
