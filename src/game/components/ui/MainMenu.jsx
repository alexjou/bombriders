import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import useGameStore from '../../store/gameStore';

const MainMenu = ({ characters, maps, onStartGame }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]?.name || 'Aria');
  const [selectedMap, setSelectedMap] = useState(maps[0]?.name || 'Floresta Pré-Histórica');
  const { setPlayerCharacter, setCurrentMap } = useGameStore();
  
  // Inicia o jogo com o personagem e mapa selecionados
  const handleStartGame = () => {
    // Converte o nome do mapa para a chave do mapa
    const mapKey = Object.keys(maps).find(
      key => maps[key].name === selectedMap
    ) || 'FOREST';
    
    // Atualiza o store
    setPlayerCharacter(selectedCharacter);
    setCurrentMap(mapKey);
    
    // Chama o callback
    onStartGame && onStartGame(selectedCharacter, mapKey);
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-6 text-primary">BombRider</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Escolha seu Rider</h2>
          <div className="grid grid-cols-2 gap-2">
            {characters.map((character) => (
              <Button
                key={character.name}
                variant={selectedCharacter === character.name ? "default" : "outline"}
                className="justify-start"
                onClick={() => setSelectedCharacter(character.name)}
              >
                <div className="flex flex-col items-start">
                  <span>{character.name}</span>
                  <span className="text-xs text-muted-foreground">{character.element}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Escolha o Mapa</h2>
          <div className="grid grid-cols-1 gap-2">
            {maps.map((map) => (
              <Button
                key={map.name}
                variant={selectedMap === map.name ? "default" : "outline"}
                className="justify-start"
                onClick={() => setSelectedMap(map.name)}
              >
                <div className="flex flex-col items-start">
                  <span>{map.name}</span>
                  <span className="text-xs text-muted-foreground">{map.characteristics}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="mt-8 flex flex-col gap-2">
          <Button size="lg" onClick={handleStartGame}>
            Iniciar Jogo
          </Button>
          
          <Button variant="outline" size="lg">
            Como Jogar
          </Button>
          
          <div className="text-center mt-4 text-sm text-muted-foreground">
            <p>Versão 2.0 — Planejando integração com Web3</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;

