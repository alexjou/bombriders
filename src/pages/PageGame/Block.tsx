import React, { useRef } from 'react';
import * as THREE from 'three';
import { CellType } from './types'; // Import CellType

interface BlockProps {
  position: [number, number, number];
  type: CellType; // Changed from color to type
}

const Block: React.FC<BlockProps> = ({ position, type }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  let blockColor = 'gray'; // Default color
  const blockOpacity = 1; // Corrigido para const
  let blockRoughness = 0.5;
  let blockMetalness = 0.2;

  if (type === CellType.SOLID_BLOCK) {
    blockColor = '#606060'; // Cinza escuro para blocos sólidos
    blockRoughness = 0.7;
    blockMetalness = 0.1;
  } else if (type === CellType.DESTRUCTIBLE_BLOCK) {
    blockColor = '#D2691E'; // Cor de tijolo/chocolate para blocos destrutíveis
    blockRoughness = 0.8;
    blockMetalness = 0.0;
  }

  return (
    <mesh position={position} ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={blockColor}
        opacity={blockOpacity}
        roughness={blockRoughness}
        metalness={blockMetalness}
      />
    </mesh>
  );
};

export default Block;
