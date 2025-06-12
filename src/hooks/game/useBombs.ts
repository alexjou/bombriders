import { useCallback } from 'react';
import { BombData } from '@/types/game';
import { GAME_CONFIG } from '@/utils/game/grid';

interface UseBombsProps {
  bombs: BombData[];
  setBombs: React.Dispatch<React.SetStateAction<BombData[]>>;
  bombsRef: React.MutableRefObject<BombData[]>;
  playerPosition: [number, number];
  playerBombRangeRef: React.MutableRefObject<number>;
  playerMaxBombsRef: React.MutableRefObject<number>;
  isGameOverRef: React.MutableRefObject<boolean>;
  gameState: string;
  initiateExplosionChain: (bombId: string) => void;
}

/**
 * Hook que gerencia a colocação e controle de bombas no jogo
 */
export function useBombs({
  bombs,
  setBombs,
  bombsRef,
  playerPosition,
  playerBombRangeRef,
  playerMaxBombsRef,
  isGameOverRef,
  gameState,
  initiateExplosionChain
}: UseBombsProps) {
  /**
   * Coloca uma bomba na posição atual do jogador
   */
  const placeBomb = useCallback(() => {
    if (isGameOverRef.current || gameState !== 'playing') return; if (bombsRef.current.length >= playerMaxBombsRef.current) {
      return;
    }

    const [playerCol, playerRow] = playerPosition;

    if (bombsRef.current.some(b => b.col === playerCol && b.row === playerRow)) {
      return;
    }

    const newBombId = `bomb-${Date.now()}-${Math.random()}`;

    const timerId = window.setTimeout(() => {
      initiateExplosionChain(newBombId);
    }, GAME_CONFIG.bombFuseTime);

    const newBomb: BombData = {
      id: newBombId,
      col: playerCol,
      row: playerRow,
      timerId: timerId,
      range: playerBombRangeRef.current,
    };

    setBombs(prevBombs => [...prevBombs, newBomb]);
    console.log(`Bomba ${newBombId} colocada em [${playerCol}, ${playerRow}] com range ${playerBombRangeRef.current}`);
  }, [
    playerPosition,
    bombsRef,
    playerBombRangeRef,
    playerMaxBombsRef,
    setBombs,
    initiateExplosionChain,
    isGameOverRef,
    gameState
  ]);

  /**
   * Limpa todos os timers de bombas ao desmontar o componente
   */
  const cleanupBombs = useCallback(() => {
    bombsRef.current.forEach(bomb => {
      clearTimeout(bomb.timerId);
    });
  }, [bombsRef]);

  /**
   * Callback para quando um efeito de explosão termina
   */
  const handleExplosionComplete = useCallback((explosionId: string) => {
    // Remover o efeito de explosão da lista
    return (prevExplosions: any[]) => prevExplosions.filter(exp => exp.id !== explosionId);
  }, []);

  return {
    placeBomb,
    cleanupBombs,
    handleExplosionComplete
  };
}
