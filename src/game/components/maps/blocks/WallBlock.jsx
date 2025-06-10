
const WallBlock = ({ position, mapType }) => {
  // Cores das paredes baseadas no tipo de mapa
  const getWallColors = () => {
    switch (mapType) {
      case 'FOREST':
        return {
          primary: '#795548',   // Marrom
          secondary: '#5D4037'  // Marrom escuro
        };
      case 'CAVE':
        return {
          primary: '#455A64',   // Azul-cinza
          secondary: '#263238'  // Azul-cinza escuro
        };
      case 'DESERT':
        return {
          primary: '#D2B48C',   // Bege
          secondary: '#A1887F'  // Bege escuro
        };
      case 'SWAMP':
        return {
          primary: '#33691E',   // Verde musgo
          secondary: '#1B5E20'  // Verde musgo escuro
        };
      default:
        return {
          primary: '#795548',
          secondary: '#5D4037'
        };
    }
  };
  
  const colors = getWallColors();
  
  return (
    <group position={[position[0], position[1], position[2]]}>
      {/* Bloco principal */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={colors.primary} 
          roughness={0.6}
          metalness={0.2}
          emissive={colors.primary}
          emissiveIntensity={0.3} // Aumentado para maior visibilidade
          // Define wireframe para depuração se necessário
          // wireframe={true}
        />
      </mesh>
      
      {/* Detalhes da parede */}
      <mesh castShadow position={[0, 0.5, 0.4]}>
        <boxGeometry args={[0.9, 0.9, 0.2]} />
        <meshStandardMaterial 
          color={colors.secondary}
          roughness={0.5}
          metalness={0.3}
          emissive={colors.secondary}
          emissiveIntensity={0.1}
        />
      </mesh>
      
      <mesh castShadow position={[0.4, 0.5, 0]}>
        <boxGeometry args={[0.2, 0.9, 0.9]} />
        <meshStandardMaterial color={colors.secondary} />
      </mesh>
      
      <mesh castShadow position={[-0.4, 0.5, 0]}>
        <boxGeometry args={[0.2, 0.9, 0.9]} />
        <meshStandardMaterial color={colors.secondary} />
      </mesh>
      
      <mesh castShadow position={[0, 0.5, -0.4]}>
        <boxGeometry args={[0.9, 0.9, 0.2]} />
        <meshStandardMaterial color={colors.secondary} />
      </mesh>
      
      {/* Topo do bloco com detalhes */}
      <mesh castShadow position={[0, 1, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color={colors.secondary} />
      </mesh>
    </group>
  );
};

export default WallBlock;

