import { Box, Sphere } from '@react-three/drei';
import { EnemyData } from '@/types/game';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EnemyProps extends Omit<React.ComponentProps<typeof Box>, 'position'> {
  color?: string;
  position: [number, number, number];
  enemyData?: EnemyData;
}

export default function Enemy({ color = 'purple', position, enemyData, ...props }: EnemyProps) {
  // Referência para animação
  const enemyRef = useRef<THREE.Group>(null);
  const animTimeRef = useRef<number>(0);

  // Cores diferentes para os diferentes tipos de inimigos
  let enemyColor = color;
  let enemySpeed = 0.5;
  let enemyScale = [0.8, 0.8, 0.8] as [number, number, number];
  let renderDetails = false;

  if (enemyData) {
    switch (enemyData.type) {
      case 'normal':
        enemyColor = '#8a2be2'; // Violeta
        enemySpeed = 0.5;
        enemyScale = [0.8, 0.8, 0.8];
        renderDetails = true;
        break;
      case 'rapido':
        enemyColor = '#ff4500'; // Vermelho alaranjado
        enemySpeed = 1.2;
        enemyScale = [0.7, 0.7, 0.7];
        renderDetails = true;
        break;
      case 'perseguidor':
        enemyColor = '#ff0000'; // Vermelho
        enemySpeed = 0.7;
        enemyScale = [0.9, 0.9, 0.9];
        renderDetails = true;
        break;
      case 'aleatorio':
        enemyColor = '#32cd32'; // Verde
        enemySpeed = 0.6;
        enemyScale = [0.8, 0.85, 0.8];
        renderDetails = true;
        break;
      case 'estatico':
        enemyColor = '#696969'; // Cinza escuro
        enemySpeed = 0;
        enemyScale = [1, 1, 1];
        renderDetails = false;
        break;
      default:
        enemyColor = color;
        break;
    }
  }

  // Animação para movimento dos inimigos
  useFrame((state) => {
    if (!enemyRef.current || enemyData?.movePattern === 'stationary') return;

    animTimeRef.current += state.clock.elapsedTime * 0.01;

    // Animação diferente para cada tipo de inimigo
    if (enemyData?.movePattern === 'follow') {
      enemyRef.current.rotation.y += 0.02; // Giro constante
      enemyRef.current.position.y = Math.sin(animTimeRef.current * enemySpeed * 2) * 0.1 + 0.5;
    } else if (enemyData?.movePattern === 'random') {
      enemyRef.current.rotation.z = Math.sin(animTimeRef.current * enemySpeed) * 0.2;
      enemyRef.current.position.y = Math.sin(animTimeRef.current * enemySpeed * 3) * 0.08 + 0.5;
    } else {
      // Animação padrão
      enemyRef.current.position.y = Math.sin(animTimeRef.current * 2) * 0.05 + 0.5;
    }
  });

  return (
    <group ref={enemyRef} position={position}>
      <Box args={enemyScale}>
        <meshStandardMaterial color={enemyColor} />
      </Box>

      {/* Olhos apenas para inimigos não estáticos */}
      {renderDetails && (
        <>
          <Sphere args={[0.2, 8, 8]} position={[-0.25, 0.25, 0.35]}>
            <meshStandardMaterial color="white" />
            <Sphere args={[0.1, 8, 8]} position={[0, 0, 0.1]}>
              <meshStandardMaterial color="black" />
            </Sphere>
          </Sphere>

          <Sphere args={[0.2, 8, 8]} position={[0.25, 0.25, 0.35]}>
            <meshStandardMaterial color="white" />
            <Sphere args={[0.1, 8, 8]} position={[0, 0, 0.1]}>
              <meshStandardMaterial color="black" />
            </Sphere>
          </Sphere>
        </>
      )}
    </group>
  );
}