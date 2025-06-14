import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlayerProps {
  gridPosition: [number, number, number]; // Posição lógica no grid (x, y, z)
  targetPosition?: [number, number, number]; // Posição visual alvo (opcional)
  isInvincible: boolean; // Propriedade para controle de invencibilidade
  moveSpeed?: number; // Velocidade de movimento (opcional)
  onMovementComplete?: () => void; // Callback quando o movimento termina
}

const Player: React.FC<PlayerProps> = ({
  gridPosition,
  targetPosition,
  isInvincible,
  moveSpeed = 5,
  onMovementComplete
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);
  // Armazena a posição visual atual
  const currentPosition = useRef<THREE.Vector3>(
    new THREE.Vector3(gridPosition[0], gridPosition[1], gridPosition[2])
  );

  // A posição alvo para onde o jogador está se movendo
  const visualTargetPosition = useRef<THREE.Vector3>(
    new THREE.Vector3(gridPosition[0], gridPosition[1], gridPosition[2])
  );

  // Flag para verificar se o jogador está se movendo
  const isMoving = useRef<boolean>(false);

  // Para rastrear quanto movimento já foi concluído
  const movementProgress = useRef<number>(0);

  // Quando a targetPosition é definida, iniciamos a animação de movimento
  useEffect(() => {
    if (targetPosition) {
      // Atualiza a posição alvo para onde o jogador deverá se mover
      visualTargetPosition.current.set(targetPosition[0], targetPosition[1], targetPosition[2]);

      // Inicia o movimento suave
      isMoving.current = true;
      movementProgress.current = 0;

      // Reset rotação quando começa um novo movimento
      rotationRef.current = { x: 0, y: 0, z: 0 };
    } else {
      // Se não houver targetPosition, usamos a posição do grid (teleporte sem animação)
      visualTargetPosition.current.set(gridPosition[0], gridPosition[1], gridPosition[2]);
      currentPosition.current.set(gridPosition[0], gridPosition[1], gridPosition[2]); rotationRef.current = { x: 0, y: 0, z: 0 };
    }
  }, [targetPosition, gridPosition]);

  // Função de easing personalizada para movimento mais fluido e rápido
  const customEasing = (progress: number) => {
    // Curva otimizada para movimentos mais rápidos mantendo a sensação de suavidade
    // Fase de aceleração mais curta e fase constante mais longa
    if (progress < 0.15) {
      // Aceleração inicial mais rápida (menor fase de aceleração)
      return 4.5 * Math.pow(progress, 1.7); // Potência menor para aceleração mais agressiva
    } else if (progress < 0.8) {
      // Fase média ampliada (velocidade constante por mais tempo)
      return 0.1 + (progress - 0.15) * 1.15;
    } else {
      // Desaceleração final mais curta mas ainda suave
      const t = (progress - 0.8) / 0.2; // Normaliza para 0-1 na região final (agora menor)
      return 0.85 + 0.15 * (1 - Math.pow(1 - t, 2)); // Desaceleração mais leve
    }
  };

  // Referência para rotação durante o movimento
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });

  // Rastreia o tempo para efeitos de animação contínua
  const animTime = useRef(0);

  // Atualiza o tempo de animação em cada frame
  useFrame((state) => {
    animTime.current = state.clock.elapsedTime;
  });

  // Usando useFrame para fazer a animação suave
  useFrame((state, delta) => {
    // Efeito de piscar para invencibilidade
    if (isInvincible && materialRef.current) {
      // Alterna a visibilidade (efeito de piscar)
      materialRef.current.visible = Math.floor(state.clock.elapsedTime * 10) % 2 === 0;
    } else if (materialRef.current && !materialRef.current.visible) {
      // Garante que o jogador esteja visível quando não estiver invencível
      materialRef.current.visible = true;
    }    // Verifica se o jogador está se movendo
    if (isMoving.current && meshRef.current) {
      // Calcula o passo de animação baseado no delta de tempo e velocidade
      // Ajuste adaptativo aprimorado: movimento ainda mais rápido em células mais distantes
      const distance = currentPosition.current.distanceTo(visualTargetPosition.current);
      // Velocidade base aumentada, fator de adaptação maior para células distantes
      const adaptiveSpeed = moveSpeed * (1 + Math.min(distance - 1, 0) * 0.35);
      // Multiplicador para acelerar a animação geral sem perder a suavidade
      const optimizationFactor = 1.2;
      const step = delta * adaptiveSpeed * optimizationFactor;

      // Incrementa o progresso do movimento
      movementProgress.current += step;

      // Limita o progresso a 1.0 (100%)
      movementProgress.current = Math.min(movementProgress.current, 1.0);

      // Aplica a função de easing personalizada para interpolação suave
      const easedProgress = customEasing(movementProgress.current);

      // Interpola entre a posição atual e a posição alvo
      const lerpPosition = new THREE.Vector3().lerpVectors(
        currentPosition.current,
        visualTargetPosition.current,
        easedProgress
      );

      // Calcula a direção do movimento (para rotação e efeitos visuais)
      // Aplica um sistema de rotação mais dinâmico baseado na progressão do movimento
      const moveDirection = new THREE.Vector3().subVectors(
        visualTargetPosition.current,
        currentPosition.current
      ).normalize();

      // Fase inicial do movimento (inclinação para frente)
      if (movementProgress.current < 0.25) {
        const tiltIntensity = Math.min(1.0, movementProgress.current * 8); // Suaviza a entrada

        if (Math.abs(moveDirection.x) > Math.abs(moveDirection.z)) {
          // Movimento lateral (esquerda/direita)
          rotationRef.current.z = moveDirection.x > 0 ? -0.22 * tiltIntensity : 0.22 * tiltIntensity;
          // Adiciona uma pequena rotação no eixo Y para dar mais dinamismo
          rotationRef.current.y = moveDirection.x > 0 ? 0.15 * tiltIntensity : -0.15 * tiltIntensity;
        } else {
          // Movimento vertical (frente/trás)
          rotationRef.current.x = moveDirection.z > 0 ? 0.22 * tiltIntensity : -0.22 * tiltIntensity;
          // Pequena rotação lateral para movimento mais orgânico
          rotationRef.current.z = moveDirection.z > 0 ? -0.05 * tiltIntensity : 0.05 * tiltIntensity;
        }
      }
      // Fase média do movimento (mantém a rotação)
      else if (movementProgress.current < 0.75) {
        // Manter a rotação atual, apenas ajustando levemente
        // Pequena oscilação para dar sensação de "esforço" durante o movimento
        const wobble = Math.sin(state.clock.elapsedTime * 15) * 0.03;

        if (Math.abs(moveDirection.x) > Math.abs(moveDirection.z)) {
          rotationRef.current.z += wobble;
        } else {
          rotationRef.current.x += wobble;
        }
      }
      // Fase final (retorno gradual à posição neutra)
      else {
        const returnRate = (movementProgress.current - 0.75) * 4; // 0 a 1
        rotationRef.current.x *= (1 - returnRate * 0.7);
        rotationRef.current.y *= (1 - returnRate * 0.9);
        rotationRef.current.z *= (1 - returnRate * 0.7);
      }

      // Adiciona pequena variação na altura durante o movimento para efeito de "salto" suave
      if (movementProgress.current > 0.1 && movementProgress.current < 0.9) {
        // Usando uma fórmula mais rápida para o salto (mais curto e direto)
        const jumpHeight = 0.16; // Altura ligeiramente reduzida para movimento mais rápido

        // Curva de salto modificada para ser mais rápida no início e fim
        const jumpProgress = (movementProgress.current - 0.1) / 0.8; // Normalizado para 0-1
        // Parábola ajustada com pico mais proeminente no centro
        const jumpCurve = 4.2 * Math.pow(jumpProgress * (1 - jumpProgress), 0.85);

        lerpPosition.y += jumpHeight * jumpCurve;
      }      // Atualiza a posição do mesh
      meshRef.current.position.copy(lerpPosition);

      // Detecção de chegada otimizada para finalizar o movimento mais rapidamente
      const distanceToTarget = meshRef.current.position.distanceTo(visualTargetPosition.current);
      const tolerancia = 0.05; // Aumentado para terminar movimento mais cedo
      // Considera completo mais cedo na timeline da animação (0.9 em vez de 0.95)
      const isAtDestination = (distanceToTarget < tolerancia && movementProgress.current > 0.9) ||
        movementProgress.current >= 0.98; // Reduzido de 1.0 para 0.98

      if (isAtDestination) {
        // Animação completa, coloca na posição final exata
        meshRef.current.position.copy(visualTargetPosition.current);
        currentPosition.current.copy(visualTargetPosition.current);

        // Reset rotação ao terminar
        rotationRef.current = { x: 0, y: 0, z: 0 };

        // Marca como não mais em movimento
        isMoving.current = false;

        // Notifica que o movimento foi concluído
        if (onMovementComplete) {
          onMovementComplete();
        }
      }
    }
  });
  return (
    <group
      ref={meshRef}
      position={[currentPosition.current.x, currentPosition.current.y, currentPosition.current.z]}
      rotation={[rotationRef.current.x, rotationRef.current.y, rotationRef.current.z]}
    >
      {/* Corpo principal - Troca da esfera para um conjunto de elementos detalhados */}
      <group>
        {/* Corpo base */}
        <mesh castShadow receiveShadow position={[0, 0.3, 0]} scale={[0.4, 0.5, 0.25]}>
          <boxGeometry />
          <meshStandardMaterial ref={materialRef} color="#d32f2f" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Cabeça */}
        <mesh castShadow receiveShadow position={[0, 0.65, 0]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#ffe0bd" roughness={0.3} metalness={0.05} />
          
          {/* Olhos */}
          <mesh position={[-0.08, 0.03, 0.22]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
            
            {/* Íris */}
            <mesh position={[0, 0, 0.02]}>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshStandardMaterial color="#8b0000" roughness={0.1} />
              
              {/* Pupila */}
              <mesh position={[0, 0, 0.01]}>
                <sphereGeometry args={[0.015, 16, 16]} />
                <meshStandardMaterial color="#000000" roughness={0.1} />
              </mesh>
            </mesh>
          </mesh>
          
          {/* Segundo olho */}
          <mesh position={[0.08, 0.03, 0.22]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
            
            {/* Íris */}
            <mesh position={[0, 0, 0.02]}>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshStandardMaterial color="#8b0000" roughness={0.1} />
              
              {/* Pupila */}
              <mesh position={[0, 0, 0.01]}>
                <sphereGeometry args={[0.015, 16, 16]} />
                <meshStandardMaterial color="#000000" roughness={0.1} />
              </mesh>
            </mesh>
          </mesh>
        </mesh>
        
        {/* Chapéu */}
        <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.35, 0.38, 0.05, 32]} />
          <meshStandardMaterial 
            color="#8b0000" 
            emissive="#ff4500"
            emissiveIntensity={0.8} 
            roughness={0.3} 
            metalness={0.5} 
          />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 0.2, 32]} />
          <meshStandardMaterial 
            color="#8b0000" 
            emissive="#ff4500"
            emissiveIntensity={0.8} 
            roughness={0.3} 
            metalness={0.5} 
          />
        </mesh>

        {/* Cinto */}
        <mesh castShadow receiveShadow position={[0, 0.05, 0]} scale={[0.45, 0.08, 0.15]}>
          <boxGeometry />
          <meshStandardMaterial color="#333333" roughness={0.5} metalness={0.2} />
        </mesh>
        
        {/* Fivela */}
        <mesh castShadow receiveShadow position={[0, 0.05, 0.075]} scale={[0.1, 0.08, 0.05]}>
          <boxGeometry />
          <meshStandardMaterial 
            color="#ffc107" 
            emissive="#ffa000"
            emissiveIntensity={0.5} 
            roughness={0.1} 
            metalness={0.8} 
          />
        </mesh>

        {/* Pernas */}
        <mesh castShadow receiveShadow position={[-0.1, -0.2, 0]} scale={[0.18, 0.4, 0.2]}>
          <boxGeometry />
          <meshStandardMaterial color="#d32f2f" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.1, -0.2, 0]} scale={[0.18, 0.4, 0.2]}>
          <boxGeometry />
          <meshStandardMaterial color="#d32f2f" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Botas */}
        <mesh castShadow receiveShadow position={[-0.1, -0.4, 0.02]} scale={[0.2, 0.15, 0.25]}>
          <boxGeometry />
          <meshStandardMaterial color="#333333" roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.1, -0.4, 0.02]} scale={[0.2, 0.15, 0.25]}>
          <boxGeometry />
          <meshStandardMaterial color="#333333" roughness={0.5} metalness={0.2} />
        </mesh>

        {/* Braços */}
        <mesh castShadow receiveShadow position={[-0.3, 0.3, 0]} scale={[0.15, 0.4, 0.15]}>
          <boxGeometry />
          <meshStandardMaterial color="#d32f2f" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.3, 0.3, 0]} scale={[0.15, 0.4, 0.15]}>
          <boxGeometry />
          <meshStandardMaterial color="#d32f2f" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Mãos */}
        <mesh castShadow receiveShadow position={[-0.3, 0.05, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#333333" roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.3, 0.05, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#333333" roughness={0.5} metalness={0.2} />
        </mesh>
      </group>

      {/* Sombra no chão */}
      <mesh
        position={[0, -0.49, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow={false}
        castShadow={false}
      >
        <circleGeometry args={[0.35, 24]} />
        <meshBasicMaterial
          color="#00000066"
          transparent={true}
          opacity={isMoving.current ? 0.15 : 0.35}
        />
      </mesh>
    </group>
  );
};

export default Player;
