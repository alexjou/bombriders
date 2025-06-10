import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const earthRef = useRef(null);
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    // Animação inicial da Terra em colapso
    if (earthRef.current) {
      earthRef.current.style.transform = 'scale(1) rotate(0deg)';
      earthRef.current.style.opacity = '1';
    }
  }, []);

  const handlePlayGame = () => {
    navigate('/game');
  };

  return (
    <div ref={containerRef} className="bg-black text-white overflow-x-hidden">
      {/* Hero Section - Terra em Colapso */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
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
        <motion.div 
          ref={earthRef}
          className="relative mb-8 z-10"
          initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
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
        </motion.div>

        {/* Texto da história */}
        <motion.div 
          className="bg-yellow-100 text-black p-6 rounded-lg max-w-4xl mx-auto mb-8 shadow-2xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <p className="text-lg md:text-xl font-bold text-center leading-relaxed">
            NO FUTURO, O PLANETA TERRA ESTÁ À BEIRA DO COLAPSO,<br />
            DOMINADO POR UMA GUERRA ENTRE FORÇAS<br />
            NATURAIS E MÁQUINAS AVANÇADAS.
          </p>
        </motion.div>

        {/* Título BombRider */}
        <motion.h1 
          className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent text-center"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
        >
          BombRider
        </motion.h1>
        
        {/* Botões de ação */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1, ease: "easeOut" }}
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
        </motion.div>

        {/* Estatísticas */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8, ease: "backOut" }}
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
        </motion.div>
      </section>

      {/* Seção dos BombRiders */}
      <section className="min-h-screen flex items-center justify-center py-20 bg-gradient-to-b from-black via-blue-900 to-purple-900">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Personagens BombRiders */}
            <motion.div 
              className="relative"
              initial={{ x: -100, opacity: 0, scale: 0.8 }}
              whileInView={{ x: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-blue-800 to-purple-800 rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-center space-x-4 mb-6">
                  {/* Personagem 1 */}
                  <motion.div 
                    className="w-24 h-32 bg-gradient-to-b from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-4xl shadow-lg"
                    initial={{ y: 50, opacity: 0, scale: 0.8 }}
                    whileInView={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    viewport={{ once: true }}
                  >
                    👨‍🚀
                  </motion.div>
                  {/* Personagem 2 */}
                  <motion.div 
                    className="w-24 h-32 bg-gradient-to-b from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-4xl shadow-lg"
                    initial={{ y: 50, opacity: 0, scale: 0.8 }}
                    whileInView={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                    viewport={{ once: true }}
                  >
                    👩‍🚀
                  </motion.div>
                  {/* Personagem 3 */}
                  <motion.div 
                    className="w-24 h-32 bg-gradient-to-b from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-4xl shadow-lg"
                    initial={{ y: 50, opacity: 0, scale: 0.8 }}
                    whileInView={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                    viewport={{ once: true }}
                  >
                    👨‍🚀
                  </motion.div>
                </div>
                
                {/* Tela holográfica */}
                <div className="bg-cyan-400/20 rounded-lg p-4 mb-4 border border-cyan-400/50">
                  <div className="w-full h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded opacity-70 flex items-center justify-center">
                    <span className="text-2xl">🌍</span>
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
            </motion.div>

            {/* Texto explicativo */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Seção do Dinossauro */}
      <section className="min-h-screen flex items-center justify-center py-20 bg-gradient-to-b from-purple-900 via-green-900 to-black">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texto explicativo */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
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
                <p className="text-yellow-300 font-bold">
                  "DINOSSAUROS TECNOLÓGICOS, ENCONTRADOS PELO MUNDO, SÃO NOSSOS ALIADOS."
                </p>
              </div>
            </motion.div>

            {/* Dinossauro e Ovo */}
            <motion.div 
              className="relative"
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-green-800 to-blue-800 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-center space-x-8">
                  {/* Dinossauro Tecnológico */}
                  <motion.div 
                    className="relative"
                    initial={{ x: -200, opacity: 0, rotate: -20 }}
                    whileInView={{ x: 0, opacity: 1, rotate: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    viewport={{ once: true }}
                  >
                    <div className="w-32 h-32 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-6xl shadow-lg transform hover:scale-105 transition-all duration-300">
                      🦕
                    </div>
                    {/* Detalhes tecnológicos */}
                    <div className="absolute top-2 right-2 w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-2 left-2 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="absolute top-1/2 left-1 w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
                  </motion.div>

                  {/* Ovo Especial */}
                  <motion.div 
                    className="relative"
                    initial={{ scale: 0, opacity: 0, rotate: 180 }}
                    whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: "backOut" }}
                    viewport={{ once: true }}
                  >
                    <div className="w-20 h-28 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
                      <div className="w-16 h-24 bg-gradient-to-b from-yellow-300 to-orange-400 rounded-full flex items-center justify-center">
                        <span className="text-2xl">✨</span>
                      </div>
                    </div>
                    {/* Brilho do ovo */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-30 animate-pulse"></div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Seção Final - Era dos BombRiders */}
      <section className="min-h-screen flex items-center justify-center py-20 bg-gradient-to-b from-black via-orange-900 to-red-900">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <motion.div 
            className="mb-12"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "backOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
              ERA DOS<br />BOMBRIDERS
            </h2>
            
            {/* Efeito de explosão */}
            <div className="relative inline-block">
              <div className="w-64 h-32 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded-full opacity-80 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 rounded-full opacity-60 animate-ping"></div>
              <div className="absolute inset-4 bg-gradient-to-r from-white via-yellow-200 to-orange-300 rounded-full opacity-90"></div>
            </div>
          </motion.div>

          <motion.p 
            className="text-2xl md:text-3xl font-bold mb-12 text-yellow-100"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
          >
            PREPARE-SE PARA AVENTURA<br />
            GLOBAL CHEIA DE AÇÃO<br />
            E ESTRATÉGIA! EM BREVE.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            viewport={{ once: true }}
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
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

