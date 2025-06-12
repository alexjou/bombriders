import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ParallaxProvider, ParallaxBanner } from 'react-scroll-parallax';
import { animate, stagger } from 'animejs';

// Imagens locais e placeholders
const dinoBg = '/src/assets/images/game/gameplay.jpg';
const bombRider1 = '/src/assets/images/characters/bomberman1.jpg';
const bombRider2 = '/src/assets/images/characters/bomberman2.jpg';
const dino1 = '/src/assets/images/nft/dino_egg1.jpg';
const dino2 = '/src/assets/images/nft/dino_egg2.jpg';
const galeriaImgs = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
  '/src/assets/images/game/arcade.png',
  '/src/assets/images/game/bomb.jpg',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
  '/src/assets/images/nft/prehistoric_man.jpg',
];

// Efeito de onda no Hero
const HeroWave: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = 300;
    canvas.width = width;
    canvas.height = height;
    let mouseX = width / 2;
    let animationId: number;

    const drawWave = () => {
      ctx!.clearRect(0, 0, width, height);
      ctx!.beginPath();
      for (let x = 0; x < width; x += 2) {
        const y = 60 * Math.sin((x + mouseX) * 0.01) + 120 + 10 * Math.sin((x + mouseX) * 0.05);
        ctx!.lineTo(x, y);
      }
      ctx!.strokeStyle = 'rgba(0,255,255,0.3)';
      ctx!.lineWidth = 3;
      ctx!.stroke();
    };

    const animate = () => {
      drawWave();
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute left-0 top-0 w-full h-[300px] pointer-events-none z-0" />
  );
};

// Card Flip
const FlipCard: React.FC<{ front: React.ReactNode; back: React.ReactNode }> = ({ front, back }) => (
  <div className="group perspective w-64 h-80 m-4">
    <div className="relative w-full h-full duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
      <div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden shadow-lg">
        {front}
      </div>
      <div className="absolute w-full h-full rotate-y-180 backface-hidden rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-cyan-900 to-gray-900 flex flex-col items-center justify-center text-white p-4">
        {back}
      </div>
    </div>
  </div>
);

const HomePage: React.FC = () => {
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
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center bg-gradient-to-b from-cyan-900 via-gray-900 to-black overflow-hidden">
        <HeroWave />
        <motion.h1
          className="z-10 text-4xl md:text-6xl font-extrabold text-cyan-300 drop-shadow-lg text-center mt-32 mb-6"
          variants={heroTitle}
          initial="hidden"
          animate="visible"
        >
          Entre na Era dos <span className="text-yellow-400">BombRiders</span>
        </motion.h1>
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
      </ParallaxBanner>

      {/* PERSONAGENS PRINCIPAIS */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-cyan-950 flex flex-col items-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-yellow-400 mb-10"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Personagens Principais
        </motion.h2>
        <div className="flex flex-wrap justify-center gap-8">
          <FlipCard
            front={<img src={bombRider1} alt="BombRider 1" className="w-full h-full object-cover" />}
            back={<div><h3 className="text-xl font-bold mb-2">Ryder Nova</h3><p>Piloto líder, especialista em bombas inteligentes e estratégias de ataque relâmpago.</p></div>}
          />
          <FlipCard
            front={<img src={bombRider2} alt="BombRider 2" className="w-full h-full object-cover" />}
            back={<div><h3 className="text-xl font-bold mb-2">Vega Flux</h3><p>Engenheira tática, mestre em hackear sistemas biomecânicos e despertar dinossauros lendários.</p></div>}
          />
          <FlipCard
            front={<img src={dino1} alt="Dino 1" className="w-full h-full object-cover" />}
            back={<div><h3 className="text-xl font-bold mb-2">Tyranotron</h3><p>Dinossauro tecnológico, força bruta e defesa impenetrável, aliado dos BombRiders.</p></div>}
          />
          <FlipCard
            front={<img src={dino2} alt="Dino 2" className="w-full h-full object-cover" />}
            back={<div><h3 className="text-xl font-bold mb-2">RaptoraX</h3><p>Ágil e inteligente, especialista em missões furtivas e sabotagem.</p></div>}
          />
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

      {/* SUGESTÃO DE TEMPLATES VISUAIS */}
      <section className="py-10 bg-black text-cyan-200 text-center">
        <h3 className="text-xl font-bold mb-2">Inspire-se em templates visuais modernos:</h3>
        <ul className="flex flex-wrap justify-center gap-6 text-cyan-400 underline">
          <li><a href="https://github.com/denniskigen/animated-portfolio" target="_blank" rel="noopener noreferrer">Animated Portfolio (Dennis Kigen)</a></li>
          <li><a href="https://github.com/TimurKiyivinski/portfolio" target="_blank" rel="noopener noreferrer">Futuristic Portfolio (TimurKiyivinski)</a></li>
          <li><a href="https://github.com/ixartz/Next-js-Boilerplate" target="_blank" rel="noopener noreferrer">Next.js Futuristic Boilerplate</a></li>
        </ul>
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
