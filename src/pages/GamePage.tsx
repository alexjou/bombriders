import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { registerThreeComponents } from '@/utils/game/three-config';
import GameUI from '../game/components/ui/GameUI';
import Game from './PageGame/Game';
import GameControls from './PageGame/components/GameControls';

// Registrar componentes Three.js no início
registerThreeComponents();

import { useSharedGameState } from '../hooks/game/useSharedGameState';

interface KeyboardMapping {
  name: string;
  keys: string[];
}

const GamePage: React.FC = () => {
  // Compartilha o estado do jogo entre Canvas e UI
  const gameState = useSharedGameState();

  const keyboardMap: KeyboardMapping[] = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
    { name: 'space', keys: ['Space'] },
    { name: 'escape', keys: ['Escape', 'KeyP'] },
  ];

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <KeyboardControls map={keyboardMap}>
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-4/5 h-4/5 relative shadow-2xl rounded-lg overflow-hidden flex">
            {/* Área do Canvas para o jogo 3D */}
            <div className="w-3/4">
              <Canvas
                shadows
                className="w-full h-full" gl={{
                  antialias: true,
                  alpha: true,
                  preserveDrawingBuffer: true,
                  logarithmicDepthBuffer: true,
                  // Removido useLegacyLights pois foi descontinuado no Three.js R155
                  toneMapping: THREE.ACESFilmicToneMapping,
                  precision: "highp"
                }}
                camera={{
                  fov: 60,
                  position: [15, 15, 15],
                  near: 0.1,
                  far: 1000
                }}
                onCreated={({ gl, scene }) => {
                  gl.setClearColor("#222222");
                  gl.setPixelRatio(window.devicePixelRatio);
                  scene.background = new THREE.Color("#222222");
                }}
              >
                <Game />
              </Canvas>
            </div>

            {/* Área para os controles de UI (fora do Canvas) */}
            <div className="w-1/4 bg-gray-800 p-4">
              <GameControls
                playerLives={gameState.playerLives}
                playerBombRange={gameState.playerBombRange}
                playerMaxBombs={gameState.playerMaxBombs}
                isGameOver={gameState.isGameOver}
              />
            </div>
          </div>
        </div>

        {/* UI Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <GameUI />
        </div>
      </KeyboardControls>
    </div>
  );
};

export default GamePage;
