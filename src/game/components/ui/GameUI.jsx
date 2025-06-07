import React from 'react';
import useGameStore from '../../store/gameStore';
import { CHARACTERS, MAPS } from '../../utils/constants';
import MainMenu from './MainMenu';
import GameHUD from './GameHUD';
import PauseMenu from './PauseMenu';
import GameOverScreen from './GameOverScreen';

const GameUI = () => {
  const { gameState, player, currentMap, setGameState, resetGame } = useGameStore();
  
  // Manipuladores de eventos
  const handleStartGame = (character, map) => {
    setGameState('playing');
  };
  
  const handlePauseGame = () => {
    setGameState('paused');
  };
  
  const handleResumeGame = () => {
    setGameState('playing');
  };
  
  const handleRestartGame = () => {
    resetGame();
    setGameState('menu');
  };
  
  // Renderiza a UI com base no estado do jogo
  const renderGameUI = () => {
    switch (gameState) {
      case 'menu':
        return (
          <MainMenu 
            characters={Object.values(CHARACTERS)} 
            maps={Object.values(MAPS)}
            onStartGame={handleStartGame}
          />
        );
      case 'playing':
        return (
          <GameHUD 
            player={player}
            onPause={handlePauseGame}
          />
        );
      case 'paused':
        return (
          <PauseMenu 
            onResume={handleResumeGame}
            onRestart={handleRestartGame}
          />
        );
      case 'gameOver':
        return (
          <GameOverScreen 
            score={player.score}
            onRestart={handleRestartGame}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="game-ui">
      {renderGameUI()}
    </div>
  );
};

export default GameUI;

