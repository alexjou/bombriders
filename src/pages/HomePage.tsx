import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ParallaxProvider, ParallaxBanner } from 'react-scroll-parallax';
import { animate, stagger } from 'animejs';
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
  // Imagens locais e placeholders
  const dinoBg = 'src/assets/images/game/gameplay.jpg';
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

  return (
    <ParallaxProvider>
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
        </motion.div>
        <motion.p
          className="z-10 text-lg md:text-2xl text-cyan-100 text-center max-w-2xl mb-8"
          variants={sectionAnim}
          initial="hidden"
          animate="visible"
        >
          Num futuro distópico, pilotos chamados BombRiders usam bombas para despertar dinossauros tecnológicos e salvar o planeta de um colapso total.
        </motion.p>
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

      {/* LORE / HISTÓRIA */}
      <ParallaxBanner
        layers={[
          { image: dinoBg, speed: -20 },
          { speed: -10, children: <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" /> },
        ]}
        className="relative min-h-[60vh] flex items-center justify-center"
      >
        <motion.div
          className="relative z-10 max-w-3xl mx-auto p-8 bg-black/60 rounded-xl shadow-xl backdrop-blur-md"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-200 mb-4">A História</h2>
          <p className="text-cyan-100 text-lg md:text-xl">
            Num futuro não muito distante, a Terra está à beira do colapso após décadas de guerras tecnológicas e desastres ambientais. Durante escavações, dinossauros biomecânicos adormecidos são descobertos — vestígios de uma civilização ancestral. Surge então a força rebelde BombRiders: pilotos destemidos que usam bombas inteligentes para despertar e evoluir essas criaturas, lutando para restaurar o equilíbrio do planeta e impedir a extinção da humanidade.
          </p>
        </motion.div>
      </ParallaxBanner>      {/* PERSONAGENS PRINCIPAIS */}      <section className="py-20 bg-gradient-to-b from-gray-900 to-cyan-950 flex flex-col items-center">
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

      {/* GALERIA DO MUNDO */}
      <section className="py-20 bg-gradient-to-b from-cyan-950 to-black">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-cyan-300 mb-10 text-center"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Galeria do Mundo
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {galeriaImgs.map((img, i) => (
            <motion.div
              key={img}
              className="rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
              custom={i}
              variants={galleryAnim}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <img src={img} alt="Galeria BombRiders" className="w-full h-56 object-cover" />
            </motion.div>
          ))}
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
        <p className="text-sm">© 2025 BombRiders. Todos os direitos reservados.</p>
      </footer>
    </ParallaxProvider>
  );
};

export default HomePage;
