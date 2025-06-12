import React from 'react';
import useGameStore from '@/game/store/gameStore';
import '@/styles/game-controls.css';

interface GameControlsProps {
  playerLives: number;
  playerBombRange: number;
  playerMaxBombs: number;
  isGameOver: boolean;
}

/**
 * Componente que exibe os controles e informações do jogo
 */
const GameControls: React.FC<GameControlsProps> = ({
  playerLives,
  playerBombRange,
  playerMaxBombs,
  isGameOver
}) => {
  const { gameState, setGameState, resetGame } = useGameStore();
  const { player } = useGameStore();

  const handleReset = () => {
    resetGame();
  };

  const handleStart = () => {
    setGameState('playing');
  };

  const handlePause = () => {
    setGameState('paused');
  };

  return (
    <div className="game-controls">
      <div className="game-info">
        <h3>BombRiders</h3>
        <div className="player-stats">
          <p>Vidas: <span className="stat-value">{playerLives}</span></p>
          <p>Pontuação: <span className="stat-value">{player?.score || 0}</span></p>
          <p>Alcance da bomba: <span className="stat-value">{playerBombRange}</span></p>
          <p>Máximo de bombas: <span className="stat-value">{playerMaxBombs}</span></p>
        </div>
      </div>

      <div className="game-buttons">
        {gameState === 'menu' && (
          <button className="control-btn start-btn" onClick={handleStart}>
            Iniciar Jogo
          </button>
        )}

        {gameState === 'playing' && (
          <button className="control-btn pause-btn" onClick={handlePause}>
            Pausar
          </button>
        )}

        {gameState === 'paused' && (
          <button className="control-btn resume-btn" onClick={handleStart}>
            Continuar
          </button>
        )}

        {(gameState === 'gameOver' || gameState === 'levelComplete') && (
          <button className="control-btn reset-btn" onClick={handleReset}>
            Reiniciar
          </button>
        )}
      </div>

      {isGameOver && (
        <div className="game-over-message">
          <h2>Game Over!</h2>
          <p>Pontuação final: {player?.score || 0}</p>
        </div>
      )}

      {gameState === 'levelComplete' && (
        <div className="level-complete-message">
          <h2>Nível Concluído!</h2>
          <p>Pontuação: {player?.score || 0}</p>
        </div>
      )}

      <div className="game-instructions">
        <h4>Controles:</h4>
        <p>Movimentação: Setas ou WASD</p>
        <p>Colocar bomba: Espaço</p>
      </div>
    </div>
  );
};

export default GameControls;
