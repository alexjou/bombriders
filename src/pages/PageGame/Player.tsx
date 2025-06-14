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
      console.log("visualTargetPosition atualizado para:", visualTargetPosition.current);

      // Força isMoving para true e reinicia o progresso
      isMoving.current = true;
      movementProgress.current = 0;

      // Calcula a direção do movimento para ajustar a rotação do modelo
      const direction = new THREE.Vector3().subVectors(
        visualTargetPosition.current,
        currentPosition.current
      );

      // Rotaciona o modelo na direção do movimento - rotação imediata
      if (direction.length() > 0.001) { // Limiar menor para detectar qualquer movimento
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
    } else {
      // Se não houver targetPosition, usamos a posição do grid (teleporte sem animação)
      visualTargetPosition.current.set(gridPosition[0], gridPosition[1], gridPosition[2]);
      currentPosition.current.set(gridPosition[0], gridPosition[1], gridPosition[2]);

      // Atualiza a posição do grupo diretamente para garantir sincronização
      if (groupRef.current) {
        groupRef.current.position.set(gridPosition[0], gridPosition[1], gridPosition[2]);
      }
    }
  }, [targetPosition, gridPosition, actions, names, currentAnimation, scene.rotation]);

  // Função de easing personalizada para movimento mais fluido e rápido
  const customEasing = (progress: number) => {
    // Curva super agressiva para movimento quase instantâneo
    if (progress < 0.05) {
      // Aceleração extrema no início
      return progress * 8; // Início extremamente rápido (8x)
    } else if (progress < 0.5) {
      // Fase muito curta para alcançar posição rapidamente
      return 0.4 + (progress - 0.05) * 1.2;
    } else {
      // Quase nenhuma desaceleração
      return 1.0; // Ir direto para posição final
    }
  };

  // Rastreia o tempo para efeitos de animação contínua
  const animTime = useRef(0);

  // Atualiza o tempo de animação em cada frame
  useFrame((state) => {
    animTime.current = state.clock.elapsedTime;

    // Atualiza o mixer de animações
    if (mixer) mixer.update(state.clock.deltaTime);
  });

  // Usando useFrame para fazer a animação suave
  useFrame((state, delta) => {
    // Forçar verificação em cada frame se há um targetPosition mas isMoving é false
    if (targetPosition && !isMoving.current) {
      console.log("CORREÇÃO CRÍTICA: targetPosition existe mas isMoving é falso. Corrigindo...");
      isMoving.current = true;
      movementProgress.current = 0;

      // Se houver, atualiza também a posição alvo
      visualTargetPosition.current.set(targetPosition[0], targetPosition[1], targetPosition[2]);
    }

    // Verificar periodicamente o estado geral (logs menos frequentes)
    if (state.clock.elapsedTime % 1 < 0.01) {  // Log aproximadamente a cada 1 segundo
      console.log("isMoving:", isMoving.current);
      console.log("targetPosition:", targetPosition);
      console.log("currentPosition:", currentPosition.current);
      console.log("visualTargetPosition:", visualTargetPosition.current);

      if (groupRef.current) {
        console.log("groupRef.position:",
          groupRef.current.position.x.toFixed(2),
          groupRef.current.position.y.toFixed(2),
          groupRef.current.position.z.toFixed(2));
      }
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
      // Velocidade extrema para garantir resposta rápida
      // Movimento super rápido (quase imediato)
      const adaptiveSpeed = moveSpeed * 2; // Dobrar a velocidade base

      // Incremento de movimento mais agressivo
      const progressIncrement = delta * adaptiveSpeed;

      // Debug detalhado para movimentos curtos
      if (progressIncrement < 0.01) {
        console.warn("Incremento muito pequeno:", progressIncrement, "delta:", delta, "velocidade:", adaptiveSpeed);
      }

      // Incrementa o progresso do movimento
      movementProgress.current += progressIncrement;
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
      } else {
        console.error('groupRef.current é nulo ou indefinido!');
      }

      // Detecção de chegada super-otimizada para finalizar o movimento instantaneamente
      const distanceToTarget = lerpPosition.distanceTo(visualTargetPosition.current);
      const tolerancia = 0.1; // Tolerância maior para terminar mais cedo

      // Considera completo muito mais cedo na timeline da animação
      const isAtDestination = (distanceToTarget < tolerancia && movementProgress.current > 0.7) ||
        movementProgress.current >= 0.9; // Reduzido para terminar mais cedo

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
          console.log('Callback de movimento concluído sendo chamado!');
          // Executa o callback imediatamente para garantir que o jogo saiba que o movimento terminou
          onMovementComplete();

          // Garantir que o target position seja limpo
          visualTargetPosition.current.copy(currentPosition.current);
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
