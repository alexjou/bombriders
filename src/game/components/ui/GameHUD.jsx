<<<<<<< Updated upstream
import React from 'react';
=======
import { useState, useEffect } from 'react';
>>>>>>> Stashed changes
import { Button } from '@/components/ui/button.jsx';
import { POWER_UPS } from '@/utils/game/game-constants';
import EnemyProgress from './EnemyProgress';
import { GAME_CONFIG } from '@/utils/game/grid';

const GameHUD = ({ player, onPause }) => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Indicador de progresso de inimigos */}
      <EnemyProgress 
        currentEnemies={player.enemies || 0} 
        totalEnemies={GAME_CONFIG.initialEnemyCount || 5} 
      />
      
      {/* Barra superior com informações do jogador */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 p-2 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Personagem */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {player.character.charAt(0)}
            </div>
            <div>
              <div className="text-white font-semibold">{player.character}</div>
              <div className="text-xs text-gray-300">
                {player.currentDino ? `+ ${player.currentDino}` : 'Sem dino'}
              </div>
            </div>
          </div>
          
          {/* Vidas */}
          <div className="flex items-center gap-1">
            {Array.from({ length: player.lives }).map((_, i) => (
              <div key={i} className="text-red-500 text-xl">❤️</div>
            ))}
          </div>
        </div>
        
        {/* Pontuação */}
        <div className="text-white font-bold">
          <span className="text-yellow-400">Score:</span> {player.score}
        </div>
        
        {/* Botão de pausa (com pointer-events-auto para permitir cliques) */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white pointer-events-auto"
          onClick={onPause}
        >
          ⏸️ Pausar
        </Button>
      </div>
      
      {/* Barra inferior com power-ups e bombas */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
        <div className="flex justify-between items-center">
          {/* Bombas disponíveis */}
          <div className="flex items-center gap-2">
            <div className="text-white font-semibold">Bombas:</div>
            <div className="flex gap-1">
              {Array.from({ length: player.bombs }).map((_, i) => (
                <div key={i} className="text-xl">💣</div>
              ))}
            </div>
          </div>
          
          {/* Alcance da bomba */}
          <div className="flex items-center gap-2">
            <div className="text-white font-semibold">Alcance:</div>
            <div className="flex gap-1">
              {Array.from({ length: player.bombRange }).map((_, i) => (
                <div key={i} className="text-xl">🔥</div>
              ))}
            </div>
          </div>
          
          {/* Power-ups ativos */}
          <div className="flex items-center gap-2">
            <div className="text-white font-semibold">Power-ups:</div>
            <div className="flex gap-1">
              {player.powerUps.map((powerUp, i) => {
                const powerUpInfo = POWER_UPS[powerUp] || {};
                return (
                  <div 
                    key={i} 
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xl"
                    title={powerUpInfo.name}
                  >
                    {powerUpInfo.icon}
                  </div>
                );
              })}
              {player.powerUps.length === 0 && (
                <div className="text-gray-400 text-sm">Nenhum</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Controles para dispositivos móveis */}
      <div className="absolute bottom-20 left-4 right-4 flex justify-between pointer-events-auto md:hidden">
        {/* Direcionais */}
        <div className="grid grid-cols-3 gap-2">
          <div className="w-12 h-12"></div>
          <button className="w-12 h-12 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center text-white text-2xl">
            ↑
          </button>
          <div className="w-12 h-12"></div>
          
          <button className="w-12 h-12 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center text-white text-2xl">
            ←
          </button>
          <div className="w-12 h-12"></div>
          <button className="w-12 h-12 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center text-white text-2xl">
            →
          </button>
          
          <div className="w-12 h-12"></div>
          <button className="w-12 h-12 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center text-white text-2xl">
            ↓
          </button>
          <div className="w-12 h-12"></div>
        </div>
        
        {/* Botão de bomba */}
        <button className="w-16 h-16 bg-red-600 bg-opacity-70 rounded-full flex items-center justify-center text-white text-2xl">
          💣
        </button>
      </div>
    </div>
  );
};

export default GameHUD;

