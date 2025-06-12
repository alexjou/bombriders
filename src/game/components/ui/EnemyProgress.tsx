import React from 'react';

interface EnemyProgressProps {
  currentEnemies: number;
  totalEnemies: number;
}

/**
 * Componente que mostra o progresso de inimigos eliminados
 */
const EnemyProgress: React.FC<EnemyProgressProps> = ({ currentEnemies, totalEnemies }) => {
  return (
    <div className="absolute top-4 left-4 p-2 bg-slate-800 bg-opacity-80 rounded-md z-10 text-white">
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-2">
          <span role="img" aria-label="Inimigos" className="text-red-500 text-lg">👹</span>
        </div>
        <div className="flex-grow">
          <div className="flex justify-between mb-1 text-xs font-medium">
            <span>Inimigos restantes: </span>
            <span>{currentEnemies}/{totalEnemies}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-red-600 h-2.5 rounded-full transition-all duration-300"
              style={{
                width: `${Math.max(0, 100 - (currentEnemies / totalEnemies * 100))}%`
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnemyProgress;
