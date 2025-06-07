import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import nftService from '../services/nftService';

const NFTCard = ({ nft, onEquip, onView }) => {
  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500',
    mythic: 'from-pink-400 to-red-500'
  };

  const rarityEmojis = {
    common: '⚪',
    rare: '🔵',
    epic: '🟣',
    legendary: '🟡',
    mythic: '🔴'
  };

  const typeEmojis = {
    dino_egg: '🥚',
    rider_skin: '🎨',
    power_crystal: '💎',
    artifact: '🏺'
  };

  return (
    <div className={`
      relative bg-gradient-to-br ${rarityColors[nft.rarity]} 
      rounded-2xl p-6 text-white transform transition-all duration-300 
      hover:scale-105 hover:shadow-2xl cursor-pointer
      ${nft.isEquipped ? 'ring-4 ring-yellow-400' : ''}
    `}>
      {nft.isEquipped && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-yellow-900 font-bold text-sm">✓</span>
        </div>
      )}
      
      <div className="text-center">
        <div className="text-6xl mb-4">
          {typeEmojis[nft.type] || '🎁'}
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">{rarityEmojis[nft.rarity]}</span>
          <h3 className="text-xl font-bold">{nft.name}</h3>
        </div>
        
        <p className="text-sm opacity-90 mb-4 capitalize">
          {nft.rarity} • {nft.category}
        </p>
        
        <p className="text-xs opacity-80 mb-4 line-clamp-2">
          {nft.description}
        </p>
        
        <div className="bg-black bg-opacity-30 rounded-lg p-3 mb-4">
          <div className="text-xs space-y-1">
            {Object.entries(nft.attributes).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize opacity-80">{key}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold">💰 {nft.value}</span>
          <span className="text-xs opacity-80">
            {new Date(nft.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onEquip(nft)}
            className={`
              flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all duration-300
              ${nft.isEquipped 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
              }
            `}
          >
            {nft.isEquipped ? 'Desequipar' : 'Equipar'}
          </button>
          
          <button
            onClick={() => onView(nft)}
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg font-bold text-sm transition-all duration-300"
          >
            👁️
          </button>
        </div>
      </div>
    </div>
  );
};

const NFTInventory = () => {
  const navigate = useNavigate();
  const [nfts, setNfts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [playerId] = useState('demo_player_' + Math.random().toString(36).substr(2, 9));

  // Carregar NFTs do jogador
  const loadPlayerNFTs = async () => {
    setLoading(true);
    try {
      const playerNFTs = await nftService.getPlayerNFTs(playerId);
      const playerStats = await nftService.getNFTStats(playerId);
      
      setNfts(playerNFTs);
      setStats(playerStats);
    } catch (error) {
      console.error('Erro ao carregar NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gerar NFT de demonstração
  const generateDemoNFT = async () => {
    try {
      const newNFT = await nftService.mintNFT(playerId);
      await loadPlayerNFTs();
    } catch (error) {
      console.error('Erro ao gerar NFT:', error);
    }
  };

  // Equipar/desequipar NFT
  const handleEquipNFT = async (nft) => {
    try {
      await nftService.toggleNFTEquipped(nft.firestoreId, !nft.isEquipped);
      await loadPlayerNFTs();
    } catch (error) {
      console.error('Erro ao equipar NFT:', error);
    }
  };

  // Visualizar detalhes do NFT
  const handleViewNFT = (nft) => {
    setSelectedNFT(nft);
  };

  // Filtrar NFTs
  const getFilteredNFTs = () => {
    let filtered = [...nfts];
    
    // Aplicar filtro
    if (filter !== 'all') {
      if (filter === 'equipped') {
        filtered = filtered.filter(nft => nft.isEquipped);
      } else {
        filtered = filtered.filter(nft => nft.rarity === filter || nft.type === filter);
      }
    }
    
    // Aplicar ordenação
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'value_high':
        filtered.sort((a, b) => b.value - a.value);
        break;
      case 'value_low':
        filtered.sort((a, b) => a.value - b.value);
        break;
      case 'rarity':
        const rarityOrder = { mythic: 5, legendary: 4, epic: 3, rare: 2, common: 1 };
        filtered.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]);
        break;
    }
    
    return filtered;
  };

  // Simular recompensas por conquistas
  const simulateReward = async (achievement) => {
    try {
      const rewardNFT = await nftService.rewardNFT(playerId, achievement);
      await loadPlayerNFTs();
      
      // Mostrar notificação de recompensa
      setSelectedNFT(rewardNFT);
    } catch (error) {
      console.error('Erro ao simular recompensa:', error);
    }
  };

  useEffect(() => {
    loadPlayerNFTs();
  }, []);

  const filteredNFTs = getFilteredNFTs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
            Inventário NFT
          </h1>
          <p className="text-xl opacity-90">Seus tesouros digitais do mundo BombRider</p>
        </div>

        {/* Estatísticas */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm opacity-80">Total NFTs</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold">{stats.equipped}</div>
              <div className="text-sm opacity-80">Equipados</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold">💰{stats.totalValue}</div>
              <div className="text-sm opacity-80">Valor Total</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold">{stats.byRarity?.mythic || 0}</div>
              <div className="text-sm opacity-80">🔴 Míticos</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold">{stats.byRarity?.legendary || 0}</div>
              <div className="text-sm opacity-80">🟡 Lendários</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold">{stats.byRarity?.epic || 0}</div>
              <div className="text-sm opacity-80">🟣 Épicos</div>
            </div>
          </div>
        )}

        {/* Controles */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              {/* Filtros */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-2 text-white"
              >
                <option value="all">Todos</option>
                <option value="equipped">Equipados</option>
                <option value="mythic">Míticos</option>
                <option value="legendary">Lendários</option>
                <option value="epic">Épicos</option>
                <option value="rare">Raros</option>
                <option value="common">Comuns</option>
                <option value="dino_egg">Ovos de Dinossauro</option>
                <option value="rider_skin">Skins de Rider</option>
                <option value="power_crystal">Cristais de Poder</option>
                <option value="artifact">Artefatos</option>
              </select>

              {/* Ordenação */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-2 text-white"
              >
                <option value="newest">Mais Recentes</option>
                <option value="oldest">Mais Antigos</option>
                <option value="value_high">Maior Valor</option>
                <option value="value_low">Menor Valor</option>
                <option value="rarity">Por Raridade</option>
              </select>
            </div>

            <div className="flex gap-2">
              {/* Botões de demonstração */}
              <button
                onClick={generateDemoNFT}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-4 py-2 rounded-lg font-bold transition-all duration-300"
              >
                🎁 Gerar NFT
              </button>
              
              <button
                onClick={() => simulateReward('first_win')}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-4 py-2 rounded-lg font-bold transition-all duration-300"
              >
                🏆 Simular Recompensa
              </button>
            </div>
          </div>
        </div>

        {/* Lista de NFTs */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl">Carregando seus NFTs...</p>
          </div>
        ) : filteredNFTs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-xl mb-4">
              {filter === 'all' ? 'Você ainda não possui NFTs' : 'Nenhum NFT encontrado com este filtro'}
            </p>
            <button
              onClick={generateDemoNFT}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-8 py-3 rounded-xl font-bold transition-all duration-300"
            >
              🎁 Obter seu primeiro NFT
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNFTs.map((nft) => (
              <NFTCard
                key={nft.id}
                nft={nft}
                onEquip={handleEquipNFT}
                onView={handleViewNFT}
              />
            ))}
          </div>
        )}

        {/* Modal de detalhes do NFT */}
        {selectedNFT && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="text-center mb-6">
                <div className="text-8xl mb-4">
                  {selectedNFT.type === 'dino_egg' && '🥚'}
                  {selectedNFT.type === 'rider_skin' && '🎨'}
                  {selectedNFT.type === 'power_crystal' && '💎'}
                  {selectedNFT.type === 'artifact' && '🏺'}
                </div>
                <h2 className="text-3xl font-bold mb-2">{selectedNFT.name}</h2>
                <p className="text-lg opacity-90 capitalize">
                  {selectedNFT.rarity} • {selectedNFT.category}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Descrição</h3>
                  <p className="opacity-90">{selectedNFT.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">Atributos</h3>
                  <div className="bg-black bg-opacity-30 rounded-lg p-4">
                    {Object.entries(selectedNFT.attributes).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-white border-opacity-20 last:border-b-0">
                        <span className="capitalize opacity-80">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold mb-1">Valor</h4>
                    <p className="text-2xl">💰 {selectedNFT.value}</p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Obtido em</h4>
                    <p>{new Date(selectedNFT.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleEquipNFT(selectedNFT)}
                    className={`
                      flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-300
                      ${selectedNFT.isEquipped 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-green-500 hover:bg-green-600'
                      }
                    `}
                  >
                    {selectedNFT.isEquipped ? 'Desequipar' : 'Equipar'}
                  </button>
                  
                  <button
                    onClick={() => setSelectedNFT(null)}
                    className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl font-bold transition-all duration-300"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navegação */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/')}
            className="text-white text-opacity-70 hover:text-opacity-100 underline"
          >
            ← Voltar para a Landing Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTInventory;

