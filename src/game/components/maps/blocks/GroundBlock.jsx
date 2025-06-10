
const GroundBlock = ({ position, mapType, isAlternate }) => {
  // Cores do chão baseadas no tipo de mapa
  const getGroundColors = () => {
    switch (mapType) {
      case 'FOREST':
        return {
          primary: '#8BC34A',   // Verde claro
          secondary: '#689F38'  // Verde escuro
        };
      case 'CAVE':
        return {
          primary: '#616161',   // Cinza claro
          secondary: '#424242'  // Cinza escuro
        };
      case 'DESERT':
        return {
          primary: '#F9E076',   // Amarelo areia claro
          secondary: '#E6C84C'  // Amarelo areia escuro
        };
      case 'SWAMP':
        return {
          primary: '#4CAF50',   // Verde pântano claro
          secondary: '#388E3C'  // Verde pântano escuro
        };
      default:
        return {
          primary: '#8BC34A',
          secondary: '#689F38'
        };
    }
  };
  
  const colors = getGroundColors();
  const color = isAlternate ? colors.primary : colors.secondary;
  
  return (
    <mesh 
      position={[position[0], position[1] - 0.5, position[2]]} 
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.7}
        metalness={0.1}
        emissive={color} 
        emissiveIntensity={0.1} // Leve brilho para ser visível mesmo em baixa iluminação
      />
    </mesh>
  );
};

export default GroundBlock;

