import React, { useState } from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', farm_name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/register', form);
      alert('Conta criada com sucesso. Faça login com seu e-mail e senha.');
      navigate('/login');
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400 && err.response.data && err.response.data.detail === 'E-mail já cadastrado') {
          setError('Este e-mail já está cadastrado. Clique em "Entrar" e use esse e-mail e senha.');
        } else {
          setError('Erro ao cadastrar: ' + (err.response.data?.detail || 'verifique os dados.'));
        }
      } else {
        setError('Erro de conexão com o servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={{ margin: 0, color: '#2e7d32' }}>Criar Conta</h1>
        <p style={{ margin: '6px 0 20px 0', color: '#6d4c41' }}>Configure sua fazenda</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="text"
            placeholder="Seu nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={input}
          />
          <input
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={input}
          />
          <input
            type="text"
            placeholder="Nome da fazenda"
            value={form.farm_name}
            onChange={(e) => setForm({ ...form, farm_name: e.target.value })}
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
            {loading ? 'Enviando...' : 'Cadastrar'}
          </button>
        </form>
        <div style={{ marginTop: 12, fontSize: 12, color: '#777' }}>
          Já tem conta? <span style={{ color: '#2e7d32', cursor: 'pointer' }} onClick={() => navigate('/login')}>Entrar</span>
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
  width: 380,
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

export default Register;
