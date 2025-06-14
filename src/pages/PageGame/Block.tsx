// @ts-nocheck
import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CellType } from './types'; // Import CellType

interface BlockProps {
  position: [number, number, number];
  type: CellType; // Changed from color to type
}

const Block: React.FC<BlockProps> = ({ position, type }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);  // Adiciona leves animações aos blocos destrutíveis
  useFrame((state) => {
    if (type === CellType.DESTRUCTIBLE_BLOCK && meshRef.current) {
      // Leve flutuação para blocos destrutíveis, considerando a posição já ajustada
      const baseY = position[1] - (1 - blockHeight) / 2;

      // Amplitude de flutuação aumentada para tornar o movimento mais perceptível
      const floatAmplitude = 0.04;

      // Animação de flutuação
      meshRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 1.5) * floatAmplitude;

      // Leve rotação para dar mais vida aos blocos destrutíveis
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    }
  });
  let blockColor = 'gray'; // Default color
  let blockEmissive = new THREE.Color(0x000000);
  const blockOpacity = 1;
  let blockRoughness = 0.5;
  let blockMetalness = 0.2;
  let blockHeight = 1; // Altura padrão do bloco
  let blockWidth = 1;  // Largura padrão do bloco
  let blockDepth = 1;  // Profundidade padrão do bloco
  let blockTexture = null;

  if (type === CellType.SOLID_BLOCK) {
    blockColor = '#505050'; // Cinza escuro mais atraente para blocos sólidos
    blockRoughness = 0.7;
    blockMetalness = 0.3;
    blockHeight = 0.7; // Altura reduzida para blocos sólidos
    blockWidth = 1.0;  // Largura completa para blocos sólidos
    blockDepth = 1.0;  // Profundidade completa para blocos sólidos
  } else if (type === CellType.DESTRUCTIBLE_BLOCK) {
    blockColor = '#CD6839'; // Cor de tijolo mais vibrante para blocos destrutíveis
    blockRoughness = 0.8;
    blockMetalness = 0.1;
    blockEmissive = hovered ? new THREE.Color(0x331100) : new THREE.Color(0x110500);
    blockHeight = 0.65; // Altura reduzida para blocos destrutíveis
    blockWidth = 0.85;  // Largura reduzida para blocos destrutíveis
    blockDepth = 0.85;  // Profundidade reduzida para blocos destrutíveis
  }  // Ajustar a posição para compensar as dimensões reduzidas (centraliza o bloco em sua célula)
  const adjustedPosition: [number, number, number] = [
    position[0],
    position[1] - (1 - blockHeight) / 2, // Centraliza verticalmente com base na nova altura
    position[2]
  ];

  return (
    <mesh
      position={adjustedPosition}
      ref={meshRef}
      castShadow
      receiveShadow
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[blockWidth, blockHeight, blockDepth]} />
      <meshStandardMaterial
        color={blockColor}
        opacity={blockOpacity}
        roughness={blockRoughness}
        metalness={blockMetalness}
        emissive={blockEmissive}
        // Adiciona detalhes visuais aos blocos
        {...(type === CellType.SOLID_BLOCK && {
          bumpScale: 0.02,
          flatShading: true
        })}
        {...(type === CellType.DESTRUCTIBLE_BLOCK && {
          bumpScale: 0.05,
          flatShading: false
        })}
      />
    </mesh>
  );
};

export default Block;
