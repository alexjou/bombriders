import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/chumbi-valley.css';
import { 
  useAdvancedAnimations, 
  InteractiveParticles, 
  ParallaxBackground,
  AnimatedText,
  AnimatedButton,
  AnimatedCard
} from '../components/AdvancedAnimations';

function ChumbiValleyLandingPage() {
  const navigate = useNavigate();
  const { scrollY, mousePosition, windowSize, isVisible, observeElement } = useAdvancedAnimations();
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const communityRef = useRef(null);

  // Registrar elementos para observação
  useEffect(() => {
    const cleanupFunctions = [];
    
    if (heroRef.current) {
      cleanupFunctions.push(observeElement(heroRef.current, 'hero'));
    }
    if (featuresRef.current) {
      cleanupFunctions.push(observeElement(featuresRef.current, 'features'));
    }
    if (communityRef.current) {
      cleanupFunctions.push(observeElement(communityRef.current, 'community'));
    }

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup && cleanup());
    };
  }, [observeElement]);

  // Efeito de paralaxe para o mouse
  const getParallaxStyle = (intensity = 1) => ({
    transform: `translate(${mousePosition.x * intensity * 20 - intensity * 10}px, ${mousePosition.y * intensity * 20 - intensity * 10}px)`
  });

  return (
    <div className="min-h-screen bg-chumbi-sky text-white overflow-x-hidden">
      {/* Partículas Interativas */}
      <InteractiveParticles 
        count={30} 
        mousePosition={mousePosition} 
        scrollY={scrollY} 
      />

      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div 
              className="w-12 h-12 bg-green-500 rounded-lg cartoon-border border-green-700 flex items-center justify-center text-2xl font-bold text-white glow-green cursor-pointer"
              style={getParallaxStyle(0.1)}
            >
              🌱
            </div>
          </div>

          {/* Navigation Menu - Desktop */}
          <nav className="hidden md:flex items-center space-x-4">
            <AnimatedButton variant="primary" size="sm">Our Games</AnimatedButton>
            <AnimatedButton variant="accent" size="sm">Game info</AnimatedButton>
            <AnimatedButton variant="secondary" size="sm">Token</AnimatedButton>
            <AnimatedButton variant="primary" size="sm">About</AnimatedButton>
            <AnimatedButton variant="accent" size="sm">Lore</AnimatedButton>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              className="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-full cartoon-button text-xl"
              style={getParallaxStyle(0.05)}
            >
              🔊
            </button>
            <AnimatedButton variant="primary" size="md">
              BUY CHMB
            </AnimatedButton>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10">
            <div className="px-4 py-4 space-y-2">
              <AnimatedButton variant="primary" size="sm" className="w-full">Our Games</AnimatedButton>
              <AnimatedButton variant="accent" size="sm" className="w-full">Game info</AnimatedButton>
              <AnimatedButton variant="secondary" size="sm" className="w-full">Token</AnimatedButton>
              <AnimatedButton variant="primary" size="sm" className="w-full">About</AnimatedButton>
              <AnimatedButton variant="accent" size="sm" className="w-full">Lore</AnimatedButton>
              <AnimatedButton variant="primary" size="md" className="w-full">BUY CHMB</AnimatedButton>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <ParallaxBackground scrollY={scrollY} mousePosition={mousePosition}>
          {/* Background Landscape */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-300 to-green-300">
            {/* Nuvens Animadas */}
            <div className="absolute inset-0">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full opacity-70 float"
                  style={{
                    left: `${10 + i * 12}%`,
                    top: `${5 + (i % 3) * 15}%`,
                    width: `${40 + Math.random() * 60}px`,
                    height: `${20 + Math.random() * 30}px`,
                    animationDelay: `${i * 0.5}s`,
                    ...getParallaxStyle(0.1 + i * 0.02)
                  }}
                />
              ))}
            </div>

            {/* Montanhas com SVG */}
            <div className="absolute bottom-0 left-0 right-0 h-96">
              <svg viewBox="0 0 1200 400" className="w-full h-full">
                <defs>
                  <linearGradient id="mountainGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4a5568" />
                    <stop offset="100%" stopColor="#2d3748" />
                  </linearGradient>
                  <linearGradient id="mountainGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2d3748" />
                    <stop offset="100%" stopColor="#1a202c" />
                  </linearGradient>
                </defs>
                
                <path
                  d="M0,200 L200,100 L400,150 L600,80 L800,120 L1000,90 L1200,110 L1200,400 L0,400 Z"
                  fill="url(#mountainGradient1)"
                  opacity="0.6"
                  style={{ transform: `translateY(${scrollY * 0.3}px)` }}
                />
                
                <path
                  d="M0,250 L150,150 L350,200 L550,120 L750,170 L950,140 L1200,160 L1200,400 L0,400 Z"
                  fill="url(#mountainGradient2)"
                  opacity="0.8"
                  style={{ transform: `translateY(${scrollY * 0.5}px)` }}
                />
              </svg>
            </div>

            {/* Floresta */}
            <div className="absolute bottom-0 left-0 right-0 h-64">
              <svg viewBox="0 0 1200 250" className="w-full h-full">
                <defs>
                  <linearGradient id="forestGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#22543d" />
                    <stop offset="100%" stopColor="#1a202c" />
                  </linearGradient>
                </defs>
                
                <path
                  d="M0,150 Q50,100 100,130 Q150,80 200,110 Q250,60 300,90 Q350,40 400,70 Q450,20 500,50 Q550,10 600,40 Q650,20 700,50 Q750,40 800,70 Q850,60 900,90 Q950,80 1000,110 Q1050,100 1100,130 Q1150,120 1200,150 L1200,250 L0,250 Z"
                  fill="url(#forestGradient)"
                  style={{ transform: `translateY(${scrollY * 0.7}px)` }}
                />
                
                <path
                  d="M200,200 Q400,180 600,200 Q800,220 1000,200"
                  stroke="#4299e1"
                  strokeWidth="15"
                  fill="none"
                  opacity="0.7"
                  className="glow-blue"
                />
              </svg>
            </div>
          </div>
        </ParallaxBackground>

        {/* Conteúdo Principal */}
        <div className="relative z-10 text-center">
          <div 
            className="mb-8"
            style={{
              transform: `translateY(${scrollY * -0.2}px)`,
              ...getParallaxStyle(0.1)
            }}
          >
            <AnimatedText
              text="chumbi"
              className="text-8xl md:text-9xl font-bold mb-4 chumbi-title text-3d text-green-400 pulse-glow block"
              isVisible={isVisible.hero}
              delay={500}
            />
            <AnimatedText
              text="valley"
              className="text-6xl md:text-7xl font-bold chumbi-title text-3d text-green-400 pulse-glow block"
              isVisible={isVisible.hero}
              delay={1000}
            />
          </div>

          {/* Ícones Sociais */}
          <div 
            className="flex justify-center space-x-6 mt-8"
            style={{
              transform: `translateY(${scrollY * -0.1}px)`,
            }}
          >
            <AnimatedButton variant="primary" size="lg" className="text-2xl">🐦</AnimatedButton>
            <AnimatedButton variant="accent" size="lg" className="text-2xl">📺</AnimatedButton>
            <AnimatedButton variant="secondary" size="lg" className="text-2xl">💬</AnimatedButton>
          </div>
        </div>

        {/* Banner Lateral */}
        <AnimatedCard
          className="absolute top-32 right-8 bg-green-800 border-green-600 p-4 max-w-xs glow-green"
          isVisible={isVisible.hero}
          delay={1500}
          style={{
            transform: `translateY(${scrollY * -0.3}px)`,
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-yellow-400 rounded-full cartoon-border border-yellow-600 flex items-center justify-center text-2xl float">
              🎮
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Valley Adventures</h3>
              <p className="text-green-200 text-sm">Season 1 is out!</p>
              <AnimatedButton variant="accent" size="sm" className="mt-2">
                PLAY NOW
              </AnimatedButton>
            </div>
          </div>
        </AnimatedCard>

        {/* Personagens Flutuantes */}
        <div 
          className="absolute bottom-20 right-20"
          style={{
            transform: `translateY(${scrollY * -0.4}px)`,
            ...getParallaxStyle(0.2)
          }}
        >
          <div className="w-24 h-24 bg-yellow-400 rounded-full cartoon-border border-yellow-600 flex items-center justify-center text-4xl float-delayed glow-orange cursor-pointer interactive-element">
            🦊
          </div>
        </div>

        <div 
          className="absolute bottom-32 left-20"
          style={{
            transform: `translateY(${scrollY * -0.3}px)`,
            ...getParallaxStyle(-0.1)
          }}
        >
          <div className="w-20 h-20 bg-purple-400 rounded-full cartoon-border border-purple-600 flex items-center justify-center text-3xl float glow-purple cursor-pointer interactive-element">
            🐰
          </div>
        </div>
      </section>

      {/* Seção de Features */}
      <section 
        ref={featuresRef}
        className="py-20 px-4 relative bg-chumbi-forest"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Farming */}
            <AnimatedCard
              className="bg-green-600 border-green-800 p-8 glow-green"
              isVisible={isVisible.features}
              delay={0}
            >
              <div className="text-6xl mb-4 text-center float">🌱</div>
              <AnimatedText
                text="Farming"
                className="text-3xl font-bold text-white mb-4 text-center chumbi-title block"
                isVisible={isVisible.features}
                delay={200}
              />
              <p className="text-green-100 text-lg leading-relaxed font-semibold">
                Restore a long forgotten forest farm to its former glory, grow crops and create an enchanting home for yourself and your Chumbi.
              </p>
            </AnimatedCard>

            {/* Breeding */}
            <AnimatedCard
              className="bg-pink-600 border-pink-800 p-8 glow-purple"
              isVisible={isVisible.features}
              delay={200}
            >
              <div className="text-6xl mb-4 text-center float-delayed">🥚</div>
              <AnimatedText
                text="Breeding"
                className="text-3xl font-bold text-white mb-4 text-center chumbi-title block"
                isVisible={isVisible.features}
                delay={400}
              />
              <p className="text-pink-100 text-lg leading-relaxed font-semibold">
                Accompany your Chumbi to the sacred Primordial Tree to begin breeding new Chumbi NFTs. An endless combination of attributes is possible. Will you hatch them all?
              </p>
            </AnimatedCard>

            {/* Crafting */}
            <AnimatedCard
              className="bg-orange-600 border-orange-800 p-8 glow-orange"
              isVisible={isVisible.features}
              delay={400}
            >
              <div className="text-6xl mb-4 text-center float">🔨</div>
              <AnimatedText
                text="Crafting"
                className="text-3xl font-bold text-white mb-4 text-center chumbi-title block"
                isVisible={isVisible.features}
                delay={600}
              />
              <p className="text-orange-100 text-lg leading-relaxed font-semibold">
                Combine your farm-grown crops with the treasured resources you find along your travels to craft useful and powerful items.
              </p>
            </AnimatedCard>

            {/* Exploration */}
            <AnimatedCard
              className="bg-purple-600 border-purple-800 p-8 glow-purple"
              isVisible={isVisible.features}
              delay={600}
            >
              <div className="text-6xl mb-4 text-center float-delayed">🗺️</div>
              <AnimatedText
                text="Exploration"
                className="text-3xl font-bold text-white mb-4 text-center chumbi-title block"
                isVisible={isVisible.features}
                delay={800}
              />
              <p className="text-purple-100 text-lg leading-relaxed font-semibold">
                Explore a variety of unique and interesting regions, chart the valley, meet fascinating individuals and uncover hidden secrets and valuable resources along the way.
              </p>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Seção da Comunidade */}
      <section 
        ref={communityRef}
        className="py-20 px-4 relative bg-chumbi-sunset"
      >
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedText
            text="Join the Chumbi Community"
            className="text-5xl font-bold text-white mb-8 chumbi-title text-3d block"
            isVisible={isVisible.community}
            delay={0}
          />
          
          <AnimatedText
            text="Chat with the community, ask questions, get involved in competitions and more!"
            className="text-2xl text-orange-100 mb-12 leading-relaxed font-bold block"
            isVisible={isVisible.community}
            delay={500}
          />

          {/* Ícones Sociais */}
          <div className="flex justify-center space-x-6 mb-12">
            <AnimatedButton variant="primary" size="lg" className="text-2xl">🐦</AnimatedButton>
            <AnimatedButton variant="secondary" size="lg" className="text-2xl">📱</AnimatedButton>
            <AnimatedButton variant="accent" size="lg" className="text-2xl">📺</AnimatedButton>
            <AnimatedButton variant="primary" size="lg" className="text-2xl">💬</AnimatedButton>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-gray-900 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo */}
            <div>
              <div className="w-12 h-12 bg-green-500 rounded-lg cartoon-border border-green-700 flex items-center justify-center text-2xl font-bold text-white glow-green mb-4">
                🌱
              </div>
            </div>

            {/* Game Features */}
            <div>
              <h4 className="text-blue-400 font-bold mb-4 cartoon-border border-blue-600 bg-blue-800 px-3 py-1 rounded-lg inline-block">
                Game features
              </h4>
              <div className="space-y-2">
                <AnimatedButton variant="accent" size="sm" className="block w-full">Chumbi</AnimatedButton>
                <AnimatedButton variant="secondary" size="sm" className="block w-full">Gallery</AnimatedButton>
                <AnimatedButton variant="primary" size="sm" className="block w-full">Whitepaper</AnimatedButton>
              </div>
            </div>

            {/* Token */}
            <div>
              <h4 className="text-orange-400 font-bold mb-4 cartoon-border border-orange-600 bg-orange-800 px-3 py-1 rounded-lg inline-block">
                Token
              </h4>
              <div className="space-y-2">
                <AnimatedButton variant="primary" size="sm" className="block w-full">About</AnimatedButton>
                <AnimatedButton variant="secondary" size="sm" className="block w-full">Vesting</AnimatedButton>
                <AnimatedButton variant="accent" size="sm" className="block w-full">Staking</AnimatedButton>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 cartoon-border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
                <AnimatedButton variant="accent" size="sm" className="rounded-l-none">
                  SUBSCRIBE
                </AnimatedButton>
              </div>

              {/* Números Sociais */}
              <div className="flex flex-wrap gap-2 mt-4">
                {[21, 22, 23, 24, 25, 26, 27].map((num, index) => (
                  <span 
                    key={num}
                    className={`
                      text-white px-2 py-1 rounded text-sm cartoon-border
                      ${index % 3 === 0 ? 'bg-green-600 border-green-700' : 
                        index % 3 === 1 ? 'bg-red-600 border-red-700' : 
                        'bg-blue-600 border-blue-700'}
                    `}
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Rodapé Inferior */}
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">Copyright 2025</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <AnimatedButton variant="accent" size="sm">Privacy Policy</AnimatedButton>
              <AnimatedButton variant="primary" size="sm">Terms & Conditions</AnimatedButton>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ChumbiValleyLandingPage;

