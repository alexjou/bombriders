import React, { useState, useEffect, useRef } from 'react';
import {
  OrbitControls,
  OrthographicCamera,
  Plane, Grid as GridHelper
} from '@react-three/drei';
import Block from '../Block';
import Player from '../Player';
import BombComponent from '../Bomb';
import ExplosionEffect from '../ExplosionEffect';
import EnemyEntity from '../EnemyEntity';
// Importações explícitas do Three.js para evitar problemas de tipo
import PowerUp from '../PowerUp';
import { CellType } from '@/types/game';
import type { BombData, EnemyData, ExplosionData, Grid } from '@/types/game';
import useGameStore from '@/game/store/gameStore';
import { createInitialGrid, get3DPosition, GAME_CONFIG } from '@/utils/game/grid';
import { createGuaranteedEnemies } from '@/utils/game/enemyGenerator';
import { useBombExplosion } from '@/hooks/game/useBombExplosion';
import { usePlayerMovement } from '@/hooks/game/usePlayerMovement';
import { useEnemies } from '@/hooks/game/useEnemies';
import { useBombs } from '@/hooks/game/useBombs';
import { useGameState } from '@/hooks/game/useGameState';
import { registerThreeComponents } from '@/utils/game/three-config';

// Registra os componentes Three.js
registerThreeComponents();

export default function GameBoard() {  // Gerar inimigos iniciais usando o novo gerador garantido, forçando a criação dos 5 tipos
  const generateInitialEnemies = () => {
    // Cria e força a existência de exatamente 5 inimigos
    const enemies = createGuaranteedEnemies();

    // Verificação adicional para garantir que temos exatamente o número correto de inimigos
    if (enemies.length !== GAME_CONFIG.initialEnemyCount) {
      console.warn(`⚠️ Recriando inimigos: temos apenas ${enemies.length}/${GAME_CONFIG.initialEnemyCount}`);
      return createGuaranteedEnemies(); // Tenta criar novamente
    }

    // Log detalhado dos inimigos criados
    console.log(`✅ ${enemies.length} inimigos criados:`);
    enemies.forEach((enemy, idx) => {
      console.log(`  🔹 Inimigo #${idx}: ${enemy.type} em [${enemy.col},${enemy.row}] com padrão ${enemy.movePattern}`);
    });

    return enemies;
  };

  const initialEnemies = useRef<EnemyData[]>(generateInitialEnemies());

  // Estados do jogo
  const [grid, setGrid] = useState<Grid>(() => {
    const newGrid = createInitialGrid(initialEnemies.current);
    return newGrid;
  });  // Usar todos os inimigos iniciais, garantindo que todos sejam incluídos
  const [enemies, setEnemies] = useState<EnemyData[]>(() => {
    // Verificação final para garantir que temos exatamente 5 inimigos
    if (initialEnemies.current.length !== GAME_CONFIG.initialEnemyCount) {
      // Ajusta manualmente a contagem
      const currentEnemies = [...initialEnemies.current];

      // Se o número de inimigos for maior que o esperado, mantém apenas os primeiros 5
      if (currentEnemies.length > GAME_CONFIG.initialEnemyCount) {
        console.warn(`⚠️ Muitos inimigos (${currentEnemies.length}), mantendo apenas ${GAME_CONFIG.initialEnemyCount}`);
        currentEnemies.splice(GAME_CONFIG.initialEnemyCount);
      }

      // Se o número de inimigos for menor que o esperado, adiciona os faltantes
      while (currentEnemies.length < GAME_CONFIG.initialEnemyCount) {
        // Adiciona inimigos faltantes
        const lastIdx = currentEnemies.length;
        const { gridRows, gridColumns } = GAME_CONFIG;

        // Define um tipo de inimigo com base no índice
        const enemyTypes = ['normal', 'rapido', 'perseguidor', 'aleatorio', 'estatico'];
        const movePatterns = ['random', 'random', 'follow', 'random', 'stationary'];
        const typeIndex = lastIdx % enemyTypes.length;

        currentEnemies.push({
          id: `enemy-extra-${Date.now()}-${lastIdx}`,
          row: Math.floor(gridRows / 2),
          col: gridColumns - 2 - lastIdx,
          type: enemyTypes[typeIndex],
          movePattern: movePatterns[typeIndex],
          speed: typeIndex === 1 ? 1.5 : typeIndex === 4 ? 0 : 1.0
        });
      }
      initialEnemies.current = currentEnemies;
      console.log(`✅ Ajustado para ${initialEnemies.current.length} inimigos:`,
        initialEnemies.current.map(e => `${e.type}(${e.id.slice(0, 8)})`));
    }

    return initialEnemies.current;
  });
  const [bombs, setBombs] = useState<BombData[]>([]);
  const [explosions, setExplosions] = useState<ExplosionData[]>([]);
  const [playerPosition, setPlayerPosition] = useState<[number, number]>([
    GAME_CONFIG.playerStartCol,
    GAME_CONFIG.playerStartRow
  ]);
  const [isPlayerMoving, setIsPlayerMoving] = useState<boolean>(false);
  const [playerTargetPosition, setPlayerTargetPosition] = useState<[number, number, number] | undefined>(undefined);
  const [playerLives, setPlayerLives] = useState<number>(GAME_CONFIG.playerInitialLives);
  const [isPlayerInvincible, setIsPlayerInvincible] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [playerBombRange, setPlayerBombRange] = useState<number>(GAME_CONFIG.initialBombRange);
  const [playerMaxBombs, setPlayerMaxBombs] = useState<number>(GAME_CONFIG.initialMaxBombs);

  // Referências para os estados
  const gridRef = useRef<Grid>(grid);
  const enemiesRef = useRef<EnemyData[]>(enemies);
  const bombsRef = useRef<BombData[]>(bombs);
  const playerPositionRef = useRef<[number, number]>(playerPosition);
  const isPlayerMovingRef = useRef<boolean>(isPlayerMoving);
  const isPlayerInvincibleRef = useRef<boolean>(isPlayerInvincible);
  const isGameOverRef = useRef<boolean>(isGameOver);
  const playerLivesRef = useRef<number>(playerLives);
  const playerBombRangeRef = useRef<number>(playerBombRange);
  const playerMaxBombsRef = useRef<number>(playerMaxBombs);

  // Sincronizar refs com os estados
  useEffect(() => { gridRef.current = grid; }, [grid]);
  useEffect(() => { enemiesRef.current = enemies; }, [enemies]);
  useEffect(() => { bombsRef.current = bombs; }, [bombs]);
  useEffect(() => { playerPositionRef.current = playerPosition; }, [playerPosition]);
  useEffect(() => { isPlayerMovingRef.current = isPlayerMoving; }, [isPlayerMoving]);
  useEffect(() => { isPlayerInvincibleRef.current = isPlayerInvincible; }, [isPlayerInvincible]);
  useEffect(() => { isGameOverRef.current = isGameOver; }, [isGameOver]);
  useEffect(() => { playerLivesRef.current = playerLives; }, [playerLives]);
  useEffect(() => { playerBombRangeRef.current = playerBombRange; }, [playerBombRange]);
  useEffect(() => { playerMaxBombsRef.current = playerMaxBombs; }, [playerMaxBombs]);

  // Acessar o gameStore
  const { gameState, setGameState } = useGameStore();

  // Hook para explosão de bombas
  const {
    initiateExplosionChain,
    cleanupExplosionResources,
    invincibilityTimerRef
  } = useBombExplosion(
    gridRef,
    bombsRef,
    enemiesRef,
    playerPositionRef,
    isPlayerInvincibleRef,
    isGameOverRef,
    playerLivesRef,
    setGrid,
    setExplosions,
    setBombs,
    setEnemies,
    setPlayerLives,
    setIsPlayerInvincible,
    setIsGameOver
  );

  // Hook para bombas
  const {
    placeBomb,
    cleanupBombs,
    handleExplosionComplete
  } = useBombs({
    bombs,
    setBombs,
    bombsRef,
    playerPosition,
    playerBombRangeRef,
    playerMaxBombsRef,
    isGameOverRef,
    gameState,
    initiateExplosionChain
  });

  // Hook para movimentação do jogador
  const {
    movePlayer,
    setupKeyboardControls,
    handlePlayerMovementComplete
  } = usePlayerMovement({
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
  });  // Habilitando o hook useEnemies para o movimento correto dos inimigos
  const { startEnemyMovements } = useEnemies({
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
  });

  // Hook para estado do jogo
  useGameState({
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
    invincibilityTimerRef,
    isGameOverRef
  });
  // Configurar controle de teclado
  useEffect(() => {
    return setupKeyboardControls(placeBomb);
  }, [setupKeyboardControls, placeBomb]);
  // Iniciar o movimento dos inimigos quando o jogo estiver rodando
  useEffect(() => {
    // Só inicia os movimentos se o jogo estiver rodando e existirem inimigos
    if (gameState === 'playing' && enemies.length > 0) {
      return startEnemyMovements();
    }
  }, [gameState, enemies.length, startEnemyMovements]);

  /* Código de movimento antigo - removido e substituído pelo useEnemies hook
  useEffect(() => {
    // Só inicia os movimentos se o jogo estiver rodando e existirem inimigos
    if (gameState === 'playing' && enemies.length > 0) {
      // Intervalo para movimento dos inimigos
      const moveInterval = window.setInterval(() => {
        // Só move se o jogo estiver ativo
        if (isGameOverRef.current || gameState !== 'playing') {
          return;
        }
        setEnemies(currentEnemies => {
          // Implementação simplificada de movimento (sem log excessivo)
          return currentEnemies.map(enemy => {
            // Não move inimigos estáticos
            if (enemy.type === 'estatico' || enemy.movePattern === 'stationary' || enemy.speed === 0) {
              return enemy;
            }
            
            // 30% de chance de não se mover
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
            
            // Escolhe um movimento aleatório
            let newMove;
            
            // Movimento especial para perseguidor
            if (enemy.type === 'perseguidor' && Math.random() < 0.5) {
              const playerPos = playerPositionRef.current;
              
              // Escolhe o movimento que se aproxima mais do jogador
              let bestMove = { r: enemy.row, c: enemy.col };
              let bestDist = Infinity;
              
              validMoves.forEach(move => {
                const dist = Math.abs(move.c - playerPos[0]) + Math.abs(move.r - playerPos[1]);
                if (dist < bestDist) {
                  bestDist = dist;
                  bestMove = move;
                }
              });
              
              newMove = bestMove;
            } else {
              // Movimento aleatório para outros tipos
              newMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            }
            
            // Verifica colisão com o jogador
            if (newMove.c === playerPositionRef.current[0] && newMove.r === playerPositionRef.current[1]) {
              // Se o jogador não estiver invencível
              if (!isPlayerInvincibleRef.current && !isGameOverRef.current) {
                // Torna o jogador temporariamente invencível
                setIsPlayerInvincible(true);
                
                // Reduz uma vida
                setPlayerLives(prev => {
                  const newLives = prev - 1;
                  
                  if (newLives <= 0) {
                    setIsGameOver(true);
                  }
                  
                  return newLives;
                });
                
                // Configura um timer para remover a invencibilidade
                setTimeout(() => {
                  if (!isGameOverRef.current) {
                    setIsPlayerInvincible(false);
                  }
                }, GAME_CONFIG.playerInvincibilityDuration);
              }
            }
            
            // Retorna inimigo com nova posição
            return { ...enemy, row: newMove.r, col: newMove.c };
          });
        });
      }, 600); // Intervalo um pouco mais rápido para manter o jogo dinâmico
      
      return () => {
        clearInterval(moveInterval);
      };
    }
    // Não faz nada se o estado não for 'playing' ou não houver inimigos
    return undefined;
  }, [gameState, enemies.length]);
  */

  // Limpar recursos ao desmontar
  useEffect(() => {
    return () => {
      cleanupBombs();
      cleanupExplosionResources();
    };
  }, [cleanupBombs, cleanupExplosionResources]);

  // Calcular posição da câmera
  const gridCenterX = (GAME_CONFIG.gridColumns * GAME_CONFIG.cellSize) / 2;
  const gridCenterZ = (GAME_CONFIG.gridRows * GAME_CONFIG.cellSize) / 2;
  const cameraX = gridCenterX - (GAME_CONFIG.gridColumns * GAME_CONFIG.cellSize * GAME_CONFIG.cameraXShiftFactor);
  const cameraZ = gridCenterZ - (GAME_CONFIG.gridRows * GAME_CONFIG.cellSize * GAME_CONFIG.cameraZShiftFactor);

  return (
    <>
      {/* Configuração da câmera */}      <OrthographicCamera
        makeDefault
        zoom={35}
        position={[cameraX, GAME_CONFIG.cameraAltitude, cameraZ]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <OrbitControls
        target={[cameraX, 0, cameraZ]}
        enableRotate={false}
        enablePan={true} />
      {/* Iluminação */}
      {React.createElement('ambientLight', { intensity: 0.8 })}
      {React.createElement('directionalLight', { intensity: 1.2, castShadow: true })}

      {/* Renderiza o jogo somente quando não estiver no menu */}
      {gameState !== 'menu' && (
        <>{/* Plano de Chão Verde */}
          <Plane
            receiveShadow
            position={[
              gridCenterX - GAME_CONFIG.cellSize / 2,
              -0.05,
              gridCenterZ - GAME_CONFIG.cellSize / 2
            ]}
            rotation={[-Math.PI / 2, 0, 0]} args={[
              GAME_CONFIG.gridColumns * GAME_CONFIG.cellSize * 2,
              GAME_CONFIG.gridRows * GAME_CONFIG.cellSize * 2
            ]}
          >
            {React.createElement('meshStandardMaterial', { color: '#669966' })}
          </Plane>

          {/* Renderiza o grid do jogo */}
          {grid.map((row, rIndex) =>
            row.map((cellType, cIndex) => {
              const position3D = get3DPosition(cIndex, rIndex);

              if (cellType === CellType.SOLID_BLOCK || cellType === CellType.DESTRUCTIBLE_BLOCK) {
                return (
                  <Block
                    key={`block-${rIndex}-${cIndex}`}
                    position={position3D}
                    type={cellType}
                  />
                );
              }

              if (cellType === CellType.POWERUP_BOMB_RANGE || cellType === CellType.POWERUP_MAX_BOMBS) {
                return (
                  <PowerUp
                    key={`powerup-${rIndex}-${cIndex}`}
                    position={position3D}
                    type={cellType}
                  />
                );
              } return null;
            })
          )}          {/* Renderiza os inimigos */}
          {enemies.map(enemy => (
            <EnemyEntity
              key={enemy.id}
              position={get3DPosition(enemy.col, enemy.row)}
              enemyData={enemy}
            />
          ))}

          {/* Renderiza as bombas */}
          {bombs.map(bomb => (
            <BombComponent
              key={bomb.id}
              position={get3DPosition(bomb.col, bomb.row)}
            />))}
          {/* Renderiza os efeitos de explosão */}
          {explosions.map(exp => (
            <ExplosionEffect
              key={exp.id}
              position={exp.position}
              onComplete={() => handleExplosionComplete(exp.id)}
            />
          ))}

          {/* Renderiza o jogador se o jogo não acabou */}
          {!isGameOver && (
            <Player
              gridPosition={get3DPosition(playerPosition[0], playerPosition[1])}
              targetPosition={playerTargetPosition}
              isInvincible={isPlayerInvincible}
              moveSpeed={7.5}
              onMovementComplete={handlePlayerMovementComplete}
            />
          )}
          {/* Grid Helper para visualização */}
          <GridHelper
            args={[
              Math.max(GAME_CONFIG.gridColumns, GAME_CONFIG.gridRows) * GAME_CONFIG.cellSize,
              Math.max(GAME_CONFIG.gridColumns, GAME_CONFIG.gridRows),
              '#555',
              '#444'
            ]}
            position={[
              gridCenterX - GAME_CONFIG.cellSize / 2,
              0,
              gridCenterZ - GAME_CONFIG.cellSize / 2
            ]}
          />
        </>
      )}
    </>
  );
}
