// Hook personalizado
import { useState, useEffect } from 'react';

// Imagens dos personagens (caminhos absolutos)
const characterPaths = {
  ryder: '/src/assets/images/characters/charFire.jpeg',
  vega: '/src/assets/images/characters/charRaio.jpeg',
  tyranotron: '/src/assets/images/characters/charEarth.jpeg',
  raptoraX: '/src/assets/images/characters/charWater.jpeg',
  aeroBlast: '/src/assets/images/characters/charAir.jpeg'
};

// Prefetching das imagens para garantir que carregem
const preloadImages = () => {
  Object.values(characterPaths).forEach(path => {
    const img = new Image();
    img.src = path;
  });
};

export const useCharacterImages = () => {
  const [images, setImages] = useState<Record<string, string>>(characterPaths);

  useEffect(() => {
    // Pré-carregar as imagens
    preloadImages();

    // Verificar a existência e fazer logging
    Object.entries(characterPaths).forEach(([id, path]) => {
      fetch(path)
        .then(response => {
          if (!response.ok) {
            console.error(`Erro ao carregar imagem para ${id}: ${path}`);
          } else {
            console.log(`Imagem para ${id} carregada com sucesso: ${path}`);
          }
        })
        .catch(error => {
          console.error(`Erro ao carregar imagem para ${id}: ${path}`, error);
        });
    });

    // Armazenar no estado
    setImages(characterPaths);
    console.log("Caminhos das imagens dos personagens:", characterPaths);
  }, []);

  return images;
};
