import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DINOS } from '../../utils/constants';

const DinoEgg = ({ position, type, onCollect }) => {
  const meshRef = useRef();
  
  // Animação de pulso suave
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Pulso suave
    const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    meshRef.current.scale.set(scale, scale, scale);
    
    // Pequena rotação
    meshRef.current.rotation.y += 0.01;
  });
  
  // Obtém informações do dinossauro
  const dinoInfo = DINOS[type] || DINOS.RAPTORIX;
  
  // Cores para cada tipo de dinossauro
  const getDinoColor = () => {
    switch (type) {
      case 'RAPTORIX':
        return '#FFD700'; // Dourado para velocidade
      case 'TRICERABOOM':
        return '#8B4513'; // Marrom para defesa
      case 'FLAMEODON':
        return '#FF4500'; // Vermelho-laranja para ataque
      case 'AQUALUX':
        return '#1E90FF'; // Azul para suporte
      case 'AEROZARD':
        return '#87CEEB'; // Azul claro para mobilidade
      case 'TREXON':
        return '#A52A2A'; // Marrom-avermelhado para força
      default:
        return '#4CAF50'; // Verde padrão
    }
  };
  
  return (
    <group position={[position[0], position[1] + 0.2, position[2]]}>
      {/* Ovo */}
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial 
          color="#F5F5DC" // Bege claro para a casca do ovo
          roughness={0.7}
        />
      </mesh>
      
      {/* Manchas coloridas no ovo */}
      <mesh position={[0.1, 0.1, 0.25]} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial 
          color={getDinoColor()} 
          roughness={0.6}
        />
      </mesh>
      
      <mesh position={[-0.15, 0.05, 0.2]} castShadow>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial 
          color={getDinoColor()} 
          roughness={0.6}
        />
      </mesh>
      
      {/* Brilho suave ao redor do ovo */}
      <pointLight 
        position={[0, 0, 0]} 
        color={getDinoColor()} 
        intensity={0.5} 
        distance={2}
      />
      
      {/* Base do ovo */}
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.1, 16]} />
        <meshStandardMaterial 
          color="#8B4513" // Marrom para a base
          roughness={0.9}
        />
      </mesh>
    </group>
  );
};

export default DinoEgg;

