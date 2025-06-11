import { Box } from '@react-three/drei';

interface EnemyProps extends Omit<React.ComponentProps<typeof Box>, 'position'> {
  color?: string;
  position: [number, number, number];
}

export default function Enemy({ color = 'purple', position, ...props }: EnemyProps) {
  return (
    <Box {...props} position={position} args={[0.8, 0.8, 0.8]}>
      <meshStandardMaterial color={color} />
    </Box>
  );
}
