import React, { useRef } from 'react';
import { Box, Sphere } from '@react-three/drei';
import { EnemyData } from '@/types/game';
import { useFrame } from '@react-three/fiber';

interface EnemyProps extends Omit<React.ComponentProps<typeof Box>, 'position'> {
  color?: string;
  position: [number, number, number];
  enemyData?: EnemyData;
}

/**
 * Componente para renderizar um inimigo no jogo
 * Apenas controla a renderização e animações simples, não gerencia movimento
 */
export default function EnemyEntity({ color = 'purple', position, enemyData, ...props }: EnemyProps) {
  // Referência para animação - usamos any devido à complexidade dos tipos do Three.js
  const enemyRef = useRef<any>(null);
  const animTimeRef = useRef<number>(0);
  const lookDirectionRef = useRef<{ x: number, z: number }>({ x: 0, z: 1 }); // Direção padrão para onde o inimigo está olhando

  // Cores diferentes para os diferentes tipos de inimigos
  let enemyColor = color;
  let enemyScale = [0.8, 0.8, 0.8] as [number, number, number];
  let renderDetails = false;

  if (enemyData) {
    switch (enemyData.type) {
      case 'normal':
        enemyColor = '#8a2be2'; // Violeta
        enemyScale = [0.8, 0.8, 0.8];
        renderDetails = true;
        break;
      case 'rapido':
        enemyColor = '#ff4500'; // Vermelho alaranjado
        enemyScale = [0.7, 0.7, 0.7];
        renderDetails = true;
        break;
      case 'perseguidor':
        enemyColor = '#ff0000'; // Vermelho
        enemyScale = [0.9, 0.9, 0.9];
        renderDetails = true;
        break;
      case 'aleatorio':
        enemyColor = '#32cd32'; // Verde
        enemyScale = [0.8, 0.85, 0.8];
        renderDetails = true;
        break;
      case 'estatico':
        enemyColor = '#696969'; // Cinza escuro
        enemyScale = [1, 1, 1];
        renderDetails = false;
        break;
      default:
        enemyColor = color;
        break;
    }
  }

  // Detecta mudança na posição para atualizar a rotação
  const lastPositionRef = useRef<[number, number, number]>(position);
  // Apenas animação e efeitos visuais, sem movimento
  useFrame((state, delta) => {
    if (!enemyRef.current || !enemyData) return;

    // Atualiza o tempo de animação para oscilações
    animTimeRef.current = state.clock.elapsedTime % 20;

    // Aplica flutuação vertical suave para dar vida aos inimigos (exceto estáticos)
    if (enemyData.type !== 'estatico' && enemyData.movePattern !== 'stationary') {
      // Velocidade de flutuação varia conforme tipo de inimigo
      const floatSpeed = enemyData.speed || 0.5;
      const floatAmplitude = enemyData.type === 'rapido' ? 0.15 : 0.1;
      enemyRef.current.position.y = Math.sin(animTimeRef.current * floatSpeed) * floatAmplitude + 0.5;
    }

    // Animação adicional de rotação para inimigos aleatórios (como se estivessem procurando)
    if (enemyData.movePattern === 'random' && Math.random() < 0.01) {
      const randomRotation = (Math.random() - 0.5) * 0.3; // Rotação aleatória pequena
      enemyRef.current.rotation.y += randomRotation;
    }

    // Detecta mudança de direção com base na última posição
    if (position[0] !== lastPositionRef.current[0] || position[2] !== lastPositionRef.current[2]) {
      // Calcula a direção do movimento
      const dirX = position[0] - lastPositionRef.current[0];
      const dirZ = position[2] - lastPositionRef.current[2];

      // Só atualiza a direção se houver um movimento significativo
      if (Math.abs(dirX) > 0.01 || Math.abs(dirZ) > 0.01) {
        lookDirectionRef.current = { x: dirX, z: dirZ };

        // Atualiza a rotação para olhar na direção do movimento
        const angle = Math.atan2(dirX, dirZ);
        // Suaviza a rotação para não ser tão abrupta
        if (enemyRef.current.rotation) {
          const currentRotation = enemyRef.current.rotation.y;
          const targetRotation = angle;
          // Interpolação para rotação suave
          enemyRef.current.rotation.y = currentRotation + (targetRotation - currentRotation) * Math.min(delta * 5, 1);
        } else {
          enemyRef.current.rotation.y = angle;
        }
      }

      // Atualiza a última posição conhecida
      lastPositionRef.current = [...position];
    }
  });

  // Render com React.createElement para evitar erros de tipagem
  return React.createElement('group', {
    ref: enemyRef,
    position: position
  }, [
    React.createElement(Box, {
      key: 'body',
      args: enemyScale,
      children: React.createElement('meshStandardMaterial', {
        color: enemyColor
      })
    }),

    // Renderiza olhos apenas para inimigos não estáticos
    renderDetails && React.createElement(React.Fragment, { key: 'eyes' }, [
      // Olho esquerdo
      React.createElement(Sphere, {
        key: 'leftEye',
        args: [0.2, 8, 8],
        position: [-0.25, 0.25, 0.35],
        children: [
          React.createElement('meshStandardMaterial', {
            key: 'leftEyeWhite',
            color: 'white'
          }),
          React.createElement(Sphere, {
            key: 'leftEyePupil',
            args: [0.1, 8, 8],
            position: [0, 0, 0.1],
            children: React.createElement('meshStandardMaterial', {
              color: 'black'
            })
          })
        ]
      }),

      // Olho direito
      React.createElement(Sphere, {
        key: 'rightEye',
        args: [0.2, 8, 8],
        position: [0.25, 0.25, 0.35],
        children: [
          React.createElement('meshStandardMaterial', {
            key: 'rightEyeWhite',
            color: 'white'
          }),
          React.createElement(Sphere, {
            key: 'rightEyePupil',
            args: [0.1, 8, 8],
            position: [0, 0, 0.1],
            children: React.createElement('meshStandardMaterial', {
              color: 'black'
            })
          })
        ]
      })
    ])
  ]);
}