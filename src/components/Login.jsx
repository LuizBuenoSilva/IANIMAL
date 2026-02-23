import React, { useState } from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/login', form);
      localStorage.setItem('auth_token', res.data.token);
      navigate('/');
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setError('Credenciais inválidas. Verifique e-mail e senha.');
        } else {
          setError('Erro ao conectar no servidor (' + err.response.status + ').');
        }
      } else {
        setError('Servidor indisponível. Verifique se o programa está rodando.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={{ margin: 0, color: '#2e7d32' }}>Cattle Counter</h1>
        <p style={{ margin: '6px 0 20px 0', color: '#6d4c41' }}>Acesso ao Painel</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={input}
          />
          <input
            type="password"
            placeholder="Senha"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={input}
          />
          {error && <div style={{ color: '#e74c3c', fontSize: 14 }}>{error}</div>}
          <button disabled={loading} type="submit" style={button}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div style={{ marginTop: 12, fontSize: 12, color: '#777' }}>
          Ainda não tem conta? <span style={{ color: '#2e7d32', cursor: 'pointer' }} onClick={() => navigate('/register')}>Cadastre-se</span>
        </div>
      </div>
    </div>
  );
};

const container = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #f1f8e9 0%, #e8f5e9 100%)',
};

const card = {
  width: 360,
  background: 'white',
  padding: 24,
  borderRadius: 12,
  boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
  textAlign: 'center',
  border: '1px solid #c8e6c9',
};

const input = {
  padding: 12,
  borderRadius: 8,
  border: '1px solid #cfd8dc',
  outline: 'none',
  fontSize: 16,
};

const button = {
  padding: 12,
  borderRadius: 8,
  backgroundColor: '#2e7d32',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  fontSize: 16,
  fontWeight: 'bold',
};

export default Login;
