import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handlePlayGame = () => {
    navigate('/game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-purple-600 to-green-500 text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center text-center p-8">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-white/20 border border-white/30 rounded-full px-6 py-2 mb-8">
            <span className="text-yellow-300 mr-2">✨</span>
            Novo Jogo NFT
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            BombRider
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed">
            A Revolução do Bomberman Encontra o Mundo NFT! Explore um universo pré-histórico, 
            lute contra dinossauros e construa seu legado digital neste emocionante jogo multiplayer.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button 
              onClick={() => navigate('/multiplayer')}
              className="bg-white text-orange-600 hover:bg-white/90 px-8 py-4 text-lg font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <span>👥</span>
              Multiplayer
            </button>
            
            <button 
              onClick={handlePlayGame}
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-bold rounded-full flex items-center gap-3"
            >
              <span>▶️</span>
              Solo
            </button>
            
            <button 
              onClick={() => navigate('/nft')}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-8 py-4 text-lg font-bold rounded-full flex items-center gap-3"
            >
              <span>💎</span>
              NFTs
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">5 Max</div>
              <div className="text-white/70">Jogadores</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">5</div>
              <div className="text-white/70">Personagens</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">4</div>
              <div className="text-white/70">Mapas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100+</div>
              <div className="text-white/70">NFTs</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white text-gray-800">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              O que é BombRider?
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              BombRider é uma reimaginação moderna do clássico Bomberman, ambientado em um mundo pré-histórico 
              cheio de dinossauros e aventuras. Combine estratégia, ação e tecnologia blockchain em uma 
              experiência de jogo única e emocionante.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6">
                🎮
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Gameplay Clássico</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Mecânicas familiares do Bomberman com inovações modernas e controles intuitivos.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6">
                👥
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Multiplayer até 5 Jogadores</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Desafie seus amigos em batalhas épicas com até 5 jogadores simultâneos.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6">
                ⚡
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Power-ups Únicos</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Colete power-ups especiais e ovos de dinossauro para ganhar vantagens estratégicas.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6">
                🛡️
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">5 Riders Únicos</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Escolha entre Aria, Bront, Kiro, Lume e Zunn, cada um com habilidades especiais.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6">
                🏆
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Mapas Temáticos</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Explore 4 ambientes únicos: Floresta, Caverna, Deserto e Pântano pré-históricos.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6">
                🚀
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Tecnologia Moderna</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Construído com React, Three.js e tecnologias web de última geração.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 via-blue-900 to-green-900 text-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                A Lenda dos Riders e os Ovos de Dinossauro
              </h2>
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  Em um mundo onde a tecnologia e a natureza pré-histórica coexistem, cinco heróis conhecidos 
                  como "Riders" emergem para proteger os sagrados ovos de dinossauro de forças malignas.
                </p>
                <p>
                  Cada Rider possui uma conexão única com os elementos: Aria domina o ar, Bront controla a terra, 
                  Kiro manipula o fogo, Lume canaliza o éter, e Zunn comanda a água.
                </p>
                <p>
                  Os ovos de dinossauro não são apenas tesouros - eles são a chave para manter o equilíbrio 
                  entre o mundo digital e o natural, tornando-se valiosos NFTs que representam poder e prestígio.
                </p>
              </div>
              <button 
                className="mt-8 bg-white text-purple-900 hover:bg-white/90 px-8 py-4 rounded-full font-bold flex items-center gap-3 transition-all duration-300"
                onClick={handlePlayGame}
              >
                <span>▶️</span>
                Viva a Aventura
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl p-8 transform -rotate-1 shadow-2xl">
                <div className="w-full h-64 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl mb-6 flex items-center justify-center text-6xl">
                  🦕
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Universo Épico</h3>
                  <p className="text-gray-600">Explore paisagens pré-históricas cheias de mistérios e aventuras</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NFT Section */}
      <section className="py-20 bg-gray-50 text-gray-800">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent">
              Seu Legado Digital: NFTs em BombRider
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Transforme suas conquistas em ativos digitais únicos. Cada ovo de dinossauro, personagem especial 
              e item raro pode se tornar um NFT exclusivo, garantindo verdadeira propriedade digital.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-6xl">
                  🥚
                </div>
                <div className="absolute top-3 right-3 bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                  Épico
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-3">Ovos Lendários</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Colecionável</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium">NFT</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-6xl">
                  🤖
                </div>
                <div className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  Raro
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-3">Riders Únicos</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Colecionável</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium">NFT</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-6xl">
                  🎨
                </div>
                <div className="absolute top-3 right-3 bg-gray-500 text-white px-3 py-1 rounded-full text-sm">
                  Comum
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-3">Skins Especiais</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Colecionável</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium">NFT</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-6xl">
                  ✨
                </div>
                <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                  Lendário
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-3">Itens Místicos</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Colecionável</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium">NFT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-600 to-green-500 rounded-3xl p-12 max-w-4xl mx-auto text-white">
              <div className="text-6xl mb-6">💰</div>
              <h3 className="text-3xl font-bold mb-8">Como Funcionam os NFTs</h3>
              <div className="grid md:grid-cols-3 gap-8 text-left">
                <div>
                  <h4 className="font-bold text-lg mb-3">1. Jogue e Colete</h4>
                  <p className="opacity-90">Complete desafios e encontre itens raros durante suas partidas</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-3">2. Transforme em NFT</h4>
                  <p className="opacity-90">Converta seus itens especiais em tokens únicos na blockchain</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-3">3. Possua e Negocie</h4>
                  <p className="opacity-90">Tenha propriedade real dos seus ativos digitais</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-5xl font-bold mb-8">
            Pronto para a Aventura?
          </h2>
          <p className="text-xl mb-12 opacity-90 leading-relaxed">
            Junte-se à revolução dos jogos NFT e torne-se uma lenda no universo BombRider. 
            Sua jornada épica começa agora!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button 
              onClick={handlePlayGame}
              className="bg-white text-orange-600 hover:bg-white/90 px-12 py-4 text-xl font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <span>▶️</span>
              Jogar Agora
            </button>
            
            <button className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-bold rounded-full flex items-center gap-3">
              <span>👥</span>
              Convidar Amigos
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center hover:scale-110 transition-transform duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                🎮
              </div>
              <p className="font-medium">Jogue Grátis</p>
            </div>
            <div className="text-center hover:scale-110 transition-transform duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                👥
              </div>
              <p className="font-medium">Multiplayer</p>
            </div>
            <div className="text-center hover:scale-110 transition-transform duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                💰
              </div>
              <p className="font-medium">NFTs Únicos</p>
            </div>
            <div className="text-center hover:scale-110 transition-transform duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                🏆
              </div>
              <p className="font-medium">Competição</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-8">
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">
            BombRider
          </h3>
          <p className="text-gray-400 mb-8">
            A revolução dos jogos NFT está aqui. Junte-se à aventura!
          </p>
          <div className="text-gray-400">
            © 2025 BombRider. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

