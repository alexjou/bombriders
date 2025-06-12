import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import useGameStore from '@/game/store/gameStore';
import { GAME_CONFIG } from '@/utils/game/grid';
import '@/styles/game.css';

/**
 * Componente principal do jogo que renderiza o GameBoard e os controles
 */
export default function Game() {
  const [playerLives, setPlayerLives] = useState<number>(GAME_CONFIG.playerInitialLives);
  const [playerBombRange, setPlayerBombRange] = useState<number>(GAME_CONFIG.initialBombRange);
  const [playerMaxBombs, setPlayerMaxBombs] = useState<number>(GAME_CONFIG.initialMaxBombs);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const { player } = useGameStore();

  // Sincroniza os estados locais com o estado global
  useEffect(() => {
    if (player) {
      setPlayerLives(player.lives);
      setPlayerBombRange(player.bombRange);
      setPlayerMaxBombs(player.bombs);
    }
  }, [player]);

  return (
    <div className="game-container">
      <div className="game-board-container">
        <GameBoard />
      </div>
      <div className="game-controls-container">
        <GameControls
          playerLives={playerLives}
          playerBombRange={playerBombRange}
          playerMaxBombs={playerMaxBombs}
          isGameOver={isGameOver}
        />
      </div>
    </div>
  );
}
