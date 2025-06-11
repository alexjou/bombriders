// d:\Code\Meus Projetos\Jogos\BombRider\src\pathfinding.ts
import { CellType } from './types';
import type { Grid, BombData } from './types'; // Usar import type para tipos

interface Node {
  x: number; // Corresponde a col (coluna)
  y: number; // Corresponde a row (linha)
  g: number; // Cost from start to this node
  h: number; // Heuristic cost from this node to end
  f: number; // g + h
  parent: Node | null;
}

// Heuristic function (Manhattan distance)
function heuristic(a: Node, b: Node): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function findPath(
  grid: Grid,
  start: { r: number; c: number }, // Alterado para usar r, c para consistência
  end: { r: number; c: number },   // Alterado para usar r, c para consistência
  bombs: BombData[], // Adicionado parâmetro para bombas ativas
  gridWidth: number,
  gridHeight: number
): { r: number; c: number }[] | null { // Retorno também usa r, c
  const openList: Node[] = [];
  const closedList: Set<string> = new Set();
  const nodes: Map<string, Node> = new Map();

  function getNode(x: number, y: number): Node { // x é col, y é row
    const key = `${x},${y}`;
    if (!nodes.has(key)) {
      nodes.set(key, { x, y, g: Infinity, h: Infinity, f: Infinity, parent: null });
    }
    return nodes.get(key)!;
  }

  const startNode = getNode(start.c, start.r); // Usar c para x, r para y
  startNode.g = 0;
  startNode.h = heuristic(startNode, { x: end.c, y: end.r, g: 0, h: 0, f: 0, parent: null });
  startNode.f = startNode.g + startNode.h;
  openList.push(startNode);

  while (openList.length > 0) {
    openList.sort((a, b) => {
      if (a.f === b.f) {
        return Math.random() - 0.5; // Mantém o desempate aleatório
      }
      return a.f - b.f;
    });
    const currentNode = openList.shift()!;
    const currentKey = `${currentNode.x},${currentNode.y}`;

    if (currentNode.x === end.c && currentNode.y === end.r) { // Usar c para x, r para y
      const path: { r: number; c: number }[] = [];
      let temp: Node | null = currentNode;
      while (temp) {
        path.push({ r: temp.y, c: temp.x }); // Salvar como r, c
        temp = temp.parent;
      }
      return path.reverse();
    }

    closedList.add(currentKey);

    const neighborsCoords = [
      { x: currentNode.x, y: currentNode.y - 1 }, // Up (row decreases)
      { x: currentNode.x, y: currentNode.y + 1 }, // Down (row increases)
      { x: currentNode.x - 1, y: currentNode.y }, // Left (col decreases)
      { x: currentNode.x + 1, y: currentNode.y }, // Right (col increases)
    ];

    for (const neighborCoord of neighborsCoords) {
      const { x, y } = neighborCoord; // x é col, y é row

      if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) {
        continue;
      }

      const neighborKey = `${x},${y}`;
      if (closedList.has(neighborKey)) {
        continue;
      }

      // Verificar se a célula vizinha está ocupada por uma bomba
      const isBombLocation = bombs.some(bomb => bomb.col === x && bomb.row === y);
      if (isBombLocation) {
        continue;
      }

      const cellType = grid[y][x]; // Acessar grid com [row][col]
      if (
        cellType === CellType.SOLID_BLOCK ||
        cellType === CellType.DESTRUCTIBLE_BLOCK
        // CellType.BOMB já é tratado pela verificação `isBombLocation` acima
      ) {
        continue;
      }

      const tentativeG = currentNode.g + 1; // Cost to move to a neighbor is 1
      const neighborNode = getNode(x, y);

      if (tentativeG < neighborNode.g) {
        neighborNode.parent = currentNode;
        neighborNode.g = tentativeG;
        neighborNode.h = heuristic(neighborNode, { x: end.c, y: end.r, g: 0, h: 0, f: 0, parent: null });
        neighborNode.f = neighborNode.g + neighborNode.h;

        if (!openList.some(node => node.x === neighborNode.x && node.y === neighborNode.y)) {
          openList.push(neighborNode);
        }
      }
    }
  }

  return null; // Path not found
}
