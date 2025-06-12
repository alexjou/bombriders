import { CellType, EnemyData, Grid } from '@/types/game';

/**
 * Constantes do jogo
 */
export const GAME_CONFIG = {
  // Dimensões do grid
  gridColumns: 18,
  gridRows: 16,
  cellSize: 1, // Tamanho de cada célula no espaço 3D

  // Posição inicial do jogador
  playerStartRow: 1,
  playerStartCol: 1,

  // Configurações de bombas
  bombFuseTime: 3000, // 3 segundos para explodir
  chainReactionDelay: 150, // Atraso em ms para explosões em cadeia

  // Configurações do jogador
  playerInitialLives: 3,
  playerInvincibilityDuration: 2000, // 2 segundos de invencibilidade
  initialBombRange: 2,
  initialMaxBombs: 1,

  // Configurações de power-ups
  powerupSpawnChance: 0.3, // 30% de chance de um power-up aparecer

  // Configurações de inimigos
  initialEnemyCount: 5,
  enemyMoveInterval: 1500, // Inimigos tentam se mover a cada 1.5 segundos

  // Configurações da câmera
  cameraAltitude: 20,
  cameraXShiftFactor: 0.0,
  cameraZShiftFactor: 0.1,
};

/**
 * Gera um grid inicial com base na posição dos inimigos
 * @param enemiesInitial Lista inicial de inimigos
 * @returns Grid inicial do jogo
 */
export function createInitialGrid(enemiesInitial: EnemyData[]): Grid {
  const { gridRows, gridColumns, playerStartRow, playerStartCol } = GAME_CONFIG;
  const grid: CellType[][] = [];

  for (let r = 0; r < gridRows; r++) {
    grid[r] = [];
    for (let c = 0; c < gridColumns; c++) {
      const isEnemyCell = enemiesInitial.some(enemy => enemy.row === r && enemy.col === c);

      if (isEnemyCell) {
        grid[r][c] = CellType.ENEMY; // Marcar célula como contendo inimigo
      } else if (r === 0 || r === gridRows - 1 || c === 0 || c === gridColumns - 1) {
        grid[r][c] = CellType.SOLID_BLOCK;
      } else if (r % 2 === 0 && c % 2 === 0) {
        grid[r][c] = CellType.SOLID_BLOCK;
      } else if (
        (r > 0 && r < gridRows - 1 && c > 0 && c < gridColumns - 1) && // Evitar bordas para blocos destrutíveis
        !((r === playerStartRow && c === playerStartCol) || // Posição inicial do jogador
          (r === playerStartRow && c === playerStartCol + 1) || // Adjacente
          (r === playerStartRow + 1 && c === playerStartCol)) && // Adjacente
        Math.random() < 0.6 // 60% de chance de ser um bloco destrutível
      ) {
        grid[r][c] = CellType.DESTRUCTIBLE_BLOCK;
      } else {
        grid[r][c] = CellType.EMPTY;
      }
    }
  }

  // Garantir que a posição inicial e adjacentes estejam vazias
  grid[playerStartRow][playerStartCol] = CellType.EMPTY;
  if (playerStartCol + 1 < gridColumns) grid[playerStartRow][playerStartCol + 1] = CellType.EMPTY;
  if (playerStartRow + 1 < gridRows) grid[playerStartRow + 1][playerStartCol] = CellType.EMPTY;

  return grid;
}

/**
 * Cria inimigos iniciais em posições aleatórias do grid
 * @returns Lista de inimigos iniciais
 */
export function createInitialEnemies(): EnemyData[] {
  const { gridRows, gridColumns, playerStartRow, playerStartCol, initialEnemyCount } = GAME_CONFIG;
  console.log(`Criando ${initialEnemyCount} inimigos iniciais`);

  const newEnemies: EnemyData[] = [];
  const occupiedCells = new Set<string>();

  // Adicionar células ocupadas pelo jogador (e adjacentes)
  occupiedCells.add(`${playerStartRow}-${playerStartCol}`);
  occupiedCells.add(`${playerStartRow}-${playerStartCol + 1}`);
  occupiedCells.add(`${playerStartRow + 1}-${playerStartCol}`);

  // Tipos de inimigos e padrões de movimento (exatamente 5 tipos)
  const enemyTypes = ['normal', 'rapido', 'perseguidor', 'aleatorio', 'estatico'];
  const movementPatterns = ['random', 'random', 'follow', 'random', 'stationary'];
  const speedModifiers = [1.0, 1.5, 1.2, 0.8, 0]; // O último é 0 para o inimigo estático

  // Posições garantidas para cada inimigo (uma para cada tipo)
  // Essas posições são estrategicamente distribuídas para criar desafio
  const guaranteedPositions = [
    { r: 1, c: gridColumns - 2 },  // Normal (Superior direito)
    { r: gridRows - 2, c: 1 },     // Rápido (Inferior esquerdo)
    { r: gridRows - 2, c: gridColumns - 2 }, // Perseguidor (Inferior direito)
    { r: 3, c: 3 },                // Aleatório (Meio, mais perto do jogador)
    { r: gridRows - 4, c: gridColumns - 4 }  // Estático (Meio, mais longe)
  ];

  // Criar cada um dos 5 inimigos em posições específicas
  for (let i = 0; i < initialEnemyCount; i++) {
    const pos = guaranteedPositions[i];
    const typeIndex = i % enemyTypes.length; // 0 a 4, cada tipo de inimigo

    // Timestamp único para gerar IDs diferentes
    const timestamp = Date.now() + i * 100;

    const newEnemy = {
      id: `enemy-${i}-${timestamp}`,
      row: pos.r,
      col: pos.c,
      type: enemyTypes[typeIndex],
      movePattern: movementPatterns[typeIndex],
      speed: speedModifiers[typeIndex]
    };

    console.log(`Adicionando inimigo #${i + 1}: [${pos.r}, ${pos.c}] tipo: ${enemyTypes[typeIndex]}, padrão: ${movementPatterns[typeIndex]}`);
    newEnemies.push(newEnemy);
    occupiedCells.add(`${pos.r}-${pos.c}`);
  }

  // Verificação final
  console.log(`Criados ${newEnemies.length}/${initialEnemyCount} inimigos`);
  return newEnemies;
}

/**
 * Converte coordenadas do grid (2D) para posição no mundo 3D
 * @param col Coluna no grid
 * @param row Linha no grid
 * @returns Coordenadas [x, y, z] no mundo 3D
 */
export function get3DPosition(col: number, row: number): [number, number, number] {
  const { cellSize } = GAME_CONFIG;
  return [
    col * cellSize,
    cellSize / 2,
    row * cellSize
  ];
}
