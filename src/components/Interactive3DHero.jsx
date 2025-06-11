import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Sphere, 
  MeshDistortMaterial, 
  Float, 
  Environment,
  useScroll,
  ScrollControls,
  Text,
  Points,
  PointMaterial,
  Plane
} from '@react-three/drei';
import { 
  EffectComposer, 
  Bloom, 
  ChromaticAberration, 
  DepthOfField,
  Noise,
  Vignette
} from '@react-three/postprocessing';
import * as THREE from 'three';

// Configurações de performance
const PARTICLE_COUNT = 1000; // Reduzido para melhor performance
const LOD_DISTANCE = 20;
const FRAME_RATE_TARGET = 60;

// Componente de Partículas Otimizadas
function OptimizedParticles({ mouse, scrollY }) {
  const pointsRef = useRef();
  const velocitiesRef = useRef();
  const [isVisible, setIsVisible] = useState(true);
  
  const { positions, colors, velocities } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Posições iniciais
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      
      // Cores otimizadas
      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.4, 0.8, 0.5 + Math.random() * 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Velocidades iniciais
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    return { positions, colors, velocities };
  }, []);

  velocitiesRef.current = velocities;

  useFrame((state, delta) => {
    if (!pointsRef.current || !isVisible) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array;
    const velocities = velocitiesRef.current;
    
    // Otimização: atualizar apenas a cada 2 frames para 30fps nas partículas
    if (state.clock.elapsedTime % (2 / 60) < delta) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        
        // Movimento com velocidade
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];
        
        // Reação suave ao mouse (reduzida)
        const mouseInfluence = 0.05;
        velocities[i3] += (mouse.x * 5 - positions[i3]) * mouseInfluence * delta;
        velocities[i3 + 1] += (mouse.y * 5 - positions[i3 + 1]) * mouseInfluence * delta;
        
        // Limites de velocidade
        velocities[i3] = Math.max(-0.1, Math.min(0.1, velocities[i3]));
        velocities[i3 + 1] = Math.max(-0.1, Math.min(0.1, velocities[i3 + 1]));
        
        // Reset de posição quando sai dos limites
        if (Math.abs(positions[i3]) > 15) positions[i3] *= -0.8;
        if (Math.abs(positions[i3 + 1]) > 15) positions[i3 + 1] *= -0.8;
        if (Math.abs(positions[i3 + 2]) > 15) positions[i3 + 2] *= -0.8;
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    // Rotação suave
    pointsRef.current.rotation.y += delta * 0.05;
  });

  return (
    <Points ref={pointsRef} positions={positions} frustumCulled={true}>
      <PointMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
      <bufferAttribute
        attach="geometry-attributes-color"
        args={[colors, 3]}
      />
    </Points>
  );
}

// Componente de Ondas Otimizadas
function OptimizedWaves({ mouse, scrollY }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const [lastUpdate, setLastUpdate] = useState(0);
  
  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;
    
    // Otimização: atualizar material apenas a cada 100ms
    if (state.clock.elapsedTime - lastUpdate > 0.1) {
      materialRef.current.distort = 0.2 + Math.sin(state.clock.elapsedTime) * 0.1;
      materialRef.current.speed = 1.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
      setLastUpdate(state.clock.elapsedTime);
    }
    
    // Rotação suave
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouse.y * 0.2, 0.02);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouse.x * 0.2, 0.02);
    
    // Escala baseada no scroll (otimizada)
    const targetScale = 1 + (scrollY * 0.0005);
    const currentScale = meshRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, Math.min(targetScale, 1.5), 0.02);
    meshRef.current.scale.setScalar(newScale);
  });

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.3}>
      <Sphere ref={meshRef} args={[2.5, 64, 64]} position={[0, 0, -3]} frustumCulled={true}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#4a90e2"
          attach="material"
          distort={0.2}
          speed={1.5}
          roughness={0.3}
          metalness={0.7}
          emissive="#1a4480"
          emissiveIntensity={0.3}
        />
      </Sphere>
    </Float>
  );
}

// Componente de Elementos Brilhantes Otimizados
function OptimizedGlowingElements({ mouse, scrollY }) {
  const groupRef = useRef();
  const elementCount = 8; // Reduzido de 12 para 8
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    groupRef.current.rotation.y += delta * 0.1;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    
    // Movimento suave baseado no mouse
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouse.x * 1, 0.02);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, mouse.y * 1, 0.02);
  });

  return (
    <group ref={groupRef}>
      {[...Array(elementCount)].map((_, i) => (
        <Float key={i} speed={1.5 + i * 0.1} rotationIntensity={0.2} floatIntensity={0.2}>
          <Sphere
            args={[0.15, 16, 16]} // Reduzida geometria
            position={[
              Math.cos((i / elementCount) * Math.PI * 2) * 6,
              Math.sin((i / elementCount) * Math.PI * 2) * 6,
              Math.sin(i) * 1
            ]}
            frustumCulled={true}
          >
            <meshStandardMaterial
              color={`hsl(${(i * 45) % 360}, 80%, 60%)`}
              emissive={`hsl(${(i * 45) % 360}, 80%, 20%)`}
              emissiveIntensity={1}
              metalness={0.7}
              roughness={0.3}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
}

// Componente de Texto 3D Otimizado
function OptimizedText({ mouse, scrollY }) {
  const textRef = useRef();
  
  useFrame((state, delta) => {
    if (!textRef.current) return;
    
    textRef.current.rotation.y = THREE.MathUtils.lerp(textRef.current.rotation.y, mouse.x * 0.1, 0.02);
    textRef.current.rotation.x = THREE.MathUtils.lerp(textRef.current.rotation.x, mouse.y * 0.1, 0.02);
    
    // Efeito de pulsação suave
    const scale = 1 + Math.sin(state.clock.elapsedTime) * 0.05;
    textRef.current.scale.setScalar(scale);
  });

  return (
    <Text
      ref={textRef}
      fontSize={1.5}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      position={[0, 1, 0]}
      frustumCulled={true}
    >
      BOMBRIDER
      <meshStandardMaterial
        emissive="#4a90e2"
        emissiveIntensity={0.8}
        metalness={0.7}
        roughness={0.3}
      />
    </Text>
  );
}

// Componente de Câmera Otimizada
function OptimizedCamera({ mouse, scrollY }) {
  const { camera } = useThree();
  
  useFrame(() => {
    // Movimento muito sutil da câmera
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 1, 0.01);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 1, 0.01);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 8 - scrollY * 0.005, 0.01);
    
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// Componente Principal da Cena 3D Otimizada
function OptimizedScene3D() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  
  // Throttle para mouse movement
  const handleMouseMove = useCallback(
    THREE.MathUtils.throttle((event) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    }, 16), // ~60fps
    []
  );
  
  // Throttle para scroll
  const handleScroll = useCallback(
    THREE.MathUtils.throttle(() => {
      setScrollY(window.scrollY);
    }, 16), // ~60fps
    []
  );
  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleMouseMove, handleScroll]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, -5]} intensity={0.4} color="#4a90e2" />
      
      <OptimizedParticles mouse={mouse} scrollY={scrollY} />
      <OptimizedWaves mouse={mouse} scrollY={scrollY} />
      <OptimizedGlowingElements mouse={mouse} scrollY={scrollY} />
      <OptimizedText mouse={mouse} scrollY={scrollY} />
      <OptimizedCamera mouse={mouse} scrollY={scrollY} />
      
      <Environment preset="night" />
    </>
  );
}

// Componente Principal Otimizado
export default function Interactive3DHero() {
  return (
    <div className="w-full h-screen relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        gl={{ 
          antialias: false, // Desabilitado para performance
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        dpr={[1, 1.5]} // Limitado para performance
        performance={{ min: 0.5 }} // Performance adaptativa
        frameloop="demand" // Renderização sob demanda
      >
        <OptimizedScene3D />
        
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={1}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.7}
            height={200} // Reduzido para performance
          />
          <ChromaticAberration
            offset={[0.001, 0.001]}
          />
          <Noise
            opacity={0.05}
          />
          <Vignette
            eskil={false}
            offset={0.2}
            darkness={0.3}
          />
        </EffectComposer>
      </Canvas>
      
      {/* Gradiente de fundo otimizado */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-black/50 pointer-events-none" />
      
      {/* Overlay de conteúdo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center text-white z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Era dos BombRiders
          </h1>
          <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto px-4">
            Explore um mundo futurista onde tecnologia e natureza se encontram em uma jornada épica de sobrevivência
          </p>
        </div>
      </div>
    </div>
  );
}

