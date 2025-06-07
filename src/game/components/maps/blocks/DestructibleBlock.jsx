import React from 'react';

const DestructibleBlock = ({ position, mapType }) => {
  // Cores dos blocos destrutíveis baseadas no tipo de mapa
  const getDestructibleColors = () => {
    switch (mapType) {
      case 'FOREST':
        return {
          primary: '#A1887F',   // Marrom claro (madeira)
          secondary: '#8D6E63',  // Marrom médio
          detail: '#795548'      // Marrom escuro
        };
      case 'CAVE':
        return {
          primary: '#78909C',   // Azul-cinza claro (pedra)
          secondary: '#607D8B',  // Azul-cinza médio
          detail: '#546E7A'      // Azul-cinza escuro
        };
      case 'DESERT':
        return {
          primary: '#FFD54F',   // Amarelo areia (caixote)
          secondary: '#FFC107',  // Âmbar
          detail: '#FFA000'      // Âmbar escuro
        };
      case 'SWAMP':
        return {
          primary: '#7CB342',   // Verde musgo claro
          secondary: '#689F38',  // Verde musgo médio
          detail: '#558B2F'      // Verde musgo escuro
        };
      default:
        return {
          primary: '#A1887F',
          secondary: '#8D6E63',
          detail: '#795548'
        };
    }
  };
  
  const colors = getDestructibleColors();
  
  return (
    <group position={[position[0], position[1], position[2]]}>
      {/* Bloco principal */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial color={colors.primary} />
      </mesh>
      
      {/* Detalhes do bloco destrutível (estilo caixote) */}
      {/* Tábuas horizontais */}
      <mesh castShadow position={[0, 0.3, 0.46]}>
        <boxGeometry args={[0.92, 0.2, 0.02]} />
        <meshStandardMaterial color={colors.detail} />
      </mesh>
      
      <mesh castShadow position={[0, 0.7, 0.46]}>
        <boxGeometry args={[0.92, 0.2, 0.02]} />
        <meshStandardMaterial color={colors.detail} />
      </mesh>
      
      <mesh castShadow position={[0, 0.3, -0.46]}>
        <boxGeometry args={[0.92, 0.2, 0.02]} />
        <meshStandardMaterial color={colors.detail} />
      </mesh>
      
      <mesh castShadow position={[0, 0.7, -0.46]}>
        <boxGeometry args={[0.92, 0.2, 0.02]} />
        <meshStandardMaterial color={colors.detail} />
      </mesh>
      
      {/* Tábuas verticais */}
      <mesh castShadow position={[0.46, 0.5, 0]}>
        <boxGeometry args={[0.02, 0.92, 0.92]} />
        <meshStandardMaterial color={colors.detail} />
      </mesh>
      
      <mesh castShadow position={[-0.46, 0.5, 0]}>
        <boxGeometry args={[0.02, 0.92, 0.92]} />
        <meshStandardMaterial color={colors.detail} />
      </mesh>
      
      {/* Topo e base */}
      <mesh castShadow position={[0, 0.96, 0]}>
        <boxGeometry args={[0.92, 0.02, 0.92]} />
        <meshStandardMaterial color={colors.secondary} />
      </mesh>
      
      <mesh castShadow position={[0, 0.04, 0]}>
        <boxGeometry args={[0.92, 0.02, 0.92]} />
        <meshStandardMaterial color={colors.secondary} />
      </mesh>
    </group>
  );
};

export default DestructibleBlock;

