import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { POWER_UPS } from '../../utils/constants';

const PowerUp = ({ position, type, onCollect }) => {
  const meshRef = useRef();
  
  // Animação de flutuação e rotação
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Flutuação suave
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.2;
    
    // Rotação constante
    meshRef.current.rotation.y += 0.02;
  });
  
  // Obtém informações do power-up
  const powerUpInfo = POWER_UPS[type] || POWER_UPS.BOMB_UP;
  
  // Cores para cada tipo de power-up
  const getPowerUpColor = () => {
    switch (type) {
      case 'BOMB_UP':
        return '#FF4500'; // Vermelho-laranja
      case 'FIRE_UP':
        return '#FF6347'; // Vermelho mais claro
      case 'SPEED_UP':
        return '#1E90FF'; // Azul
      case 'FULL_ARMOR':
        return '#4682B4'; // Azul aço
      case 'REMOTE_BOMB':
        return '#9370DB'; // Roxo médio
      case 'KICK':
        return '#3CB371'; // Verde médio
      case 'PASS':
        return '#20B2AA'; // Verde-azulado claro
      case 'RANDOMIZER':
        return '#FFD700'; // Dourado
      default:
        return '#FF4500';
    }
  };
  
  return (
    <group position={[position[0], position[1], position[2]]}>
      {/* Base do power-up */}
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial 
          color={getPowerUpColor()} 
          emissive={getPowerUpColor()}
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      
      {/* Luz do power-up */}
      <pointLight 
        position={[0, 0.3, 0]} 
        color={getPowerUpColor()} 
        intensity={0.5} 
        distance={2}
      />
      
      {/* Símbolo do power-up (simplificado) */}
      <mesh position={[0, 0, -0.26]} castShadow>
        <planeGeometry args={[0.3, 0.3]} />
        <meshStandardMaterial 
          color="#FFFFFF"
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};

export default PowerUp;

