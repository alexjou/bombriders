// Índice de assets para o jogo BombRider

// Personagens
import bombermanSprites from './characters/bomberman_sprites.png';
import bombermanAssetPack from './characters/bomberman_asset_pack.png';

// Bombas e explosões
import bombSprites from './bombs/bomb_sprites.png';
import explosionSprites from './bombs/explosion_sprites.png';
import explosionEffect from './bombs/explosion_effect.png';

// Blocos e tiles
import bombermanBlocks from './blocks/bomberman_blocks.png';
import bombermanTileset from './blocks/bomberman_tileset.png';
import superBombermanTiles from './blocks/super_bomberman_tiles.png';

// Dinossauros
import dinoSprites from './dinos/dino_sprites.jpg';

// Inimigos
import enemySprites from './enemies/enemy_sprites.gif';
import monsterSprites from './enemies/monster_sprites.webp';

// Power-ups e itens
import bombermanItems from './powerups/bomberman_items.png';
import powerupSprites from './powerups/powerup_sprites.png';
import itemSprites from './powerups/item_sprites.png';

// Fundos para os mapas
import swampTileset from './backgrounds/swamp_tileset.webp';
import forestTileset from './backgrounds/forest_tileset.jpg';
import caveTileset from './backgrounds/cave_tileset.jpg';

// Exportando todos os assets
export const characters = {
  bombermanSprites,
  bombermanAssetPack
};

export const bombs = {
  bombSprites,
  explosionSprites,
  explosionEffect
};

export const blocks = {
  bombermanBlocks,
  bombermanTileset,
  superBombermanTiles
};

export const dinos = {
  dinoSprites
};

export const enemies = {
  enemySprites,
  monsterSprites
};

export const powerups = {
  bombermanItems,
  powerupSprites,
  itemSprites
};

export const backgrounds = {
  swampTileset,
  forestTileset,
  caveTileset
};

// Exportação padrão de todos os assets
export default {
  characters,
  bombs,
  blocks,
  dinos,
  enemies,
  powerups,
  backgrounds
};

