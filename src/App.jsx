import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GamePage from './pages/GamePage';
import MultiplayerLobby from './pages/MultiplayerLobby';
import NFTInventory from './pages/NFTInventory';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/multiplayer" element={<MultiplayerLobby />} />
          <Route path="/nft" element={<NFTInventory />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

