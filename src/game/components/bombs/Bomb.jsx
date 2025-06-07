import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import useGameStore from '../../store/gameStore';
import * as THREE from 'three';

// Importando os assets
import bombSprites from '../../assets/bombs/bomb_sprites.png';
import explosionSprites from '../../assets/bombs/explosion_effect.png';

const Bomb = ({ id, position, range, placedAt }) => {
  const bombRef = useRef();
  const { removeBomb, createExplosion } = useGameStore();
  
  // Estado para controlar a animação da bomba
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [exploded, setExploded] = useState(false);
  const [explosionTime, setExplosionTime] = useState(0);
  
  // Carrega as texturas
  const bombTexture = useTexture(bombSprites);
  const explosionTexture = useTexture(explosionSprites);
  
  // Cria o sprite THREE.js para a bomba
  const bombSpriteMaterial = new THREE.SpriteMaterial({ map: bombTexture, transparent: true });
  const bombSprite = new THREE.Sprite(bombSpriteMaterial);
  bombSprite.scale.set(1.2, 1.2, 1.2); // Ajusta a escala do sprite

  // Cria o sprite THREE.js para a explosão
  const explosionSpriteMaterial = new THREE.SpriteMaterial({ map: explosionTexture, transparent: true });
  const explosionSprite = new THREE.Sprite(explosionSpriteMaterial);
  explosionSprite.scale.set(2.4, 2.4, 2.4); // Ajusta a escala do sprite

  // Tempo de explosão da bomba (3 segundos)
  const explosionDelay = 3000;
  
  // Efeito para controlar a explosão da bomba
  useEffect(() => {
    const timer = setTimeout(() => {
      setExploded(true);
      setExplosionTime(Date.now());
      createExplosion(id, position, range);
      
      // Remove a bomba após a animação de explosão (1 segundo)
      setTimeout(() => {
        removeBomb(id);
      }, 1000);
    }, explosionDelay);
    
    return () => clearTimeout(timer);
  }, [id, position, range, createExplosion, removeBomb]);
  
  // Animação da bomba pulsando
  useFrame((state, delta) => {
    if (!bombRef.current || exploded) return;
    
    // Calcula o tempo decorrido desde que a bomba foi colocada
    const elapsed = (Date.now() - placedAt) / 1000;
    
    // Animação de pulsação
    const pulseSpeed = 3;
    const pulseAmount = 0.2;
    const newScale = 1 + Math.sin(elapsed * pulseSpeed) * pulseAmount;
    setScale(newScale);
    
    // Animação de rotação
    const rotationSpeed = 1;
    setRotation(elapsed * rotationSpeed);
    
    // Aumenta a frequência da pulsação conforme se aproxima da explosão
    const remainingTime = explosionDelay / 1000 - elapsed;
    if (remainingTime < 1) {
      const pulseSpeedFinal = 6;
      const newScaleFinal = 1 + Math.sin(elapsed * pulseSpeedFinal) * pulseAmount;
      setScale(newScaleFinal);
    }
  });
  
  // Animação da explosão
  useFrame((state, delta) => {
    if (!exploded) return;
    
    // Calcula o tempo decorrido desde a explosão
    const elapsed = (Date.now() - explosionTime) / 1000;
    
    // Animação de expansão da explosão
    const expansionSpeed = 2;
    const maxScale = 3;
    const newScale = Math.min(maxScale, elapsed * expansionSpeed);
    setScale(newScale);

    // Atualiza a opacidade do sprite de explosão
    explosionSprite.material.opacity = 1 - (elapsed / 1); // Fade out em 1 segundo
  });
  
  return (
    <group position={[position[0], position[1], position[2]]}>
      {/* Versão 3D da bomba (invisível) */}
      <mesh 
        ref={bombRef}
        visible={false}
        position={[0, 0.3, 0]}
        scale={[scale, scale, scale]}
        rotation={[0, rotation, 0]}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="black" />
        
        {/* Pavio da bomba */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
          <meshStandardMaterial color="gray" />
        </mesh>
        
        {/* Ponta do pavio (acesa) */}
        <mesh position={[0, 0.4, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="orange" emissive="orange" emissiveIntensity={1} />
        </mesh>
      </mesh>
      
      {/* Versão sprite da bomba usando os assets */}
      {!exploded ? (
        <primitive object={bombSprite} position={[0, 0.5, 0]} scale={[scale, scale, scale]} />
      ) : (
        <primitive object={explosionSprite} position={[0, 0.5, 0]} scale={[scale * 2, scale * 2, scale * 2]} />
      )}
      
      {/* Luz da bomba */}
      <pointLight 
        position={[0, 0.4, 0]} 
        intensity={exploded ? 5 : 0.5} 
        distance={exploded ? 5 : 2}
        color={exploded ? "orange" : "yellow"}
      />
      
      {/* Sombra sob a bomba */}
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        visible={!exploded}
      >
        <circleGeometry args={[0.3, 16]} />
        <meshBasicMaterial color="black" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

export default Bomb;


