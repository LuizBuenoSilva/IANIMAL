import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import EditAnimal from './components/EditAnimal';
import FinancePage from './components/FinancePage';
import VaccinesPage from './components/VaccinesPage';
import AnimalsPage from './components/AnimalsPage';

function App() {
  return (
    <div className="App">
      <div style={{ backgroundColor: '#2c3e50', padding: '10px 20px', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 'bold' }}>Cattle Counter AI</div>
          <nav style={{ display: 'flex', gap: '15px' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Início</Link>
            <Link to="/animais" style={{ color: 'white', textDecoration: 'none' }}>Animais</Link>
            <Link to="/financeiro" style={{ color: 'white', textDecoration: 'none' }}>Financeiro</Link>
            <Link to="/vacinas" style={{ color: 'white', textDecoration: 'none' }}>Vacinas</Link>
          </nav>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/animais" element={<AnimalsPage />} />
        <Route path="/financeiro" element={<FinancePage />} />
        <Route path="/vacinas" element={<VaccinesPage />} />
        <Route path="/animal/:id" element={<EditAnimal />} />
      </Routes>
    </div>
  );
}

export default App;
