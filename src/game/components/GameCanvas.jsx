import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import useGameStore from '../store/gameStore';
import { generateMap, getPlayerStartPosition } from '../utils/gameUtils';
import { MAPS } from '../utils/constants';
import { logDebug, logGameState, visualizeMap, visualizePlayerPosition } from '../utils/debug';

// Componentes do jogo
import GameMap from './maps/GameMap';
import Player from './characters/Player';
import Enemy from './characters/Enemy';
import Bomb from './bombs/Bomb';

const GameCanvas = () => {
  const { 
    gameState, 
    currentMap, 
    setCurrentMap, 
    player, 
    setPlayerPosition,
    mapData: storeMapData,
    setMapData: storeSetMapData,
    activeBombs,
    setEnemies
  } = useGameStore();
  
  const [mapData, setMapData] = useState(null);
  const [enemies, setLocalEnemies] = useState([]);
  
  // Inicializa o mapa quando o componente é montado
  useEffect(() => {
    if (!currentMap) {
      // Por padrão, começa com o mapa da floresta
      const mapType = 'FOREST';
      setCurrentMap(mapType);
      
      // Gera o mapa
      const newMap = generateMap(mapType);
      setMapData(newMap);
      storeSetMapData && storeSetMapData(newMap);
      
      // Define a posição inicial do jogador
      const startPosition = getPlayerStartPosition(newMap);
      setPlayerPosition(startPosition);
      
      // Gera inimigos
      generateEnemies(newMap, startPosition);
      
      // Depuração
      logDebug('Mapa gerado', { mapType, size: newMap ? `${newMap.length}x${newMap[0].length}` : 'null' });
      visualizeMap(newMap);
      visualizePlayerPosition(newMap, startPosition);
    }
  }, [currentMap, setCurrentMap, setPlayerPosition, storeSetMapData]);
  
  // Gera inimigos no mapa
  const generateEnemies = (map, playerPos) => {
    if (!map) return;
    
    const height = map.length;
    const width = map[0].length;
    const newEnemies = [];
    
    // Número de inimigos baseado no tamanho do mapa
    const enemyCount = Math.floor((width * height) / 50) + 1;
    
    // Tipos de inimigos
    const enemyTypes = ['DARK_DINO', 'NEXX_DRONE', 'LIVING_BOMB', 'TOXIC_SLIME'];
    
    for (let i = 0; i < enemyCount; i++) {
      // Encontra uma posição válida para o inimigo (não em uma parede e não muito perto do jogador)
      let enemyPos;
      let attempts = 0;
      const maxAttempts = 50;
      
      do {
        const x = Math.floor(Math.random() * (width - 2)) + 1;
        const y = Math.floor(Math.random() * (height - 2)) + 1;
        
        // Verifica se a posição é válida (não é uma parede e está longe do jogador)
        const isWall = map[y][x] === 1 || map[y][x] === 2;
        const distToPlayer = Math.sqrt(
          Math.pow(x - playerPos.x, 2) + Math.pow(y - playerPos.y, 2)
        );
        
        if (!isWall && distToPlayer > 5) {
          enemyPos = { x, y };
          break;
        }
        
        attempts++;
      } while (attempts < maxAttempts);
      
      // Se encontrou uma posição válida, adiciona o inimigo
      if (enemyPos) {
        const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        newEnemies.push({
          id: `enemy-${i}`,
          type: enemyType,
          position: enemyPos,
          speed: 0.5 + Math.random() * 0.5, // Velocidade aleatória entre 0.5 e 1.0
        });
      }
    }
    
    setLocalEnemies(newEnemies);
    setEnemies && setEnemies(newEnemies);
    
    // Depuração
    logDebug('Inimigos gerados', { count: newEnemies.length });
  };
  
  // Depuração do estado do jogo
  useEffect(() => {
    const interval = setInterval(() => {
      logGameState(useGameStore.getState());
    }, 5000); // A cada 5 segundos
    
    return () => clearInterval(interval);
  }, []);

  // Calcula o tamanho do mapa para centralização
  const mapWidth = mapData ? mapData[0].length : 15;
  const mapHeight = mapData ? mapData.length : 15;
  
  return (
    <div className="game-canvas-container" style={{ 
      width: '100%', 
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      backgroundColor: '#000'
    }}>
      <div style={{
        width: '80%',
        height: '80%',
        position: 'relative',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <Canvas shadows>
          {/* Câmera isométrica fixa no estilo Bomberman clássico - AJUSTADA */}
          <OrthographicCamera 
            makeDefault 
            position={[mapWidth/2, mapHeight*1.5, mapHeight/2]} // Posicionada mais acima e centralizada
            zoom={18} // Ajustado para melhor visualização
            near={1}
            far={100}
            lookAt={[mapWidth/2, 0, mapHeight/2]} // Olha para o centro do mapa
          />
          
          {/* Iluminação */}
          <ambientLight intensity={0.7} />
          <directionalLight 
            position={[mapWidth/2, mapHeight*1.5, -mapHeight/2]} 
            intensity={1} 
            castShadow 
            shadow-mapSize-width={2048} 
            shadow-mapSize-height={2048} 
          />
          
          {/* Mapa do jogo */}
          {mapData && (
            <GameMap 
              mapData={mapData} 
              mapType={currentMap} 
            />
          )}
          
          {/* Jogador */}
          {player.position && (
            <Player 
              position={[player.position.x, 0, player.position.y]} 
              character={player.character}
              currentDino={player.currentDino}
              mapData={mapData}
            />
          )}
          
          {/* Bombas */}
          {activeBombs.map((bomb) => (
            <Bomb
              key={bomb.id}
              id={bomb.id}
              position={[bomb.position.x, 0, bomb.position.y]}
              range={bomb.range}
              placedAt={bomb.placedAt}
            />
          ))}
          
          {/* Inimigos */}
          {enemies.map((enemy) => (
            <Enemy
              key={enemy.id}
              position={[enemy.position.x, 0, enemy.position.y]}
              type={enemy.type}
              speed={enemy.speed}
              playerPosition={player.position ? [player.position.x, 0, player.position.y] : [0, 0, 0]}
              mapData={mapData}
            />
          ))}
        </Canvas>
      </div>
    </div>
  );
};

export default GameCanvas;

