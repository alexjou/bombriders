import { useCallback, useRef } from 'react';
import { CellType, Grid } from '@/types/game';
import { get3DPosition, GAME_CONFIG } from '@/utils/game/grid';

interface UsePlayerMovementProps {
  gridRef: React.MutableRefObject<Grid>;
  bombsRef: React.MutableRefObject<any[]>;
  enemiesRef: React.MutableRefObject<any[]>;
  playerPositionRef: React.MutableRefObject<[number, number]>;
  isPlayerMovingRef: React.MutableRefObject<boolean>;
  isPlayerInvincibleRef: React.MutableRefObject<boolean>;
  isGameOverRef: React.MutableRefObject<boolean>;
  playerLivesRef: React.MutableRefObject<number>;
  invincibilityTimerRef: React.MutableRefObject<number | null>;
  playerBombRangeRef: React.MutableRefObject<number>;
  playerMaxBombsRef: React.MutableRefObject<number>;
  setPlayerPosition: React.Dispatch<React.SetStateAction<[number, number]>>;
  setIsPlayerMoving: React.Dispatch<React.SetStateAction<boolean>>;
  setPlayerTargetPosition: React.Dispatch<React.SetStateAction<[number, number, number] | undefined>>;
  setIsPlayerInvincible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setPlayerLives: React.Dispatch<React.SetStateAction<number>>;
  setPlayerBombRange: React.Dispatch<React.SetStateAction<number>>;
  setPlayerMaxBombs: React.Dispatch<React.SetStateAction<number>>;
  setGrid: React.Dispatch<React.SetStateAction<Grid>>;
  gameState: string; // Estado global do jogo
}

/**
 * Hook que gerencia a movimentação do jogador no jogo
 */
export function usePlayerMovement({
  gridRef,
  bombsRef,
  enemiesRef,
  playerPositionRef,
  isPlayerMovingRef,
  isPlayerInvincibleRef,
  isGameOverRef,
  playerLivesRef,
  invincibilityTimerRef,
  playerBombRangeRef,
  playerMaxBombsRef,
  setPlayerPosition,
  setIsPlayerMoving,
  setPlayerTargetPosition,
  setIsPlayerInvincible,
  setIsGameOver,
  setPlayerLives,
  setPlayerBombRange,
  setPlayerMaxBombs,
  setGrid,
  gameState
}: UsePlayerMovementProps) {
  const lastMovementDirectionRef = useRef<'horizontal' | 'vertical'>('horizontal');
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  /**
   * Move o jogador na direção especificada
   * @param dx Deslocamento horizontal
   * @param dy Deslocamento vertical
   */
  const movePlayer = useCallback((dx: number, dy: number) => {
    if (isGameOverRef.current || gameState !== 'playing') return;

    // Se o jogador está em movimento, ignora novos comandos
    if (isPlayerMovingRef.current) {
      return;
    }

    let collectedPowerUp = false;

    // Calcula a nova posição
    const currentPos = playerPositionRef.current;
    const newCol = currentPos[0] + dx;
    const newRow = currentPos[1] + dy;

    // Verifica se a nova posição é válida
    const { gridRows, gridColumns } = GAME_CONFIG;
    if (newRow < 0 || newRow >= gridRows || newCol < 0 || newCol >= gridColumns) {
      return; // Posição fora do grid
    }

    const targetCellType = gridRef.current[newRow][newCol];

    // Lógica de coleta de Power-up
    if (targetCellType === CellType.POWERUP_BOMB_RANGE) {
      setPlayerBombRange(prevRange => prevRange + 1);
      console.log("Coletou POWERUP_BOMB_RANGE! Novo range:", playerBombRangeRef.current + 1);
      // Atualiza o grid para remover o power-up
      setGrid(prevGrid => {
        const nextGrid = prevGrid.map(r => [...r]);
        nextGrid[newRow][newCol] = CellType.EMPTY;
        return nextGrid;
      });
      collectedPowerUp = true;
    } else if (targetCellType === CellType.POWERUP_MAX_BOMBS) {
      setPlayerMaxBombs(prevMax => prevMax + 1);
      console.log("Coletou POWERUP_MAX_BOMBS! Novo máximo:", playerMaxBombsRef.current + 1);
      // Atualiza o grid para remover o power-up
      setGrid(prevGrid => {
        const nextGrid = prevGrid.map(r => [...r]);
        nextGrid[newRow][newCol] = CellType.EMPTY;
        return nextGrid;
      });
      collectedPowerUp = true;
    }

    // Verificar colisões se não coletou power-up
    if (!collectedPowerUp) {
      if (targetCellType === CellType.SOLID_BLOCK || targetCellType === CellType.DESTRUCTIBLE_BLOCK) {
        return; // Colisão com bloco
      }

      if (bombsRef.current.some(b => b.col === newCol && b.row === newRow)) {
        return; // Colisão com bomba
      }

      if (enemiesRef.current.some(enemy => enemy.col === newCol && enemy.row === newRow)) {
        if (!isPlayerInvincibleRef.current && !isGameOverRef.current) {
          console.log("Jogador colidiu com um inimigo!");

          if (playerLivesRef.current > 0) {
            if (playerLivesRef.current - 1 > 0) {
              setIsPlayerInvincible(true);
              isPlayerInvincibleRef.current = true;
              if (invincibilityTimerRef.current) {
                clearTimeout(invincibilityTimerRef.current);
              }
              invincibilityTimerRef.current = window.setTimeout(() => {
                setIsPlayerInvincible(false);
                isPlayerInvincibleRef.current = false;
                invincibilityTimerRef.current = null;
              }, GAME_CONFIG.playerInvincibilityDuration);
            }
          }

          setPlayerLives(prevLives => {
            const newLives = prevLives - 1;
            if (newLives <= 0) {
              console.log("Game Over! - Colisão com inimigo");
              setIsGameOver(true);
              isGameOverRef.current = true;
              if (invincibilityTimerRef.current) {
                clearTimeout(invincibilityTimerRef.current);
                invincibilityTimerRef.current = null;
              }
              setIsPlayerInvincible(false);
              isPlayerInvincibleRef.current = false;
              return 0;
            }
            return newLives;
          });
        }
        return; // Jogador não se move se colidir com inimigo
      }
    }

    // Se chegou aqui, o movimento é válido
    setIsPlayerMoving(true);
    isPlayerMovingRef.current = true;

    // Define a nova posição alvo para o jogador (para animação visual)
    const [targetX, targetY, targetZ] = get3DPosition(newCol, newRow);
    setPlayerTargetPosition([targetX, targetY, targetZ]);

    // Atualiza a posição lógica imediatamente
    setPlayerPosition([newCol, newRow]);
    playerPositionRef.current = [newCol, newRow];
  }, [
    gameState,
    isGameOverRef,
    isPlayerMovingRef,
    playerPositionRef,
    gridRef,
    bombsRef,
    enemiesRef,
    isPlayerInvincibleRef,
    playerLivesRef,
    invincibilityTimerRef,
    playerBombRangeRef,
    playerMaxBombsRef,
    setGrid,
    setPlayerBombRange,
    setPlayerMaxBombs,
    setIsPlayerMoving,
    setPlayerPosition,
    setPlayerTargetPosition,
    setIsPlayerInvincible,
    setIsGameOver,
    setPlayerLives
  ]);

  /**
   * Configura os eventos de teclado para movimentação do jogador
   * @returns Função de cleanup para remover event listeners
   */  const setupKeyboardControls = useCallback((
    placeBomb: () => void,
    onCleanup?: () => void
  ) => {
    // Variável para armazenar o ID do intervalo de processamento de teclas
    let keyProcessInterval: number | null = null;

    // Handler para tecla pressionada
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isGameOverRef.current || gameState !== 'playing') return;

      const key = event.key.toLowerCase();
      keysPressed.current[key] = true;

      // Processar bomba imediatamente
      if (key === ' ') {
        event.preventDefault();
        placeBomb();
      }
    };

    // Handler para tecla liberada
    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      delete keysPressed.current[key];
    };

    // Função para processar as teclas pressionadas periodicamente
    const processKeys = () => {
      if (isGameOverRef.current || gameState !== 'playing') return;
      if (isPlayerMovingRef.current) return;

      let dx = 0;
      let dy = 0;

      // Detecta teclas verticais
      if (keysPressed.current['arrowup'] || keysPressed.current['w']) {
        dy = -1;
      } else if (keysPressed.current['arrowdown'] || keysPressed.current['s']) {
        dy = 1;
      }

      // Detecta teclas horizontais
      if (keysPressed.current['arrowleft'] || keysPressed.current['a']) {
        dx = -1;
      } else if (keysPressed.current['arrowright'] || keysPressed.current['d']) {
        dx = 1;
      }

      // Alternância entre movimentos horizontais e verticais para simular diagonais
      if (dx !== 0 && dy !== 0) {
        const lastDirection = lastMovementDirectionRef.current;

        if (lastDirection === 'horizontal') {
          dx = 0; // Move verticalmente desta vez
          lastMovementDirectionRef.current = 'vertical';
        } else {
          dy = 0; // Move horizontalmente desta vez
          lastMovementDirectionRef.current = 'horizontal';
        }
      } else if (dx !== 0) {
        lastMovementDirectionRef.current = 'horizontal';
      } else if (dy !== 0) {
        lastMovementDirectionRef.current = 'vertical';
      }

      // Executa o movimento se alguma tecla direcional estiver pressionada
      if (dx !== 0 || dy !== 0) {
        movePlayer(dx, dy);
      }
    };

    // Configurar eventos de teclado
    window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp);

    // Iniciar o intervalo para processar teclas
    keyProcessInterval = window.setInterval(processKeys, 50);

    // Limpar eventos e intervalo ao desmontar
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);

      if (keyProcessInterval !== null) {
        clearInterval(keyProcessInterval);
        keyProcessInterval = null;
      }

      if (onCleanup) {
        onCleanup();
      }
    };
  }, [gameState, isGameOverRef, isPlayerMovingRef, movePlayer]);

  /**
   * Callback para quando o movimento do jogador é concluído
   */
  const handlePlayerMovementComplete = useCallback(() => {
    setIsPlayerMoving(false);
    isPlayerMovingRef.current = false;
    setPlayerTargetPosition(undefined);
  }, [setIsPlayerMoving, isPlayerMovingRef, setPlayerTargetPosition]);

  return {
    movePlayer,
    setupKeyboardControls,
    handlePlayerMovementComplete
  };
}
