import React from 'react';
import { Sphere } from '@react-three/drei';

interface BombProps {
  position: [number, number, number];
}

const Bomb: React.FC<BombProps> = ({ position }) => {
  return (
    <mesh position={position} castShadow>
      <Sphere args={[0.3, 32, 32]}>
        <meshStandardMaterial color="#333333" roughness={0.2} metalness={0.5} emissive="#111111" />
      </Sphere>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
    </mesh>
  );
};

export default Bomb;