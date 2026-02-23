import React from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import EditAnimal from './components/EditAnimal';
import FinancePage from './components/FinancePage';
import VaccinesPage from './components/VaccinesPage';
import AnimalsPage from './components/AnimalsPage';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import UsersPage from './components/UsersPage';

function RequireAuth({ children }) {
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (!token && location.pathname !== '/login' && location.pathname !== '/register') {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };
  return (
    <div className="App">
      <div style={{ backgroundColor: '#2e7d32', padding: '12px 20px', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 'bold' }}>Cattle Counter</div>
          <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Início</Link>
            <Link to="/monitoramento" style={{ color: 'white', textDecoration: 'none' }}>Monitoramento</Link>
            <Link to="/usuarios" style={{ color: 'white', textDecoration: 'none' }}>Usuários</Link>
            <Link to="/animais" style={{ color: 'white', textDecoration: 'none' }}>Animais</Link>
            <Link to="/financeiro" style={{ color: 'white', textDecoration: 'none' }}>Financeiro</Link>
            <Link to="/vacinas" style={{ color: 'white', textDecoration: 'none' }}>Vacinas</Link>
            {token && (
              <button
                onClick={handleLogout}
                style={{
                  marginLeft: 12,
                  padding: '6px 10px',
                  background: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                Sair
              </button>
            )}
          </nav>
        </div>
      </div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/monitoramento" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/usuarios" element={<RequireAuth><UsersPage /></RequireAuth>} />
        <Route path="/animais" element={<RequireAuth><AnimalsPage /></RequireAuth>} />
        <Route path="/financeiro" element={<RequireAuth><FinancePage /></RequireAuth>} />
        <Route path="/vacinas" element={<RequireAuth><VaccinesPage /></RequireAuth>} />
        <Route path="/animal/:id" element={<RequireAuth><EditAnimal /></RequireAuth>} />
      </Routes>
    </div>
  );
}

export default App;
