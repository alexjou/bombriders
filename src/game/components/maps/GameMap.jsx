import React, { useMemo } from 'react';
import { BLOCK_TYPES, MAPS } from '../../utils/constants';
import WallBlock from './blocks/WallBlock';
import DestructibleBlock from './blocks/DestructibleBlock';
import WaterBlock from './blocks/WaterBlock';
import GroundBlock from './blocks/GroundBlock';

const GameMap = ({ mapData, mapType }) => {
  // Memoriza os blocos do mapa para evitar re-renderizações desnecessárias
  const mapBlocks = useMemo(() => {
    if (!mapData) return [];
    
    const blocks = [];
    const height = mapData.length;
    const width = mapData[0].length;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const blockType = mapData[y][x];
        const key = `block-${x}-${y}`;
        const position = [x, 0, y]; // Usa y como z no espaço 3D
        
        // Adiciona o bloco de chão para todas as posições
        blocks.push(
          <GroundBlock 
            key={`ground-${x}-${y}`} 
            position={position} 
            mapType={mapType}
            isAlternate={(x + y) % 2 === 0} // Padrão de tabuleiro de xadrez
          />
        );
        
        // Adiciona blocos específicos por cima do chão
        switch (blockType) {
          case BLOCK_TYPES.WALL:
            blocks.push(
              <WallBlock 
                key={key} 
                position={position} 
                mapType={mapType} 
              />
            );
            break;
          case BLOCK_TYPES.DESTRUCTIBLE:
            blocks.push(
              <DestructibleBlock 
                key={key} 
                position={position} 
                mapType={mapType} 
              />
            );
            break;
          case BLOCK_TYPES.WATER:
            blocks.push(
              <WaterBlock 
                key={key} 
                position={position} 
                mapType={mapType} 
              />
            );
            break;
          default:
            // Para blocos vazios, o chão já foi adicionado
            break;
        }
      }
    }
    
    return blocks;
  }, [mapData, mapType]);
  
  // Configurações específicas do mapa
  const mapConfig = MAPS[mapType];
  
  // Cores do mapa baseadas no tipo
  const getMapColors = () => {
    switch (mapType) {
      case 'FOREST':
        return {
          primary: '#4a8c3d',
          secondary: '#3a7c2d',
          border: '#2a5c1d',
          ground1: '#8BC34A',
          ground2: '#689F38'
        };
      case 'CAVE':
        return {
          primary: '#3a3a3a',
          secondary: '#2a2a2a',
          border: '#1a1a1a',
          ground1: '#616161',
          ground2: '#424242'
        };
      case 'DESERT':
        return {
          primary: '#d9c07c',
          secondary: '#c9b06c',
          border: '#b9a05c',
          ground1: '#F9E076',
          ground2: '#E6C84C'
        };
      case 'SWAMP':
        return {
          primary: '#2d4c3e',
          secondary: '#1d3c2e',
          border: '#0d2c1e',
          ground1: '#4CAF50',
          ground2: '#388E3C'
        };
      default:
        return {
          primary: '#555555',
          secondary: '#444444',
          border: '#333333',
          ground1: '#8BC34A',
          ground2: '#689F38'
        };
    }
  };
  
  const mapColors = getMapColors();
  
  return (
    <group>
      {/* Plano de fundo do mapa com padrão de tabuleiro */}
      <mesh 
        receiveShadow 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[mapData ? mapData[0].length / 2 - 0.5 : 0, -0.51, mapData ? mapData.length / 2 - 0.5 : 0]}
      >
        <planeGeometry 
          args={[
            mapData ? mapData[0].length + 4 : 14, 
            mapData ? mapData.length + 4 : 14
          ]} 
        />
        <meshStandardMaterial color={mapColors.border} />
      </mesh>
      
      {/* Renderiza todos os blocos do mapa */}
      {mapBlocks}
      
      {/* Efeitos específicos do mapa */}
      {mapType === 'DESERT' && (
        <fog attach="fog" args={['#d9c07c', 15, 30]} />
      )}
      
      {mapType === 'CAVE' && (
        <>
          <ambientLight intensity={0.3} />
          <pointLight position={[mapData ? mapData[0].length / 2 : 5, 5, mapData ? mapData.length / 2 : 5]} intensity={0.8} />
        </>
      )}
      
      {/* Bordas do mapa - Ajustadas para serem mais visíveis */}
      <group>
        {/* Borda superior */}
        <mesh 
          position={[
            mapData ? mapData[0].length / 2 - 0.5 : 0, 
            0.5, 
            -0.5
          ]} 
          castShadow
        >
          <boxGeometry args={[mapData ? mapData[0].length + 2 : 12, 1, 1]} />
          <meshStandardMaterial color={mapColors.border} />
        </mesh>
        
        {/* Borda inferior */}
        <mesh 
          position={[
            mapData ? mapData[0].length / 2 - 0.5 : 0, 
            0.5, 
            mapData ? mapData.length - 0.5 : 9
          ]} 
          castShadow
        >
          <boxGeometry args={[mapData ? mapData[0].length + 2 : 12, 1, 1]} />
          <meshStandardMaterial color={mapColors.border} />
        </mesh>
        
        {/* Borda esquerda */}
        <mesh 
          position={[
            -0.5, 
            0.5, 
            mapData ? mapData.length / 2 - 0.5 : 0
          ]} 
          castShadow
        >
          <boxGeometry args={[1, 1, mapData ? mapData.length : 10]} />
          <meshStandardMaterial color={mapColors.border} />
        </mesh>
        
        {/* Borda direita */}
        <mesh 
          position={[
            mapData ? mapData[0].length - 0.5 : 9, 
            0.5, 
            mapData ? mapData.length / 2 - 0.5 : 0
          ]} 
          castShadow
        >
          <boxGeometry args={[1, 1, mapData ? mapData.length : 10]} />
          <meshStandardMaterial color={mapColors.border} />
        </mesh>
      </group>
      
      {/* Adiciona uma luz ambiente mais forte para melhorar a visibilidade */}
      <ambientLight intensity={0.8} />
      
      {/* Adiciona uma luz direcional para simular o sol */}
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1.2} 
        castShadow 
      />
    </group>
  );
};

export default GameMap;

