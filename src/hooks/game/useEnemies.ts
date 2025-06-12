import { useCallback, useEffect, useRef } from 'react';
import { EnemyData, Grid, CellType } from '@/types/game';
import { GAME_CONFIG } from '@/utils/game/grid';

interface UseEnemiesProps {
  gridRef: React.MutableRefObject<Grid>;
  playerPositionRef: React.MutableRefObject<[number, number]>;
  bombsRef: React.MutableRefObject<any[]>;
  isPlayerInvincibleRef: React.MutableRefObject<boolean>;
  isGameOverRef: React.MutableRefObject<boolean>;
  playerLivesRef: React.MutableRefObject<number>;
  invincibilityTimerRef: React.MutableRefObject<number | null>;
  enemies: EnemyData[];
  setEnemies: React.Dispatch<React.SetStateAction<EnemyData[]>>;
  setPlayerLives: React.Dispatch<React.SetStateAction<number>>;
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPlayerInvincible: React.Dispatch<React.SetStateAction<boolean>>;
  gameState: string;
}

/**
 * Hook simplificado que gerencia o comportamento dos inimigos no jogo
 * Baseado na versão anterior que funcionava bem
 */
export function useEnemies({
  gridRef,
  playerPositionRef,
  bombsRef,
  isPlayerInvincibleRef,
  isGameOverRef,
  playerLivesRef,
  invincibilityTimerRef,
  enemies,
  setEnemies,
  setPlayerLives,
  setIsGameOver,
  setIsPlayerInvincible,
  gameState
}: UseEnemiesProps) {  const enemyMoveIntervalRef = useRef<number | null>(null);

  /**
   * Inicia o intervalo de movimento dos inimigos
   */
  const startEnemyMovements = useCallback(() => {
    // Limpa qualquer intervalo existente
    if (enemyMoveIntervalRef.current) {
      clearInterval(enemyMoveIntervalRef.current);
      enemyMoveIntervalRef.current = null;
    }

    // Não executa se o jogo estiver finalizado ou se não estiver jogando
    if (isGameOverRef.current || gameState !== 'playing') {
      return;
    }

    enemyMoveIntervalRef.current = window.setInterval(() => {
      // Verificação adicional: não move se jogo estiver finalizado
      if (isGameOverRef.current || gameState !== 'playing') {
        return;
      }
      
      setEnemies(currentEnemies => {
        return currentEnemies.map(enemy => {
          // Não move inimigos estáticos
          if (enemy.type === 'estatico' || enemy.movePattern === 'stationary' || enemy.speed === 0) {
            return enemy;
          }
          
          // 30% de chance de não se mover (simplifica o movimento)
          if (Math.random() < 0.3) return enemy;
          
          // Obtém grid e posição atual
          const grid = gridRef.current;
          const playerPos = playerPositionRef.current;
          const bombs = bombsRef.current;
          
          // Posição atual
          const { row, col } = enemy;
          
          // Possíveis movimentos: esquerda, direita, cima, baixo ou ficar parado
          const possibleMoves = [
            { r: row, c: col }, // ficar parado
            { r: row, c: col + 1 }, // direita
            { r: row, c: col - 1 }, // esquerda
            { r: row + 1, c: col }, // baixo
            { r: row - 1, c: col }  // cima
          ];
          
          // Filtra movimentos válidos (sem colisão)
          const validMoves = possibleMoves.filter(move => {
            // Verificar limites do grid
            if (move.r <= 0 || move.r >= GAME_CONFIG.gridRows - 1 ||
                move.c <= 0 || move.c >= GAME_CONFIG.gridColumns - 1) {
              return false;
            }
            
            // Verificar colisões com blocos
            if (grid[move.r][move.c] !== CellType.EMPTY) {
              return false;
            }
            
            // Verificar colisões com bombas
            if (bombs.some(b => b.row === move.r && b.col === move.c)) {
              return false;
            }
            
            return true;
          });
          
          // Se não há movimentos válidos, fica parado
          if (validMoves.length === 0) return enemy;
          
          // Escolhe um movimento
          let newMove;
          } else if (enemy.movePattern === 'random' || !enemy.movePattern) {
            // Movimento aleatório (sem logs)
            const possibleMoves = [
              { r: enemy.row, c: enemy.col + 1 },
              { r: enemy.row, c: enemy.col - 1 },
              { r: enemy.row + 1, c: enemy.col },
              { r: enemy.row - 1, c: enemy.col },
              // Adiciona a opção de ficar parado
              { r: enemy.row, c: enemy.col }
            ];

            const validMoves = possibleMoves.filter(move => {
              // Se for o movimento de ficar parado, sempre é válido
              if (move.r === enemy.row && move.c === enemy.col) {
                return true;
              }

              // Verificações de limites e colisões
              if (
                move.r <= 0 ||
                move.r >= GAME_CONFIG.gridRows - 1 ||
                move.c <= 0 ||
                move.c >= GAME_CONFIG.gridColumns - 1 ||
                currentGridForPathfinding[move.r][move.c] !== CellType.EMPTY ||
                activeBombs.some(b => b.row === move.r && b.col === move.c) ||
                playerPos[0] === move.c && playerPos[1] === move.r ||
                currentEnemies.some(otherEnemy =>
                  otherEnemy.id !== enemy.id &&
                  otherEnemy.row === move.r &&
                  otherEnemy.col === move.c
                )
              ) {
                return false;
              }

              return true;
            });

            if (validMoves.length > 0) {
              // Escolher movimento aleatório
              nextMove = validMoves[Math.floor(Math.random() * validMoves.length)];

              // Verificação final de segurança (sem logs)
              if (
                nextMove.r < 0 ||
                nextMove.r >= GAME_CONFIG.gridRows ||
                nextMove.c < 0 ||
                nextMove.c >= GAME_CONFIG.gridColumns
              ) {
                nextMove = { r: enemy.row, c: enemy.col };
              }
            }
          }

          // Colisão com jogador (sem logs excessivos)
          if (nextMove.r === playerPos[1] && nextMove.c === playerPos[0]) {
            if (!isPlayerInvincibleRef.current && !isGameOverRef.current) {
              // Ativar invencibilidade
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

              // Reduzir vidas
              setPlayerLives(prevLives => {
                const newLives = prevLives - 1;
                if (newLives <= 0) {
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

              return { ...enemy };
            }
          }

          // Retorna inimigo com nova posição
          return { ...enemy, row: nextMove.r, col: nextMove.c };
        });

        return nextEnemiesState;
      });
    }, 600); // Usar intervalo fixo de 600ms para movimento frequente

    return () => {
      if (enemyMoveIntervalRef.current) {
        clearInterval(enemyMoveIntervalRef.current);
        enemyMoveIntervalRef.current = null;
      }
    };
  }, [
    // Lista mínima de dependências essenciais
    gameState,
    setEnemies,
    setPlayerLives,
    setIsGameOver,
    setIsPlayerInvincible
  ]);

  // Limpar recursos quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (enemyMoveIntervalRef.current) {
        clearInterval(enemyMoveIntervalRef.current);
        enemyMoveIntervalRef.current = null;
      }
    };
  }, []);

  return {
    startEnemyMovements
  };
}
