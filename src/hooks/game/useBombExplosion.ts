import { useCallback, useRef } from 'react';
import { BombData, CellType, Grid, ExplosionData, EnemyData } from '@/types/game';
import { get3DPosition, GAME_CONFIG } from '@/utils/game/grid';
import useGameStore from '@/game/store/gameStore';

interface ProcessExplosionResult {
  affectedCells: { row: number; col: number }[];
  newGrid: CellType[][];
  explosionEffects: ExplosionData[];
  powerUpsToSpawn: { type: CellType; row: number; col: number }[];
}

/**
 * Hook que gerencia a lógica de explosão de bombas no jogo
 */
export function useBombExplosion(
  gridRef: React.MutableRefObject<Grid>,
  bombsRef: React.MutableRefObject<BombData[]>,
  enemiesRef: React.MutableRefObject<EnemyData[]>,
  playerPositionRef: React.MutableRefObject<[number, number]>,
  isPlayerInvincibleRef: React.MutableRefObject<boolean>,
  isGameOverRef: React.MutableRefObject<boolean>,
  playerLivesRef: React.MutableRefObject<number>,
  setGrid: React.Dispatch<React.SetStateAction<Grid>>,
  setExplosions: React.Dispatch<React.SetStateAction<ExplosionData[]>>,
  setBombs: React.Dispatch<React.SetStateAction<BombData[]>>,
  setEnemies: React.Dispatch<React.SetStateAction<EnemyData[]>>,
  setPlayerLives: React.Dispatch<React.SetStateAction<number>>,
  setIsPlayerInvincible: React.Dispatch<React.SetStateAction<boolean>>,
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const { removeEnemy } = useGameStore();
  const recentlyExplodedOrScheduledBombIdsRef = useRef(new Set<string>());
  const chainReactionTimeoutsRef = useRef<number[]>([]);
  const invincibilityTimerRef = useRef<number | null>(null);

  /**
   * Processa a explosão de uma única bomba
   * @param bombToExplode Bomba a ser explodida
   * @param currentGrid Grid atual
   * @returns Resultado do processamento da explosão
   */
  const processSingleBombExplosion = useCallback(
    (bombToExplode: BombData, currentGrid: CellType[][]): ProcessExplosionResult => {
      const newGrid = currentGrid.map(r => [...r]);
      const affectedCells: { row: number; col: number }[] = [];
      const explosionEffects: ExplosionData[] = [];
      const powerUpsToSpawn: { type: CellType; row: number; col: number }[] = [];
      const currentBombRange = bombToExplode.range;

      // Adiciona a célula central da bomba nas células afetadas para verificação de dano
      affectedCells.push({ row: bombToExplode.row, col: bombToExplode.col });

      // Adiciona efeito de explosão visual para a célula central da bomba
      explosionEffects.push({
        id: `explosion-${bombToExplode.id}-${bombToExplode.row}-${bombToExplode.col}-center-${Date.now()}-${Math.random()}`,
        position: get3DPosition(bombToExplode.col, bombToExplode.row),
      });

      // Apenas as 4 direções (excluindo o centro para evitar duplicação)
      const directions = [
        { r: 0, c: 1 }, // Direita
        { r: 0, c: -1 }, // Esquerda
        { r: 1, c: 0 }, // Baixo
        { r: -1, c: 0 } // Cima
      ];

      for (const dir of directions) {
        for (let i = 1; i <= currentBombRange; i++) {
          const targetRow = bombToExplode.row + dir.r * i;
          const targetCol = bombToExplode.col + dir.c * i;

          // Verificar se está dentro do grid
          const { gridRows, gridColumns } = GAME_CONFIG;
          if (targetRow >= 0 && targetRow < gridRows && targetCol >= 0 && targetCol < gridColumns) {
            const cellTypeInPath = newGrid[targetRow][targetCol];

            // Adicionar às células afetadas
            if (!affectedCells.some(cell => cell.row === targetRow && cell.col === targetCol)) {
              affectedCells.push({ row: targetRow, col: targetCol });
            }

            // Adicionar efeito de explosão visual se não for um bloco sólido
            if (cellTypeInPath !== CellType.SOLID_BLOCK) {
              const pos3D = get3DPosition(targetCol, targetRow);
              if (!explosionEffects.some(eff =>
                eff.position[0] === pos3D[0] &&
                eff.position[2] === pos3D[2]
              )) {
                explosionEffects.push({
                  id: `explosion-${bombToExplode.id}-${targetRow}-${targetCol}-${Date.now()}-${Math.random()}`,
                  position: pos3D,
                });
              }
            }

            // Lógica de interação com a célula
            if (cellTypeInPath === CellType.DESTRUCTIBLE_BLOCK) {
              newGrid[targetRow][targetCol] = CellType.EMPTY;

              // Chance de gerar um power-up
              if (Math.random() < GAME_CONFIG.powerupSpawnChance) {
                const powerUpType = Math.random() < 0.5
                  ? CellType.POWERUP_BOMB_RANGE
                  : CellType.POWERUP_MAX_BOMBS;

                powerUpsToSpawn.push({ type: powerUpType, row: targetRow, col: targetCol });
                console.log(`Power-up ${powerUpType === CellType.POWERUP_BOMB_RANGE ? 'BOMB_RANGE' : 'MAX_BOMBS'} para spawnar em [${targetCol}, ${targetRow}]`);
              }
              break; // A explosão para naquela direção após destruir um bloco
            }

            if (cellTypeInPath === CellType.SOLID_BLOCK) {
              break; // A explosão para naquela direção se atingir um bloco sólido
            }
          } else {
            // Se saiu do grid, para naquela direção
            break;
          }
        }
      }

      return { affectedCells, newGrid, explosionEffects, powerUpsToSpawn };
    },
    [],
  );

  /**
   * Inicia a cadeia de explosão a partir de uma bomba
   * @param bombIdToExplode ID da bomba a ser explodida
   */
  const initiateExplosionChain = useCallback((bombIdToExplode: string) => {
    if (recentlyExplodedOrScheduledBombIdsRef.current.has(bombIdToExplode)) {
      return;
    }
    recentlyExplodedOrScheduledBombIdsRef.current.add(bombIdToExplode);

    const bombToExplode = bombsRef.current.find(b => b.id === bombIdToExplode);

    if (!bombToExplode) {
      recentlyExplodedOrScheduledBombIdsRef.current.delete(bombIdToExplode);
      return;
    }

    console.log(`Iniciando explosão para bomba ${bombToExplode.id} (alcance: ${bombToExplode.range})`);
    clearTimeout(bombToExplode.timerId);

    const {
      affectedCells,
      newGrid: gridAfterBlockDestruction,
      explosionEffects,
      powerUpsToSpawn
    } = processSingleBombExplosion(bombToExplode, gridRef.current);

    // 1. Atualizar estado das bombas
    const remainingBombs = bombsRef.current.filter(b => b.id !== bombToExplode.id);
    setBombs(remainingBombs);
    bombsRef.current = remainingBombs;

    // 2. Processar dano a inimigos e atualizar grid
    const destroyedEnemyIdsThisExplosion = new Set<string>();
    const gridAfterEnemyDamageAndPowerups = gridAfterBlockDestruction.map(r => [...r]);

    const currentEnemiesForDamageCheck = [...enemiesRef.current];
    currentEnemiesForDamageCheck.forEach(enemy => {
      if (affectedCells.some(cell => cell.row === enemy.row && cell.col === enemy.col)) {
        if (enemiesRef.current.find(e => e.id === enemy.id)) {
          console.log(`Inimigo ${enemy.id} em [${enemy.col}, ${enemy.row}] atingido pela explosão de ${bombToExplode.id}.`);
          destroyedEnemyIdsThisExplosion.add(enemy.id);
          if (gridAfterEnemyDamageAndPowerups[enemy.row][enemy.col] !== CellType.SOLID_BLOCK) {
            gridAfterEnemyDamageAndPowerups[enemy.row][enemy.col] = CellType.EMPTY;
          }
        }
      }
    }); if (destroyedEnemyIdsThisExplosion.size > 0) {
      // Incrementar pontuação para cada inimigo destruído
      destroyedEnemyIdsThisExplosion.forEach(enemyId => {
        removeEnemy(enemyId);
        console.log(`Pontuação incrementada por destruir inimigo ${enemyId}`);
      });

      // Atualizar estado local dos inimigos e a referência
      setEnemies(prevEnemies => {
        const updatedEnemies = prevEnemies.filter(enemy => !destroyedEnemyIdsThisExplosion.has(enemy.id));
        // Atualiza a referência diretamente para garantir sincronia imediata
        enemiesRef.current = updatedEnemies;
        console.log(`Inimigos restantes: ${updatedEnemies.length}`);

        return updatedEnemies;
      });
    }

    // 3. Colocar power-ups no grid
    powerUpsToSpawn.forEach(powerUp => {
      if (gridAfterEnemyDamageAndPowerups[powerUp.row][powerUp.col] === CellType.EMPTY) {
        gridAfterEnemyDamageAndPowerups[powerUp.row][powerUp.col] = powerUp.type;
        console.log(`Power-up ${powerUp.type === CellType.POWERUP_BOMB_RANGE ? 'BOMB_RANGE' : 'MAX_BOMBS'} SPAWNADO em [${powerUp.col}, ${powerUp.row}]`);
      } else {
        console.log(`Não foi possível spawnar power-up em [${powerUp.col}, ${powerUp.row}] pois a célula não está vazia (tipo: ${gridAfterEnemyDamageAndPowerups[powerUp.row][powerUp.col]})`);
      }
    });

    // Atualizar o grid
    setGrid(gridAfterEnemyDamageAndPowerups);

    // 4. Adicionar efeitos visuais da explosão
    setExplosions(prevExplosions => {
      const newExplosionsToAdd = explosionEffects.filter(
        eff => !prevExplosions.some(existingEff => existingEff.id === eff.id)
      );
      return [...prevExplosions, ...newExplosionsToAdd];
    });

    // 5. Processar dano ao jogador
    const damageCheckTimeoutId = window.setTimeout(() => {
      const [pCol, pRow] = playerPositionRef.current;
      console.log(`Verificando dano ao jogador (TIMEOUT para ${bombToExplode.id}). Posição Jogador: [${pCol}, ${pRow}]`);

      const playerOnBomb = pCol === bombToExplode.col && pRow === bombToExplode.row;
      if (playerOnBomb) {
        console.log("ALERTA: Jogador está em cima da bomba que explodiu!");
      }

      if (!isPlayerInvincibleRef.current && !isGameOverRef.current) {
        const playerHit = affectedCells.some(cell => cell.row === pRow && cell.col === pCol);

        if (playerHit) {
          console.log(`Jogador ATINGIDO pela explosão de ${bombToExplode.id}!`);
          if (playerLivesRef.current > 0) {
            if (playerLivesRef.current - 1 > 0) {
              // Ativar invencibilidade temporária
              setIsPlayerInvincible(true);
              if (invincibilityTimerRef.current) clearTimeout(invincibilityTimerRef.current);
              invincibilityTimerRef.current = window.setTimeout(() => {
                setIsPlayerInvincible(false);
                invincibilityTimerRef.current = null;
                console.log("Jogador não está mais invencível.");
              }, GAME_CONFIG.playerInvincibilityDuration);
            }
          }

          setPlayerLives(prevLives => {
            const newLives = prevLives - 1;
            if (newLives <= 0) {
              console.log(`Game Over! Atingido por ${bombToExplode.id}`);
              setIsGameOver(true);
              if (invincibilityTimerRef.current) {
                clearTimeout(invincibilityTimerRef.current);
                invincibilityTimerRef.current = null;
              }
              setIsPlayerInvincible(false);
              return 0;
            }
            return newLives;
          });
        }
      }
      chainReactionTimeoutsRef.current = chainReactionTimeoutsRef.current.filter(id => id !== damageCheckTimeoutId);
    }, 0);
    chainReactionTimeoutsRef.current.push(damageCheckTimeoutId);

    // 6. Propagar explosão para outras bombas
    const bombsStillInPlay = [...bombsRef.current];
    for (const cell of affectedCells) {
      for (const otherBomb of bombsStillInPlay) {
        if (otherBomb.col === cell.col && otherBomb.row === cell.row) {
          console.log(`Bomba ${otherBomb.id} em [${otherBomb.col},${otherBomb.row}] atingida por ${bombToExplode.id}. Agendando sua explosão.`);

          const chainTimeoutId = window.setTimeout(() => {
            if (bombsRef.current.some(b => b.id === otherBomb.id)) {
              initiateExplosionChain(otherBomb.id);
            } else {
              console.log(`Bomba ${otherBomb.id} não encontrada para explosão em cadeia (de ${bombToExplode.id}), provavelmente já explodiu.`);
            }
            chainReactionTimeoutsRef.current = chainReactionTimeoutsRef.current.filter(id => id !== chainTimeoutId);
          }, GAME_CONFIG.chainReactionDelay);
          chainReactionTimeoutsRef.current.push(chainTimeoutId);
        }
      }
    }
  }, [
    bombsRef,
    enemiesRef,
    gridRef,
    playerPositionRef,
    isPlayerInvincibleRef,
    isGameOverRef,
    processSingleBombExplosion,
    setBombs,
    setEnemies,
    setGrid,
    setExplosions,
    setPlayerLives,
    setIsGameOver,
    setIsPlayerInvincible,
    removeEnemy
  ]);

  /**
   * Limpa todos os timers e recursos
   */
  const cleanupExplosionResources = useCallback(() => {
    chainReactionTimeoutsRef.current.forEach(clearTimeout);
    chainReactionTimeoutsRef.current = [];

    if (invincibilityTimerRef.current) {
      clearTimeout(invincibilityTimerRef.current);
      invincibilityTimerRef.current = null;
    }

    recentlyExplodedOrScheduledBombIdsRef.current.clear();
  }, []);

  return {
    initiateExplosionChain,
    cleanupExplosionResources,
    invincibilityTimerRef
  };
}
