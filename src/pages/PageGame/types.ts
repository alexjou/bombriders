// d:\Code\Meus Projetos\Jogos\BombRider\src\types.ts
export enum CellType {
  EMPTY = 0,
  SOLID_BLOCK = 1,
  DESTRUCTIBLE_BLOCK = 2,
  PLAYER = 3,
  BOMB = 4,
  EXPLOSION = 5,
  ENEMY = 6,
  POWERUP_BOMB_RANGE = 7,    // Novo: Power-up para alcance da bomba
  POWERUP_MAX_BOMBS = 8,     // Novo: Power-up para mais bombas
  // Adicionar mais power-ups aqui conforme necessário
}

export interface BombData {
  id: string;
  col: number;
  row: number;
  timerId: number;
  range: number; // Alcance da explosão desta bomba específica
}

export interface EnemyData {
  id: string;
  row: number;
  col: number;
  type?: string; // Tipo de inimigo: 'normal', 'rapido', 'estatico', etc.
  movePattern?: string; // Padrão de movimento: 'random', 'follow', 'stationary'
  speed?: number; // Velocidade de movimento (multiplicador do intervalo base)
  // Outras propriedades do inimigo, como tipo, velocidade, etc.
}

export interface ExplosionData {
  id: string;
  position: [number, number, number];
  // Poderia adicionar startTime para controlar a duração da animação da explosão
}

// Para o pathfinding
export type Grid = CellType[][];
export interface Node {
  r: number;
  c: number;
  g: number; // Custo do início até este nó
  h: number; // Heurística (custo estimado deste nó até o fim)
  f: number; // Custo total (g + h)
  parent: Node | null;
}
