import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls, useTexture } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import useGameStore from '../../store/gameStore';
import { CHARACTERS, BLOCK_TYPES } from '../../utils/constants';
import { checkCollision } from '../../utils/gameUtils';
import { SpriteAnimator } from '@react-three/drei'; // Importação correta

// Importando os assets
import bombermanSprites from '../../assets/characters/bomberman_sprites.png';

// Componente animado para o modelo do jogador
const AnimatedGroup = animated.group;

const Player = ({ position, character, currentDino, mapData }) => {
  const groupRef = useRef();
  const { 
    player, 
    setPlayerPosition, 
    placeBomb,
    gameState
  } = useGameStore();
  
  // Estado para controlar o cooldown da bomba
  const [bombCooldown, setBombCooldown] = useState(false);
  
  // Estado para animação de movimento
  const [isMoving, setIsMoving] = useState(false);
  const [bobOffset, setBobOffset] = useState(0);
  const [direction, setDirection] = useState('down');
  const [frame, setFrame] = useState(0);
  
  // Carrega a textura do sprite
  const texture = useTexture(bombermanSprites);
  
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
    const speed = baseSpeed * player.speed * delta * 2.5;
    
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
    
    // Atualiza o estado de movimento e direção
    setIsMoving(isMovingNow);
    setDirection(newDirection);
    
    // Animação de bobbing (subir e descer) quando em movimento
    if (isMovingNow) {
      setBobOffset((prev) => (prev + delta * 5) % (Math.PI * 2));
      
      // Atualiza o frame da animação a cada 0.2 segundos
      setFrame((prev) => (prev + delta * 5) % 4);
    } else {
      setBobOffset(0);
      setFrame(0);
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
      
      // Coloca a bomba
      placeBomb({ x: gridX, y: gridZ });
      
      // Ativa o cooldown da bomba
      setBombCooldown(true);
      setTimeout(() => setBombCooldown(false), 500); // 500ms de cooldown
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
  
  const characterColor = getCharacterColor();
  const characterSecondaryColor = getCharacterSecondaryColor();
  
  // Determina o índice do personagem com base no character
  const getCharacterIndex = () => {
    switch (character.toUpperCase()) {
      case 'ARIA':
        return 0;
      case 'BRONT':
        return 1;
      case 'KIRO':
        return 2;
      case 'LUME':
        return 3;
      case 'ZUNN':
        return 4;
      default:
        return 0;
    }
  };
  
  const characterIndex = getCharacterIndex();
  
  return (
    <AnimatedGroup 
      ref={groupRef}
      {...springs}
    >
      {/* Versão 3D do jogador (estilo Bomberman) */}
      <group visible={false}>
        {/* Corpo principal */}
        <mesh 
          castShadow 
          receiveShadow
          position={[0, 0.5, 0]}
        >
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color={characterColor} />
        </mesh>
        
        {/* Cabeça */}
        <mesh
          castShadow
          position={[0, 0.9, 0]}
        >
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color={characterColor} />
        </mesh>
        
        {/* Olhos */}
        <mesh
          position={[0.1, 0.95, 0.2]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="white" />
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
      <SpriteAnimator
        textureImageURL={bombermanSprites}
        numberOfFrames={4} // Assumindo 4 frames por animação
        fps={10} // Frames por segundo
        autoPlay={true}
        loop={true}
        scale={[1.2, 1.2, 1.2]} // Ajusta a escala do sprite
        position={[0, 0.5, 0]}
        // Adicione outras props conforme necessário para controlar a animação
      />
      
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


