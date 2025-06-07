# Instruções para Execução do BombRider

## Requisitos

- Node.js (versão 18 ou superior)
- PNPM (versão 8 ou superior)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/bombrider.git
cd bombrider
```

2. Instale as dependências:
```bash
pnpm install
```

## Execução

1. Inicie o servidor de desenvolvimento:
```bash
pnpm run dev
```

2. Abra o navegador e acesse:
```
http://localhost:5173
```

## Controles do Jogo

- **Movimento**: Setas ou WASD
- **Colocar Bomba**: Espaço
- **Pausar**: ESC ou P

## Personagens

- **Aria** (Ar): Velocidade aumentada
- **Bront** (Terra): Reduz knockback
- **Kiro** (Fogo): Aumenta alcance das bombas
- **Lume** (Éter): Inicia com 2 bombas
- **Zunn** (Água): Atravessa água

## Mapas

- **Floresta Pré-Histórica**: Grama oculta bombas, ovos escondidos
- **Caverna do Eco**: Som reverbera bombas (detona em delay)
- **Deserto Atômico**: Tempestades de areia reduzem visão temporariamente
- **Pântano Mutante**: Slimes e terreno escorregadio
- **Arena do Tempo (PvP)**: Simétrica, cheia de armadilhas e efeitos climáticos

## Inimigos

O jogo agora inclui inimigos com IA que:
- Perseguem o jogador quando estão próximos
- Fogem das bombas quando detectam uma explosão iminente
- Têm diferentes comportamentos baseados no tipo de inimigo

## Depuração

Para desenvolvedores, o jogo inclui ferramentas de depuração:
- Visualização do mapa no console
- Registro do estado do jogo
- Visualização da posição do jogador

Para ativar a depuração, abra o console do navegador (F12) durante o jogo.

## Construção para Produção

Para gerar uma versão de produção:

```bash
pnpm run build
```

Os arquivos serão gerados na pasta `dist` e podem ser servidos por qualquer servidor web estático.

## Tecnologias Utilizadas

- React
- Three.js
- @react-three/fiber
- @react-three/drei
- Zustand
- Tailwind CSS

## Problemas Conhecidos e Soluções

- **Problema**: Câmera seguindo o jogador em vez de ter uma visão fixa
  **Solução**: Implementada câmera isométrica fixa para melhor visualização do jogo

- **Problema**: Controle do personagem não funcionando corretamente
  **Solução**: Corrigido o sistema de controle e implementadas colisões adequadas

- **Problema**: Falta de inimigos no jogo
  **Solução**: Adicionados inimigos com IA que perseguem o jogador e fogem das bombas

## Suporte

Em caso de dúvidas ou problemas, entre em contato pelo email: seu-email@exemplo.com

