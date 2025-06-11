import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePlayGame = () => {
    navigate('/game');
  };

  return (
    <div className="bg-black text-white overflow-x-hidden">
      {/* Hero Section - Terra em Colapso */}
      <section className="min-h-screen flex flex-col items-center justify-center relative">
        {/* Background com estrelas */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-purple-900 to-black">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Terra em Colapso */}
        <div 
          className="relative mb-8 z-10 animate-spin-slow"
          style={{
            transform: `scale(${1 + scrollY * 0.0001}) rotate(${scrollY * 0.1}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="w-80 h-80 md:w-96 md:h-96 relative">
            {/* Terra base */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-green-500 to-blue-600 shadow-2xl">
              {/* Continentes */}
              <div className="absolute top-8 left-12 w-16 h-12 bg-green-600 rounded-lg opacity-80"></div>
              <div className="absolute top-20 right-8 w-20 h-16 bg-green-600 rounded-lg opacity-80"></div>
              <div className="absolute bottom-16 left-8 w-12 h-20 bg-green-600 rounded-lg opacity-80"></div>
              
              {/* Explosões */}
              <div className="absolute top-4 left-8 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full animate-pulse shadow-lg shadow-orange-500/50"></div>
              <div className="absolute top-12 right-12 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full animate-pulse shadow-lg shadow-orange-500/50"></div>
              <div className="absolute bottom-8 left-16 w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
              <div className="absolute bottom-12 right-8 w-14 h-14 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse shadow-lg shadow-orange-500/50"></div>
              <div className="absolute top-1/2 left-4 w-8 h-8 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"></div>
            </div>
            
            {/* Aura de energia */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-30 animate-pulse"></div>
          </div>
        </div>

        {/* Texto da história */}
        <div 
          className="bg-yellow-100 text-black p-6 rounded-lg max-w-4xl mx-auto mb-8 shadow-2xl transform transition-all duration-1000"
          style={{
            opacity: Math.max(0, 1 - scrollY * 0.002),
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        >
          <p className="text-lg md:text-xl font-bold text-center leading-relaxed">
            NO FUTURO, O PLANETA TERRA ESTÁ À BEIRA DO COLAPSO,<br />
            DOMINADO POR UMA GUERRA ENTRE FORÇAS<br />
            NATURAIS E MÁQUINAS AVANÇADAS.
          </p>
        </div>

        {/* Título BombRider */}
        <h1 
          className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent text-center"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            opacity: Math.max(0, 1 - scrollY * 0.001)
          }}
        >
          BombRider
        </h1>
        
        {/* Botões de ação */}
        <div 
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
            opacity: Math.max(0, 1 - scrollY * 0.001)
          }}
        >
          <button 
            onClick={() => navigate('/multiplayer')}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 px-8 py-4 text-lg font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            <span>👥</span>
            Multiplayer
          </button>
          
          <button 
            onClick={handlePlayGame}
            className="border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white px-8 py-4 text-lg font-bold rounded-full flex items-center gap-3 transition-all duration-300"
          >
            <span>▶️</span>
            Solo
          </button>
          
          <button 
            onClick={() => navigate('/nft')}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-8 py-4 text-lg font-bold rounded-full flex items-center gap-3 transition-all duration-300"
          >
            <span>💎</span>
            NFTs
          </button>
        </div>

        {/* Estatísticas */}
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`,
            opacity: Math.max(0, 1 - scrollY * 0.001)
          }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">5 Max</div>
            <div className="text-white/70">Jogadores</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">5</div>
            <div className="text-white/70">Personagens</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">4</div>
            <div className="text-white/70">Mapas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">100+</div>
            <div className="text-white/70">NFTs</div>
          </div>
        </div>
      </section>

      {/* Seção dos BombRiders */}
      <section className="min-h-screen flex items-center justify-center py-20 bg-gradient-to-b from-black via-blue-900 to-purple-900">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Personagens BombRiders */}
            <div 
              className="relative transform transition-all duration-1000"
              style={{
                transform: `translateX(${Math.max(-100, -100 + (scrollY - 800) * 0.2)}px)`,
                opacity: Math.max(0, Math.min(1, (scrollY - 600) * 0.002))
              }}
            >
              <div className="bg-gradient-to-br from-blue-800 to-purple-800 rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-center space-x-4 mb-6">
                  {/* Personagem 1 */}
                  <div className="w-24 h-32 bg-gradient-to-b from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-4xl shadow-lg hover:scale-105 transition-transform duration-300">
                    👨‍🚀
                  </div>
                  {/* Personagem 2 */}
                  <div className="w-24 h-32 bg-gradient-to-b from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-4xl shadow-lg hover:scale-105 transition-transform duration-300">
                    👩‍🚀
                  </div>
                  {/* Personagem 3 */}
                  <div className="w-24 h-32 bg-gradient-to-b from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-4xl shadow-lg hover:scale-105 transition-transform duration-300">
                    👨‍🚀
                  </div>
                </div>
                
                {/* Tela holográfica */}
                <div className="bg-cyan-400/20 rounded-lg p-4 mb-4 border border-cyan-400/50">
                  <div className="w-full h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded opacity-70 flex items-center justify-center">
                    <span className="text-2xl animate-pulse">🌍</span>
                  </div>
                </div>
              </div>
              
              {/* Balão de fala */}
              <div className="absolute -top-4 left-8 bg-yellow-100 text-black p-4 rounded-lg shadow-xl max-w-xs">
                <p className="font-bold text-center">
                  SOMOS OS BOMBRIDERS.<br />
                  NOSSA MISSÃO É<br />
                  SALVAR A TERRA.
                </p>
                <div className="absolute bottom-0 left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-yellow-100 transform translate-y-full"></div>
              </div>
            </div>

            {/* Texto explicativo */}
            <div 
              className="transform transition-all duration-1000"
              style={{
                transform: `translateX(${Math.min(100, 100 - (scrollY - 800) * 0.2)}px)`,
                opacity: Math.max(0, Math.min(1, (scrollY - 600) * 0.002))
              }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                Os Heróis da Resistência
              </h2>
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  Em um mundo devastado pela guerra entre natureza e tecnologia, cinco heróis emergem das sombras. 
                  Eles são os BombRiders - guerreiros especializados em combate explosivo e estratégia tática.
                </p>
                <p>
                  Cada BombRider possui habilidades únicas baseadas nos elementos fundamentais: 
                  <span className="text-cyan-400 font-bold"> Aria</span> (Ar), 
                  <span className="text-yellow-400 font-bold"> Bront</span> (Terra), 
                  <span className="text-red-400 font-bold"> Kiro</span> (Fogo), 
                  <span className="text-purple-400 font-bold"> Lume</span> (Éter), e 
                  <span className="text-blue-400 font-bold"> Zunn</span> (Água).
                </p>
                <p>
                  Unidos por uma missão comum, eles lutam para restaurar o equilíbrio do planeta 
                  e proteger os últimos vestígios da vida natural.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção do Gameplay - Bombas e Estratégia */}
      <section className="min-h-screen flex items-center justify-center py-20 bg-gradient-to-b from-purple-900 via-red-900 to-orange-900">
        <div className="max-w-6xl mx-auto px-8">
          <div 
            className="text-center mb-16 transform transition-all duration-1000"
            style={{
              transform: `translateY(${Math.max(-50, -50 + (scrollY - 1600) * 0.1)}px)`,
              opacity: Math.max(0, Math.min(1, (scrollY - 1400) * 0.002))
            }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
              Gameplay Explosivo
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Domine a arte da guerra estratégica com bombas inteligentes e movimentos táticos precisos
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Bomba Clássica */}
            <div 
              className="bg-gradient-to-br from-red-800 to-orange-800 rounded-3xl p-8 shadow-2xl text-center transform transition-all duration-1000"
              style={{
                transform: `translateY(${Math.max(100, 100 - (scrollY - 1600) * 0.2)}px)`,
                opacity: Math.max(0, Math.min(1, (scrollY - 1500) * 0.002))
              }}
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-4xl shadow-lg animate-pulse">
                💣
              </div>
              <h3 className="text-2xl font-bold mb-4 text-yellow-300">Bomba Clássica</h3>
              <p className="text-white/80">
                Explosão em cruz que destrói blocos e elimina inimigos. 
                Timing perfeito é essencial para a vitória.
              </p>
            </div>

            {/* Bomba Especial */}
            <div 
              className="bg-gradient-to-br from-purple-800 to-pink-800 rounded-3xl p-8 shadow-2xl text-center transform transition-all duration-1000"
              style={{
                transform: `translateY(${Math.max(100, 100 - (scrollY - 1700) * 0.2)}px)`,
                opacity: Math.max(0, Math.min(1, (scrollY - 1600) * 0.002))
              }}
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl shadow-lg animate-spin">
                ⚡
              </div>
              <h3 className="text-2xl font-bold mb-4 text-yellow-300">Bomba Elemental</h3>
              <p className="text-white/80">
                Cada BombRider possui bombas únicas baseadas em seu elemento. 
                Fogo, água, terra, ar e éter.
              </p>
            </div>

            {/* Estratégia */}
            <div 
              className="bg-gradient-to-br from-blue-800 to-cyan-800 rounded-3xl p-8 shadow-2xl text-center transform transition-all duration-1000"
              style={{
                transform: `translateY(${Math.max(100, 100 - (scrollY - 1800) * 0.2)}px)`,
                opacity: Math.max(0, Math.min(1, (scrollY - 1700) * 0.002))
              }}
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-4xl shadow-lg animate-bounce">
                🧠
              </div>
              <h3 className="text-2xl font-bold mb-4 text-yellow-300">Estratégia Tática</h3>
              <p className="text-white/80">
                Planeje seus movimentos, antecipe inimigos e use o ambiente 
                a seu favor para dominar o campo de batalha.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção dos Dinossauros Tecnológicos */}
      <section className="min-h-screen flex items-center justify-center py-20 bg-gradient-to-b from-orange-900 via-green-900 to-teal-900">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texto explicativo */}
            <div 
              className="transform transition-all duration-1000"
              style={{
                transform: `translateX(${Math.max(-100, -100 + (scrollY - 2400) * 0.2)}px)`,
                opacity: Math.max(0, Math.min(1, (scrollY - 2200) * 0.002))
              }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-green-400 to-cyan-300 bg-clip-text text-transparent">
                Aliados Tecnológicos
              </h2>
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  Durante suas jornadas, os BombRiders descobriram uma espécie única: 
                  dinossauros tecnológicos que sobreviveram à devastação através da fusão 
                  entre biologia e cibernética.
                </p>
                <p>
                  Estes seres magníficos não apenas se tornaram aliados poderosos, 
                  mas também guardiões de ovos especiais que contêm códigos genéticos 
                  únicos - verdadeiros tesouros digitais.
                </p>
                <p className="text-yellow-300 font-bold text-xl">
                  "DINOSSAUROS TECNOLÓGICOS, ENCONTRADOS PELO MUNDO, SÃO NOSSOS ALIADOS."
                </p>
              </div>
            </div>

            {/* Dinossauros e Ovos */}
            <div 
              className="relative transform transition-all duration-1000"
              style={{
                transform: `translateX(${Math.min(100, 100 - (scrollY - 2400) * 0.2)}px)`,
                opacity: Math.max(0, Math.min(1, (scrollY - 2200) * 0.002))
              }}
            >
              <div className="bg-gradient-to-br from-green-800 to-teal-800 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  {/* Dinossauro 1 */}
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-6xl shadow-lg transform hover:scale-105 transition-all duration-300">
                      🦕
                    </div>
                    {/* Detalhes tecnológicos */}
                    <div className="absolute top-2 right-2 w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-2 left-2 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>

                  {/* Dinossauro 2 */}
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-b from-green-400 to-emerald-600 rounded-lg flex items-center justify-center text-6xl shadow-lg transform hover:scale-105 transition-all duration-300">
                      🦖
                    </div>
                    {/* Detalhes tecnológicos */}
                    <div className="absolute top-2 left-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-2 right-2 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>

                  {/* Ovo Especial 1 */}
                  <div className="relative">
                    <div className="w-20 h-28 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
                      <div className="w-16 h-24 bg-gradient-to-b from-yellow-300 to-orange-400 rounded-full flex items-center justify-center">
                        <span className="text-2xl">✨</span>
                      </div>
                    </div>
                    {/* Brilho do ovo */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-30 animate-pulse"></div>
                  </div>

                  {/* Ovo Especial 2 */}
                  <div className="relative">
                    <div className="w-20 h-28 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
                      <div className="w-16 h-24 bg-gradient-to-b from-purple-300 to-pink-400 rounded-full flex items-center justify-center">
                        <span className="text-2xl">💎</span>
                      </div>
                    </div>
                    {/* Brilho do ovo */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-30 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção dos NFTs */}
      <section className="min-h-screen flex items-center justify-center py-20 bg-gradient-to-b from-teal-900 via-purple-900 to-pink-900">
        <div className="max-w-6xl mx-auto px-8">
          <div 
            className="text-center mb-16 transform transition-all duration-1000"
            style={{
              transform: `translateY(${Math.max(-50, -50 + (scrollY - 3200) * 0.1)}px)`,
              opacity: Math.max(0, Math.min(1, (scrollY - 3000) * 0.002))
            }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-300 via-pink-400 to-cyan-300 bg-clip-text text-transparent">
              Tesouros Digitais NFT
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Colecione, evolua e negocie ativos únicos que moldam sua jornada no universo BombRider
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Ovos de Dinossauro */}
            <div 
              className="bg-gradient-to-br from-yellow-800 to-orange-800 rounded-3xl p-6 shadow-2xl text-center transform transition-all duration-1000"
              style={{
                transform: `translateY(${Math.max(100, 100 - (scrollY - 3200) * 0.3)}px)`,
                opacity: Math.max(0, Math.min(1, (scrollY - 3100) * 0.002))
              }}
            >
              <div className="w-20 h-28 mx-auto mb-4 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl shadow-lg animate-bounce">
                🥚
              </div>
              <h3 className="text-lg font-bold mb-2 text-yellow-300">Ovos de Dino</h3>
              <p className="text-white/80 text-sm">
                Códigos genéticos únicos que evoluem com o tempo
              </p>
            </div>

            {/* Skins de Rider */}
            <div 
              className="bg-gradient-to-br from-blue-800 to-cyan-800 rounded-3xl p-6 shadow-2xl text-center transform transition-all duration-1000"
              style={{
                transform: `translateY(${Math.max(100, 100 - (scrollY - 3300) * 0.3)}px)`,
                opacity: Math.max(0, Math.min(1, (scrollY - 3200) * 0.002))
              }}
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-b from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center text-3xl shadow-lg animate-pulse">
                👤
              </div>
              <h3 className="text-lg font-bold mb-2 text-cyan-300">Skins de Rider</h3>
              <p className="text-white/80 text-sm">
                Personalize seu BombRider com visuais exclusivos
              </p>
            </div>

            {/* Cristais de Poder */}
            <div 
              className="bg-gradient-to-br from-purple-800 to-pink-800 rounded-3xl p-6 shadow-2xl text-center transform transition-all duration-1000"
              style={{
                transform: `translateY(${Math.max(100, 100 - (scrollY - 3400) * 0.3)}px)`,
                opacity: Math.max(0, Math.min(1, (scrollY - 3300) * 0.002))
              }}
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-b from-purple-400 to-pink-500 rounded-lg flex items-center justify-center text-3xl shadow-lg animate-spin">
                💎
              </div>
              <h3 className="text-lg font-bold mb-2 text-pink-300">Cristais de Poder</h3>
              <p className="text-white/80 text-sm">
                Amplificam habilidades e desbloqueiam poderes
              </p>
            </div>

            {/* Artefatos */}
            <div 
              className="bg-gradient-to-br from-green-800 to-emerald-800 rounded-3xl p-6 shadow-2xl text-center transform transition-all duration-1000"
              style={{
                transform: `translateY(${Math.max(100, 100 - (scrollY - 3500) * 0.3)}px)`,
                opacity: Math.max(0, Math.min(1, (scrollY - 3400) * 0.002))
              }}
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-b from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-3xl shadow-lg animate-bounce">
                ⚱️
              </div>
              <h3 className="text-lg font-bold mb-2 text-emerald-300">Artefatos</h3>
              <p className="text-white/80 text-sm">
                Relíquias antigas com poderes misteriosos
              </p>
            </div>
          </div>

          {/* Sistema de Raridade */}
          <div 
            className="mt-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl transform transition-all duration-1000"
            style={{
              transform: `translateY(${Math.max(50, 50 - (scrollY - 3600) * 0.2)}px)`,
              opacity: Math.max(0, Math.min(1, (scrollY - 3500) * 0.002))
            }}
          >
            <h3 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Sistema de Raridade
            </h3>
            <div className="grid grid-cols-5 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">C</div>
                <p className="text-gray-400 text-sm">Comum</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">R</div>
                <p className="text-blue-400 text-sm">Raro</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">E</div>
                <p className="text-purple-400 text-sm">Épico</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">L</div>
                <p className="text-yellow-400 text-sm">Lendário</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">M</div>
                <p className="text-pink-400 text-sm">Mítico</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Final - Era dos BombRiders */}
      <section className="min-h-screen flex items-center justify-center py-20 bg-gradient-to-b from-pink-900 via-orange-900 to-red-900">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <div 
            className="mb-12 transform transition-all duration-1000"
            style={{
              transform: `scale(${Math.max(0.8, 0.8 + (scrollY - 4000) * 0.0005)})`,
              opacity: Math.max(0, Math.min(1, (scrollY - 3800) * 0.002))
            }}
          >
            <h2 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
              ERA DOS<br />BOMBRIDERS
            </h2>
            
            {/* Efeito de explosão */}
            <div className="relative inline-block">
              <div className="w-64 h-32 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded-full opacity-80 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 rounded-full opacity-60 animate-ping" />
              <div className="absolute inset-4 bg-gradient-to-r from-white via-yellow-200 to-orange-300 rounded-full opacity-90"></div>
            </div>
          </div>

          <p 
            className="text-2xl md:text-3xl font-bold mb-12 text-yellow-100 transform transition-all duration-1000"
            style={{
              transform: `translateY(${Math.max(50, 50 - (scrollY - 4200) * 0.2)}px)`,
              opacity: Math.max(0, Math.min(1, (scrollY - 4000) * 0.002))
            }}
          >
            PREPARE-SE PARA AVENTURA<br />
            GLOBAL CHEIA DE AÇÃO<br />
            E ESTRATÉGIA! EM BREVE.
          </p>

          <div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center transform transition-all duration-1000"
            style={{
              transform: `translateY(${Math.max(50, 50 - (scrollY - 4400) * 0.2)}px)`,
              opacity: Math.max(0, Math.min(1, (scrollY - 4200) * 0.002))
            }}
          >
            <button 
              onClick={() => navigate('/multiplayer')}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 px-12 py-6 text-xl font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <span>🚀</span>
              Começar Aventura
            </button>
            
            <button 
              onClick={() => navigate('/nft')}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-12 py-6 text-xl font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <span>💎</span>
              Explorar NFTs
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;

