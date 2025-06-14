// @ts-nocheck
import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';

// Pré-carregar o modelo (caminho relativo ao diretório public)
useGLTF.preload('/models/Rider.glb');

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
  const groupRef = useRef<THREE.Group>(null!);
  const materialRef = useRef<THREE.Material | THREE.Material[]>(null!);
  // Carrega o modelo com useGLTF (wrapper do GLTFLoader da @react-three/drei)
  const { scene, animations } = useGLTF('/models/Rider.glb');

  // Configura animações
  const { actions, names, mixer } = useAnimations(animations, scene);

  // Estado para controlar animação atual
  const [currentAnimation, setCurrentAnimation] = useState('idle');

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

  // Referência para rotação durante o movimento
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });
  // Configura o modelo e animações iniciais
  useEffect(() => {
    // Aplica escala aumentada ao modelo (40% maior que o anterior)
    scene.scale.set(0.7, 0.7, 0.7);

    // Verifica se temos animações disponíveis
    if (names.length > 0) {
      // Configura animações disponíveis - podemos mapear nomes de animação aqui
      const animationMap = {
        idle: names.find(name => name.toLowerCase().includes('idle')) || names[0],
        run: names.find(name => name.toLowerCase().includes('run') || name.toLowerCase().includes('walk')) || names[0],
        attack: names.find(name => name.toLowerCase().includes('attack')) || names[0]
      };

      // Inicia animação idle
      if (actions[animationMap.idle]) {
        actions[animationMap.idle].reset().fadeIn(0.5).play();
        setCurrentAnimation('idle');
      }
    }
    // Configura materiais para efeito de invencibilidade
    scene.traverse((object) => {
      if (object.type === 'Mesh') {
        const mesh = object as THREE.Mesh;
        if (mesh.material) {
          // Guarda referência para usar no efeito de invencibilidade
          if (!materialRef.current) {
            materialRef.current = mesh.material;
          }
        }
      }
    });

    return () => {
      // Limpa animações ao desmontar
      Object.values(actions).forEach(action => action?.stop());
    };
  }, [scene, names, actions]);
  // Quando a targetPosition é definida, iniciamos a animação de movimento
  useEffect(() => {
    console.log("targetPosition mudou:", targetPosition);
    if (targetPosition) {
      // Atualiza a posição alvo para onde o jogador deverá se mover
      visualTargetPosition.current.set(targetPosition[0], targetPosition[1], targetPosition[2]);

      // Inicia o movimento suave
      isMoving.current = true;
      movementProgress.current = 0;

      // Calcula a direção do movimento para ajustar a rotação do modelo
      const direction = new THREE.Vector3().subVectors(
        visualTargetPosition.current,
        currentPosition.current
      );

      // Rotaciona o modelo na direção do movimento
      if (direction.length() > 0.01) {
        // Rotação apenas no eixo Y (virar para a direção)
        const angle = Math.atan2(direction.x, direction.z);
        scene.rotation.y = angle;
      }

      // Alterna para animação de corrida
      const runAnimName = names.find(name => name.toLowerCase().includes('run') || name.toLowerCase().includes('walk')) || names[0];
      if (actions[runAnimName] && currentAnimation !== 'run') {
        Object.values(actions).forEach(action => action?.fadeOut(0.2));
        actions[runAnimName].reset().fadeIn(0.2).play();
        setCurrentAnimation('run');
      }
    } else {      // Se não houver targetPosition, usamos a posição do grid (teleporte sem animação)
      visualTargetPosition.current.set(gridPosition[0], gridPosition[1], gridPosition[2]);
      currentPosition.current.set(gridPosition[0], gridPosition[1], gridPosition[2]);

      // Atualiza a posição do grupo diretamente para garantir sincronização
      if (groupRef.current) {
        groupRef.current.position.set(gridPosition[0], gridPosition[1], gridPosition[2]);
      }

      console.log('Teleporte para:', gridPosition);
    }
  }, [targetPosition, gridPosition, actions, names, currentAnimation]);

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

  // Rastreia o tempo para efeitos de animação contínua
  const animTime = useRef(0);

  // Atualiza o tempo de animação em cada frame
  useFrame((state) => {
    animTime.current = state.clock.elapsedTime;

    // Atualiza o mixer de animações
    if (mixer) mixer.update(state.clock.elapsedTime);
  });  // Usando useFrame para fazer a animação suave
  useFrame((state, delta) => {
    // Verificar periodicamente se isMoving.current está correto
    if (state.clock.elapsedTime % 1 < 0.01) {  // Log aproximadamente a cada 1 segundo
      console.log("isMoving:", isMoving.current);
    }
    // Efeito de piscar para invencibilidade
    if (isInvincible && materialRef.current) {
      // Alterna a visibilidade (efeito de piscar)
      scene.visible = Math.floor(state.clock.elapsedTime * 10) % 2 === 0;
    } else if (!scene.visible) {
      // Garante que o jogador esteja visível quando não estiver invencível
      scene.visible = true;
    }

    // Verifica se o jogador está se movendo
    if (isMoving.current) {
      // Calcula o passo de animação baseado no delta de tempo e velocidade
      // Ajuste adaptativo aprimorado: movimento ainda mais rápido em células mais distantes
      const distance = currentPosition.current.distanceTo(visualTargetPosition.current);
      // Velocidade base aumentada, fator de adaptação maior para células distantes
      const adaptiveSpeed = moveSpeed * (1 + Math.min(distance - 1, 0) * 0.35);

      // Incrementa o progresso do movimento
      movementProgress.current += delta * adaptiveSpeed;
      movementProgress.current = Math.min(movementProgress.current, 1);
      // Aplica easing personalizado ao movimento
      const easedProgress = customEasing(movementProgress.current);

      // Calcula a nova posição interpolada
      const lerpPosition = new THREE.Vector3().lerpVectors(
        currentPosition.current,
        visualTargetPosition.current,
        easedProgress
      );
      // Atualiza a posição do modelo
      if (groupRef.current) {
        // Atualização explícita de cada componente da posição para garantir o movimento
        groupRef.current.position.x = lerpPosition.x;
        groupRef.current.position.y = lerpPosition.y;
        groupRef.current.position.z = lerpPosition.z;

        // Debug para verificar movimento
        console.log('Movendo groupRef:',
          groupRef.current.position.x.toFixed(2),
          groupRef.current.position.y.toFixed(2),
          groupRef.current.position.z.toFixed(2),
          'Para:',
          lerpPosition.x.toFixed(2),
          lerpPosition.y.toFixed(2),
          lerpPosition.z.toFixed(2),
          'Progresso:', easedProgress.toFixed(2));
      } else {
        console.error('groupRef.current é nulo ou indefinido!');
      }

      // Detecção de chegada otimizada para finalizar o movimento mais rapidamente
      const distanceToTarget = lerpPosition.distanceTo(visualTargetPosition.current);
      const tolerancia = 0.05; // Aumentado para terminar movimento mais cedo
      // Considera completo mais cedo na timeline da animação (0.9 em vez de 0.95)
      const isAtDestination = (distanceToTarget < tolerancia && movementProgress.current > 0.9) ||
        movementProgress.current >= 0.98; // Reduzido de 1.0 para 0.98

      if (isAtDestination) {
        // Animação completa, coloca na posição final exata
        if (groupRef.current) {
          // Atribuição direta para garantir precisão
          groupRef.current.position.x = visualTargetPosition.current.x;
          groupRef.current.position.y = visualTargetPosition.current.y;
          groupRef.current.position.z = visualTargetPosition.current.z;

          console.log('Movimento concluído:', visualTargetPosition.current);
        }
        currentPosition.current.copy(visualTargetPosition.current);

        // Marca como não mais em movimento
        isMoving.current = false;

        // Alterna para animação idle
        const idleAnimName = names.find(name => name.toLowerCase().includes('idle')) || names[0];
        if (actions[idleAnimName] && currentAnimation !== 'idle') {
          Object.values(actions).forEach(action => action?.fadeOut(0.2));
          actions[idleAnimName].reset().fadeIn(0.2).play();
          setCurrentAnimation('idle');
        }

        // Notifica que o movimento foi concluído
        if (onMovementComplete) {
          console.log('Callback de movimento concluído sendo chamado');
          onMovementComplete();
        }
      }
    }
  });
  // @ts-nocheck - desativa verificações de tipo a partir daqui
  return (
    <group ref={groupRef} position={[gridPosition[0], gridPosition[1], gridPosition[2]]}>
      <primitive object={scene} />

      {/* Sombra no chão para melhorar sensação de posicionamento */}
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
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

export default Player;