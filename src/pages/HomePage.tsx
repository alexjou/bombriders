import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ParallaxProvider, ParallaxBanner } from 'react-scroll-parallax';
import { animate, stagger } from 'animejs';
import { useNavigate } from 'react-router-dom';
import CharacterCard from "@/components/CharacterCard";
import Carousel3D from "@/components/Carousel3D";
import HeroWave from "@/components/HeroWave";
import { useCharacterImages } from "@/hooks/useCharacterImages";
import '@/styles/character-cards.css';
import '@/styles/carousel-3d.css';

// O hook useCharacterImages foi movido para um arquivo separado

// Constante com informações dos personagens
const characterData = [
  {
    id: 'ryder',
    name: 'Ryder Nova',
    element: 'Fogo',
    elementColor: 'red',
    description: 'Piloto líder, especialista em bombas inteligentes e estratégias de ataque relâmpago. Domina o elemento do fogo.',
    stats: { força: 85, velocidade: 75, técnica: 90 }
  },
  {
    id: 'vega',
    name: 'Vega Flux',
    element: 'Raio',
    elementColor: 'yellow',
    description: 'Engenheira tática, mestre em hackear sistemas biomecânicos e despertar dinossauros lendários.',
    stats: { força: 65, velocidade: 95, técnica: 80 }
  },
  {
    id: 'tyranotron',
    name: 'Tyranotron',
    element: 'Terra',
    elementColor: 'green',
    description: 'Dinossauro tecnológico, força bruta e defesa impenetrável, aliado dos BombRiders.',
    stats: { força: 98, velocidade: 50, técnica: 70 }
  },
  {
    id: 'raptoraX',
    name: 'RaptoraX',
    element: 'Água',
    elementColor: 'blue',
    description: 'Ágil e inteligente, especialista em missões furtivas e sabotagem.',
    stats: { força: 70, velocidade: 88, técnica: 82 }
  },
  {
    id: 'aeroBlast',
    name: 'AeroBlast',
    element: 'Ar',
    elementColor: 'purple',
    description: 'Piloto aéreo, especialista em ataques verticais e bombardeio estratégico.',
    stats: { força: 75, velocidade: 85, técnica: 78 }
  }
];

// Card Flip
const FlipCard: React.FC<{ front: React.ReactNode; back: React.ReactNode }> = ({ front, back }) => (
  <div className="group perspective w-72 h-96 m-6">
    <div className="relative w-full h-full duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
      <div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden shadow-2xl border-2 border-cyan-400/30">
        {front}
      </div>
      <div className="absolute w-full h-full rotate-y-180 backface-hidden rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-cyan-900 to-gray-900 flex flex-col items-center justify-center text-white p-6 border-2 border-yellow-400/30">
        {back}
      </div>
    </div>
  </div>
);

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Navegação centralizada
  const navigationButtons = [
    { path: '/game', label: 'Modo Solo', icon: '▶️', bgColor: 'from-green-500 to-green-700', description: 'Jogue contra a IA' },
    { path: '/multiplayer', label: 'Multiplayer', icon: '👥', bgColor: 'from-blue-500 to-blue-700', description: 'Jogue online com amigos' },
    { path: '/nft', label: 'NFTs', icon: '💎', bgColor: 'from-purple-500 to-purple-700', description: 'Colecionáveis digitais' },
  ];

  // Imagens locais e placeholders
  const dinoBg = 'src/assets/images/characters/capa.jpeg';
  const bombRider1 = 'src/assets/images/characters/bomberman1.jpg';
  const bombRider2 = 'src/assets/images/characters/bomberman2.jpg';
  const dino1 = 'src/assets/images/nft/dino_egg1.jpg';
  const dino2 = 'src/assets/images/nft/dino_egg2.jpg';
  const galeriaImgs = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    'src/assets/images/game/arcade.png',
    'src/assets/images/game/bomb.jpg',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    'src/assets/images/nft/prehistoric_man.jpg',
  ];

  // Animação de entrada do Hero
  const heroTitle = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  // Animação de entrada para seções
  const sectionAnim = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  // Animação de grid da galeria
  const galleryAnim = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.1, duration: 0.6 } }),
  };
  // Usando o hook personalizado para obter as imagens dos personagens
  const characterImages = useCharacterImages();
  // Efeito explosão CTA
  const ctaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ctaRef.current) return;
    animate(ctaRef.current.querySelectorAll('.explosion'), {
      scale: [0.8, 1.2, 1],
      opacity: [0.7, 1, 0.8],
      easing: 'easeInOutSine',
      duration: 1800,
      loop: true,
      delay: stagger(200),
    });
  }, []);

  return (<ParallaxProvider>
    <div className="pt-16"> {/* Adicionado pt-16 para compensar o Header fixo */}
      {/* HERO SECTION */}      <section className="relative min-h-[90vh] flex flex-col justify-center items-center bg-gradient-to-b from-cyan-900 via-gray-900 to-black overflow-hidden">
        <HeroWave />
        {/* Bomb image behind the title */}
        <div className="absolute top-1/2 transform -translate-y-1/4 z-5 opacity-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <svg width="300" height="300" viewBox="0 0 200 200" className="animate-pulse">
              <circle cx="100" cy="100" r="80" fill="#333" />
              <circle cx="100" cy="100" r="70" fill="#222" />
              <circle cx="100" cy="100" r="60" fill="#ff5500" className="animate-ping" style={{ animationDuration: '3s' }} />
              <rect x="90" y="30" width="20" height="30" fill="#555" rx="5" />
              <circle cx="100" cy="25" r="8" fill="#ff0000" className="animate-pulse" />
            </svg>
          </motion.div>
        </div>

        <motion.div
          className="z-10 text-center relative"
          variants={heroTitle}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl md:text-7xl font-extrabold text-center mb-6"
            style={{
              textShadow: "0 0 10px rgba(0,255,255,0.5), 0 0 20px rgba(0,255,255,0.3)",
            }}
          >
            <motion.div
              className="mb-2"
              animate={{
                textShadow: ["0 0 10px rgba(0,255,255,0.5)", "0 0 20px rgba(0,255,255,0.8)", "0 0 10px rgba(0,255,255,0.5)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Entre na Era dos
            </motion.div>

            <motion.div
              className="relative inline-block"
              style={{
                textShadow: "0 0 20px rgba(255,204,0,0.8)",
                transform: "perspective(500px) rotateX(10deg)"
              }}
              animate={{
                rotateX: [10, 5, 10],
                textShadow: ["0 0 20px rgba(255,204,0,0.5)", "0 0 30px rgba(255,204,0,0.8)", "0 0 20px rgba(255,204,0,0.5)"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-yellow-300 to-yellow-600" style={{ fontSize: "120%" }}>BombRiders</span>

              {/* Arco visual em SVG abaixo do texto */}
              <svg width="100%" height="30" viewBox="0 0 200 30" className="absolute -bottom-8 left-0">
                <path
                  d="M 10,25 Q 100,5 190,25"
                  stroke="url(#grad)"
                  strokeWidth="2"
                  fill="none"
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255,204,0,0.1)" />
                    <stop offset="50%" stopColor="rgba(255,204,0,0.8)" />
                    <stop offset="100%" stopColor="rgba(255,204,0,0.1)" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          </motion.h1>
        </motion.div>        <motion.p
          className="z-10 text-lg md:text-2xl text-cyan-100 text-center max-w-2xl mb-8"
          variants={sectionAnim}
          initial="hidden"
          animate="visible"
        >
          Num futuro distópico, pilotos chamados BombRiders usam bombas para despertar dinossauros tecnológicos e salvar o planeta de um colapso total.
        </motion.p>

        {/* Botões de Navegação */}
        <motion.div
          className="z-10 flex flex-wrap gap-4 md:gap-6 justify-center mb-8"
          variants={sectionAnim}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <motion.a
            href="/game"
            className="px-6 py-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold rounded-full shadow-lg flex items-center gap-2 hover:shadow-green-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">▶️</span>
            <span>Modo Solo</span>
          </motion.a>

          <motion.a
            href="/multiplayer"
            className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg flex items-center gap-2 hover:shadow-blue-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">👥</span>
            <span>Multiplayer</span>
          </motion.a>

          <motion.a
            href="/nft"
            className="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold rounded-full shadow-lg flex items-center gap-2 hover:shadow-purple-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">💎</span>
            <span>NFTs</span>
          </motion.a>
        </motion.div>

        {/* Botão Principal */}
        <motion.button
          className="z-10 px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-full shadow-lg hover:bg-yellow-300 transition text-xl"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          Começar Missão
        </motion.button>
        {/* Partículas decorativas */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute left-1/4 top-1/3 w-32 h-32 rounded-full bg-cyan-400 opacity-20 blur-2xl animate-pulse" />
          <div className="absolute right-1/4 bottom-1/4 w-40 h-40 rounded-full bg-yellow-400 opacity-10 blur-2xl animate-pulse" />
        </div>
      </section>

      {/* NAVEGAÇÃO CENTRALIZADA */}
      <section className="py-16 bg-gradient-to-b from-black via-cyan-950/30 to-gray-900 flex flex-col items-center">
        <motion.h2
          className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          ESCOLHA SUA AVENTURA
        </motion.h2>

        <motion.p
          className="text-gray-400 text-lg mb-12 max-w-3xl text-center px-4"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Explore diferentes modos de jogo e descubra todas as possibilidades no universo BombRiders
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-6 max-w-6xl px-4"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {navigationButtons.map((button) => (
            <motion.div
              key={button.path}
              className="w-64 bg-gray-900/80 border-2 border-cyan-700/30 rounded-xl overflow-hidden shadow-lg shadow-cyan-800/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/20 cursor-pointer"
              whileHover={{ y: -5 }}
              onClick={() => navigate(button.path)}
            >
              <div className={`h-2 bg-gradient-to-r ${button.bgColor}`}></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 relative bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
                    <span className="text-2xl">{button.icon}</span>
                    <div className="absolute -inset-1 rounded-full bg-yellow-400 opacity-10 blur-sm"></div>
                  </div>
                  <h3 className="text-xl font-bold text-white">{button.label}</h3>
                </div>
                <p className="text-gray-400 text-sm">{button.description}</p>
                <div className="mt-4 flex justify-end">
                  <div className="text-yellow-500 flex items-center text-sm font-medium">
                    JOGAR
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* LORE / HISTÓRIA */}
      <ParallaxBanner
        layers={[
          { image: dinoBg, speed: -20 },
          { speed: -10, children: <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" /> },
        ]}
        className="relative min-h-[60vh] flex items-center justify-center"
      >
        <motion.div
          className="relative z-10 max-w-4xl mx-auto p-8 bg-black/60 rounded-xl shadow-xl backdrop-blur-md"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-200 mb-4 flex items-center">
            <div className="mr-3 text-yellow-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
              </svg>
            </div>
            A História
          </h2>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/2">
                <p className="text-cyan-100 text-lg">
                  Num futuro não muito distante, a Terra está à beira do colapso após décadas de guerras tecnológicas e desastres ambientais. Durante escavações, dinossauros biomecânicos adormecidos são descobertos — vestígios de uma civilização ancestral.
                </p>
              </div>
              <div className="md:w-1/2 rounded-xl overflow-hidden shadow-glow">
                <motion.img
                  src="src/assets/images/nft/prehistoric_man.jpg"
                  alt="Escavações arqueológicas"
                  className="w-full h-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  viewport={{ once: true }}
                />
              </div>
            </div>

            <motion.div
              className="bg-gradient-to-r from-cyan-900/30 to-yellow-900/30 p-5 rounded-xl border border-cyan-500/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl text-yellow-300 mb-2">A Blockchain Elemental</h3>
              <p className="text-cyan-100">
                Após a liberação da "Blockchain Elemental", o mundo mergulhou no caos. Essa tecnologia ancestral dividiu os poderes da natureza em cinco elementos: Fogo, Raio, Terra, Água e Ar. Organizações malignas tentam dominar esses fragmentos para controlar o planeta.
              </p>
            </motion.div>

            <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
              <div className="md:w-1/2">
                <p className="text-cyan-100 text-lg">
                  Os BombRiders são heróis ligados aos elementos naturais, escolhidos para restaurar o equilíbrio. Utilizando bombas tecnológicas avançadas, eles despertam e formam alianças com os dinossauros biomecânicos, criando um vínculo elementar que amplifica seus poderes.
                </p>
              </div>
              <div className="md:w-1/2 rounded-xl overflow-hidden shadow-glow">
                <motion.img
                  src="src/assets/images/game/bomb.jpg"
                  alt="Tecnologia BombRider"
                  className="w-full h-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  viewport={{ once: true }}
                />
              </div>
            </div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-5 gap-4 my-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              viewport={{ once: true }}
            >
              {["Fogo", "Raio", "Terra", "Água", "Ar"].map((elemento, idx) => (
                <div
                  key={elemento}
                  className={`p-3 rounded-lg text-center ${elemento === 'Fogo' ? 'bg-red-900/40 border-red-500/50' :
                    elemento === 'Raio' ? 'bg-yellow-900/40 border-yellow-500/50' :
                      elemento === 'Terra' ? 'bg-green-900/40 border-green-500/50' :
                        elemento === 'Água' ? 'bg-blue-900/40 border-blue-500/50' :
                          'bg-purple-900/40 border-purple-500/50'
                    } border`}
                >
                  <div className="text-lg font-bold mb-1">{elemento}</div>
                  <motion.img
                    src={`src/assets/images/nft/dino_egg${idx + 1}.jpg`}
                    alt={`Ovo de dinossauro do elemento ${elemento}`}
                    className="w-full h-auto rounded-md"
                    whileHover={{ scale: 1.05 }}
                  />
                </div>
              ))}
            </motion.div>

            <p className="text-cyan-100 text-lg border-l-4 border-yellow-400 pl-4">
              Os BombRiders agora avançam pelo Brasil, o primeiro capítulo da sua jornada global. Da Patagônia Verdejante até o Domínio Tecnossauro, enfrentando inimigos e descobrindo segredos enquanto buscam restaurar o equilíbrio do planeta e impedir a extinção da humanidade.
            </p>
          </div>
        </motion.div>
      </ParallaxBanner>{/* PERSONAGENS PRINCIPAIS */}      <section className="py-20 bg-gradient-to-b from-gray-900 to-cyan-950 flex flex-col items-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-yellow-400 mb-20"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Personagens Principais
        </motion.h2>
        {/* Carrossel 3D de Personagens */}
        <div className="container px-4 sm:px-8 mx-auto">
          <div className="relative mb-16">
            <Carousel3D autoRotate={true} rotationInterval={4000}>
              {characterData.map((character) => (
                <div key={character.id} className="p-2 transform-gpu">
                  <CharacterCard
                    character={character}
                    imageSrc={characterImages[character.id]}
                  />
                </div>
              ))}
            </Carousel3D>
          </div>
        </div>
      </section>

      {/* MAPAS E FASES */}
      <section className="py-20 bg-gradient-to-b from-cyan-950 to-gray-900 flex flex-col items-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-yellow-400 mb-10 text-center"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Capítulo 1: Brasil
        </motion.h2>

        <motion.div
          className="container max-w-5xl mx-auto px-4 sm:px-8"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="mb-10 text-center">
            <p className="text-cyan-100 text-xl max-w-3xl mx-auto">
              Comece sua jornada pelo Brasil, onde a tecnologia ancestral dos dinossauros
              primeiro despertou. Enfrente 10 fases desafiadoras em cenários emblemáticos do país.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <motion.div
              className="bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-cyan-500/20"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(6, 182, 212, 0.3)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-40 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
                <img src="src/assets/images/game/gameplay.jpg" className="w-full h-full object-cover" alt="Fase do jogo" />
                <div className="absolute bottom-0 left-0 w-full p-4 z-20">
                  <span className="inline-block bg-red-500/70 text-white text-xs px-2 py-1 rounded mb-2">Fase 1</span>
                  <h3 className="text-white text-xl font-bold">Patagônia Verdejante</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-cyan-100 text-sm">
                  Uma área com vastos campos verdejantes misturados com tecnologia
                  ancestral. Abriga os primeiros ovos tecnossauros e possui quebra-cabeças simples.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-cyan-500/20"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(255, 204, 0, 0.3)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-40 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
                <img src="src/assets/images/game/arcade.png" className="w-full h-full object-cover" alt="Fase do jogo" />
                <div className="absolute bottom-0 left-0 w-full p-4 z-20">
                  <span className="inline-block bg-yellow-500/70 text-white text-xs px-2 py-1 rounded mb-2">Fase 2</span>
                  <h3 className="text-white text-xl font-bold">Dunas do Ceará</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-cyan-100 text-sm">
                  Labirinto de dunas douradas com tecnologia enterrada. Dinossauros do elemento Raio
                  estão despertando, trazendo tempestades de areia que mudam o cenário.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="relative bg-black/60 rounded-xl overflow-hidden backdrop-blur-sm p-6 border border-cyan-500/20 mb-8">
            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

            {/* Marca d'água decorativa */}
            <div className="absolute right-6 bottom-10 opacity-5 pointer-events-none" style={{ zIndex: 0 }}>
              <svg width="180" height="180" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#FACC15" strokeWidth="2" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="#FACC15" strokeWidth="1" />
                <path d="M50,10 L50,90 M10,50 L90,50" stroke="#FACC15" strokeWidth="1" />
                <circle cx="50" cy="50" r="10" fill="#FACC15" opacity="0.5" />
                <text x="30" y="55" fill="#FACC15" fontFamily="Arial" fontSize="8">BRASIL</text>
              </svg>
            </div>

            <h3 className="text-xl text-yellow-300 font-bold mb-4 relative z-10 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.25-11.25v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 1.5 0zm0 4v4.25a.75.75 0 0 1-1.5 0v-4.25a.75.75 0 0 1 1.5 0z" />
              </svg>
              Mapa de Progresso
              <motion.span
                className="ml-2 text-xs bg-yellow-400/80 text-gray-900 px-2 py-0.5 rounded-full"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                10 FASES
              </motion.span>
            </h3>

            <div className="relative z-10">
              {/* Linha de conexão animada que percorre o mapa */}
              <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-yellow-500/50 via-cyan-400/50 to-gray-700/50" style={{ zIndex: -1 }}>
                <motion.div
                  className="absolute top-0 w-full bg-yellow-400"
                  initial={{ height: "0%" }}
                  animate={{ height: ["0%", "100%", "0%"] }}
                  transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                />
              </div>

              <div className="space-y-4">
                {[
                  {
                    nome: "Patagônia Verdejante",
                    status: "atual",
                    desc: "Campos verdejantes com tecnologia ancestral. Os primeiros ovos tecnossauros podem ser encontrados aqui junto com quebra-cabeças simples para introduzir os jogadores à mecânica."
                  },
                  {
                    nome: "Dunas do Ceará",
                    status: "próxima",
                    desc: "Um labirinto de dunas douradas onde tecnologia enterrada espera para ser descoberta. Dinossauros do elemento Raio estão despertando, criando tempestades de areia que mudam constantemente o cenário."
                  },
                  {
                    nome: "Favela do Fogo",
                    status: "bloqueada",
                    desc: "Uma comunidade verticalmente construída com rampas e plataformas. O calor dos processadores de dados aquece toda a região e desperta dinossauros do elemento Fogo."
                  },
                  {
                    nome: "Floresta Amazônica Digital",
                    status: "bloqueada",
                    desc: "Árvores e plantas interligadas por cabos de fibra ótica e servidores antigos. Os dinossauros aqui são do elemento Terra e podem controlar a vegetação tecnológica."
                  },
                  {
                    nome: "Vale da Energia Perdida",
                    status: "bloqueada",
                    desc: "Cânion profundo com geradores de energia antigos. Dinossauros do elemento Água usam as correntes de rios subterrâneos para alimentar os geradores."
                  },
                  {
                    nome: "Pantanal Codificado",
                    status: "bloqueada",
                    desc: "Área alagada com plataformas flutuantes. A água contém nanobots que formam padrões geométricos na superfície, revelando caminhos secretos."
                  },
                  {
                    nome: "Sertão Seco",
                    status: "bloqueada",
                    desc: "Região árida com torres de transmissão antigas. Tempestades de areia intermitentes mudam a visibilidade e a jogabilidade, revelando ruínas tecnológicas."
                  },
                  {
                    nome: "Amazônia Profunda",
                    status: "bloqueada",
                    desc: "Coração da floresta com estruturas ancestrais gigantes. Dinossauros de elementos mistos protegem o núcleo energético primordial."
                  },
                  {
                    nome: "Mini Boss - Jaguar de Dados",
                    status: "bloqueada",
                    desc: "Uma arena circular com plataformas móveis onde o guardião felino da rede brasileira desafia os jogadores. Ele pode se materializar e desmaterializar como streams de dados."
                  },
                  {
                    nome: "Boss Final - Domínio Tecnossauro",
                    status: "bloqueada",
                    desc: "Complexo tecnológico colossal com múltiplos andares. O Tirano-Servidor, um T-Rex tecnológico gigante que controla todos os dados do Brasil, deve ser derrotado ou convertido para a causa dos BombRiders."
                  }
                ].map((fase, i) => (
                  <div
                    key={fase.nome}
                    className={`flex items-start p-3 rounded-lg transition-all ${fase.status === "atual"
                      ? "bg-gradient-to-r from-yellow-500/30 to-yellow-900/10 border border-yellow-500/40"
                      : fase.status === "próxima"
                        ? "bg-gradient-to-r from-cyan-500/20 to-cyan-900/10 border border-cyan-500/30"
                        : "bg-gradient-to-r from-gray-700/20 to-gray-900/10 border border-gray-600/20"
                      }`}
                  >
                    <div className={`rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 ${fase.status === "atual"
                      ? "bg-yellow-400 text-gray-900"
                      : fase.status === "próxima"
                        ? "bg-cyan-400 text-gray-900"
                        : "bg-gray-700 text-gray-300"
                      }`}>
                      {i + 1}
                    </div>
                    <div>
                      <h4 className={`font-bold text-base mb-1 ${fase.status === "atual"
                        ? "text-yellow-300"
                        : fase.status === "próxima"
                          ? "text-cyan-300"
                          : "text-gray-300"
                        }`}>
                        {fase.nome}
                        {fase.status === "atual" && (
                          <span className="ml-2 text-xs bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full">ATUAL</span>
                        )}
                      </h4>
                      <p className="text-cyan-100 text-sm">{fase.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicador de progresso numérico */}
            <motion.div
              className="mt-6 bg-black/40 backdrop-blur-sm p-4 rounded-lg border border-yellow-500/20 flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col items-center mr-6">
                <div className="text-2xl font-bold text-yellow-300">1/10</div>
                <div className="text-xs text-cyan-200">Fase atual</div>
              </div>

              <div className="w-full max-w-xs">
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-400 to-cyan-400"
                    style={{ width: "10%" }}
                    animate={{ boxShadow: ["0 0 5px rgba(255, 204, 0, 0.7)", "0 0 10px rgba(255, 204, 0, 0.9)", "0 0 5px rgba(255, 204, 0, 0.7)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div className="mt-1 text-xs text-cyan-200 text-right">10% completado</div>
              </div>
            </motion.div>

            <motion.div
              className="mt-6 bg-gradient-to-r from-cyan-900/30 to-yellow-900/30 p-4 rounded-lg text-center max-w-lg mx-auto"
              animate={{
                boxShadow: ["0 0 10px rgba(6, 182, 212, 0.3)", "0 0 20px rgba(6, 182, 212, 0.5)", "0 0 10px rgba(6, 182, 212, 0.3)"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <p className="text-cyan-100">
                <span className="text-yellow-300 font-bold">Em breve:</span> Próximos capítulos em outros países, cada um com suas fases exclusivas!
              </p>
            </motion.div>

            {/* Dicas de jogo para as fases */}
            <motion.div
              className="mt-6 bg-black/50 backdrop-blur-sm p-4 rounded-lg border border-cyan-500/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg text-cyan-300 font-semibold mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
                Dica para Patagônia Verdejante
              </h4>

              <div className="pl-7">
                <p className="text-cyan-100 text-sm mb-2">
                  Para encontrar ovos ocultos nesta fase, busque áreas com vegetação brilhante.
                  Use bombas do elemento fogo perto de cristais para revelar passagens secretas.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-block bg-yellow-900/40 border border-yellow-500/30 text-yellow-300 text-xs px-2 py-1 rounded-full">
                    # Cristais
                  </span>
                  <span className="inline-block bg-red-900/40 border border-red-500/30 text-red-300 text-xs px-2 py-1 rounded-full">
                    # Bombas de Fogo
                  </span>
                  <span className="inline-block bg-green-900/40 border border-green-500/30 text-green-300 text-xs px-2 py-1 rounded-full">
                    # Ovos Elementais
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* PETS E EVOLUÇÃO */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black flex flex-col items-center overflow-hidden relative">
        {/* Efeito de partículas flutuantes */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full bg-cyan-400/20"
              style={{
                width: Math.random() * 20 + 5,
                height: Math.random() * 20 + 5,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: Math.random() * 8 + 12,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <motion.h2
          className="text-3xl md:text-4xl font-bold text-yellow-400 mb-10 text-center"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Pets Dinossauros e Evolução
        </motion.h2>

        <motion.div
          className="container max-w-6xl mx-auto px-4 sm:px-8"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <p className="text-cyan-100 text-xl max-w-3xl mx-auto">
              Cada BombRider tem um pet dinossauro tecnológico que evolui conforme o progresso no jogo,
              ganhando novos poderes e habilidades.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              className="bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-cyan-500/20"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(6, 182, 212, 0.3)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-5 border-b border-cyan-500/20 bg-gradient-to-r from-black/80 to-cyan-900/20">
                <h3 className="text-xl text-cyan-300 font-bold">Ovos Elementais</h3>
              </div>
              <div className="p-5 flex flex-col items-center">
                <div className="relative w-40 h-40 mb-6">
                  <motion.img
                    src="src/assets/images/nft/dino_egg1.jpg"
                    alt="Ovo Elemental"
                    className="rounded-lg w-full h-full object-cover border-2 border-cyan-500/30"
                    animate={{
                      boxShadow: ["0 0 10px rgba(6, 182, 212, 0.3)", "0 0 20px rgba(6, 182, 212, 0.5)", "0 0 10px rgba(6, 182, 212, 0.3)"]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <div className="absolute -bottom-3 -right-3 bg-yellow-400 text-black rounded-full p-2 font-bold text-xs">
                    NÍVEL 1
                  </div>
                </div>
                <p className="text-cyan-100 text-sm">
                  Sua jornada começa encontrando um ovo misterioso. Ele contém um dinossauro tecnológico
                  que responderá ao seu elemento natural. Os ovos são raros e podem ser encontrados durante missões especiais.
                </p>
                <div className="mt-4 flex justify-center">
                  <span className="inline-block bg-cyan-900/50 text-cyan-300 text-xs px-3 py-1 rounded-full">
                    Habilidade Inicial: Suporte Básico
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-yellow-500/20"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(255, 204, 0, 0.3)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-5 border-b border-yellow-500/20 bg-gradient-to-r from-black/80 to-yellow-900/20">
                <h3 className="text-xl text-yellow-300 font-bold">Evolução Intermediária</h3>
              </div>
              <div className="p-5 flex flex-col items-center">
                <div className="relative w-40 h-40 mb-6">
                  <motion.img
                    src="src/assets/images/nft/dino_egg3.jpg"
                    alt="Dinossauro Evoluído"
                    className="rounded-lg w-full h-full object-cover border-2 border-yellow-500/30"
                    animate={{
                      boxShadow: ["0 0 10px rgba(255, 204, 0, 0.3)", "0 0 20px rgba(255, 204, 0, 0.5)", "0 0 10px rgba(255, 204, 0, 0.3)"]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <div className="absolute -bottom-3 -right-3 bg-yellow-400 text-black rounded-full p-2 font-bold text-xs">
                    NÍVEL 2
                  </div>
                </div>
                <p className="text-cyan-100 text-sm">
                  Após batalhas e uso frequente, seu pet evolui para uma forma mais forte e ágil.
                  A evolução pode ser acelerada com tokens especiais ou completando desafios específicos.
                </p>
                <div className="mt-4 flex justify-center">
                  <span className="inline-block bg-yellow-900/50 text-yellow-300 text-xs px-3 py-1 rounded-full">
                    Habilidade Desbloqueada: Ataque Elemental
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.3)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-5 border-b border-purple-500/20 bg-gradient-to-r from-black/80 to-purple-900/20">
                <h3 className="text-xl text-purple-300 font-bold mb-4">Forma Final NFT</h3>
              </div>
              <div className="p-5 flex flex-col items-center">
                <div className="relative w-40 h-40 mb-6">
                  <motion.img
                    src="src/assets/images/nft/dino_egg7.jpg"
                    alt="Dinossauro Forma Final"
                    className="rounded-lg w-full h-full object-cover border-2 border-purple-500/30"
                    animate={{
                      boxShadow: ["0 0 10px rgba(168, 85, 247, 0.3)", "0 0 20px rgba(168, 85, 247, 0.5)", "0 0 10px rgba(168, 85, 247, 0.3)"]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <div className="absolute -bottom-3 -right-3 bg-purple-400 text-black rounded-full p-2 font-bold text-xs">
                    NÍVEL 3
                  </div>
                </div>
                <p className="text-cyan-100 text-sm">
                  A forma final representa o máximo potencial do seu dinossauro. Neste estágio,
                  você pode transformá-lo em um NFT único para coleção ou negociação no marketplace.
                </p>
                <div className="mt-4 flex justify-center">
                  <span className="inline-block bg-purple-900/50 text-purple-300 text-xs px-3 py-1 rounded-full">
                    Habilidade Desbloqueada: Fusão Elemental
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-gray-900 to-black p-6 rounded-xl border border-yellow-500/20 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3">
                <motion.img
                  src="src/assets/images/nft/dino_egg5.jpg"
                  alt="NFT Dinossauro"
                  className="rounded-lg w-full object-cover shadow-glow border-2 border-yellow-500/20"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl text-yellow-300 font-bold mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
                    <path d="M5.5 13v1.25c0 .138.112.25.25.25h1a.25.25 0 0 0 .25-.25V13h.5v1.25c0 .138.112.25.25.25h1a.25.25 0 0 0 .25-.25V13h.084c1.992 0 3.416-1.033 3.416-2.82 0-1.502-1.007-2.323-2.186-2.44v-.088c.97-.242 1.683-.974 1.683-2.19C11.997 3.93 10.847 3 9.092 3H9V1.75a.25.25 0 0 0-.25-.25h-1a.25.25 0 0 0-.25.25V3h-.573V1.75a.25.25 0 0 0-.25-.25h-1a.25.25 0 0 0-.25.25V3H4.75a.25.25 0 0 0-.25.25v1a.25.25 0 0 0 .25.25h.5v7h-.5a.25.25 0 0 0-.25.25v1c0 .138.112.25.25.25h.5zm4.5-8.76c0 1.156-.512 1.76-1.625 1.76h-.5v-3.5h.5c1.1 0 1.625.596 1.625 1.74zm.5 4.495c0 1.216-.593 1.815-1.76 1.815H9v-3.66h.75c1.154 0 1.75.648 1.75 1.845z" />
                  </svg>
                  Sistema NFT e Blockchain
                </h3>
                <p className="text-cyan-100">
                  Os dinossauros evoluídos se tornam NFTs dinâmicos na rede Polygon ou Solana,
                  permitindo que jogadores colecionem, negociem ou aluguem seus pets. O sistema
                  é totalmente opcional - você pode jogar normalmente sem usar blockchain,
                  conectando sua wallet apenas quando desejar negociar ou mintar seus dinossauros.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-block bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-pink-300 text-xs px-3 py-1 rounded-full border border-purple-500/30">
                    NFT ERC-721
                  </span>
                  <span className="inline-block bg-gradient-to-r from-cyan-900/30 to-blue-900/30 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-500/30">
                    Polygon
                  </span>
                  <span className="inline-block bg-gradient-to-r from-purple-900/30 to-blue-900/30 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/30">
                    Solana
                  </span>
                  <span className="inline-block bg-gradient-to-r from-green-900/30 to-emerald-900/30 text-emerald-300 text-xs px-3 py-1 rounded-full border border-green-500/30">
                    Marketplace Interno
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* TECNOLOGIA E ESTILO VISUAL */}
      <section className="py-20 bg-gradient-to-b from-black to-cyan-950 flex flex-col items-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-yellow-400 mb-10 text-center"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Tecnologia e Estilo Visual
        </motion.h2>

        <div className="container max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              className="bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-cyan-500/20 p-6"
              variants={sectionAnim}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-xl text-cyan-300 font-bold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
                  <path d="M2.5 5.5C2.5 3.57 3.93 2 5.8 2c1.4 0 2.54.95 2.94 2.25.18.56.99.69 1.3.2A2.47 2.47 0 0 1 12.2 3c1.87 0 3.3 1.57 3.3 3.5 0 2.5-2.98 4.95-5.2 6.96a1 1 0 0 1-1.4 0C6.98 11.45 4 9 4 6.5a2.5 2.5 0 0 1-.5-1z" />
                </svg>
                Estilo Visual
              </h3>

              <div className="space-y-4">
                <p className="text-cyan-100">
                  BombRiders apresenta um visual cartoon 3D estilizado, inspirado em clássicos como
                  Bomberman e Mario 3D World, com uma estética moderna e vibrante.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-cyan-900/30 to-gray-900 p-3 rounded-lg border border-cyan-500/20">
                    <h4 className="text-cyan-300 text-sm font-bold mb-2">Personagens</h4>
                    <p className="text-cyan-100 text-xs">
                      Design chibi com proporções estilizadas e animações exageradas
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-900/30 to-gray-900 p-3 rounded-lg border border-yellow-500/20">
                    <h4 className="text-yellow-300 text-sm font-bold mb-2">Dinossauros</h4>
                    <p className="text-cyan-100 text-xs">
                      Tecnológicos com elementos biomecânicos e partes brilhantes
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-900/30 to-gray-900 p-3 rounded-lg border border-green-500/20">
                    <h4 className="text-green-300 text-sm font-bold mb-2">Cenários</h4>
                    <p className="text-cyan-100 text-xs">
                      Ambientes dinâmicos com clima e eventos que afetam a jogabilidade
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-900/30 to-gray-900 p-3 rounded-lg border border-purple-500/20">
                    <h4 className="text-purple-300 text-sm font-bold mb-2">Efeitos</h4>
                    <p className="text-cyan-100 text-xs">
                      Explosões e habilidades com partículas e luzes vibrantes
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-yellow-500/20 p-6"
              variants={sectionAnim}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl text-yellow-300 font-bold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
                  <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                  <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
                </svg>
                Tecnologias
              </h3>

              <div className="space-y-4">
                <p className="text-cyan-100">
                  Desenvolvido com tecnologias modernas para garantir performance e qualidade
                  gráfica, permitindo jogabilidade fluida em navegadores.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-blue-900/30 to-gray-900 p-3 rounded-lg border border-blue-500/20">
                    <h4 className="text-blue-300 text-sm font-bold mb-2">Frontend</h4>
                    <p className="text-cyan-100 text-xs">
                      React + Vite + TypeScript
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-900/30 to-gray-900 p-3 rounded-lg border border-purple-500/20">
                    <h4 className="text-purple-300 text-sm font-bold mb-2">Gráficos 3D</h4>
                    <p className="text-cyan-100 text-xs">
                      React Three Fiber (Three.js)
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-900/30 to-gray-900 p-3 rounded-lg border border-orange-500/20">
                    <h4 className="text-orange-300 text-sm font-bold mb-2">Backend</h4>
                    <p className="text-cyan-100 text-xs">
                      Firebase + WebSockets para multijogador
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-900/30 to-gray-900 p-3 rounded-lg border border-green-500/20">
                    <h4 className="text-green-300 text-sm font-bold mb-2">Blockchain</h4>
                    <p className="text-cyan-100 text-xs">
                      Integração com MetaMask e NFTs dinâmicos
                    </p>
                  </div>
                </div>

                <div className="mt-4 px-4 py-3 bg-cyan-950/50 rounded-lg border border-cyan-500/20">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-cyan-300 mt-1 mr-2 flex-shrink-0" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                    </svg>
                    <p className="text-cyan-100 text-xs">
                      <span className="text-cyan-300 font-bold">Importante:</span> O jogo foi projetado para ser acessível mesmo sem wallet conectada.
                      A integração blockchain é totalmente opcional e permite que os jogadores colecionem e negociem seus pets evoluídos como NFTs.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="bg-gradient-to-r from-black/60 to-cyan-950/30 rounded-xl p-6 border border-cyan-500/20"
            variants={sectionAnim}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl text-cyan-300 font-bold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
              </svg>
              Modos de Jogo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-cyan-900/20 to-black p-4 rounded-lg border border-cyan-500/10">
                <h4 className="text-cyan-300 text-sm font-bold mb-2">Campanha Solo</h4>
                <p className="text-cyan-100 text-xs">
                  Explore o mundo e complete missões para avançar na história e evoluir seu dinossauro
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-900/20 to-black p-4 rounded-lg border border-green-500/10">
                <h4 className="text-green-300 text-sm font-bold mb-2">Coop Local e Online</h4>
                <p className="text-cyan-100 text-xs">
                  Jogue com amigos em cooperação para derrotar chefes e completar missões especiais
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-900/20 to-black p-4 rounded-lg border border-red-500/10">
                <h4 className="text-red-300 text-sm font-bold mb-2">PvP Competitivo</h4>
                <p className="text-cyan-100 text-xs">
                  Enfrente outros jogadores em arenas especiais para testar suas habilidades
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-900/20 to-black p-4 rounded-lg border border-yellow-500/10">
                <h4 className="text-yellow-300 text-sm font-bold mb-2">Torneios e Desafios</h4>
                <p className="text-cyan-100 text-xs">
                  Participe de eventos semanais com ranking e recompensas exclusivas
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-cyan-300 text-sm">
                <span className="text-yellow-300 font-bold">Em breve:</span> Modo Criador para construção de mapas personalizados!
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section ref={ctaRef} className="relative py-24 flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400/20 via-cyan-900 to-black overflow-hidden">
        {/* Explosão animada SVG */}
        <svg className="absolute explosion left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40" width="400" height="400" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="120" fill="#facc15" />
          <circle cx="200" cy="200" r="80" fill="#22d3ee" />
          <circle cx="200" cy="200" r="40" fill="#fff" />
        </svg>
        <motion.h2
          className="z-10 text-3xl md:text-5xl font-extrabold text-yellow-400 mb-6 text-center drop-shadow-lg"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Você está pronto para a missão?
        </motion.h2>
        <motion.button
          className="z-10 px-10 py-4 bg-cyan-400 text-gray-900 font-bold rounded-full shadow-lg hover:bg-cyan-300 transition text-2xl mb-4"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          Inscreva-se
        </motion.button>
        <div className="z-10 flex gap-6 mt-4">
          <a href="#" className="text-cyan-200 hover:text-yellow-400 text-2xl transition"><i className="fab fa-discord" /> Discord</a>
          <a href="#" className="text-cyan-200 hover:text-yellow-400 text-2xl transition"><i className="fab fa-twitter" /> Twitter</a>
          <a href="#" className="text-cyan-200 hover:text-yellow-400 text-2xl transition"><i className="fab fa-twitch" /> Twitch</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-gradient-to-t from-black to-cyan-950 text-cyan-200 flex flex-col items-center animate-fadeIn">
        <div className="flex gap-6 mb-2">
          <a href="#" className="hover:text-yellow-400 transition">Discord</a>
          <a href="#" className="hover:text-yellow-400 transition">Twitter</a>
          <a href="#" className="hover:text-yellow-400 transition">Twitch</a>
        </div>
        <p className="text-sm">© 2025 BombRiders. Todos os direitos reservados.</p>      </footer>
    </div> {/* Fechamento da div pt-16 */}
  </ParallaxProvider>
  );
};

export default HomePage;
