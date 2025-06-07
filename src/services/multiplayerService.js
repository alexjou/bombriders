import { realtimeDb } from './firebase.js';
import { ref, push, set, onValue, off, remove, update } from 'firebase/database';

class MultiplayerService {
  constructor() {
    this.currentRoom = null;
    this.playerId = null;
    this.listeners = new Map();
  }

  // Gerar ID único para o jogador
  generatePlayerId() {
    return 'player_' + Math.random().toString(36).substr(2, 9);
  }

  // Criar uma nova sala de jogo
  async createRoom(playerName, selectedCharacter) {
    try {
      const roomsRef = ref(realtimeDb, 'rooms');
      const newRoomRef = push(roomsRef);
      const roomId = newRoomRef.key;
      
      this.playerId = this.generatePlayerId();
      this.currentRoom = roomId;

      const roomData = {
        id: roomId,
        host: this.playerId,
        status: 'waiting', // waiting, playing, finished
        maxPlayers: 5,
        currentPlayers: 1,
        createdAt: Date.now(),
        gameState: {
          map: 'forest', // default map
          round: 1,
          timeLeft: 180, // 3 minutes
          powerUps: {},
          bombs: {},
          explosions: {}
        },
        players: {
          [this.playerId]: {
            id: this.playerId,
            name: playerName,
            character: selectedCharacter,
            position: { x: 1, y: 1 },
            health: 3,
            bombCount: 1,
            bombRange: 1,
            speed: 1,
            score: 0,
            isAlive: true,
            isReady: false,
            joinedAt: Date.now()
          }
        }
      };

      await set(newRoomRef, roomData);
      
      console.log(`Sala criada: ${roomId}`);
      return { roomId, playerId: this.playerId };
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      throw error;
    }
  }

  // Entrar em uma sala existente
  async joinRoom(roomId, playerName, selectedCharacter) {
    try {
      const roomRef = ref(realtimeDb, `rooms/${roomId}`);
      
      // Verificar se a sala existe e tem espaço
      return new Promise((resolve, reject) => {
        onValue(roomRef, (snapshot) => {
          const roomData = snapshot.val();
          
          if (!roomData) {
            reject(new Error('Sala não encontrada'));
            return;
          }

          if (roomData.currentPlayers >= roomData.maxPlayers) {
            reject(new Error('Sala lotada'));
            return;
          }

          if (roomData.status !== 'waiting') {
            reject(new Error('Jogo já iniciado'));
            return;
          }

          // Verificar se o personagem já foi escolhido
          const existingCharacters = Object.values(roomData.players || {}).map(p => p.character);
          if (existingCharacters.includes(selectedCharacter)) {
            reject(new Error('Personagem já escolhido por outro jogador'));
            return;
          }

          this.playerId = this.generatePlayerId();
          this.currentRoom = roomId;

          // Adicionar jogador à sala
          const playerData = {
            id: this.playerId,
            name: playerName,
            character: selectedCharacter,
            position: this.getSpawnPosition(roomData.currentPlayers),
            health: 3,
            bombCount: 1,
            bombRange: 1,
            speed: 1,
            score: 0,
            isAlive: true,
            isReady: false,
            joinedAt: Date.now()
          };

          const updates = {};
          updates[`rooms/${roomId}/players/${this.playerId}`] = playerData;
          updates[`rooms/${roomId}/currentPlayers`] = roomData.currentPlayers + 1;

          update(ref(realtimeDb), updates).then(() => {
            console.log(`Entrou na sala: ${roomId}`);
            resolve({ roomId, playerId: this.playerId });
          }).catch(reject);

          // Remove o listener após a primeira verificação
          off(roomRef);
        }, { onlyOnce: true });
      });
    } catch (error) {
      console.error('Erro ao entrar na sala:', error);
      throw error;
    }
  }

  // Obter posição de spawn baseada no número de jogadores
  getSpawnPosition(playerCount) {
    const spawnPositions = [
      { x: 1, y: 1 },
      { x: 13, y: 1 },
      { x: 1, y: 11 },
      { x: 13, y: 11 },
      { x: 7, y: 6 }
    ];
    return spawnPositions[playerCount] || { x: 1, y: 1 };
  }

  // Listar salas disponíveis
  async listAvailableRooms() {
    try {
      const roomsRef = ref(realtimeDb, 'rooms');
      
      return new Promise((resolve) => {
        onValue(roomsRef, (snapshot) => {
          const rooms = snapshot.val() || {};
          const availableRooms = Object.values(rooms)
            .filter(room => 
              room.status === 'waiting' && 
              room.currentPlayers < room.maxPlayers &&
              (Date.now() - room.createdAt) < 300000 // Salas criadas há menos de 5 minutos
            )
            .map(room => ({
              id: room.id,
              currentPlayers: room.currentPlayers,
              maxPlayers: room.maxPlayers,
              host: Object.values(room.players)[0]?.name || 'Desconhecido',
              map: room.gameState.map
            }));
          
          resolve(availableRooms);
        }, { onlyOnce: true });
      });
    } catch (error) {
      console.error('Erro ao listar salas:', error);
      return [];
    }
  }

  // Marcar jogador como pronto
  async setPlayerReady(isReady = true) {
    if (!this.currentRoom || !this.playerId) return;

    try {
      const playerRef = ref(realtimeDb, `rooms/${this.currentRoom}/players/${this.playerId}/isReady`);
      await set(playerRef, isReady);
    } catch (error) {
      console.error('Erro ao definir status de pronto:', error);
    }
  }

  // Atualizar posição do jogador
  async updatePlayerPosition(position) {
    if (!this.currentRoom || !this.playerId) return;

    try {
      const positionRef = ref(realtimeDb, `rooms/${this.currentRoom}/players/${this.playerId}/position`);
      await set(positionRef, position);
    } catch (error) {
      console.error('Erro ao atualizar posição:', error);
    }
  }

  // Colocar bomba
  async placeBomb(position) {
    if (!this.currentRoom || !this.playerId) return;

    try {
      const bombId = `bomb_${Date.now()}_${this.playerId}`;
      const bombRef = ref(realtimeDb, `rooms/${this.currentRoom}/gameState/bombs/${bombId}`);
      
      const bombData = {
        id: bombId,
        playerId: this.playerId,
        position: position,
        range: 1, // Será obtido do jogador
        timer: 3000, // 3 segundos
        placedAt: Date.now()
      };

      await set(bombRef, bombData);
      return bombId;
    } catch (error) {
      console.error('Erro ao colocar bomba:', error);
    }
  }

  // Escutar mudanças na sala
  onRoomUpdate(callback) {
    if (!this.currentRoom) return;

    const roomRef = ref(realtimeDb, `rooms/${this.currentRoom}`);
    const listenerId = 'room_' + Date.now();
    
    onValue(roomRef, callback);
    this.listeners.set(listenerId, { ref: roomRef, callback });
    
    return listenerId;
  }

  // Escutar mudanças nos jogadores
  onPlayersUpdate(callback) {
    if (!this.currentRoom) return;

    const playersRef = ref(realtimeDb, `rooms/${this.currentRoom}/players`);
    const listenerId = 'players_' + Date.now();
    
    onValue(playersRef, callback);
    this.listeners.set(listenerId, { ref: playersRef, callback });
    
    return listenerId;
  }

  // Escutar mudanças no estado do jogo
  onGameStateUpdate(callback) {
    if (!this.currentRoom) return;

    const gameStateRef = ref(realtimeDb, `rooms/${this.currentRoom}/gameState`);
    const listenerId = 'gameState_' + Date.now();
    
    onValue(gameStateRef, callback);
    this.listeners.set(listenerId, { ref: gameStateRef, callback });
    
    return listenerId;
  }

  // Remover listener
  removeListener(listenerId) {
    const listener = this.listeners.get(listenerId);
    if (listener) {
      off(listener.ref, listener.callback);
      this.listeners.delete(listenerId);
    }
  }

  // Sair da sala
  async leaveRoom() {
    if (!this.currentRoom || !this.playerId) return;

    try {
      // Remover jogador da sala
      const playerRef = ref(realtimeDb, `rooms/${this.currentRoom}/players/${this.playerId}`);
      await remove(playerRef);

      // Atualizar contador de jogadores
      const roomRef = ref(realtimeDb, `rooms/${this.currentRoom}`);
      onValue(roomRef, async (snapshot) => {
        const roomData = snapshot.val();
        if (roomData) {
          const currentPlayers = Object.keys(roomData.players || {}).length;
          await update(ref(realtimeDb), {
            [`rooms/${this.currentRoom}/currentPlayers`]: currentPlayers
          });

          // Se não há mais jogadores, remover a sala
          if (currentPlayers === 0) {
            await remove(roomRef);
          }
        }
      }, { onlyOnce: true });

      // Remover todos os listeners
      this.listeners.forEach((listener, id) => {
        this.removeListener(id);
      });

      this.currentRoom = null;
      this.playerId = null;
    } catch (error) {
      console.error('Erro ao sair da sala:', error);
    }
  }

  // Iniciar jogo (apenas o host pode fazer isso)
  async startGame() {
    if (!this.currentRoom) return;

    try {
      const updates = {};
      updates[`rooms/${this.currentRoom}/status`] = 'playing';
      updates[`rooms/${this.currentRoom}/gameState/startedAt`] = Date.now();
      
      await update(ref(realtimeDb), updates);
    } catch (error) {
      console.error('Erro ao iniciar jogo:', error);
    }
  }

  // Obter informações da sala atual
  getCurrentRoom() {
    return this.currentRoom;
  }

  // Obter ID do jogador atual
  getCurrentPlayerId() {
    return this.playerId;
  }
}

// Exportar instância singleton
export const multiplayerService = new MultiplayerService();
export default multiplayerService;

