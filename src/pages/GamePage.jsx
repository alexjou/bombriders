import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import GameCanvas from '../game/components/GameCanvas';
import GameUI from '../game/components/ui/GameUI';
import useGameStore from '../game/store/gameStore';

const GamePage = () => {
  const { gameState } = useGameStore();

  const keyboardMap = [
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
          <div className="w-4/5 h-4/5 relative shadow-2xl rounded-lg overflow-hidden">
            <Canvas
              shadows
              className="w-full h-full"
            >
              <GameCanvas />
            </Canvas>
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

