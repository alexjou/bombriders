import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BombLoadingScreen from './components/BombLoadingScreen';
import GamePage from './pages/GamePage';
import MultiplayerLobby from './pages/MultiplayerLobby';
import NFTInventory from './pages/NFTInventory';
import './App.css';
import HomePage from './pages/HomePage';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <BombLoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/multiplayer" element={<MultiplayerLobby />} />
          <Route path="/nft" element={<NFTInventory />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

