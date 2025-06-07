import { create } from 'zustand';

// Store para gerenciar o estado do jogo
const useGameStore = create((set) => ({
  // Estado do jogo
  gameState: 'menu', // menu, playing, paused, gameOver
  currentMap: null,
  mapData: null,
  score: 0,
  
  // Jogador
  player: {
    character: 'Aria', // Personagem padrão
    position: { x: 0, y: 0 },
    lives: 3,
    bombs: 1,
    bombRange: 1,
    speed: 1,
    powerUps: [],
    currentDino: null,
  },
  
  // Inimigos
  enemies: [],
  
  // Bombas ativas
  activeBombs: [],
  
  // Dinossauros coletados
  collectedDinos: [],
  
  // Ações
  setGameState: (state) => set({ gameState: state }),
  setCurrentMap: (map) => set({ currentMap: map }),
  setMapData: (mapData) => set({ mapData }),
  setScore: (score) => set({ score }),
  
  // Ações do jogador
  setPlayerCharacter: (character) => set((state) => ({
    player: { ...state.player, character }
  })),
  
  setPlayerPosition: (position) => set((state) => ({
    player: { ...state.player, position }
  })),
  
  addPlayerBomb: () => set((state) => ({
    player: { ...state.player, bombs: state.player.bombs + 1 }
  })),
  
  increaseBombRange: () => set((state) => ({
    player: { ...state.player, bombRange: state.player.bombRange + 1 }
  })),
  
  increasePlayerSpeed: () => set((state) => ({
    player: { ...state.player, speed: state.player.speed + 0.2 }
  })),
  
  addPowerUp: (powerUp) => set((state) => ({
    player: { 
      ...state.player, 
      powerUps: [...state.player.powerUps, powerUp] 
    }
  })),
  
  setCurrentDino: (dino) => set((state) => ({
    player: { ...state.player, currentDino: dino }
  })),
  
  addCollectedDino: (dino) => set((state) => ({
    collectedDinos: [...state.collectedDinos, dino]
  })),
  
  // Ações de bombas
  placeBomb: (position) => set((state) => {
    // Verifica se o jogador ainda tem bombas disponíveis
    if (state.activeBombs.length >= state.player.bombs) {
      return state;
    }
    
    // Cria uma nova bomba
    const newBomb = {
      id: `bomb-${Date.now()}`,
      position,
      range: state.player.bombRange,
      timer: 3, // 3 segundos até explodir
      placedAt: Date.now(),
    };
    
    return {
      activeBombs: [...state.activeBombs, newBomb]
    };
  }),
  
  removeBomb: (bombId) => set((state) => ({
    activeBombs: state.activeBombs.filter(bomb => bomb.id !== bombId)
  })),
  
  // Ações de inimigos
  setEnemies: (enemies) => set({ enemies }),
  
  updateEnemyPosition: (enemyId, position) => set((state) => ({
    enemies: state.enemies.map(enemy => 
      enemy.id === enemyId ? { ...enemy, position } : enemy
    )
  })),
  
  removeEnemy: (enemyId) => set((state) => ({
    enemies: state.enemies.filter(enemy => enemy.id !== enemyId),
    score: state.score + 100 // Adiciona pontos ao eliminar um inimigo
  })),
  
  // Reset do jogo
  resetGame: () => set({
    gameState: 'menu',
    currentMap: null,
    mapData: null,
    score: 0,
    player: {
      character: 'Aria',
      position: { x: 0, y: 0 },
      lives: 3,
      bombs: 1,
      bombRange: 1,
      speed: 1,
      powerUps: [],
      currentDino: null,
    },
    enemies: [],
    activeBombs: [],
    collectedDinos: [],
  }),
}));

export default useGameStore;

