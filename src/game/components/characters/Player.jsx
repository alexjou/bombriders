import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls, Billboard, useTexture } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import useGameStore from '../../store/gameStore';
import { CHARACTERS } from '../../utils/constants';
import { checkCollision } from '../../utils/gameUtils';
import * as THREE from 'three';

// Importando os assets
import playerTexture from '../../assets/characters/bomberman_sprites.png';

// Componente animado para o modelo do jogador
const AnimatedGroup = animated.group;

const Player = ({ position, character, mapData }) => {
  const groupRef = useRef();
  const { 
    player, 
    setPlayerPosition, 
    placeBomb,
    gameState,
    activeBombs
  } = useGameStore();
  
  // Estado para controlar o cooldown da bomba
  const [bombCooldown, setBombCooldown] = useState(false);
  
  // Estado para animação de movimento
  const [bobOffset, setBobOffset] = useState(0);
  const [direction, setDirection] = useState('down');
  
  // Configuração dos controles de teclado
  const [, getKeys] = useKeyboardControls();
  
  // Animação de movimento
  const [springs, api] = useSpring(() => ({
    position: [position[0], position[1], position[2]],
    rotation: [0, 0, 0],
    config: { mass: 1, tension: 180, friction: 12 }
  }));
  
  // Atualiza a posição do jogador com base nas teclas pressionadas
  useFrame((state, delta) => {
    if (!groupRef.current || gameState !== 'playing' || !mapData) return;
    
    const { forward, backward, left, right, space } = getKeys();
    
    // Velocidade base do jogador
    const characterConfig = CHARACTERS[character.toUpperCase()] || CHARACTERS.ARIA;
    const baseSpeed = characterConfig.initialSpeed || 1.0;
    const speed = baseSpeed * player.speed * delta * 4.5; // Aumentada velocidade para movimentação mais rápida
    
    // Posição atual
    let newX = position[0];
    let newZ = position[2];
    
    // Direção de movimento
    let newDirection = direction;
    let isMovingNow = false;
    
    if (forward) {
      const nextPos = { x: newX, y: newZ - speed };
      if (!checkCollision(nextPos, mapData)) {
        newZ -= speed;
        newDirection = 'up';
        isMovingNow = true;
      }
    }
    if (backward) {
      const nextPos = { x: newX, y: newZ + speed };
      if (!checkCollision(nextPos, mapData)) {
        newZ += speed;
        newDirection = 'down';
        isMovingNow = true;
      }
    }
    if (left) {
      const nextPos = { x: newX - speed, y: newZ };
      if (!checkCollision(nextPos, mapData)) {
        newX -= speed;
        newDirection = 'left';
        isMovingNow = true;
      }
    }
    if (right) {
      const nextPos = { x: newX + speed, y: newZ };
      if (!checkCollision(nextPos, mapData)) {
        newX += speed;
        newDirection = 'right';
        isMovingNow = true;
      }
    }
    
    // Atualiza a direção
    setDirection(newDirection);
    
    // Animação de bobbing (subir e descer) quando em movimento
    if (isMovingNow) {
      setBobOffset((prev) => (prev + delta * 5) % (Math.PI * 2));
    } else {
      setBobOffset(0);
    }
    
    // Atualiza a posição no store se houve movimento
    if (newX !== position[0] || newZ !== position[2]) {
      setPlayerPosition({ x: newX, y: newZ });
      
      // Atualiza a animação
      api.start({
        position: [newX, position[1] + Math.sin(bobOffset) * 0.1, newZ],
        rotation: [
          0,
          newDirection === 'left' ? Math.PI / 2 : 
          newDirection === 'right' ? -Math.PI / 2 : 
          newDirection === 'up' ? 0 : 
          newDirection === 'down' ? Math.PI : 0,
          0
        ]
      });
    }
    
    // Colocar bomba com a tecla de espaço
    if (space && !bombCooldown) {
      // Arredonda a posição para o grid
      const gridX = Math.round(newX);
      const gridZ = Math.round(newZ);
      
      console.log("Tentando colocar bomba em:", gridX, gridZ);
      
      // Verifica se já existe uma bomba na mesma posição
      const hasBombAtPosition = activeBombs?.some(
        bomb => Math.round(bomb.position.x) === gridX && Math.round(bomb.position.y) === gridZ
      );
      
      // Verifica se a posição está vazia (não é parede ou outro obstáculo)
      const canPlaceBomb = !checkCollision({ x: gridX, y: gridZ }, mapData) && !hasBombAtPosition;
      
      // Coloca a bomba se possível
      if (canPlaceBomb) {
        placeBomb({ x: gridX, y: gridZ });
        console.log("Bomba colocada em:", gridX, gridZ);
        
        // Pequena animação de feedback visual
        api.start({
          position: [newX, position[1] + 0.2, newZ], // Pequeno pulo
          config: { tension: 400, friction: 20 }
        });
        
        setTimeout(() => {
          api.start({
            position: [newX, position[1], newZ],
            config: { tension: 400, friction: 20 }
          });
        }, 150);
      }
      
      // Ativa o cooldown da bomba
      setBombCooldown(true);
      setTimeout(() => setBombCooldown(false), 300); // 300ms de cooldown
    }
  });
  
  // Atualiza a posição quando as props mudam
  useEffect(() => {
    api.start({
      position: [position[0], position[1], position[2]]
    });
  }, [position, api]);
  
  // Cores para cada personagem
  const getCharacterColor = () => {
    switch (character.toUpperCase()) {
      case 'ARIA':
        return '#87CEEB'; // Azul claro para Ar
      case 'BRONT':
        return '#8B4513'; // Marrom para Terra
      case 'KIRO':
        return '#FF4500'; // Vermelho-laranja para Fogo
      case 'LUME':
        return '#9370DB'; // Roxo para Éter
      case 'ZUNN':
        return '#1E90FF'; // Azul para Água
      default:
        return '#87CEEB';
    }
  };
  
  // Cores secundárias para cada personagem
  const getCharacterSecondaryColor = () => {
    switch (character.toUpperCase()) {
      case 'ARIA':
        return '#4682B4'; // Azul mais escuro
      case 'BRONT':
        return '#654321'; // Marrom mais escuro
      case 'KIRO':
        return '#B22222'; // Vermelho mais escuro
      case 'LUME':
        return '#663399'; // Roxo mais escuro
      case 'ZUNN':
        return '#0000CD'; // Azul mais escuro
      default:
        return '#4682B4';
    }
  };
  
  const characterSecondaryColor = getCharacterSecondaryColor();
  
  return (
    <AnimatedGroup 
      ref={groupRef}
      {...springs}
    >
      {/* Versão 3D do jogador (estilo Bomberman) */}
      <group>
        {/* Corpo principal */}
        <mesh 
          castShadow 
          receiveShadow
          position={[0, 0.5, 0]}
        >
          <boxGeometry args={[0.5, 0.8, 0.5]} />
          <meshStandardMaterial 
            color={getCharacterColor()} 
            emissive={getCharacterColor()} 
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Cabeça */}
        <mesh
          castShadow
          position={[0, 1.0, 0]}
        >
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial 
            color={getCharacterColor()} 
            emissive={getCharacterColor()}
            emissiveIntensity={0.2} 
          />
        </mesh>
        
        {/* Olhos */}
        <mesh position={[0.1, 1.1, 0.2]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="white" />
        </mesh>
        
        <mesh position={[-0.1, 1.1, 0.2]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="white" />
        </mesh>
        
        {/* Pupilas */}
        <mesh position={[0.1, 1.1, 0.25]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="black" />
        </mesh>
        
        <mesh position={[-0.1, 1.1, 0.25]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="black" />
        </mesh>
        
        <mesh
          position={[-0.1, 0.95, 0.2]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="white" />
        </mesh>
        
        {/* Pupilas */}
        <mesh
          position={[0.1, 0.95, 0.24]}
        >
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="black" />
        </mesh>
        
        <mesh
          position={[-0.1, 0.95, 0.24]}
        >
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="black" />
        </mesh>
        
        {/* Pés */}
        <mesh
          castShadow
          position={[0.2, 0.15, 0]}
        >
          <boxGeometry args={[0.2, 0.3, 0.2]} />
          <meshStandardMaterial color={characterSecondaryColor} />
        </mesh>
        
        <mesh
          castShadow
          position={[-0.2, 0.15, 0]}
        >
          <boxGeometry args={[0.2, 0.3, 0.2]} />
          <meshStandardMaterial color={characterSecondaryColor} />
        </mesh>
        
        {/* Mãos */}
        <mesh
          castShadow
          position={[0.4, 0.5, 0]}
        >
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color={characterSecondaryColor} />
        </mesh>
        
        <mesh
          castShadow
          position={[-0.4, 0.5, 0]}
        >
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color={characterSecondaryColor} />
        </mesh>
      </group>
      
      {/* Versão sprite do jogador usando os assets */}
      <Billboard
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
        position={[0, 1.2, 0]}
      >
        <mesh>
          <planeGeometry args={[1.2, 1.2]} />
          <meshBasicMaterial 
            map={useTexture(playerTexture)}
            transparent={true}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Billboard>
      
      {/* Sombra sob o jogador */}
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
      >
        <circleGeometry args={[0.4, 16]} />
        <meshBasicMaterial color="black" transparent opacity={0.3} />
      </mesh>
    </AnimatedGroup>
  );
};

export default Player;


