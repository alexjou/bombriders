import { db } from './firebase.js';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot 
} from 'firebase/firestore';

class NFTService {
  constructor() {
    this.userNFTs = [];
    this.listeners = new Map();
  }

  // Tipos de NFTs disponíveis
  getNFTTypes() {
    return {
      DINO_EGG: {
        id: 'dino_egg',
        name: 'Ovo de Dinossauro',
        description: 'Um ovo misterioso que pode conter um dinossauro lendário',
        rarity: 'epic',
        category: 'collectible',
        baseValue: 100,
        attributes: {
          species: ['T-Rex', 'Triceratops', 'Velociraptor', 'Brontosaurus', 'Stegosaurus'],
          element: ['Fire', 'Water', 'Earth', 'Air', 'Lightning'],
          power: [1, 2, 3, 4, 5]
        }
      },
      RIDER_SKIN: {
        id: 'rider_skin',
        name: 'Skin de Rider',
        description: 'Uma aparência única para seu personagem',
        rarity: 'rare',
        category: 'cosmetic',
        baseValue: 50,
        attributes: {
          character: ['Aria', 'Bront', 'Kiro', 'Lume', 'Zunn'],
          theme: ['Prehistoric', 'Futuristic', 'Elemental', 'Tribal', 'Cosmic'],
          color: ['Red', 'Blue', 'Green', 'Purple', 'Gold']
        }
      },
      POWER_CRYSTAL: {
        id: 'power_crystal',
        name: 'Cristal de Poder',
        description: 'Um cristal que concede habilidades especiais',
        rarity: 'legendary',
        category: 'utility',
        baseValue: 200,
        attributes: {
          power: ['Bomb Range', 'Speed Boost', 'Extra Bomb', 'Shield', 'Teleport'],
          level: [1, 2, 3, 4, 5],
          duration: [30, 60, 90, 120, 180] // segundos
        }
      },
      ARTIFACT: {
        id: 'artifact',
        name: 'Artefato Antigo',
        description: 'Um item raro da era pré-histórica',
        rarity: 'mythic',
        category: 'collectible',
        baseValue: 500,
        attributes: {
          type: ['Fossil', 'Weapon', 'Tool', 'Ornament', 'Scroll'],
          age: ['Triassic', 'Jurassic', 'Cretaceous'],
          condition: ['Poor', 'Fair', 'Good', 'Excellent', 'Perfect']
        }
      }
    };
  }

  // Gerar NFT aleatório baseado na raridade
  generateRandomNFT(playerId, type = null, rarity = null) {
    const nftTypes = this.getNFTTypes();
    const typeKeys = Object.keys(nftTypes);
    
    // Se não especificado, escolher tipo aleatório
    if (!type) {
      type = typeKeys[Math.floor(Math.random() * typeKeys.length)];
    }

    const nftTemplate = nftTypes[type];
    if (!nftTemplate) {
      throw new Error('Tipo de NFT inválido');
    }

    // Se não especificado, gerar raridade baseada em probabilidade
    if (!rarity) {
      const rarityRoll = Math.random();
      if (rarityRoll < 0.01) rarity = 'mythic';      // 1%
      else if (rarityRoll < 0.05) rarity = 'legendary'; // 4%
      else if (rarityRoll < 0.15) rarity = 'epic';      // 10%
      else if (rarityRoll < 0.35) rarity = 'rare';      // 20%
      else rarity = 'common';                            // 65%
    }

    // Gerar atributos aleatórios
    const attributes = {};
    Object.keys(nftTemplate.attributes).forEach(attr => {
      const options = nftTemplate.attributes[attr];
      attributes[attr] = options[Math.floor(Math.random() * options.length)];
    });

    // Calcular valor baseado na raridade
    const rarityMultipliers = {
      common: 1,
      rare: 2,
      epic: 5,
      legendary: 10,
      mythic: 25
    };

    const nft = {
      id: `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type,
      name: nftTemplate.name,
      description: nftTemplate.description,
      rarity: rarity,
      category: nftTemplate.category,
      value: Math.floor(nftTemplate.baseValue * rarityMultipliers[rarity]),
      attributes: attributes,
      ownerId: playerId,
      createdAt: Date.now(),
      obtainedFrom: 'game_reward', // game_reward, purchase, trade
      isEquipped: false,
      metadata: {
        image: `/assets/nfts/${type}_${rarity}.png`,
        animation: `/assets/nfts/${type}_${rarity}.gif`,
        external_url: `https://bombrider.game/nft/${this.id}`
      }
    };

    return nft;
  }

  // Salvar NFT no Firestore
  async mintNFT(playerId, nftType = null, rarity = null) {
    try {
      const nft = this.generateRandomNFT(playerId, nftType, rarity);
      
      const nftsCollection = collection(db, 'nfts');
      const docRef = await addDoc(nftsCollection, nft);
      
      nft.firestoreId = docRef.id;
      
      console.log('NFT criado:', nft);
      return nft;
    } catch (error) {
      console.error('Erro ao criar NFT:', error);
      throw error;
    }
  }

  // Obter NFTs do jogador
  async getPlayerNFTs(playerId) {
    try {
      const nftsCollection = collection(db, 'nfts');
      const q = query(
        nftsCollection, 
        where('ownerId', '==', playerId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const nfts = [];
      
      querySnapshot.forEach((doc) => {
        nfts.push({
          firestoreId: doc.id,
          ...doc.data()
        });
      });
      
      this.userNFTs = nfts;
      return nfts;
    } catch (error) {
      console.error('Erro ao obter NFTs do jogador:', error);
      return [];
    }
  }

  // Equipar/desequipar NFT
  async toggleNFTEquipped(nftId, isEquipped) {
    try {
      const nftDoc = doc(db, 'nfts', nftId);
      await updateDoc(nftDoc, {
        isEquipped: isEquipped,
        lastModified: Date.now()
      });
      
      // Atualizar cache local
      const nftIndex = this.userNFTs.findIndex(nft => nft.firestoreId === nftId);
      if (nftIndex !== -1) {
        this.userNFTs[nftIndex].isEquipped = isEquipped;
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao equipar/desequipar NFT:', error);
      return false;
    }
  }

  // Transferir NFT (para futuro sistema de trade)
  async transferNFT(nftId, fromPlayerId, toPlayerId) {
    try {
      const nftDoc = doc(db, 'nfts', nftId);
      const nftSnapshot = await getDoc(nftDoc);
      
      if (!nftSnapshot.exists()) {
        throw new Error('NFT não encontrado');
      }
      
      const nftData = nftSnapshot.data();
      if (nftData.ownerId !== fromPlayerId) {
        throw new Error('Jogador não é o dono do NFT');
      }
      
      await updateDoc(nftDoc, {
        ownerId: toPlayerId,
        previousOwner: fromPlayerId,
        transferredAt: Date.now(),
        isEquipped: false
      });
      
      // Registrar transferência
      const transfersCollection = collection(db, 'nft_transfers');
      await addDoc(transfersCollection, {
        nftId: nftId,
        fromPlayerId: fromPlayerId,
        toPlayerId: toPlayerId,
        transferredAt: Date.now(),
        type: 'trade'
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao transferir NFT:', error);
      throw error;
    }
  }

  // Obter estatísticas de NFTs
  async getNFTStats(playerId) {
    try {
      const nfts = await this.getPlayerNFTs(playerId);
      
      const stats = {
        total: nfts.length,
        byRarity: {},
        byType: {},
        totalValue: 0,
        equipped: 0
      };
      
      nfts.forEach(nft => {
        // Por raridade
        stats.byRarity[nft.rarity] = (stats.byRarity[nft.rarity] || 0) + 1;
        
        // Por tipo
        stats.byType[nft.type] = (stats.byType[nft.type] || 0) + 1;
        
        // Valor total
        stats.totalValue += nft.value;
        
        // Equipados
        if (nft.isEquipped) stats.equipped++;
      });
      
      return stats;
    } catch (error) {
      console.error('Erro ao obter estatísticas de NFT:', error);
      return null;
    }
  }

  // Escutar mudanças nos NFTs do jogador
  onPlayerNFTsUpdate(playerId, callback) {
    const nftsCollection = collection(db, 'nfts');
    const q = query(
      nftsCollection, 
      where('ownerId', '==', playerId),
      orderBy('createdAt', 'desc')
    );
    
    const listenerId = 'nfts_' + playerId + '_' + Date.now();
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const nfts = [];
      querySnapshot.forEach((doc) => {
        nfts.push({
          firestoreId: doc.id,
          ...doc.data()
        });
      });
      
      this.userNFTs = nfts;
      callback(nfts);
    });
    
    this.listeners.set(listenerId, unsubscribe);
    return listenerId;
  }

  // Remover listener
  removeListener(listenerId) {
    const unsubscribe = this.listeners.get(listenerId);
    if (unsubscribe) {
      unsubscribe();
      this.listeners.delete(listenerId);
    }
  }

  // Simular recompensa de NFT por conquista no jogo
  async rewardNFT(playerId, achievement) {
    const rewardTypes = {
      'first_win': { type: 'DINO_EGG', rarity: 'rare' },
      'bomb_master': { type: 'POWER_CRYSTAL', rarity: 'epic' },
      'survivor': { type: 'RIDER_SKIN', rarity: 'rare' },
      'collector': { type: 'ARTIFACT', rarity: 'legendary' },
      'champion': { type: 'ARTIFACT', rarity: 'mythic' }
    };
    
    const reward = rewardTypes[achievement];
    if (!reward) {
      // Recompensa aleatória
      return await this.mintNFT(playerId);
    }
    
    return await this.mintNFT(playerId, reward.type, reward.rarity);
  }

  // Limpar cache local
  clearCache() {
    this.userNFTs = [];
    this.listeners.forEach((unsubscribe) => {
      unsubscribe();
    });
    this.listeners.clear();
  }
}

// Exportar instância singleton
export const nftService = new NFTService();
export default nftService;

