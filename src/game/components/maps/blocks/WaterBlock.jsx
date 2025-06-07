import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const WaterBlock = ({ position, mapType }) => {
  const meshRef = useRef();
  
  // Animação da água
  useFrame((state) => {
    if (meshRef.current) {
      // Faz a água "ondular" com base no tempo
      meshRef.current.position.y = -0.3 + Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  // Cores diferentes para cada tipo de mapa
  const getWaterColor = () => {
    switch (mapType) {
      case 'FOREST':
        return '#4a95c0'; // Azul para lagos
      case 'CAVE':
        return '#3a7d9e'; // Azul escuro para água subterrânea
      case 'DESERT':
        return '#6eb5ff'; // Azul claro para oásis
      case 'SWAMP':
        return '#5e7e6b'; // Verde-azulado escuro para água do pântano
      default:
        return '#4a95c0';
    }
  };

  return (
    <group position={[position[0], position[1] - 0.3, position[2]]}>
      {/* Base da água (mais escura) */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshStandardMaterial 
          color={getWaterColor()} 
          opacity={0.8} 
          transparent 
        />
      </mesh>
      
      {/* Superfície da água (com animação) */}
      <mesh ref={meshRef} receiveShadow>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial 
          color={getWaterColor()} 
          opacity={0.6} 
          transparent 
          metalness={0.2}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
};

export default WaterBlock;

