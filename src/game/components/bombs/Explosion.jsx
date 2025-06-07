import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';

const Explosion = ({ position, duration = 1, onComplete }) => {
  const groupRef = useRef();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [particles, setParticles] = useState([]);
  
  // Gera partículas de explosão
  useEffect(() => {
    const particleCount = 20;
    const newParticles = [];
    
    for (let i = 0; i < particleCount; i++) {
      // Direção aleatória para cada partícula
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.05 + Math.random() * 0.1;
      const size = 0.1 + Math.random() * 0.2;
      
      newParticles.push({
        id: i,
        direction: [
          Math.cos(angle) * speed,
          (Math.random() - 0.5) * speed * 2,
          Math.sin(angle) * speed
        ],
        size,
        position: [0, 0, 0],
        color: Math.random() > 0.7 ? '#FF4500' : '#FFA500'
      });
    }
    
    setParticles(newParticles);
  }, []);
  
  // Anima as partículas
  useFrame((state, delta) => {
    if (timeElapsed >= duration) {
      onComplete && onComplete();
      return;
    }
    
    setTimeElapsed(prev => prev + delta);
    
    // Atualiza a posição de cada partícula
    setParticles(prev => 
      prev.map(particle => ({
        ...particle,
        position: [
          particle.position[0] + particle.direction[0],
          particle.position[1] + particle.direction[1],
          particle.position[2] + particle.direction[2]
        ],
        // Diminui o tamanho com o tempo
        size: particle.size * (1 - timeElapsed / duration)
      }))
    );
  });
  
  // Não renderiza nada após a duração da explosão
  if (timeElapsed >= duration) return null;
  
  // Calcula a opacidade com base no tempo decorrido
  const opacity = 1 - (timeElapsed / duration);
  
  return (
    <group ref={groupRef} position={position}>
      {/* Centro da explosão */}
      <mesh>
        <sphereGeometry args={[0.5 * (1 - timeElapsed / duration), 8, 8]} />
        <meshStandardMaterial 
          color="#FF4500" 
          emissive="#FF4500"
          emissiveIntensity={2}
          transparent
          opacity={opacity}
        />
      </mesh>
      
      {/* Luz da explosão */}
      <pointLight 
        color="#FF4500" 
        intensity={5 * (1 - timeElapsed / duration)} 
        distance={5}
        decay={2}
      />
      
      {/* Partículas */}
      {particles.map(particle => (
        <mesh 
          key={particle.id}
          position={[
            position[0] + particle.position[0],
            position[1] + particle.position[1],
            position[2] + particle.position[2]
          ]}
        >
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshStandardMaterial 
            color={particle.color}
            emissive={particle.color}
            emissiveIntensity={1}
            transparent
            opacity={opacity}
          />
        </mesh>
      ))}
    </group>
  );
};

export default Explosion;

