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

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white overflow-x-hidden">
      {/* Floating Stars Background */}
      <div className="fixed inset-0 z-0">
        {[...Array(100)].map((_, i) => (
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

      {/* Hero Section - Terra em Colapso */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 z-10">
        {/* Animated Earth */}
        <div className="relative mb-8 animate-on-scroll">
          <div 
            className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-green-400 relative overflow-hidden"
            style={{
              transform: `rotateY(${scrollY * 0.1}deg) rotateX(${Math.sin(scrollY * 0.01) * 5}deg)`,
              boxShadow: '0 0 100px rgba(59, 130, 246, 0.5)'
            }}
          >
            {/* Explosion Effects */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full animate-ping"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
            
            {/* Continents */}
            <div className="absolute inset-4 bg-green-600 rounded-full opacity-70" />
            <div className="absolute top-8 left-12 w-16 h-12 bg-yellow-600 rounded-full opacity-60" />
            <div className="absolute bottom-12 right-8 w-20 h-16 bg-orange-600 rounded-full opacity-60" />
          </div>
        </div>

        {/* Story Text */}
        <div className="bg-yellow-100 text-black p-6 rounded-lg max-w-4xl mx-auto mb-8 animate-on-scroll border-4 border-yellow-400 shadow-2xl">
          <p className="text-lg md:text-xl font-bold text-center leading-relaxed">
            NO FUTURO, O PLANETA TERRA ESTÁ À BEIRA DO COLAPSO,
            <br />
            DOMINADO POR UMA GUERRA ENTRE FORÇAS
            <br />
            NATURAIS E MÁQUINAS AVANÇADAS.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center animate-on-scroll">
          <button 
            onClick={() => navigate('/multiplayer')}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-bold text-lg hover:scale-110 transform transition-all duration-300 shadow-lg hover:shadow-orange-500/50 border-2 border-orange-300"
          >
            👥 Multiplayer
          </button>
          <button 
            onClick={() => navigate('/game')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-bold text-lg hover:scale-110 transform transition-all duration-300 shadow-lg hover:shadow-blue-500/50 border-2 border-blue-300"
          >
            ▶️ Solo
          </button>
          <button 
            onClick={() => navigate('/nft')}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full font-bold text-lg hover:scale-110 transform transition-all duration-300 shadow-lg hover:shadow-purple-500/50 border-2 border-purple-300"
          >
            💎 NFTs
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 animate-on-scroll">
          {[
            { number: "5 Max", label: "Jogadores", color: "from-orange-500 to-red-500" },
            { number: "5", label: "Personagens", color: "from-blue-500 to-cyan-500" },
            { number: "4", label: "Mapas", color: "from-green-500 to-emerald-500" },
            { number: "100+", label: "NFTs", color: "from-purple-500 to-pink-500" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.number}
              </div>
              <div className="text-gray-300 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BombRiders Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-purple-800 to-blue-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Comic Panel */}
            <div className="animate-on-scroll">
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-8 rounded-3xl border-4 border-blue-300 shadow-2xl relative">
                {/* Speech Bubble */}
                <div className="bg-yellow-100 text-black p-4 rounded-2xl mb-6 relative border-3 border-yellow-400">
                  <div className="absolute -bottom-4 left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-yellow-100"></div>
                  <p className="font-bold text-center">
                    SOMOS OS BOMBRIDERS.
                    <br />
                    NOSSA MISSÃO É
                    <br />
                    SALVAR A TERRA.
                  </p>
                </div>
                
                {/* Characters */}
                <div className="flex justify-center gap-4 mb-6">
                  {[
                    { color: "from-orange-500 to-red-500", name: "Kiro" },
                    { color: "from-blue-500 to-cyan-500", name: "Aria" },
                    { color: "from-green-500 to-emerald-500", name: "Bront" }
                  ].map((char, i) => (
                    <div key={i} className="text-center group">
                      <div className={`w-16 h-20 bg-gradient-to-b ${char.color} rounded-lg border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}>
                        {/* Character Face */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-200 rounded-full border-2 border-gray-800">
                          <div className="absolute top-1 left-1 w-2 h-2 bg-black rounded-full"></div>
                          <div className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full"></div>
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-black rounded-full"></div>
                        </div>
                        {/* Body */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-8 bg-gray-700 rounded border border-gray-500"></div>
                      </div>
                      <div className="text-xs mt-1 font-bold">{char.name}</div>
                    </div>
                  ))}
                </div>

                {/* Holographic Screen */}
                <div className="bg-cyan-400 p-4 rounded-lg border-2 border-cyan-200 relative">
                  <div className="w-full h-16 bg-gradient-to-br from-blue-500 to-green-400 rounded relative overflow-hidden">
                    <div className="absolute inset-2 bg-green-600 rounded-full opacity-70" />
                    <div className="absolute top-2 left-4 w-4 h-3 bg-yellow-600 rounded opacity-60" />
                    <div className="absolute bottom-2 right-2 w-5 h-4 bg-orange-600 rounded opacity-60" />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="animate-on-scroll">
              <div className="bg-gradient-to-br from-orange-500 to-yellow-500 p-8 rounded-3xl border-4 border-orange-300 shadow-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">Os BombRiders</h2>
                <p className="text-lg text-black mb-6 leading-relaxed">
                  Em um mundo devastado pela guerra entre natureza e tecnologia, cinco heróis emergem das sombras. 
                  Eles são os BombRiders - guerreiros especializados em combate explosivo e estratégia tática.
                </p>
                <p className="text-lg text-black mb-6 leading-relaxed">
                  Cada BombRider possui habilidades únicas baseadas nos elementos fundamentais: 
                  <span className="font-bold text-cyan-600"> Aria</span> (Ar), 
                  <span className="font-bold text-yellow-600"> Bront</span> (Terra), 
                  <span className="font-bold text-red-600"> Kiro</span> (Fogo), 
                  <span className="font-bold text-purple-600"> Lume</span> (Éter), e 
                  <span className="font-bold text-blue-600"> Zunn</span> (Água).
                </p>
                <p className="text-lg text-black leading-relaxed">
                  Unidos por uma missão comum, eles lutam para restaurar o equilíbrio do planeta e proteger os últimos vestígios da vida natural.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gameplay Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-red-800 to-orange-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-on-scroll">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 w-full mb-8 rounded-full"></div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Gameplay Explosivo</h2>
            <p className="text-xl text-gray-300">
              Domine a arte da guerra estratégica com bombas inteligentes e movimentos táticos precisos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Bomba Clássica",
                description: "Explosão em cruz que destrói blocos e elimina inimigos. Timing perfeito é essencial para a vitória.",
                icon: "💣",
                color: "from-red-600 to-orange-600",
                animation: "animate-bounce"
              },
              {
                title: "Bomba Elemental",
                description: "Cada BombRider possui bombas únicas baseadas em seu elemento. Fogo, água, terra, ar e éter.",
                icon: "⚡",
                color: "from-purple-600 to-pink-600",
                animation: "animate-pulse"
              },
              {
                title: "Estratégia Tática",
                description: "Planeje seus movimentos, antecipe inimigos e use o ambiente a seu favor para dominar o campo de batalha.",
                icon: "🧠",
                color: "from-blue-600 to-cyan-600",
                animation: "animate-spin"
              }
            ].map((feature, i) => (
              <div key={i} className="animate-on-scroll">
                <div className={`bg-gradient-to-br ${feature.color} p-8 rounded-3xl border-4 border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300`}>
                  <div className={`text-6xl mb-4 ${feature.animation}`}>{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 text-yellow-300">{feature.title}</h3>
                  <p className="text-white leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dinosaurs Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-green-800 to-teal-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Description */}
            <div className="animate-on-scroll">
              <div className="bg-gradient-to-br from-green-400 to-cyan-400 h-2 w-full mb-8 rounded-full"></div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Dinossauros Tecnológicos</h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Durante suas jornadas, os BombRiders descobriram uma espécie única: dinossauros tecnológicos que 
                sobreviveram à devastação através da fusão entre biologia e cibernética.
              </p>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Estes seres magníficos não apenas se tornaram aliados poderosos, mas também guardiões de ovos especiais que 
                contêm códigos genéticos únicos - verdadeiros tesouros digitais.
              </p>
              <div className="bg-yellow-100 text-black p-4 rounded-lg border-4 border-yellow-400 font-bold text-center">
                "DINOSSAUROS TECNOLÓGICOS, ENCONTRADOS PELO MUNDO, SÃO NOSSOS ALIADOS."
              </div>
            </div>

            {/* Dinosaur Display */}
            <div className="animate-on-scroll">
              <div className="bg-gradient-to-br from-teal-600 to-green-700 p-8 rounded-3xl border-4 border-teal-300 shadow-2xl">
                {/* Dinosaurs */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { color: "from-blue-500 to-cyan-500", type: "Aquático" },
                    { color: "from-green-500 to-emerald-500", type: "Terrestre" }
                  ].map((dino, i) => (
                    <div key={i} className="text-center group">
                      <div className={`w-20 h-16 bg-gradient-to-br ${dino.color} rounded-lg border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}>
                        {/* Dino Body */}
                        <div className="absolute bottom-1 left-2 w-16 h-8 bg-gray-700 rounded-full border border-gray-500"></div>
                        {/* Dino Head */}
                        <div className="absolute top-1 left-6 w-8 h-6 bg-gray-600 rounded border border-gray-400"></div>
                        {/* Tech Elements */}
                        <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-2 left-1 w-1 h-1 bg-red-500 rounded-full animate-ping"></div>
                      </div>
                      <div className="text-xs mt-1 font-bold">{dino.type}</div>
                    </div>
                  ))}
                </div>

                {/* Eggs */}
                <div className="flex justify-center gap-4">
                  {[
                    { color: "from-orange-400 to-yellow-500", rarity: "Comum" },
                    { color: "from-purple-400 to-pink-500", rarity: "Raro" }
                  ].map((egg, i) => (
                    <div key={i} className="text-center group">
                      <div className={`w-12 h-16 bg-gradient-to-b ${egg.color} rounded-full border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}>
                        {/* Egg Pattern */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white/30 rounded-full"></div>
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-white/30 rounded-full"></div>
                        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white/30 rounded-full"></div>
                        {/* Glow Effect */}
                        <div className="absolute inset-1 bg-white/10 rounded-full animate-pulse"></div>
                      </div>
                      <div className="text-xs mt-1 font-bold">{egg.rarity}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NFTs Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-purple-800 to-blue-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-on-scroll">
            <div className="bg-gradient-to-r from-purple-400 to-cyan-400 h-2 w-full mb-8 rounded-full"></div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">NFTs Únicos</h2>
            <p className="text-xl text-gray-300">
              Colecione, evolua e negocie ativos únicos que moldam sua jornada no universo BombRider
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: "Ovos de Dino",
                description: "Códigos genéticos únicos que evoluem com o tempo",
                icon: "🥚",
                color: "from-orange-600 to-yellow-600"
              },
              {
                title: "Skins de Rider",
                description: "Personalize seu BombRider com visuais exclusivos",
                icon: "👤",
                color: "from-blue-600 to-cyan-600"
              },
              {
                title: "Cristais de Poder",
                description: "Amplificam habilidades e desbloqueiam poderes",
                icon: "💎",
                color: "from-purple-600 to-pink-600"
              },
              {
                title: "Artefatos",
                description: "Relíquias antigas com poderes misteriosos",
                icon: "🏺",
                color: "from-green-600 to-emerald-600"
              }
            ].map((nft, i) => (
              <div key={i} className="animate-on-scroll">
                <div className={`bg-gradient-to-br ${nft.color} p-6 rounded-3xl border-4 border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300 hover:rotate-1`}>
                  <div className="text-4xl mb-4 animate-bounce">{nft.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-yellow-300">{nft.title}</h3>
                  <p className="text-white text-sm leading-relaxed">{nft.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Rarity System */}
          <div className="animate-on-scroll">
            <div className="bg-gray-800 p-8 rounded-3xl border-4 border-gray-600 shadow-2xl">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 w-full mb-6 rounded-full"></div>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { name: "Comum", color: "bg-gray-500", letter: "C" },
                  { name: "Raro", color: "bg-blue-500", letter: "R" },
                  { name: "Épico", color: "bg-purple-500", letter: "E" },
                  { name: "Lendário", color: "bg-yellow-500", letter: "L" },
                  { name: "Mítico", color: "bg-pink-500", letter: "M" }
                ].map((rarity, i) => (
                  <div key={i} className="text-center group">
                    <div className={`w-12 h-12 ${rarity.color} rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {rarity.letter}
                    </div>
                    <div className="text-sm mt-2 text-gray-300">{rarity.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Section - Era dos BombRiders */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-red-800 to-orange-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-on-scroll">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 w-full mb-8 rounded-full"></div>
            
            {/* Explosion Effect */}
            <div className="relative mb-8">
              <div className="w-32 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto relative overflow-hidden">
                <div className="absolute inset-2 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">💥</div>
              </div>
            </div>

            <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              ERA DOS BOMBRIDERS
            </h2>
            
            <p className="text-2xl md:text-3xl font-bold mb-12 text-yellow-100">
              PREPARE-SE PARA AVENTURA
              <br />
              GLOBAL CHEIA DE AÇÃO
              <br />
              E ESTRATÉGIA! EM BREVE.
            </p>

            <div className="flex flex-wrap gap-6 justify-center">
              <button 
                onClick={() => navigate('/game')}
                className="px-12 py-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-bold text-xl hover:scale-110 transform transition-all duration-300 shadow-2xl hover:shadow-orange-500/50 border-4 border-orange-300"
              >
                🚀 Começar Aventura
              </button>
              <button 
                onClick={() => navigate('/nft')}
                className="px-12 py-6 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full font-bold text-xl hover:scale-110 transform transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 border-4 border-purple-300"
              >
                💎 Explorar NFTs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style jsx>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s ease-out;
        }
        
        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;

