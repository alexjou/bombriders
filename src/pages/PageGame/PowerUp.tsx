import { CellType } from './types';
import type { ThreeElements } from '@react-three/fiber'; // Usar 'import type'

// Definir as props específicas do nosso componente PowerUp
interface PowerUpCustomProps {
  type: CellType.POWERUP_BOMB_RANGE | CellType.POWERUP_MAX_BOMBS;
  // position já está incluído em ThreeElements['mesh'] e será passado diretamente
}

// Combinar com as props de um elemento mesh do R3F
// Omitimos 'type' de ThreeElements['mesh'] para evitar conflito, pois já definimos em PowerUpCustomProps.
// A prop 'position' será explicitamente passada para o componente <mesh> e deve ser compatível
// com a definição em ThreeElements['mesh'].
type PowerUpProps = PowerUpCustomProps & Omit<ThreeElements['mesh'], 'type'>;

export default function PowerUp({ position, type, ...props }: PowerUpProps) {
  const color = type === CellType.POWERUP_BOMB_RANGE ? 'blue' : 'green';
  const powerUpSize: [number, number, number] = [0.5, 0.5, 0.5]; // Tamanho do power-up

  return (
    // A prop 'position' aqui é a que vem de PowerUpProps, que deve ser compatível com ThreeElements['mesh']['position']
    <mesh position={position} {...props} castShadow receiveShadow>
      <sphereGeometry args={[powerUpSize[0] / 1.5, 16, 16]} /> {/* Usando esfera para diferenciar */}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
    </mesh>
  );
}
