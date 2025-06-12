/**
 * Tipos de células no grid do jogo
 */
export enum CellType {
  EMPTY = 0,
  SOLID_BLOCK = 1,
  DESTRUCTIBLE_BLOCK = 2,
  PLAYER = 3,
  BOMB = 4,
  EXPLOSION = 5,
  ENEMY = 6,
  POWERUP_BOMB_RANGE = 7,
  POWERUP_MAX_BOMBS = 8,
}

/**
 * Representa uma bomba no jogo
 */
export interface BombData {
  id: string;
  col: number;
  row: number;
  timerId: ReturnType<typeof setTimeout> | number; // Ajustado para aceitar o tipo de setTimeout ou number
  range: number;
  placedAt?: number; // Adicionando opcionalmente, se for usado para lógica de animação/tempo
}

/**
 * Representa um inimigo no jogo
 */
export interface EnemyData {
  id: string;
  row: number;
  col: number;
  type?: string;          // Tipo do inimigo: 'normal', 'rapido', 'perseguidor', 'aleatorio', 'estatico'
  movePattern?: string;   // Padrão de movimento: 'follow', 'random', 'stationary'
  speed?: number;         // Multiplicador de velocidade
}

/**
 * Representa uma explosão no jogo
 */
export interface ExplosionData {
  id: string;
  position: [number, number, number];
}

/**
 * Representa o grid do jogo
 */
export type Grid = CellType[][];

/**
 * Representa um nó no algoritmo de pathfinding
 */
export interface Node {
  r: number;
  c: number;
  g: number; // Custo do início até este nó
  h: number; // Heurística (custo estimado deste nó até o fim)
  f: number; // Custo total (g + h)
  parent: Node | null;
}

/**
 * Tipos possíveis de estado do jogo
 */
export type GameState = 'menu' | 'playing' | 'paused' | 'gameOver' | 'levelComplete';

/**
 * Configuração do jogo
 */
export interface GameConfig {
  gridColumns: number;
  gridRows: number;
  cellSize: number;
  playerStartRow: number;
  playerStartCol: number;
  bombFuseTime: number;
  chainReactionDelay: number;
  playerInitialLives: number;
  playerInvincibilityDuration: number;
  initialBombRange: number;
  initialMaxBombs: number;
  powerupSpawnChance: number;
  initialEnemyCount: number;
  enemyMoveInterval: number;
  cameraAltitude: number;
  cameraXShiftFactor: number;
  cameraZShiftFactor: number;
}

/**
 * Dados do jogador
 */
export interface PlayerData {
  character: string;
  position: { x: number; y: number };
  lives: number;
  bombs: number;
  bombRange: number;
  speed: number;
  powerUps: string[];
  currentDino: string | null;
  score: number;
  isInvincible?: boolean;
  enemies?: number; // Número de inimigos restantes
}

/**
 * Estado do jogo armazenado no Zustand
 */
export interface GameStoreState {
  gameState: GameState;
  currentMap: string | null;
  mapData: any | null;
  player: PlayerData;
  enemies: any[];
  activeBombs: BombData[];
  collectedDinos: string[];

  // Métodos
  setGameState: (state: GameState) => void;
  setCurrentMap: (map: string | null) => void;
  setMapData: (mapData: any | null) => void;

  resetGame: () => void;
  restartGame: () => void;
  goToNextLevel: () => void;

  // Ações do jogador
  setScore: (score: number) => void;
  setPlayerCharacter: (character: string) => void;
  setPlayerPosition: (position: { x: number; y: number }) => void;
  addPlayerBomb: () => void;
  increaseBombRange: () => void;
  increasePlayerSpeed: () => void;

  // Ações de bombas
  addBomb: (bomb: BombData) => void;
  removeBomb: (bombId: string) => void;

  // Ações de inimigos
  setEnemies: (enemies: EnemyData[]) => void;
  updateEnemyPosition: (enemyId: string, position: { x: number; y: number }) => void;
  removeEnemy: (enemyId: string) => void;
}
