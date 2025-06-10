import { useState, useEffect, useCallback } from 'react';
import { OrthographicCamera } from '@react-three/drei';
import useGameStore from '../store/gameStore';
import { generateMap, getPlayerStartPosition } from '../utils/gameUtils';
import { BLOCK_TYPES, MAPS } from '../utils/constants';
import { logDebug, logGameState, visualizeMap, visualizePlayerPosition } from '../utils/debug';

// Componentes do jogo
import GameMap from './maps/GameMap';
import Player from './characters/Player';
import Enemy from './characters/Enemy';
import Bomb from './bombs/Bomb';

const GameCanvas = () => {
  const { 
    currentMap, 
    setCurrentMap, 
    player, 
    setPlayerPosition,
    setMapData: storeSetMapData,
    activeBombs,
    setEnemies
  } = useGameStore();
  
  const [mapData, setMapData] = useState(null);
  const [enemies, setLocalEnemies] = useState([]);
  // Gera inimigos no mapa
  const generateEnemies = useCallback((map, playerPos) => {
    if (!map) return;
    
    try {
      const height = map.length;
      const width = map[0].length;
      const newEnemies = [];
      
      // Verifica se o mapa tem dimensões válidas
      if (height < 3 || width < 3) {
        console.warn("Mapa muito pequeno para gerar inimigos");
        setLocalEnemies([]);
        if (typeof setEnemies === 'function') {
          setEnemies([]);
        }
        return;
      }
      
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
          // Usando constantes para clareza e segurança
          const isWall = map[y] && map[y][x] === BLOCK_TYPES.WALL || 
                         map[y] && map[y][x] === BLOCK_TYPES.DESTRUCTIBLE;
          
          // Calcula a distância ao jogador
          const distToPlayer = playerPos ? Math.sqrt(
            Math.pow(x - playerPos.x, 2) + Math.pow(y - playerPos.y, 2)
          ) : 0;
          
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
      if (typeof setEnemies === 'function') {
        setEnemies(newEnemies);
      }
      
      // Depuração
      logDebug('Inimigos gerados', { count: newEnemies.length });
    } catch (error) {
      console.error("Erro ao gerar inimigos:", error);
      setLocalEnemies([]);
      if (typeof setEnemies === 'function') {
        setEnemies([]);
      }
    }
  }, [setLocalEnemies, setEnemies]);
  
  // Inicializa o mapa quando o componente é montado
  useEffect(() => {
    // Verificação das constantes no início para depuração
    console.log("MAPS disponível:", !!MAPS);
    console.log("BLOCK_TYPES disponível:", !!BLOCK_TYPES);
    
    // Garante que temos um tipo de mapa válido
    console.log("Tipo de mapa recebido:", currentMap, typeof currentMap);
    
    // Converte para string se for um número, ou usa o valor padrão
    let mapType;
    if (typeof currentMap === 'number') {
      // Se for um número, tenta converter para uma chave de mapa válida
      const mapKeys = Object.keys(MAPS);
      mapType = mapKeys[currentMap] || 'FOREST';
      console.log("Convertendo número para chave:", currentMap, "->", mapType);
    } else {
      mapType = currentMap || 'FOREST';
    }
    
    console.log("Tipo de mapa solicitado:", mapType);
    
    // Verifica se o tipo de mapa existe nas definições
    if (!MAPS || !MAPS[mapType]) {
      console.warn(`Tipo de mapa ${mapType} não encontrado. Usando FOREST como fallback.`);
      mapType = 'FOREST'; // Garante um valor padrão se o mapa solicitado não existir
    }
    
    setCurrentMap(mapType);
    console.log("Configuração do mapa:", MAPS[mapType]);
    
    try {
      console.log("Tentando gerar mapa do tipo:", mapType);
      
      // Verifica se a função de geração de mapa está disponível
      if (typeof generateMap !== 'function') {
        throw new Error("Função generateMap não está disponível");
      }
      
      // Gera o mapa
      const newMap = generateMap(mapType);
      console.log("Resultado da geração de mapa:", newMap);
      
      if (newMap && Array.isArray(newMap) && newMap.length > 0) {
        console.log(`Mapa gerado com sucesso: ${newMap.length}x${newMap[0].length}`);
        
        setMapData(newMap);
        if (typeof storeSetMapData === 'function') {
          storeSetMapData(newMap);
        }
        
        // Define a posição inicial do jogador
        const startPosition = getPlayerStartPosition(newMap);
        console.log("Posição inicial do jogador:", startPosition);
        setPlayerPosition(startPosition);
        
        // Gera inimigos
        generateEnemies(newMap, startPosition);
        
        // Depuração
        logDebug('Mapa gerado com sucesso', { mapType, size: `${newMap.length}x${newMap[0].length}` });
        visualizeMap(newMap);
        visualizePlayerPosition(newMap, startPosition);
      } else {
        throw new Error("Mapa gerado é inválido ou vazio");
      }
    } catch (error) {
      console.error("Erro ao gerar o mapa:", error);
      console.warn("Gerando mapa de fallback...");
      
      // Geração de mapa de fallback como plano B
      const fallbackMapSize = 15;
      const fallbackMap = Array(fallbackMapSize).fill().map(() => Array(fallbackMapSize).fill(0));
      
      // Adiciona paredes nas bordas
      for (let y = 0; y < fallbackMapSize; y++) {
        for (let x = 0; x < fallbackMapSize; x++) {
          if (x === 0 || y === 0 || x === fallbackMapSize - 1 || y === fallbackMapSize - 1) {
            fallbackMap[y][x] = BLOCK_TYPES ? BLOCK_TYPES.WALL : 1;
          }
        }
      }
      
      console.log("Mapa de fallback gerado:", fallbackMap);
      
      setMapData(fallbackMap);
      if (typeof storeSetMapData === 'function') {
        storeSetMapData(fallbackMap);
      }
      
      // Define a posição inicial do jogador
      const startPosition = { x: 1, y: 1 };
      console.log("Posição inicial do jogador (fallback):", startPosition);
      setPlayerPosition(startPosition);
      
      // Gera inimigos básicos
      generateEnemies(fallbackMap, startPosition);
    }
  }, [currentMap, setCurrentMap, setPlayerPosition, storeSetMapData, generateEnemies]);
  
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
    <>
      {/* Câmera isométrica no estilo clássico de Bomberman - vista de cima */}
      <OrthographicCamera 
        makeDefault 
        position={[mapWidth/2, mapHeight*0.4, mapHeight/2]} // Posicionado diretamente acima com um leve ângulo
        zoom={30} // Valor ainda menor para aproximar mais o mapa
        near={0.1} 
        far={1000}
        rotation={[-Math.PI/2.5, 0, 0]} // Rotação para visão de cima
      />
      {/* Target da câmera - ajuda a manter o foco no mapa */}
      <mesh position={[mapWidth/2, 0, mapHeight/2]} visible={false} name="cameraTarget">
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial opacity={0} transparent />
      </mesh>
      
      {/* Iluminação Super Reforçada para máxima visibilidade */}
      <ambientLight intensity={3.0} /> {/* Luz ambiente muito forte para garantir que tudo seja visível */}
      <directionalLight 
        position={[mapWidth/2, mapHeight*3, mapHeight/2]} 
        intensity={4.0}
        castShadow
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      {/* Luzes extras em posições estratégicas */}
      <pointLight position={[mapWidth/2, 20, mapHeight/2]} intensity={5.0} color="#ffffff" distance={100} />
      <pointLight position={[0, 10, 0]} intensity={3.0} color="#ffeecc" distance={50} />
      <pointLight position={[mapWidth, 10, mapHeight]} intensity={3.0} color="#ffeecc" distance={50} />
      <hemisphereLight 
        skyColor="#ffffff" 
        groundColor="#ddddff" 
        intensity={2.0}
      />
      
      {/* Plano de fundo visível, caso o mapa não seja renderizado */}
      <mesh position={[mapWidth/2, -1, mapHeight/2]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#2a6b2a" 
          roughness={0.6}
          emissive="#2a6b2a"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Grade de visualização para depuração */}
      <gridHelper 
        args={[Math.max(mapWidth, mapHeight) * 2, Math.max(mapWidth, mapHeight) * 2, "#ffffff", "#888888"]} 
        position={[mapWidth/2, 0, mapHeight/2]}
      />
      
      {/* Mapa do jogo */}
      {mapData && (
        <GameMap 
          mapData={mapData} 
          mapType={typeof currentMap === 'string' ? currentMap : 'FOREST'} 
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
    </>
  );
};

export default GameCanvas;

