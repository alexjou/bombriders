import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { POWER_UPS } from '../../utils/constants';

const GameHUD = ({ player, onPause }) => {
  // Estado para controlar a animação de pontuação
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [prevScore, setPrevScore] = useState(player.score);
  
  // Verificar se o score mudou para mostrar a animação
  useEffect(() => {
    if (player.score > prevScore) {
      // Mostrar animação
      setShowScoreAnimation(true);
      
      // Esconder após 2 segundos
      const timer = setTimeout(() => {
        setShowScoreAnimation(false);
      }, 2000);
      
      // Atualizar o score anterior
      setPrevScore(player.score);
      
      return () => clearTimeout(timer);
    }
  }, [player.score, prevScore]);
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Barra superior com informações do jogador */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 p-2 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Personagem com Score */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {player.character.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{player.character}</span>
                <span className="text-yellow-400 font-bold text-sm relative">
                  ({player.score} pontos)
                  {/* Animação quando o score aumenta */}
                  {showScoreAnimation && (
                    <span className="absolute -top-5 -right-2 text-green-400 font-bold animate-bounce">
                      +100!
                    </span>
                  )}
                </span>
              </div>
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
          
          {/* Power-ups - Alcance de bombas com ícone */}
          <div className="flex items-center gap-2 ml-4">
            <div className="text-orange-400 text-lg">🔥</div>
            <div className="text-white font-bold">{player.bombRange || 2}</div>
          </div>
          
          {/* Power-ups - Máximo de bombas com ícone */}
          <div className="flex items-center gap-2 ml-4">
            <div className="text-blue-400 text-lg">💣</div>
            <div className="text-white font-bold">{player.bombs || 1}</div>
          </div>
          
          {/* Status de invencibilidade */}
          {player.isInvincible && (
            <div className="ml-4 text-yellow-300 animate-pulse font-bold">
              INVENCÍVEL
            </div>
          )}
          
          {/* Power-ups ativos - Adicionado na barra superior */}
          <div className="flex items-center gap-2 ml-4">
            <div className="text-white text-sm">Power-ups:</div>
            <div className="flex gap-1">
              {player.powerUps.map((powerUp, i) => {
                const powerUpInfo = POWER_UPS[powerUp] || {};
                return (
                  <div 
                    key={i} 
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-lg"
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
      
      {/* Barra inferior removida conforme solicitado */}
      
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

