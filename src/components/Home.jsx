import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const meRes = await api.get('/me');
        setMe(meRes.data);
      } catch (e) {
        // ignore; user context pode falhar se o token expirar
      }
      try {
        const statsRes = await api.get('/stats');
        setStats(statsRes.data);
      } catch (e) {
        // mantém placeholders
      }
    };
    load();
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ color: '#2e7d32' }}>Visão geral da fazenda</h1>
      {me && me.farm && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 'bold' }}>{me.farm.name}</div>
          <div style={{ fontSize: 14, color: '#555' }}>Você é: {me.role}</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginBottom: 24 }}>
        <div style={card}>
          <div style={label}>Animais totais</div>
          <div style={number}>{stats?.total_animals_all_time ?? '-'}</div>
        </div>
        <div style={card}>
          <div style={label}>Ativos</div>
          <div style={number}>{stats?.active_count ?? '-'}</div>
        </div>
        <div style={card}>
          <div style={label}>Saldo (R$)</div>
          <div style={{ ...number, color: (stats && stats.balance >= 0) ? '#2e7d32' : '#e53935' }}>
            {stats && typeof stats.balance === 'number' ? stats.balance.toFixed(2) : '-'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <button style={button} onClick={() => navigate('/usuarios')}>Gerenciar usuários</button>
        <button style={buttonOutline} onClick={() => navigate('/monitoramento')}>Ir para monitoramento</button>
      </div>
    </div>
  );
};

const card = {
  background: 'white',
  borderRadius: 8,
  padding: 16,
  border: '1px solid #e0e0e0',
};

const label = {
  fontSize: 14,
  color: '#607d8b',
};

const number = {
  fontSize: 26,
  fontWeight: 'bold',
};

const button = {
  padding: '10px 18px',
  borderRadius: 6,
  border: 'none',
  backgroundColor: '#2e7d32',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const buttonOutline = {
  padding: '10px 18px',
  borderRadius: 6,
  border: '1px solid #2e7d32',
  backgroundColor: 'transparent',
  color: '#2e7d32',
  fontWeight: 'bold',
  cursor: 'pointer',
};

export default Home;
