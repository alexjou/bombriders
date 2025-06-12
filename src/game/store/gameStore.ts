import { create } from 'zustand';
import { GameState, GameStoreState, BombData } from '@/types/game';

/**
 * Store para gerenciar o estado global do jogo
 */
const useGameStore = create<GameStoreState>((set) => ({
  // Estado do jogo
  gameState: 'menu',
  currentMap: null,
  mapData: null,
  // Jogador
  player: {
    character: 'Aria',
    position: { x: 0, y: 0 }, // Posição 2D no grid
    lives: 3,
    bombs: 1,
    bombRange: 1,
    speed: 1,
    powerUps: [],
    currentDino: null,
    score: 0,
    isInvincible: false,
    enemies: 5
  },

  // Inimigos
  enemies: [],

  // Bombas ativas
  activeBombs: [],

  // Dinossauros coletados
  collectedDinos: [],

  // Ações para gerenciar o estado do jogo
  setGameState: (state: GameState) => set({ gameState: state }),
  setCurrentMap: (map: string | null) => set({ currentMap: map }),
  setMapData: (mapData: any | null) => set({ mapData }),

  // Ações relacionadas ao jogador
  setScore: (score: number) => set((state) => ({
    player: { ...state.player, score }
  })),

  setPlayerCharacter: (character: string) => set((state) => ({
    player: { ...state.player, character }
  })),

  setPlayerPosition: (position: { x: number; y: number }) => set((state) => ({
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

  addPowerUp: (powerUp: string) => set((state) => ({
    player: {
      ...state.player,
      powerUps: [...state.player.powerUps, powerUp]
    }
  })),

  setCurrentDino: (dino: string | null) => set((state) => ({
    player: { ...state.player, currentDino: dino }
  })),

  addCollectedDino: (dino: string) => set((state) => ({
    collectedDinos: [...state.collectedDinos, dino]
  })),

  // Ações relacionadas às bombas
  addBomb: (bomb) => set((state) => {
    return {
      activeBombs: [...state.activeBombs, bomb]
    };
  }),

  placeBomb: (position: { x: number; y: number }) => set((state) => {
    if (state.activeBombs.length >= state.player.bombs) {
      return state; // Retorna o estado inalterado se não puder colocar mais bombas
    }
    const newBomb: BombData = {
      id: `bomb-${Date.now()}`,
      col: position.x,
      row: position.y,
      range: state.player.bombRange,
      timerId: Date.now(), // Usando Date.now() como um placeholder para timerId, idealmente seria um ID de setTimeout
      placedAt: Date.now(),
    };

    return {
      activeBombs: [...state.activeBombs, newBomb]
    };
  }),
  removeBomb: (bombId: string) => set((state) => ({
    activeBombs: state.activeBombs.filter(bomb => bomb.id !== bombId)
  })),

  // Ações relacionadas aos inimigos
  setEnemies: (enemies) => set((state) => ({
    enemies,
    player: {
      ...state.player,
      enemies: enemies.length // Atualiza a contagem correta de inimigos
    }
  })),

  updateEnemyPosition: (enemyId: string, position: { x: number; y: number }) => set((state) => ({
    enemies: state.enemies.map(enemy =>
      enemy.id === enemyId ? { ...enemy, position } : enemy
    )
  })),
  removeEnemy: (enemyId: string) => set((state) => {
    const updatedEnemies = state.enemies.filter(enemy => enemy.id !== enemyId);
    const remainingEnemyCount = Math.max(0, (state.player.enemies || 0) - 1);

    console.log(`Inimigo removido. Restando: ${remainingEnemyCount}`);

    return {
      enemies: updatedEnemies,
      player: {
        ...state.player,
        score: state.player.score + 100, // Incrementa a pontuação ao eliminar um inimigo
        enemies: remainingEnemyCount // Atualiza a contagem de inimigos restantes
      }
    };
  }),

  // Funções para transição de níveis
  goToNextLevel: () => {
    console.log("Avançando para o próximo nível");
    set((state) => ({
      gameState: 'playing',
      player: {
        ...state.player,
        // Mantém o score e os power-ups entre níveis
        enemies: 5 // Reseta contagem de inimigos para o valor inicial
      },
      // Reseta outros elementos do jogo para o novo nível
      enemies: [],
      activeBombs: [],
    }));
  },
  // Reinicia o jogo mantendo algumas configurações
  restartGame: () => {
    console.log("Reiniciando o jogo");
    set((state) => ({
      gameState: 'playing',
      player: {
        ...state.player,
        lives: 3,
        enemies: 5, // Resetar contagem de inimigos para o valor inicial
        position: { x: 0, y: 0 },
        isInvincible: false,
        score: 0
      },
      enemies: [],
      activeBombs: [],
    }));
  },
  // Reset completo do jogo
  resetGame: () => {
    console.log("resetGame chamado no gameStore");
    set({
      gameState: 'menu',
      currentMap: null,
      mapData: null,
      player: {
        character: 'Aria',
        position: { x: 0, y: 0 },
        lives: 3,
        bombs: 1,
        bombRange: 1,
        speed: 1,
        powerUps: [],
        currentDino: null,
        score: 0,
        isInvincible: false,
        enemies: 5  // Garante que a contagem de inimigos seja correta no reset
      },
      enemies: [],
      activeBombs: [],
      collectedDinos: [],
    });
    console.log("Estado do jogo resetado com sucesso");
  },
}));

export default useGameStore;
