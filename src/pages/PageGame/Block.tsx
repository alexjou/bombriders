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
  const [hovered, setHovered] = useState(false);

  // Adiciona leves animações aos blocos destrutíveis
  useFrame((state) => {
    if (type === CellType.DESTRUCTIBLE_BLOCK && meshRef.current) {
      // Leve flutuação para blocos destrutíveis
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
    }
  });

  let blockColor = 'gray'; // Default color
  let blockEmissive = new THREE.Color(0x000000);
  const blockOpacity = 1;
  let blockRoughness = 0.5;
  let blockMetalness = 0.2;
  let blockHeight = 1; // Altura padrão do bloco
  let blockTexture = null;

  if (type === CellType.SOLID_BLOCK) {
    blockColor = '#505050'; // Cinza escuro mais atraente para blocos sólidos
    blockRoughness = 0.7;
    blockMetalness = 0.3;
    blockHeight = 1;
  } else if (type === CellType.DESTRUCTIBLE_BLOCK) {
    blockColor = '#CD6839'; // Cor de tijolo mais vibrante para blocos destrutíveis
    blockRoughness = 0.8;
    blockMetalness = 0.1;
    blockEmissive = hovered ? new THREE.Color(0x331100) : new THREE.Color(0x110500);
    blockHeight = 0.95; // Ligeiramente menor
  }
  return (
    <mesh
      position={position}
      ref={meshRef}
      castShadow
      receiveShadow
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, blockHeight, 1]} />
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
