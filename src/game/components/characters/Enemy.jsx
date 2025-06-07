import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import useGameStore from '../../store/gameStore';
import { checkCollision } from '../../utils/gameUtils';

// Importando os assets
import monsterSprites from '../../assets/enemies/monster_sprites.webp';
import dinoSprites from '../../assets/dinos/dino_sprites.jpg';

// Componente animado para o modelo do inimigo
const AnimatedGroup = animated.group;

const Enemy = ({ position, type, speed, playerPosition, mapData }) => {
  const groupRef = useRef();
  const { activeBombs } = useGameStore();
  
  // Estado para controlar a direção e animação do inimigo
  const [direction, setDirection] = useState('down');
  const [frame, setFrame] = useState(0);
  const [targetPosition, setTargetPosition] = useState({ x: position[0], z: position[2] });
  const [isMoving, setIsMoving] = useState(false);
  const [bobOffset, setBobOffset] = useState(0);
  
  // Carrega as texturas
  const monsterTexture = useTexture(monsterSprites);
  const dinoTexture = useTexture(dinoSprites);
  
  // Animação de movimento
  const [springs, api] = useSpring(() => ({
    position: [position[0], position[1], position[2]],
    rotation: [0, 0, 0],
    config: { mass: 1, tension: 180, friction: 12 }
  }));
  
  // Atualiza a posição do inimigo com base na IA
  useFrame((state, delta) => {
    if (!groupRef.current || !mapData) return;
    
    // Velocidade do inimigo
    const enemySpeed = speed * delta * 1.5;
    
    // Posição atual
    const currentX = position[0];
    const currentZ = position[2];
    
    // Verifica se chegou à posição alvo
    const distanceToTarget = Math.sqrt(
      Math.pow(currentX - targetPosition.x, 2) + 
      Math.pow(currentZ - targetPosition.z, 2)
    );
    
    if (distanceToTarget < 0.1) {
      // Define uma nova posição alvo
      chooseNewTarget();
    }
    
    // Direção para a posição alvo
    let newX = currentX;
    let newZ = currentZ;
    let newDirection = direction;
    
    // Verifica se há bombas próximas para fugir
    const nearbyBomb = checkForNearbyBombs(currentX, currentZ);
    
    if (nearbyBomb) {
      // Foge da bomba
      const directionFromBomb = {
        x: currentX - nearbyBomb.x,
        z: currentZ - nearbyBomb.z
      };
      
      // Normaliza a direção
      const length = Math.sqrt(directionFromBomb.x * directionFromBomb.x + directionFromBomb.z * directionFromBomb.z);
      if (length > 0) {
        directionFromBomb.x /= length;
        directionFromBomb.z /= length;
      }
      
      // Move-se na direção oposta à bomba
      const escapeX = currentX + directionFromBomb.x * enemySpeed * 2;
      const escapeZ = currentZ + directionFromBomb.z * enemySpeed * 2;
      
      // Verifica colisão
      if (!checkCollision({ x: escapeX, y: escapeZ }, mapData)) {
        newX = escapeX;
        newZ = escapeZ;
        
        // Define a direção com base no movimento
        if (Math.abs(directionFromBomb.x) > Math.abs(directionFromBomb.z)) {
          newDirection = directionFromBomb.x > 0 ? 'right' : 'left';
        } else {
          newDirection = directionFromBomb.z > 0 ? 'down' : 'up';
        }
      }
    } else {
      // Movimento normal em direção ao alvo ou jogador
      
      // Decide se vai perseguir o jogador ou seguir para o alvo
      const shouldChasePlayer = type === 'DARK_DINO' || type === 'LIVING_BOMB';
      
      const targetX = shouldChasePlayer ? playerPosition[0] : targetPosition.x;
      const targetZ = shouldChasePlayer ? playerPosition[2] : targetPosition.z;
      
      // Calcula a direção para o alvo
      const dirToTarget = {
        x: targetX - currentX,
        z: targetZ - currentZ
      };
      
      // Normaliza a direção
      const length = Math.sqrt(dirToTarget.x * dirToTarget.x + dirToTarget.z * dirToTarget.z);
      if (length > 0) {
        dirToTarget.x /= length;
        dirToTarget.z /= length;
      }
      
      // Decide se move horizontalmente ou verticalmente
      if (Math.random() < 0.5) {
        // Move horizontalmente
        if (Math.abs(dirToTarget.x) > 0.1) {
          const nextX = currentX + Math.sign(dirToTarget.x) * enemySpeed;
          if (!checkCollision({ x: nextX, y: currentZ }, mapData)) {
            newX = nextX;
            newDirection = dirToTarget.x > 0 ? 'right' : 'left';
          }
        }
      } else {
        // Move verticalmente
        if (Math.abs(dirToTarget.z) > 0.1) {
          const nextZ = currentZ + Math.sign(dirToTarget.z) * enemySpeed;
          if (!checkCollision({ x: currentX, y: nextZ }, mapData)) {
            newZ = nextZ;
            newDirection = dirToTarget.z > 0 ? 'down' : 'up';
          }
        }
      }
    }
    
    // Verifica se está se movendo
    const isMovingNow = newX !== currentX || newZ !== currentZ;
    setIsMoving(isMovingNow);
    
    // Atualiza a direção
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
    
    // Atualiza a posição se houve movimento
    if (newX !== currentX || newZ !== currentZ) {
      position[0] = newX;
      position[2] = newZ;
      
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
  });
  
  // Escolhe uma nova posição alvo aleatória
  const chooseNewTarget = () => {
    if (!mapData) return;
    
    const height = mapData.length;
    const width = mapData[0].length;
    
    let attempts = 0;
    const maxAttempts = 20;
    
    while (attempts < maxAttempts) {
      // Escolhe uma posição aleatória próxima
      const offsetX = (Math.random() - 0.5) * 10;
      const offsetZ = (Math.random() - 0.5) * 10;
      
      const newX = Math.max(1, Math.min(width - 2, position[0] + offsetX));
      const newZ = Math.max(1, Math.min(height - 2, position[2] + offsetZ));
      
      // Verifica se a posição é válida (não é uma parede)
      if (!checkCollision({ x: newX, y: newZ }, mapData)) {
        setTargetPosition({ x: newX, z: newZ });
        break;
      }
      
      attempts++;
    }
  };
  
  // Verifica se há bombas próximas
  const checkForNearbyBombs = (x, z) => {
    const dangerRadius = 2.5;
    
    for (const bomb of activeBombs) {
      const distToBomb = Math.sqrt(
        Math.pow(x - bomb.position.x, 2) + 
        Math.pow(z - bomb.position.y, 2)
      );
      
      if (distToBomb < dangerRadius) {
        return { x: bomb.position.x, z: bomb.position.y };
      }
    }
    
    return null;
  };
  
  // Inicializa a posição alvo
  useEffect(() => {
    chooseNewTarget();
  }, [mapData]);
  
  // Cores para cada tipo de inimigo
  const getEnemyColor = () => {
    switch (type) {
      case 'DARK_DINO':
        return '#8B0000'; // Vermelho escuro
      case 'NEXX_DRONE':
        return '#4B0082'; // Índigo
      case 'LIVING_BOMB':
        return '#FF4500'; // Vermelho-laranja
      case 'TOXIC_SLIME':
        return '#32CD32'; // Verde limão
      default:
        return '#8B0000';
    }
  };
  
  const enemyColor = getEnemyColor();
  
  // Determina qual textura usar com base no tipo
  const getTexture = () => {
    if (type === 'DARK_DINO') {
      return dinoTexture;
    }
    return monsterTexture;
  };
  
  const texture = getTexture();
  
  return (
    <AnimatedGroup 
      ref={groupRef}
      {...springs}
    >
      {/* Versão 3D do inimigo (invisível) */}
      <mesh 
        castShadow 
        receiveShadow
        position={[0, 0.4, 0]}
        visible={false}
      >
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color={enemyColor} />
      </mesh>
      
      {/* Versão sprite do inimigo usando os assets */}
      <Sprite
        position={[0, 0.5, 0]}
        scale={[1.2, 1.2, 1.2]}
        center={[0.5, 0.5]}
        rotation={[0, Math.PI, 0]} // Rotaciona para ficar de frente para a câmera
      >
        <spriteMaterial 
          map={texture} 
          transparent={true}
          opacity={1}
        />
      </Sprite>
      
      {/* Sombra sob o inimigo */}
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

export default Enemy;

