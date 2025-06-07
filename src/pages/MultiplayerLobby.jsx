import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import multiplayerService from '../services/multiplayerService';

const CharacterSelection = ({ onCharacterSelect, selectedCharacter, unavailableCharacters = [] }) => {
  const characters = [
    {
      id: 'aria',
      name: 'Aria',
      element: 'Air',
      description: 'Mestre dos ventos, move-se com velocidade e agilidade',
      color: 'from-cyan-400 to-blue-500',
      emoji: '💨',
      abilities: ['Velocidade +1', 'Salto Alto', 'Dash Aéreo']
    },
    {
      id: 'bront',
      name: 'Bront',
      element: 'Earth',
      description: 'Guardião da terra, resistente e poderoso',
      color: 'from-green-400 to-emerald-600',
      emoji: '🌍',
      abilities: ['Vida +1', 'Resistência', 'Terremoto']
    },
    {
      id: 'kiro',
      name: 'Kiro',
      element: 'Fire',
      description: 'Senhor das chamas, explosões mais poderosas',
      color: 'from-red-400 to-orange-500',
      emoji: '🔥',
      abilities: ['Alcance +1', 'Explosão Ígnea', 'Imunidade ao Fogo']
    },
    {
      id: 'lume',
      name: 'Lume',
      element: 'Ether',
      description: 'Manipulador da energia etérea, habilidades místicas',
      color: 'from-purple-400 to-pink-500',
      emoji: '✨',
      abilities: ['Teletransporte', 'Escudo Etéreo', 'Visão Astral']
    },
    {
      id: 'zunn',
      name: 'Zunn',
      element: 'Water',
      description: 'Controlador das águas, adaptável e fluido',
      color: 'from-blue-400 to-teal-500',
      emoji: '🌊',
      abilities: ['Cura', 'Congelamento', 'Onda Tsunami']
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {characters.map((character) => {
        const isSelected = selectedCharacter === character.id;
        const isUnavailable = unavailableCharacters.includes(character.id);
        
        return (
          <div
            key={character.id}
            className={`
              relative p-6 rounded-2xl cursor-pointer transition-all duration-300 transform
              ${isSelected 
                ? 'ring-4 ring-yellow-400 scale-105 shadow-2xl' 
                : 'hover:scale-105 hover:shadow-xl'
              }
              ${isUnavailable 
                ? 'opacity-50 cursor-not-allowed bg-gray-300' 
                : `bg-gradient-to-br ${character.color}`
              }
            `}
            onClick={() => !isUnavailable && onCharacterSelect(character.id)}
          >
            {isUnavailable && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">Ocupado</span>
              </div>
            )}
            
            <div className="text-center text-white">
              <div className="text-4xl mb-3">{character.emoji}</div>
              <h3 className="text-xl font-bold mb-2">{character.name}</h3>
              <p className="text-sm opacity-90 mb-3">{character.element}</p>
              <p className="text-xs opacity-80 mb-4">{character.description}</p>
              
              <div className="space-y-1">
                {character.abilities.map((ability, index) => (
                  <div key={index} className="text-xs bg-white bg-opacity-20 rounded-full px-2 py-1">
                    {ability}
                  </div>
                ))}
              </div>
            </div>
            
            {isSelected && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-yellow-900 font-bold">✓</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const MultiplayerLobby = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('menu'); // menu, create, join, lobby, character-select
  const [playerName, setPlayerName] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomPlayers, setRoomPlayers] = useState({});
  const [isHost, setIsHost] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Carregar salas disponíveis
  const loadAvailableRooms = async () => {
    try {
      const rooms = await multiplayerService.listAvailableRooms();
      setAvailableRooms(rooms);
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
    }
  };

  // Criar nova sala
  const createRoom = async () => {
    if (!playerName.trim() || !selectedCharacter) {
      setError('Por favor, insira seu nome e selecione um personagem');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { roomId, playerId } = await multiplayerService.createRoom(playerName, selectedCharacter);
      setCurrentRoom(roomId);
      setIsHost(true);
      setCurrentView('lobby');
      
      // Escutar mudanças na sala
      multiplayerService.onRoomUpdate((snapshot) => {
        const roomData = snapshot.val();
        if (roomData) {
          setRoomPlayers(roomData.players || {});
        }
      });
      
    } catch (error) {
      setError('Erro ao criar sala: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Entrar em sala existente
  const joinRoom = async (roomId) => {
    if (!playerName.trim() || !selectedCharacter) {
      setError('Por favor, insira seu nome e selecione um personagem');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { playerId } = await multiplayerService.joinRoom(roomId, playerName, selectedCharacter);
      setCurrentRoom(roomId);
      setIsHost(false);
      setCurrentView('lobby');
      
      // Escutar mudanças na sala
      multiplayerService.onRoomUpdate((snapshot) => {
        const roomData = snapshot.val();
        if (roomData) {
          setRoomPlayers(roomData.players || {});
        }
      });
      
    } catch (error) {
      setError('Erro ao entrar na sala: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Marcar como pronto
  const toggleReady = async () => {
    const newReadyState = !isReady;
    await multiplayerService.setPlayerReady(newReadyState);
    setIsReady(newReadyState);
  };

  // Iniciar jogo
  const startGame = async () => {
    if (!isHost) return;
    
    const players = Object.values(roomPlayers);
    const allReady = players.every(player => player.isReady || player.id === multiplayerService.getCurrentPlayerId());
    
    if (players.length < 2) {
      setError('É necessário pelo menos 2 jogadores para iniciar');
      return;
    }
    
    if (!allReady) {
      setError('Todos os jogadores devem estar prontos');
      return;
    }

    try {
      await multiplayerService.startGame();
      navigate('/game');
    } catch (error) {
      setError('Erro ao iniciar jogo: ' + error.message);
    }
  };

  // Sair da sala
  const leaveRoom = async () => {
    await multiplayerService.leaveRoom();
    setCurrentRoom(null);
    setRoomPlayers({});
    setIsHost(false);
    setIsReady(false);
    setCurrentView('menu');
  };

  // Obter personagens indisponíveis
  const getUnavailableCharacters = () => {
    return Object.values(roomPlayers)
      .filter(player => player.id !== multiplayerService.getCurrentPlayerId())
      .map(player => player.character);
  };

  // Carregar salas quando necessário
  useEffect(() => {
    if (currentView === 'join') {
      loadAvailableRooms();
      const interval = setInterval(loadAvailableRooms, 5000); // Atualizar a cada 5 segundos
      return () => clearInterval(interval);
    }
  }, [currentView]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-green-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            BombRider Multiplayer
          </h1>
          <p className="text-xl opacity-90">Até 5 jogadores • Batalha épica • NFTs únicos</p>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-4 mb-6 text-center">
            {error}
          </div>
        )}

        {/* Menu Principal */}
        {currentView === 'menu' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Configurar Jogador</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome do Jogador</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Digite seu nome..."
                    className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    maxLength={20}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-4">Escolha seu Rider</label>
                  <CharacterSelection
                    onCharacterSelect={setSelectedCharacter}
                    selectedCharacter={selectedCharacter}
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => setCurrentView('create')}
                disabled={!playerName.trim() || !selectedCharacter}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-6 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-3xl mb-2">🏠</div>
                Criar Sala
              </button>

              <button
                onClick={() => setCurrentView('join')}
                disabled={!playerName.trim() || !selectedCharacter}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-6 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-3xl mb-2">🚪</div>
                Entrar em Sala
              </button>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/')}
                className="text-white text-opacity-70 hover:text-opacity-100 underline"
              >
                ← Voltar para a Landing Page
              </button>
            </div>
          </div>
        )}

        {/* Criar Sala */}
        {currentView === 'create' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Criar Nova Sala</h2>
              
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏠</div>
                  <p className="text-lg opacity-90">
                    Você será o host da sala e poderá iniciar o jogo quando todos estiverem prontos.
                  </p>
                </div>

                <div className="bg-white bg-opacity-10 rounded-xl p-4">
                  <h3 className="font-bold mb-2">Configurações da Sala:</h3>
                  <ul className="space-y-1 text-sm opacity-90">
                    <li>• Máximo de 5 jogadores</li>
                    <li>• Mapa: Floresta Pré-histórica</li>
                    <li>• Duração: 3 minutos por rodada</li>
                    <li>• Modo: Battle Royale</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={createRoom}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 px-6 py-3 rounded-xl font-bold transition-all duration-300"
                  >
                    {loading ? 'Criando...' : 'Criar Sala'}
                  </button>
                  
                  <button
                    onClick={() => setCurrentView('menu')}
                    className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl font-bold transition-all duration-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Entrar em Sala */}
        {currentView === 'join' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Salas Disponíveis</h2>
              
              {availableRooms.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-lg opacity-90 mb-4">Nenhuma sala disponível no momento</p>
                  <button
                    onClick={loadAvailableRooms}
                    className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-xl font-bold transition-all duration-300"
                  >
                    Atualizar
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableRooms.map((room) => (
                    <div
                      key={room.id}
                      className="bg-white bg-opacity-10 rounded-xl p-6 flex items-center justify-between hover:bg-opacity-20 transition-all duration-300"
                    >
                      <div>
                        <h3 className="font-bold text-lg">Sala de {room.host}</h3>
                        <p className="text-sm opacity-90">
                          {room.currentPlayers}/{room.maxPlayers} jogadores • Mapa: {room.map}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => joinRoom(room.id)}
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 px-6 py-3 rounded-xl font-bold transition-all duration-300"
                      >
                        {loading ? 'Entrando...' : 'Entrar'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <button
                  onClick={loadAvailableRooms}
                  className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-xl font-bold transition-all duration-300"
                >
                  🔄 Atualizar Lista
                </button>
                
                <button
                  onClick={() => setCurrentView('menu')}
                  className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl font-bold transition-all duration-300"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lobby da Sala */}
        {currentView === 'lobby' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Sala: {currentRoom}</h2>
                  <p className="text-sm opacity-90">
                    {Object.keys(roomPlayers).length}/5 jogadores
                    {isHost && ' • Você é o host'}
                  </p>
                </div>
                
                <button
                  onClick={leaveRoom}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl font-bold transition-all duration-300"
                >
                  Sair da Sala
                </button>
              </div>

              {/* Lista de Jogadores */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {Object.values(roomPlayers).map((player) => (
                  <div
                    key={player.id}
                    className={`
                      bg-white bg-opacity-10 rounded-xl p-4 text-center
                      ${player.isReady ? 'ring-2 ring-green-400' : ''}
                    `}
                  >
                    <div className="text-3xl mb-2">
                      {player.character === 'aria' && '💨'}
                      {player.character === 'bront' && '🌍'}
                      {player.character === 'kiro' && '🔥'}
                      {player.character === 'lume' && '✨'}
                      {player.character === 'zunn' && '🌊'}
                    </div>
                    <h3 className="font-bold">{player.name}</h3>
                    <p className="text-sm opacity-90 capitalize">{player.character}</p>
                    <div className={`
                      text-xs mt-2 px-2 py-1 rounded-full
                      ${player.isReady ? 'bg-green-500' : 'bg-yellow-500'}
                    `}>
                      {player.isReady ? 'Pronto' : 'Aguardando'}
                    </div>
                  </div>
                ))}
                
                {/* Slots vazios */}
                {Array.from({ length: 5 - Object.keys(roomPlayers).length }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="bg-white bg-opacity-5 rounded-xl p-4 text-center border-2 border-dashed border-white border-opacity-30"
                  >
                    <div className="text-3xl mb-2 opacity-50">👤</div>
                    <p className="text-sm opacity-50">Aguardando jogador...</p>
                  </div>
                ))}
              </div>

              {/* Controles */}
              <div className="flex gap-4">
                <button
                  onClick={toggleReady}
                  className={`
                    flex-1 px-6 py-3 rounded-xl font-bold transition-all duration-300
                    ${isReady 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-yellow-500 hover:bg-yellow-600'
                    }
                  `}
                >
                  {isReady ? '✓ Pronto' : 'Marcar como Pronto'}
                </button>
                
                {isHost && (
                  <button
                    onClick={startGame}
                    disabled={Object.keys(roomPlayers).length < 2}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-xl font-bold transition-all duration-300"
                  >
                    🚀 Iniciar Jogo
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiplayerLobby;

