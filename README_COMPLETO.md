# BombRider - Projeto Completo

## Resumo do Projeto

O BombRider é um jogo multiplayer inovador que combina a mecânica clássica do Bomberman com elementos de NFT e um universo pré-histórico. O projeto foi desenvolvido com React, Firebase e inclui uma landing page atrativa, sistema de multiplayer para até 5 jogadores e lógica completa de NFTs.

## Funcionalidades Implementadas

### ✅ Landing Page
- Design responsivo com gradientes e animações
- Seção hero com título impactante
- Estatísticas do jogo (5 jogadores max, 5 personagens, 4 mapas, 100+ NFTs)
- História do jogo e explicação dos NFTs
- Navegação para Multiplayer, Solo e NFTs

### ✅ Sistema Multiplayer
- Lobby para até 5 jogadores
- Seleção de personagens únicos (Aria, Bront, Kiro, Lume, Zunn)
- Cada personagem com elemento, descrição e habilidades especiais
- Sistema de salas com host e convidados
- Status de "pronto" para cada jogador
- Firebase Realtime Database para sincronização em tempo real

### ✅ Sistema de NFTs
- 4 tipos de NFTs: Ovos de Dinossauro, Skins de Rider, Cristais de Poder, Artefatos
- 5 níveis de raridade: Comum, Raro, Épico, Lendário, Mítico
- Sistema de atributos aleatórios para cada NFT
- Interface de inventário com filtros e ordenação
- Sistema de equipar/desequipar NFTs
- Geração de NFTs por recompensas de jogo
- Firebase Firestore para persistência de dados

### ✅ Arquitetura Técnica
- React com React Router para navegação
- Firebase para backend (Realtime Database + Firestore)
- Tailwind CSS para estilização
- Componentes modulares e reutilizáveis
- Serviços organizados para multiplayer e NFTs

## Estrutura do Projeto

```
bombrider/
├── src/
│   ├── pages/
│   │   ├── LandingPage.jsx      # Página inicial com hero e informações
│   │   ├── MultiplayerLobby.jsx # Lobby multiplayer com seleção de personagens
│   │   ├── NFTInventory.jsx     # Inventário de NFTs do jogador
│   │   └── GamePage.jsx         # Página do jogo (existente)
│   ├── services/
│   │   ├── firebase.js          # Configuração do Firebase
│   │   ├── multiplayerService.js # Serviço para multiplayer
│   │   └── nftService.js        # Serviço para NFTs
│   ├── game/                    # Componentes do jogo (existentes)
│   └── App.jsx                  # Roteamento principal
├── package.json
└── README.md
```

## Personagens Disponíveis

1. **Aria** (Air) - Mestre dos ventos, velocidade e agilidade
2. **Bront** (Earth) - Guardião da terra, resistente e poderoso
3. **Kiro** (Fire) - Senhor das chamas, explosões poderosas
4. **Lume** (Ether) - Manipulador da energia etérea, habilidades místicas
5. **Zunn** (Water) - Controlador das águas, adaptável e fluido

## Tipos de NFTs

### Ovos de Dinossauro
- Raridade: Epic
- Espécies: T-Rex, Triceratops, Velociraptor, Brontosaurus, Stegosaurus
- Elementos: Fire, Water, Earth, Air, Lightning

### Skins de Rider
- Raridade: Rare
- Temas: Prehistoric, Futuristic, Elemental, Tribal, Cosmic
- Cores: Red, Blue, Green, Purple, Gold

### Cristais de Poder
- Raridade: Legendary
- Poderes: Bomb Range, Speed Boost, Extra Bomb, Shield, Teleport
- Níveis: 1-5

### Artefatos Antigos
- Raridade: Mythic
- Tipos: Fossil, Weapon, Tool, Ornament, Scroll
- Eras: Triassic, Jurassic, Cretaceous

## Como Executar

1. Instalar dependências:
```bash
cd bombrider
pnpm install
```

2. Iniciar servidor de desenvolvimento:
```bash
pnpm run dev
```

3. Acessar no navegador:
```
http://localhost:5173
```

## Navegação

- `/` - Landing Page
- `/multiplayer` - Lobby Multiplayer
- `/nft` - Inventário de NFTs
- `/game` - Jogo (modo solo)

## Configuração do Firebase

Para usar em produção, substitua as configurações em `src/services/firebase.js` pelas suas credenciais reais do Firebase:

```javascript
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  databaseURL: "https://seu-projeto-default-rtdb.firebaseio.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Próximos Passos

1. Integração com carteiras Web3 para NFTs reais
2. Implementação completa do jogo multiplayer
3. Sistema de marketplace para NFTs
4. Torneios e rankings
5. Integração com blockchain para NFTs verificáveis

## Status do Projeto

✅ **Concluído**: Landing Page, Multiplayer Lobby, Sistema de NFTs
🔄 **Em Desenvolvimento**: Jogo multiplayer funcional
📋 **Planejado**: Integração Web3, Marketplace NFT

O projeto está pronto para testes e desenvolvimento adicional!

