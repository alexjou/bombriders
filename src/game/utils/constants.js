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

// Dinossauros
export const DINOS = {
  RAPTORIX: {
    name: 'Raptorix',
    type: 'Velocidade',
    initialAbility: 'Aumenta velocidade do Rider',
    evolution: 'Pode atravessar blocos',
    evolutionLevel: 3,
  },
  TRICERABOOM: {
    name: 'TriceraBoom',
    type: 'Defesa',
    initialAbility: 'Protege contra 1 explosão extra',
    evolution: 'Reflete explosões',
    evolutionLevel: 3,
  },
  FLAMEODON: {
    name: 'Flameodon',
    type: 'Ataque',
    initialAbility: 'Fogo extra nas bombas',
    evolution: 'Cria explosões em cruz',
    evolutionLevel: 3,
  },
  AQUALUX: {
    name: 'Aqualux',
    type: 'Suporte',
    initialAbility: 'Pode atravessar água sem perder bomba',
    evolution: 'Escudo aquático temporário',
    evolutionLevel: 3,
  },
  AEROZARD: {
    name: 'Aerozard',
    type: 'Mobilidade',
    initialAbility: 'Pulo curto por cima de bombas',
    evolution: 'Dash aéreo curto',
    evolutionLevel: 3,
  },
  TREXON: {
    name: 'T-Rexon',
    type: 'Força',
    initialAbility: 'Empurra blocos/bombas',
    evolution: 'Destrói blocos frágeis ao contato',
    evolutionLevel: 3,
  },
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

// Inimigos
export const ENEMIES = {
  DARK_DINO: {
    name: 'Dino Sombrio',
    behavior: 'Imita seus movimentos',
    notes: 'Mini-chefe',
  },
  NEXX_DRONE: {
    name: 'Drone do Nexx',
    behavior: 'Persegue por radar',
    notes: 'Rápido, mas frágil',
  },
  LIVING_BOMB: {
    name: 'Bomba-Viva',
    behavior: 'Anda aleatoriamente e explode',
    notes: 'Solta loot raro às vezes',
  },
  TOXIC_SLIME: {
    name: 'Slime Tóxico',
    behavior: 'Libera nuvem que desativa power-ups',
    notes: 'Apenas em pântano',
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

