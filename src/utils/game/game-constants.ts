// Constantes do jogo

// Personagens jogáveis
export const CHARACTERS = {
  ARIA: {
    name: 'Aria',
    element: 'Ar',
    passiveAbility: 'Velocidade +',
    personality: 'Rebelde e veloz',
    initialSpeed: 1.2,
  },
  BRONT: {
    name: 'Bront',
    element: 'Terra',
    passiveAbility: 'Reduz knockback',
    personality: 'Paciente e forte',
    initialSpeed: 0.9,
  },
  KIRO: {
    name: 'Kiro',
    element: 'Fogo',
    passiveAbility: 'Aumenta alcance',
    personality: 'Intenso e explosivo',
    initialSpeed: 1.0,
  },
  LUME: {
    name: 'Lume',
    element: 'Éter',
    passiveAbility: 'Inicia com 2 bombas',
    personality: 'Místico e enigmático',
    initialSpeed: 1.0,
  },
  ZUNN: {
    name: 'Zunn',
    element: 'Água',
    passiveAbility: 'Atravessa água',
    personality: 'Serene e precisa',
    initialSpeed: 1.1,
  },
};

// Mapas
export const MAPS = {
  FOREST: {
    name: 'Floresta Pré-Histórica',
    characteristics: 'Grama oculta bombas, ovos escondidos',
    size: { width: 15, height: 15 },
  },
  CAVE: {
    name: 'Caverna do Eco',
    characteristics: 'Som reverbera bombas (detona em delay)',
    size: { width: 13, height: 13 },
  },
  DESERT: {
    name: 'Deserto Atômico',
    characteristics: 'Tempestades de areia reduzem visão temporariamente',
    size: { width: 17, height: 17 },
  },
  SWAMP: {
    name: 'Pântano Mutante',
    characteristics: 'Slimes e terreno escorregadio',
    size: { width: 15, height: 15 },
  },
  ARENA: {
    name: 'Arena do Tempo (PvP)',
    characteristics: 'Simétrica, cheia de armadilhas e efeitos climáticos',
    size: { width: 11, height: 11 },
  },
};

// Tipos de blocos
export const BLOCK_TYPES = {
  EMPTY: 0,
  WALL: 1,
  DESTRUCTIBLE: 2,
  BOMB: 3,
  EXPLOSION: 4,
  POWER_UP: 5,
  DINO_EGG: 6,
  WATER: 7,
  PORTAL: 8,
};

// Power-Ups
export const POWER_UPS = {
  BOMB_UP: {
    name: 'Bomb Up',
    icon: '💣',
    effect: 'Adiciona +1 bomba simultânea',
  },
  FIRE_UP: {
    name: 'Fire Up',
    icon: '🔥',
    effect: 'Aumenta +1 de alcance de explosão',
  },
  SPEED_UP: {
    name: 'Speed Up',
    icon: '🏃‍♂️',
    effect: 'Aumenta velocidade do jogador',
  },
  FULL_ARMOR: {
    name: 'Full Armor',
    icon: '🛡️',
    effect: 'Invulnerabilidade curta após dano',
  },
  REMOTE_BOMB: {
    name: 'Remote Bomb',
    icon: '💫',
    effect: 'Detona bomba manualmente',
  },
  KICK: {
    name: 'Kick',
    icon: '💨',
    effect: 'Chuta bomba pela linha',
  },
  PASS: {
    name: 'Pass',
    icon: '🌀',
    effect: 'Atravesse bombas sem colisão',
  },
  RANDOMIZER: {
    name: 'Randomizer',
    icon: '🎲',
    effect: 'Pode ser efeito positivo ou negativo',
  },
};
