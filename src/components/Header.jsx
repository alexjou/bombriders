import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [onlinePlayers, setOnlinePlayers] = useState(Math.floor(Math.random() * 500) + 1500);
  
  // Efeito para simular jogadores online entrando e saindo
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlinePlayers(prev => {
        const change = Math.floor(Math.random() * 10) - 4; // -4 a +5 jogadores
        return Math.max(1200, Math.min(2500, prev + change));
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Efeito para detectar scroll e mudar a aparência do header
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Verificar se a rota atual está ativa
  const isActive = (path) => {
    return location.pathname === path;
  };
  // Array de rotas para o header
  const routes = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/game', label: 'Solo', icon: '▶️' },
    { path: '/multiplayer', label: 'Multiplayer', icon: '👥' },
    { path: '/nft', label: 'NFTs', icon: '💎' },
  ];

  return (
    <>
      {/* Header Tecnológico Fixo */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-black/80 backdrop-blur-md shadow-lg shadow-cyan-500/10' 
            : 'bg-transparent'
        }`}
      >
        {/* Padrão tecnológico de fundo */}
        <div className="absolute inset-0 z-0 opacity-20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full" style={{ 
            backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFCC00' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center group cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center mr-3 relative group-hover:scale-110 transition-all duration-300">
                <span className="text-xl">💣</span>
                {/* Efeito de brilho em torno do logo */}
                <div className="absolute -inset-1 rounded-full bg-yellow-400 opacity-30 blur-sm group-hover:opacity-60 transition-opacity duration-300"></div>
                {/* Efeito de pulse */}
                <div className="absolute -inset-2 rounded-full border border-yellow-500 opacity-0 group-hover:opacity-100 animate-ping"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent group-hover:scale-105 transition-all duration-300">
                  BOMBRIDER
                </h1>
                <div className="text-xs text-gray-400 font-mono">/* VIRTUAL EXPERIENCE */</div>
              </div>
            </div>

            {/* Informações tecnológicas decorativas */}
            <div className="hidden lg:flex items-center text-xs text-cyan-500 font-mono mr-4">
              <div className="flex items-center mr-4">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
                <span>SYS ONLINE</span>
              </div>
              <div>ID: {Math.floor(Math.random() * 9000 + 1000)}-X</div>
              <div className="ml-4 px-2 py-1 bg-black/40 rounded border border-cyan-500/20 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5 animate-pulse"></span>
                <span className="text-flicker">{onlinePlayers}</span>
                <span className="ml-1 text-gray-400">PLAYERS</span>
              </div>
            </div>

            {/* Menu de navegação para desktop */}
            <nav className="hidden md:block">
              <ul className="flex space-x-1.5 items-center">
                {routes.map((route) => (
                  <li key={route.path}>
                    <button 
                      onClick={() => navigate(route.path)}
                      className={`header-button relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 overflow-hidden ${
                        isActive(route.path)
                          ? 'text-black'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {isActive(route.path) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 -z-10"></div>
                      )}
                      <span className="flex items-center">
                        <span className="mr-1.5 text-base">{route.icon}</span>
                        {route.label}
                      </span>
                      {isActive(route.path) && (
                        <>
                          <span className="absolute bottom-0 left-0 h-0.5 w-full bg-yellow-400"></span>
                          <span className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-yellow-400 notification-pulse"></span>
                        </>
                      )}
                    </button>
                  </li>
                ))}
                
                {/* Botão Login com efeito especial */}
                <li className="ml-2">
                  <button className="relative group px-5 py-2 bg-transparent overflow-hidden">
                    <span className="relative z-10 flex items-center text-sm text-cyan-400 font-semibold group-hover:text-white transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      LOGIN
                    </span>
                    <span className="absolute inset-0 border border-cyan-500/50 rounded"></span>
                    <span className="absolute inset-0 bg-cyan-500/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </button>
                </li>
              </ul>
            </nav>

            {/* Botão de menu para mobile */}
            <button 
              className="md:hidden text-white p-2 relative bg-black/50 rounded-md border border-yellow-500/20"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-6 flex flex-col items-end gap-1.5">
                <span className={`block h-0.5 bg-yellow-400 transition-all duration-300 ${mobileMenuOpen ? 'w-6 -rotate-45 translate-y-2' : 'w-6'}`}></span>
                <span className={`block h-0.5 bg-yellow-400 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'w-4'}`}></span>
                <span className={`block h-0.5 bg-yellow-400 transition-all duration-300 ${mobileMenuOpen ? 'w-6 rotate-45 -translate-y-2' : 'w-5'}`}></span>
              </div>
              <div className="absolute -inset-px bg-yellow-400/10 rounded-md blur-sm"></div>
            </button>
          </div>

          {/* Menu de navegação para mobile */}
          <div 
            className={`md:hidden transition-all duration-300 overflow-hidden ${
              mobileMenuOpen ? 'max-h-96 opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-95'
            }`}
            style={{ transformOrigin: 'top' }}
          >
            <div className="py-4 space-y-2 relative">
              {/* Linhas decorativas */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500/20 to-transparent"></div>
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500/10 to-transparent"></div>

              <ul className="space-y-2">
                {routes.map((route) => (
                  <li key={route.path}>
                    <button 
                      onClick={() => {
                        navigate(route.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left pl-10 pr-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center relative overflow-hidden ${
                        isActive(route.path)
                          ? 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-400'
                          : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      {isActive(route.path) && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>
                      )}
                      <span className="mr-3 text-xl">{route.icon}</span>
                      <span>{route.label}</span>
                      {isActive(route.path) && (
                        <span className="ml-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L10 14.586l5.293-5.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </button>
                  </li>
                ))}
                
                {/* Botão de login para mobile */}
                <li className="mt-4 px-6">
                  <button 
                    className="w-full py-3 bg-cyan-500/20 rounded-lg border border-cyan-500/40 text-cyan-400 font-semibold transition-all duration-300 hover:bg-cyan-500/30"
                  >
                    LOGIN / CADASTRO
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Efeito de borda de energia */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-70"></div>

        {/* Efeito de circuito */}
        <div className="h-1 w-full overflow-hidden">
          <div className="h-full w-10 bg-yellow-400 animate-circuit"></div>
        </div>
        
        {/* Efeito de scanline */}
        <div className="scanline hidden md:block"></div>
      </header>

      {/* Espaçador para compensar o header fixo */}
      <div className="h-24"></div>
    </>
  );
};

export default Header;
