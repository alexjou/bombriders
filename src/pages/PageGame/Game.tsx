import React, { Suspense } from 'react';
const GameBoard = React.lazy(() => import('./components/GameBoard'));

/**
 * Componente principal do jogo
 * Este componente atua apenas como um container para o GameBoard (renderização 3D)
 */
export default function Game() {
  // O componente Game agora apenas renderiza o GameBoard com Suspense
  // Os controles serão movidos para fora do Canvas no GamePage
  return (
    <Suspense fallback={null}>
      <GameBoard />
    </Suspense>
  );
}