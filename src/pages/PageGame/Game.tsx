import { OrbitControls, OrthographicCamera, Html } from '@react-three/drei'; // Adicionado Html
import { useState, useEffect, useCallback, useRef } from 'react'; // Adicionado useRef
import Block from './Block';
import Player from './Player';
import BombComponent from './Bomb';
import ExplosionEffect from './ExplosionEffect';
import Enemy from './Enemy'; // Importar o componente Enemy
import PowerUp from './PowerUp'; // NOVO: Importar o componente PowerUp
import { CellType } from './types';
import type { BombData, EnemyData, Grid } from './types'; // Adicionado Grid e CellType aqui
import { findPath } from './pathfinding'; // IMPORTAR findPath
import React from 'react';
// import { Canvas } from '@react-three/fiber'; // Removido - Canvas é usado no App.tsx, não aqui diretamente para <color />

// Dimensões do grid conforme especificado (13x11)
const GRID_COLUMNS = 18;
const GRID_ROWS = 16;
const CELL_SIZE = 1; // Tamanho de cada célula no espaço 3D

// Posição inicial do jogador no grid (índices da matriz)
const PLAYER_START_ROW = 1;
const PLAYER_START_COL = 1;

// Constantes para bombas
const BOMB_FUSE_TIME = 3000; // 3 segundos para explodir
const CHAIN_REACTION_DELAY = 150; // NOVO: Atraso em ms para explosões em cadeia

// Constantes do jogador
const PLAYER_INITIAL_LIVES = 3;
const PLAYER_INVINCIBILITY_DURATION = 2000; // 2 segundos de invencibilidade
const INITIAL_BOMB_RANGE = 2; // NOVO: Alcance inicial da bomba do jogador
const INITIAL_MAX_BOMBS = 1; // NOVO: Máximo de bombas iniciais do jogador

// Constantes para power-ups
const POWERUP_SPAWN_CHANCE = 0.3; // 30% de chance de um power-up aparecer

// Constantes para inimigos (exemplo)
const INITIAL_ENEMY_COUNT = 3;
const ENEMY_MOVE_INTERVAL = 1500; // Inimigos tentam se mover a cada 1.5 segundos

// Novas constantes para a câmera
const CAMERA_ALTITUDE = 20;
// Para mover o grid para a direita da tela, a câmera se move para a esquerda do centro do grid.
// Este fator determina o quanto a câmera se desloca para a esquerda, como uma fração da largura do grid.
const CAMERA_X_SHIFT_FACTOR = 0.0; // MODIFICADO: Para grid à esquerda
// Fator similar para o deslocamento vertical da câmera.
// Negativo para a câmera ir "para baixo" do centro do grid, fazendo o grid aparecer "em cima".
const CAMERA_Z_SHIFT_FACTOR = 0.1; // MODIFICADO: Para descer mais o grid (era -0.3)

interface ExplosionData {
  id: string;
  position: [number, number, number];
}

// Função para gerar um grid inicial
const createInitialGrid = (enemiesInitial: EnemyData[]): CellType[][] => { // Renomeado parâmetro para evitar conflito
  const grid: CellType[][] = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    grid[r] = [];
    for (let c = 0; c < GRID_COLUMNS; c++) {
      const isEnemyCell = enemiesInitial.some(enemy => enemy.row === r && enemy.col === c);
      if (isEnemyCell) {
        grid[r][c] = CellType.ENEMY; // Marcar célula como contendo inimigo
      } else if (r === 0 || r === GRID_ROWS - 1 || c === 0 || c === GRID_COLUMNS - 1) {
        grid[r][c] = CellType.SOLID_BLOCK;
      } else if (r % 2 === 0 && c % 2 === 0) {
        grid[r][c] = CellType.SOLID_BLOCK;
      } else if (
        (r > 0 && r < GRID_ROWS - 1 && c > 0 && c < GRID_COLUMNS - 1) && // Evitar bordas para blocos destrutíveis
        !((r === PLAYER_START_ROW && c === PLAYER_START_COL) || // Posição inicial do jogador
          (r === PLAYER_START_ROW && c === PLAYER_START_COL + 1) || // Adjacente
          (r === PLAYER_START_ROW + 1 && c === PLAYER_START_COL)) && // Adjacente
        Math.random() < 0.6 // 60% de chance de ser um bloco destrutível
      ) {
        grid[r][c] = CellType.DESTRUCTIBLE_BLOCK;
      } else {
        grid[r][c] = CellType.EMPTY;
      }
    }
  }
  // Garantir que a posição inicial e adjacentes estejam vazias
  grid[PLAYER_START_ROW][PLAYER_START_COL] = CellType.EMPTY;
  if (PLAYER_START_COL + 1 < GRID_COLUMNS) grid[PLAYER_START_ROW][PLAYER_START_COL + 1] = CellType.EMPTY;
  if (PLAYER_START_ROW + 1 < GRID_ROWS) grid[PLAYER_START_ROW + 1][PLAYER_START_COL] = CellType.EMPTY;


  return grid;
};

// Função para criar inimigos iniciais
const createInitialEnemies = (): EnemyData[] => {
  const newEnemies: EnemyData[] = []; // Renomeado para newEnemies
  const occupiedCells = new Set<string>();
  occupiedCells.add(`${PLAYER_START_ROW}-${PLAYER_START_COL}`);
  occupiedCells.add(`${PLAYER_START_ROW}-${PLAYER_START_COL + 1}`);
  occupiedCells.add(`${PLAYER_START_ROW + 1}-${PLAYER_START_COL}`);

  while (newEnemies.length < INITIAL_ENEMY_COUNT) {
    const r = Math.floor(Math.random() * (GRID_ROWS - 2)) + 1;
    const c = Math.floor(Math.random() * (GRID_COLUMNS - 2)) + 1;
    const cellKey = `${r}-${c}`;

    if (!occupiedCells.has(cellKey) && !(r % 2 === 0 && c % 2 === 0)) {
      newEnemies.push({ id: `enemy-${newEnemies.length}-${Date.now()}`, row: r, col: c });
      occupiedCells.add(cellKey);
    }
  }
  return newEnemies;
};

// NOVA FUNÇÃO AUXILIAR
const processSingleBombExplosion = (
  bombToExplde: BombData,
  currentGrid: CellType[][],
  get3DPosition: (col: number, row: number) => [number, number, number]
): {
  affectedCells: { row: number; col: number }[];
  newGrid: CellType[][];
  explosionEffects: ExplosionData[];
  powerUpsToSpawn: { type: CellType; row: number; col: number }[]; // NOVO
} => {
  const newGrid = currentGrid.map(r => [...r]);
  const affectedCells: { row: number; col: number }[] = [];
  const explosionEffects: ExplosionData[] = [];
  const powerUpsToSpawn: { type: CellType; row: number, col: number }[] = []; // NOVO
  const currentBombRange = bombToExplde.range;

  // Adiciona efeito de explosão visual para a célula central da bomba (apenas visual, sem dano)
  explosionEffects.push({
    id: `explosion-${bombToExplde.id}-${bombToExplde.row}-${bombToExplde.col}-center-${Date.now()}-${Math.random()}`,
    position: get3DPosition(bombToExplde.col, bombToExplde.row),
  });

  // Apenas as 4 direções (excluindo o centro para evitar duplicação)
  const directions = [
    { r: 0, c: 1 }, // Direita
    { r: 0, c: -1 }, // Esquerda
    { r: 1, c: 0 }, // Baixo
    { r: -1, c: 0 }  // Cima
  ];

  for (const dir of directions) {
    for (let i = 1; i <= currentBombRange; i++) {
      const targetRow = bombToExplde.row + dir.r * i;
      const targetCol = bombToExplde.col + dir.c * i;

      if (targetRow >= 0 && targetRow < GRID_ROWS && targetCol >= 0 && targetCol < GRID_COLUMNS) {
        const cellTypeInPath = newGrid[targetRow][targetCol]; // Tipo da célula no caminho da explosão

        // SEMPRE adicionar às células afetadas (exceto se já foi adicionada)
        // Isso é para lógica de dano, não para visualização
        if (!affectedCells.some(cell => cell.row === targetRow && cell.col === targetCol)) {
          affectedCells.push({ row: targetRow, col: targetCol });
        }

        // Adiciona efeito de explosão visual para esta célula APENAS SE NÃO FOR SOLID_BLOCK
        if (cellTypeInPath !== CellType.SOLID_BLOCK) {
          if (!explosionEffects.some(eff => eff.position[0] === get3DPosition(targetCol, targetRow)[0] && eff.position[2] === get3DPosition(targetCol, targetRow)[2])) {
            explosionEffects.push({
              id: `explosion-${bombToExplde.id}-${targetRow}-${targetCol}-${Date.now()}-${Math.random()}`,
              position: get3DPosition(targetCol, targetRow),
            });
          }
        }

        // Lógica de interação com a célula
        if (cellTypeInPath === CellType.DESTRUCTIBLE_BLOCK) {
          newGrid[targetRow][targetCol] = CellType.EMPTY; // Bloco destruído vira EMPTY por padrão

          // Chance de gerar um power-up
          if (Math.random() < POWERUP_SPAWN_CHANCE) {
            const powerUpType = Math.random() < 0.5 ? CellType.POWERUP_BOMB_RANGE : CellType.POWERUP_MAX_BOMBS;
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
};


export default function Game() {
  const initialEnemies = useRef(createInitialEnemies());
  const [enemies, setEnemies] = useState<EnemyData[]>(initialEnemies.current);
  const enemiesRef = useRef<EnemyData[]>(enemies);

  useEffect(() => {
    enemiesRef.current = enemies;
  }, [enemies]);

  const [grid, setGrid] = useState<CellType[][]>(() => createInitialGrid(initialEnemies.current));
  const gridRef = useRef(grid);
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  const [playerPosition, setPlayerPosition] = useState<[number, number]>([PLAYER_START_COL, PLAYER_START_ROW]);
  const playerPositionRef = useRef(playerPosition);
  // Estado para gerenciar a movimentação visual do jogador
  const [isPlayerMoving, setIsPlayerMoving] = useState<boolean>(false);
  const isPlayerMovingRef = useRef(isPlayerMoving);
  // Adicionando estado para posição visual alvo do jogador (para animações)
  const [playerTargetPosition, setPlayerTargetPosition] = useState<[number, number, number] | undefined>(undefined);

  useEffect(() => {
    playerPositionRef.current = playerPosition;
  }, [playerPosition]);

  useEffect(() => {
    isPlayerMovingRef.current = isPlayerMoving;
  }, [isPlayerMoving]);

  const [bombs, setBombs] = useState<BombData[]>([]);
  const bombsRef = useRef<BombData[]>(bombs);
  const [explosions, setExplosions] = useState<ExplosionData[]>([]);
  const [playerLives, setPlayerLives] = useState<number>(PLAYER_INITIAL_LIVES);
  const playerLivesRef = useRef(playerLives);
  const [isPlayerInvincible, setIsPlayerInvincible] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const invincibilityTimerRef = useRef<number | null>(null);

  // NOVOS ESTADOS PARA POWER-UPS DO JOGADOR
  const [playerBombRange, setPlayerBombRange] = useState<number>(INITIAL_BOMB_RANGE);
  const [playerMaxBombs, setPlayerMaxBombs] = useState<number>(INITIAL_MAX_BOMBS);
  // Refs para os novos estados, se necessário para acesso em callbacks que não os têm como dependência direta
  const playerBombRangeRef = useRef(playerBombRange);
  const playerMaxBombsRef = useRef(playerMaxBombs);

  useEffect(() => { // Sincronizar refs dos power-ups
    playerBombRangeRef.current = playerBombRange;
  }, [playerBombRange]);

  useEffect(() => { // Sincronizar refs dos power-ups
    playerMaxBombsRef.current = playerMaxBombs;
  }, [playerMaxBombs]);


  const recentlyExplodedOrScheduledBombIdsRef = useRef(new Set<string>()); // NOVO: Para rastrear bombas na cadeia
  const chainReactionTimeoutsRef = useRef<number[]>([]); // NOVO: Para limpar timeouts da cadeia

  const isPlayerInvincibleRef = useRef(isPlayerInvincible);
  const isGameOverRef = useRef(isGameOver);

  useEffect(() => { // NOVO: Sincronizar playerLivesRef
    playerLivesRef.current = playerLives;
  }, [playerLives]);

  useEffect(() => {
    isPlayerInvincibleRef.current = isPlayerInvincible;
  }, [isPlayerInvincible]);

  useEffect(() => {
    isGameOverRef.current = isGameOver;
  }, [isGameOver]);

  const gridCenterX = (GRID_COLUMNS * CELL_SIZE) / 2;
  const gridCenterZ = (GRID_ROWS * CELL_SIZE) / 2;

  // Calcular a posição X e Z da câmera com base nos fatores de deslocamento
  const cameraX = gridCenterX - (GRID_COLUMNS * CELL_SIZE * CAMERA_X_SHIFT_FACTOR);
  const cameraZ = gridCenterZ - (GRID_ROWS * CELL_SIZE * CAMERA_Z_SHIFT_FACTOR);

  const get3DPosition = useCallback((col: number, row: number): [number, number, number] => {
    return [
      col * CELL_SIZE,
      CELL_SIZE / 2,
      row * CELL_SIZE
    ];
  }, []);

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
      newGrid: gridAfterBlockDestruction, // Renomeado para clareza
      explosionEffects,
      powerUpsToSpawn // NOVO: power-ups que podem surgir
    } = processSingleBombExplosion(
      bombToExplode,
      gridRef.current,
      get3DPosition
    );

    // 1. Atualizar estado das bombas
    const remainingBombs = bombsRef.current.filter(b => b.id !== bombToExplode.id);
    setBombs(remainingBombs);
    bombsRef.current = remainingBombs;

    // 2. Processar dano a inimigos e atualizar grid (gridAfterBlockDestruction já tem blocos destruídos)
    const destroyedEnemyIdsThisExplosion = new Set<string>();
    // Corrigido para const, pois não é reatribuído, apenas seu conteúdo interno é modificado se necessário.
    const gridAfterEnemyDamageAndPowerups = gridAfterBlockDestruction.map(r => [...r]); // Começa com o grid pós-destruição de blocos

    const currentEnemiesForDamageCheck = [...enemiesRef.current];
    currentEnemiesForDamageCheck.forEach(enemy => {
      if (affectedCells.some(cell => cell.row === enemy.row && cell.col === enemy.col)) {
        if (enemiesRef.current.find(e => e.id === enemy.id)) {
          console.log(`Inimigo ${enemy.id} em [${enemy.col}, ${enemy.row}] atingido pela explosão de ${bombToExplode.id}.`);
          destroyedEnemyIdsThisExplosion.add(enemy.id);
          if (gridAfterEnemyDamageAndPowerups[enemy.row][enemy.col] !== CellType.SOLID_BLOCK) { // Verifica o grid atualizado
            gridAfterEnemyDamageAndPowerups[enemy.row][enemy.col] = CellType.EMPTY;
          }
        }
      }
    });

    if (destroyedEnemyIdsThisExplosion.size > 0) {
      setEnemies(prevEnemies => prevEnemies.filter(enemy => !destroyedEnemyIdsThisExplosion.has(enemy.id)));
    }

    // NOVO: Colocar power-ups no grid
    // Isso deve acontecer *depois* que os inimigos são removidos das células,
    // para que um power-up não seja sobrescrito se um inimigo estava na mesma célula de um bloco destruído.
    powerUpsToSpawn.forEach(powerUp => {
      // Verifica se a célula está vazia antes de colocar o power-up
      // (um inimigo poderia ter sido destruído ali, ou outro power-up de uma explosão simultânea)
      if (gridAfterEnemyDamageAndPowerups[powerUp.row][powerUp.col] === CellType.EMPTY) {
        gridAfterEnemyDamageAndPowerups[powerUp.row][powerUp.col] = powerUp.type;
        console.log(`Power-up ${powerUp.type === CellType.POWERUP_BOMB_RANGE ? 'BOMB_RANGE' : 'MAX_BOMBS'} SPAWNADO em [${powerUp.col}, ${powerUp.row}]`);
      } else {
        console.log(`Não foi possível spawnar power-up em [${powerUp.col}, ${powerUp.row}] pois a célula não está vazia (tipo: ${gridAfterEnemyDamageAndPowerups[powerUp.row][powerUp.col]})`);
      }
    });

    // Atualiza o grid com blocos destruídos, células de inimigos limpas E power-ups
    setGrid(gridAfterEnemyDamageAndPowerups);


    // 3. Adicionar efeitos visuais da explosão
    setExplosions(prevExplosions => {
      const newExplosionsToAdd = explosionEffects.filter(
        eff => !prevExplosions.some(existingEff => existingEff.id === eff.id)
      );
      return [...prevExplosions, ...newExplosionsToAdd];
    });

    // 4. Processar dano ao jogador (envolvido em setTimeout para pegar a posição mais recente do jogador)
    const damageCheckTimeoutId = window.setTimeout(() => {
      const [pCol, pRow] = playerPositionRef.current;
      console.log(`Verificando dano ao jogador (TIMEOUT para ${bombToExplode.id}). Posição Jogador: [${pCol}, ${pRow}]`);
      console.log("Células afetadas pela explosão (para dano ao jogador):", JSON.stringify(affectedCells));
      console.log(`Bomba que explodiu: [${bombToExplode.col}, ${bombToExplode.row}]`);

      if (!isPlayerInvincibleRef.current && !isGameOverRef.current) {
        const playerHit = affectedCells.some(cell => cell.row === pRow && cell.col === pCol);

        if (playerHit) {
          console.log(`Jogador ATINGIDO pela explosão de ${bombToExplode.id}!`);
          if (playerLivesRef.current > 0) {
            if (playerLivesRef.current - 1 > 0) { // Só ativa invencibilidade se for sobreviver
              setIsPlayerInvincible(true);
              if (invincibilityTimerRef.current) clearTimeout(invincibilityTimerRef.current);
              invincibilityTimerRef.current = window.setTimeout(() => {
                setIsPlayerInvincible(false);
                invincibilityTimerRef.current = null;
                console.log("Jogador não está mais invencível.");
              }, PLAYER_INVINCIBILITY_DURATION);
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
              setIsPlayerInvincible(false); // Garante que não está invencível no game over
              return 0;
            }
            return newLives;
          });
        }
      }
      chainReactionTimeoutsRef.current = chainReactionTimeoutsRef.current.filter(id => id !== damageCheckTimeoutId);
    }, 0);
    chainReactionTimeoutsRef.current.push(damageCheckTimeoutId);


    // 5. Propagar para outras bombas com atraso
    // Iterar sobre uma cópia de bombsRef.current (que já foi atualizado para remover bombToExplode)
    const bombsStillInPlay = [...bombsRef.current];
    for (const cell of affectedCells) {
      for (const otherBomb of bombsStillInPlay) {
        if (otherBomb.col === cell.col && otherBomb.row === cell.row) {
          // A checagem de recentlyExplodedOrScheduledBombIdsRef será feita no início da chamada recursiva.
          console.log(`Bomba ${otherBomb.id} em [${otherBomb.col},${otherBomb.row}] atingida por ${bombToExplode.id}. Agendando sua explosão.`);

          const chainTimeoutId = window.setTimeout(() => {
            // Verificar se a bomba ainda existe antes de tentar explodi-la
            // (pode ter sido detonada por outra explosão que ocorreu mais rápido)
            if (bombsRef.current.some(b => b.id === otherBomb.id)) {
              initiateExplosionChain(otherBomb.id);
            } else {
              console.log(`Bomba ${otherBomb.id} não encontrada para explosão em cadeia (de ${bombToExplode.id}), provavelmente já explodiu.`);
            }
            chainReactionTimeoutsRef.current = chainReactionTimeoutsRef.current.filter(id => id !== chainTimeoutId);
          }, CHAIN_REACTION_DELAY);
          chainReactionTimeoutsRef.current.push(chainTimeoutId);
        }
      }
    }
  }, [
    get3DPosition, // Estável
    // Refs (são estáveis, mas seu .current muda)
    bombsRef, enemiesRef, gridRef, playerPositionRef,
    isPlayerInvincibleRef, isGameOverRef, invincibilityTimerRef, playerLivesRef,
    recentlyExplodedOrScheduledBombIdsRef, chainReactionTimeoutsRef,
    // Setters de estado (são estáveis)
    setGrid, setExplosions, setBombs, setEnemies, setPlayerLives, setIsGameOver, setIsPlayerInvincible
    // Constantes como PLAYER_INVINCIBILITY_DURATION, CHAIN_REACTION_DELAY são usadas diretamente
  ]);

  const handleExplosionComplete = useCallback((explosionId: string) => {
    setExplosions(prev => prev.filter(exp => exp.id !== explosionId));
  }, []);
  const placeBomb = useCallback(() => {
    if (isGameOverRef.current) return; // Apenas impede se o jogo acabou

    // Agora permite colocar bomba mesmo em movimento (removida a checagem isPlayerMovingRef.current)

    if (bombsRef.current.length >= playerMaxBombsRef.current) { // USA O ESTADO DO JOGADOR
      console.log(`Máximo de bombas ativas (${playerMaxBombsRef.current}) atingido!`);
      return;
    }
    const [playerCol, playerRow] = playerPosition;
    if (bombsRef.current.some(b => b.col === playerCol && b.row === playerRow)) {
      console.log("Já existe uma bomba nesta célula!");
      return;
    }

    const newBombId = `bomb-${Date.now()}-${Math.random()}`;

    const timerId = window.setTimeout(() => {
      initiateExplosionChain(newBombId);
    }, BOMB_FUSE_TIME);

    const newBomb: BombData = {
      id: newBombId,
      col: playerCol,
      row: playerRow,
      timerId: timerId,
      range: playerBombRangeRef.current, // USA O ESTADO DO JOGADOR
    };

    setBombs(prevBombs => [...prevBombs, newBomb]);
    console.log(`Bomba ${newBombId} colocada em [${playerCol}, ${playerRow}] com range ${playerBombRangeRef.current}`);

  }, [playerPosition, initiateExplosionChain, /* Adicionar playerMaxBombsRef e playerBombRangeRef como dependências se não forem estáveis, mas refs são */]);

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (isGameOverRef.current) return; // Impede movimento se o jogo acabou    // Se o jogador está em movimento, armazena o último comando de direção para sensação de jogo mais responsivo
    if (isPlayerMovingRef.current) {
      // Armazenar a última direção solicitada para executar quando o movimento atual terminar
      // (Esta parte poderia ser expandida com um sistema de buffer de movimentos)
      return; // Por enquanto apenas ignora novos comandos durante movimento
    }

    let collectedPowerUp = false; // Flag para saber se um power-up foi coletado

    // Calcula a nova posição
    const currentPos = playerPositionRef.current;
    const newCol = currentPos[0] + dx;
    const newRow = currentPos[1] + dy;

    // Verifica se a nova posição é válida
    if (newRow < 0 || newRow >= GRID_ROWS || newCol < 0 || newCol >= GRID_COLUMNS) {
      return; // Posição fora do grid
    }

    const targetCellType = gridRef.current[newRow][newCol]; // Usa gridRef para a lógica de coleta

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

    // Verifica colisões se não coletou power-up
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
              }, PLAYER_INVINCIBILITY_DURATION);
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

    // Se chegou aqui, o movimento é válido (ou um power-up foi coletado)
    // Marca o jogador como em movimento para iniciar a animação
    setIsPlayerMoving(true);
    isPlayerMovingRef.current = true;

    // Define a nova posição alvo para o jogador (para animação visual)
    const [targetX, targetY, targetZ] = get3DPosition(newCol, newRow);
    setPlayerTargetPosition([targetX, targetY, targetZ]);

    // Atualiza a posição lógica imediatamente para que a lógica do jogo funcione corretamente
    setPlayerPosition([newCol, newRow]);
    playerPositionRef.current = [newCol, newRow];
    // Nota: não precisamos de um setTimeout aqui, o callback onMovementComplete
    // será chamado automaticamente quando a animação visual terminar
  }, [setPlayerBombRange, setPlayerMaxBombs, setGrid, setPlayerPosition, setPlayerTargetPosition, setIsPlayerMoving, setPlayerLives, setIsPlayerInvincible, setIsGameOver, get3DPosition]);

  // Função chamada quando o movimento do jogador é concluído
  const handlePlayerMovementComplete = useCallback(() => {
    // O movimento visual foi concluído, o Player já está no destino correto
    setIsPlayerMoving(false);
    isPlayerMovingRef.current = false;
    setPlayerTargetPosition(undefined);
  }, []);

  // Efeito para movimentar inimigos
  useEffect(() => {
    if (isGameOverRef.current) return;

    const intervalId = setInterval(() => {
      setEnemies(currentEnemies => {
        const playerPos = playerPositionRef.current;
        const currentGridForPathfinding = gridRef.current;
        const activeBombs = bombsRef.current;

        const nextEnemiesState: EnemyData[] = currentEnemies.map(enemy => {
          const path = findPath(
            currentGridForPathfinding as Grid,
            { r: enemy.row, c: enemy.col },
            { r: playerPos[1], c: playerPos[0] },
            activeBombs,
            GRID_COLUMNS,
            GRID_ROWS
          );

          let nextMove = { r: enemy.row, c: enemy.col };

          if (path && path.length > 1) {
            nextMove = path[1];
          } else {
            const possibleMoves: { r: number, c: number }[] = [
              { r: enemy.row, c: enemy.col + 1 },
              { r: enemy.row, c: enemy.col - 1 },
              { r: enemy.row + 1, c: enemy.col },
              { r: enemy.row - 1, c: enemy.col },
            ];
            const validMoves = possibleMoves.filter(move =>
              move.r > 0 && move.r < GRID_ROWS - 1 &&
              move.c > 0 && move.c < GRID_COLUMNS - 1 &&
              currentGridForPathfinding[move.r][move.c] === CellType.EMPTY &&
              !activeBombs.some(b => b.row === move.r && b.col === move.c) &&
              !(playerPos[0] === move.c && playerPos[1] === move.r) &&
              !currentEnemies.some(otherEnemy =>
                otherEnemy.id !== enemy.id &&
                otherEnemy.row === move.r &&
                otherEnemy.col === move.c
              )
            );
            if (validMoves.length > 0) {
              nextMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            }
          }

          // Se o próximo movimento do inimigo é a posição do jogador
          if (nextMove.r === playerPos[1] && nextMove.c === playerPos[0]) {
            if (!isPlayerInvincibleRef.current && !isGameOverRef.current) {
              console.log(`Jogador atingido pelo inimigo ${enemy.id} em [${nextMove.c}, ${nextMove.r}]`);

              if (playerLivesRef.current > 0) {
                if (playerLivesRef.current - 1 > 0) { // Só ativa invencibilidade se for sobreviver
                  setIsPlayerInvincible(true);
                  isPlayerInvincibleRef.current = true;
                  if (invincibilityTimerRef.current) {
                    clearTimeout(invincibilityTimerRef.current);
                  }
                  invincibilityTimerRef.current = window.setTimeout(() => {
                    setIsPlayerInvincible(false);
                    isPlayerInvincibleRef.current = false;
                    invincibilityTimerRef.current = null;
                  }, PLAYER_INVINCIBILITY_DURATION);
                }
              }

              setPlayerLives(prevLives => {
                const newLives = prevLives - 1;
                if (newLives <= 0) {
                  console.log("Game Over! - Colisão com inimigo");
                  setIsGameOver(true);
                  isGameOverRef.current = true;
                  if (invincibilityTimerRef.current) { // Limpa invencibilidade se game over
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
          // Se não houve colisão com o jogador, inimigo se move para nextMove
          return { ...enemy, row: nextMove.r, col: nextMove.c };
        });
        return nextEnemiesState;
      });
    }, ENEMY_MOVE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [gridRef, playerPositionRef, bombsRef, isPlayerInvincibleRef, isGameOverRef, invincibilityTimerRef, setEnemies, setPlayerLives, setIsGameOver, setIsPlayerInvincible]); // Removido enemiesRef, adicionados setters e refs corretos
  useEffect(() => {
    bombsRef.current = bombs;
  }, [bombs]);
  // Ref para acompanhar as teclas pressionadas
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  // Ref para armazenar o ID do intervalo de processamento de teclas
  const keyProcessIntervalRef = useRef<number | null>(null);
  // Ref para rastrear a última direção de movimento (para alternar em movimentos diagonais)
  const lastMovementDirectionRef = useRef<'horizontal' | 'vertical'>('horizontal');

  useEffect(() => {
    // Handler para tecla pressionada
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isGameOverRef.current) return;
      const key = event.key.toLowerCase();

      // Registra a tecla como pressionada
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
      // Remove a tecla da lista de teclas pressionadas
      delete keysPressed.current[key];
    };

    // Função para processar as teclas pressionadas periodicamente
    const processKeys = () => {
      if (isGameOverRef.current) return;

      // Não processa teclas se o jogador já está em movimento
      if (isPlayerMovingRef.current) return;      // Processa as teclas de movimento permitindo movimentos tanto horizontais quanto verticais
      // Mas executa apenas um por vez, priorizando o movimento que não foi feito recentemente
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

      // Se ambas direções estão sendo pressionadas, escolhe uma baseada na última movida
      // A última direção movida é armazenada na ref lastMovementDirection
      if (dx !== 0 && dy !== 0) {
        // Se ambas direções estão pressionadas, alterna entre elas para permitir
        // um "movimento diagonal" intercalado (primeiro uma direção, depois a outra)
        const lastDirection = lastMovementDirectionRef.current;

        // Alterna a direção a cada chamada
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
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);    // Iniciar o intervalo para processar teclas pressionadas
    // 50ms fornece uma resposta mais rápida para um controle mais fluido
    keyProcessIntervalRef.current = window.setInterval(processKeys, 50);

    // Limpar eventos e intervalo ao desmontar
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (keyProcessIntervalRef.current !== null) {
        clearInterval(keyProcessIntervalRef.current);
        keyProcessIntervalRef.current = null;
      }
    };
  }, [movePlayer, placeBomb, isGameOverRef, isPlayerMovingRef]);
  useEffect(() => {
    return () => {
      bombsRef.current.forEach(bomb => {
        clearTimeout(bomb.timerId);
      });
      if (invincibilityTimerRef.current) {
        clearTimeout(invincibilityTimerRef.current);
      }
      // Limpar todos os timeouts de cadeia de explosão pendentes
      chainReactionTimeoutsRef.current.forEach(clearTimeout);
      chainReactionTimeoutsRef.current = [];
      // Limpar o intervalo de processamento de teclas
      if (keyProcessIntervalRef.current !== null) {
        clearInterval(keyProcessIntervalRef.current);
        keyProcessIntervalRef.current = null;
      }
      // Limpar o set de bombas explodidas/agendadas se o jogo for completamente reiniciado (não implementado ainda)
      // recentlyExplodedOrScheduledBombIdsRef.current.clear(); 
    };
  }, []);

  useEffect(() => {
    console.log(`Vidas: ${playerLives}, Invencível: ${isPlayerInvincible}, Game Over: ${isGameOver}`);
  }, [playerLives, isPlayerInvincible, isGameOver]);

  return (
    <>
      {/* Cor de fundo da cena */}
      <color attach="background" args={['#33334D']} /> {/* Azul escuro/cinza para o fundo */}

      {/* UI Elements wrapped in Html */}
      <Html fullscreen zIndexRange={[100, 0]}>
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '120%',
          transform: 'translateX(-50%)', // Centralizar horizontalmente
          padding: '10px',
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '5px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '24px',
          zIndex: 101 // Para garantir que fique sobre outros elementos Html se houver
        }}>
          Vidas: {playerLives}
        </div>
        {isGameOver && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            color: 'red',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '10px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '48px',
            textAlign: 'center',
            zIndex: 102
          }}>
            GAME OVER
            <button
              onClick={() => {
                // Reiniciar o estado do jogo (exemplo básico)
                setPlayerLives(PLAYER_INITIAL_LIVES);
                setPlayerPosition([PLAYER_START_COL, PLAYER_START_ROW]);
                setEnemies(createInitialEnemies());
                setGrid(createInitialGrid(initialEnemies.current));
                setBombs([]);
                setExplosions([]);
                setIsGameOver(false);
                setIsPlayerInvincible(false);
                // RESETAR ESTADOS DOS POWER-UPS
                setPlayerBombRange(INITIAL_BOMB_RANGE);
                setPlayerMaxBombs(INITIAL_MAX_BOMBS);
                if (invincibilityTimerRef.current) clearTimeout(invincibilityTimerRef.current);
                invincibilityTimerRef.current = null;
                recentlyExplodedOrScheduledBombIdsRef.current.clear();
                chainReactionTimeoutsRef.current.forEach(clearTimeout);
                chainReactionTimeoutsRef.current = [];
                console.log("Jogo Reiniciado!");
              }}
              style={{
                display: 'block',
                marginTop: '20px',
                padding: '10px 20px',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              Reiniciar Jogo
            </button>
          </div>
        )}
      </Html>

      {/* Cena 3D */}
      <OrthographicCamera
        makeDefault
        zoom={35} // Este valor de zoom pode precisar de ajuste fino posteriormente
        position={[cameraX, CAMERA_ALTITUDE, cameraZ]}
        rotation={[-Math.PI / 2, 0, 0]} // Garante a visão de cima para baixo
      />
      <OrbitControls
        target={[cameraX, 0, cameraZ]} // Define o alvo da câmera para o ponto abaixo dela no plano do grid
        enableRotate={false} // Desabilita a rotação da câmera pelo usuário
        enablePan={true} // Permite o pan (arrastar) por enquanto. Pode ser definido como false se o grid precisar ser totalmente fixo.
      />
      <ambientLight intensity={0.8} /> {/* Aumentar um pouco a luz ambiente */}
      <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow /> {/* Aumentar um pouco a luz direcional */}

      {/* Plano de Chão Verde */}
      <mesh receiveShadow position={[gridCenterX - CELL_SIZE / 2, -0.05, gridCenterZ - CELL_SIZE / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[GRID_COLUMNS * CELL_SIZE * 2, GRID_ROWS * CELL_SIZE * 2]} /> {/* Plano maior */}
        <meshStandardMaterial color="#669966" /> {/* Verde gramado */}
      </mesh>

      {grid.map((row, rIndex) =>
        row.map((cellType, cIndex) => {
          const position3D = get3DPosition(cIndex, rIndex);
          if (cellType === CellType.SOLID_BLOCK || cellType === CellType.DESTRUCTIBLE_BLOCK) {
            return <Block key={`block-${rIndex}-${cIndex}`} position={position3D} type={cellType} />;
          }
          // NOVO: Renderizar PowerUps
          if (cellType === CellType.POWERUP_BOMB_RANGE || cellType === CellType.POWERUP_MAX_BOMBS) {
            return <PowerUp key={`powerup-${rIndex}-${cIndex}`} position={position3D} type={cellType} />;
          }
          return null;
        })
      )}

      {/* Renderizar Inimigos */}
      {enemies.map(enemy => (
        <Enemy key={enemy.id} position={get3DPosition(enemy.col, enemy.row)} />
      ))}

      {bombs.map(bomb => (
        <BombComponent key={bomb.id} position={get3DPosition(bomb.col, bomb.row)} />
      ))}

      {explosions.map(exp => (
        <ExplosionEffect
          key={exp.id}
          position={exp.position}
          onComplete={() => handleExplosionComplete(exp.id)}
        />
      ))}      {!isGameOver && (
        <Player
          gridPosition={get3DPosition(playerPosition[0], playerPosition[1])}
          targetPosition={playerTargetPosition}
          isInvincible={isPlayerInvincible}
          moveSpeed={7.5} // Aumentado para 7.5 para movimento mais rápido mas ainda suave
          onMovementComplete={handlePlayerMovementComplete}
        />
      )}

      <gridHelper
        args={[Math.max(GRID_COLUMNS, GRID_ROWS) * CELL_SIZE, Math.max(GRID_COLUMNS, GRID_ROWS), '#555', '#444']}
        position={[gridCenterX - CELL_SIZE / 2, 0, gridCenterZ - CELL_SIZE / 2]}
      />
    </>
  );
}
