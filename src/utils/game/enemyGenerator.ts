import { EnemyData } from '@/types/game';
import { GAME_CONFIG } from './grid';

/**
 * Cria inimigos iniciais em posições garantidas no grid
 * Esta versão garante que exatamente o número especificado de inimigos seja criado.
 * @returns Lista de inimigos iniciais
 */
export function createGuaranteedEnemies(): EnemyData[] {
  const { gridRows, gridColumns, playerStartRow, playerStartCol, initialEnemyCount } = GAME_CONFIG;

  const newEnemies: EnemyData[] = [];
  const occupiedCells = new Set<string>();

  // Adicionar células ocupadas pelo jogador (e adjacentes)
  occupiedCells.add(`${playerStartRow}-${playerStartCol}`);
  occupiedCells.add(`${playerStartRow}-${playerStartCol + 1}`);
  occupiedCells.add(`${playerStartRow + 1}-${playerStartCol}`);

  // Tipos de inimigos e padrões de movimento (exatamente 5 tipos)
  const enemyTypes = ['normal', 'rapido', 'perseguidor', 'aleatorio', 'estatico'];
  const movementPatterns = ['random', 'random', 'follow', 'random', 'stationary'];
  const speedModifiers = [1.0, 1.5, 1.2, 0.8, 0]; // O último é 0 para o inimigo estático

  // Posições garantidas para cada inimigo (uma para cada tipo)
  // Essas posições são estrategicamente distribuídas para criar desafio
  const guaranteedPositions = [
    { r: 1, c: gridColumns - 2 },  // Normal (Superior direito)
    { r: gridRows - 2, c: 1 },     // Rápido (Inferior esquerdo)
    { r: gridRows - 2, c: gridColumns - 2 }, // Perseguidor (Inferior direito)
    { r: 3, c: 3 },                // Aleatório (Meio, mais perto do jogador)
    { r: gridRows - 4, c: gridColumns - 4 }  // Estático (Meio, mais longe)
  ];
  // Criar cada um dos 5 inimigos em posições específicas
  for (let i = 0; i < initialEnemyCount; i++) {
    const pos = guaranteedPositions[i % guaranteedPositions.length]; // Assegura que não ultrapassamos o array
    const typeIndex = i % enemyTypes.length; // 0 a 4, cada tipo de inimigo

    // Timestamp único para gerar IDs diferentes
    const timestamp = Date.now() + i * 100;

    const newEnemy = {
      id: `enemy-${i}-${timestamp}`,
      row: pos.r,
      col: pos.c,
      type: enemyTypes[typeIndex],
      movePattern: movementPatterns[typeIndex],
      speed: speedModifiers[typeIndex]
    };

    // Adiciona o inimigo à lista e marca a célula como ocupada
    newEnemies.push(newEnemy);
    occupiedCells.add(`${pos.r}-${pos.c}`);
    console.log(`Inimigo ${i + 1} criado: ${newEnemy.type} na posição [${pos.r}, ${pos.c}] com movimento ${newEnemy.movePattern}`);
  }

  console.log(`Total de inimigos criados: ${newEnemies.length}/${initialEnemyCount}`);
  return newEnemies;
}
