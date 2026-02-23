import React, { useEffect, useState } from 'react';
import api from '../api/client';

const UsersPage = () => {
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'viewer' });
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const meRes = await api.get('/me');
      setMe(meRes.data);
      if (meRes.data.role === 'owner' || meRes.data.role === 'admin') {
        const usersRes = await api.get('/farm/users');
        setUsers(usersRes.data);
      }
    } catch (err) {
      setError('Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (form.password && form.password.trim() !== '') {
        await api.post('/farm/users', form);
      } else {
        await api.post('/farm/invites', { email: form.email, role: form.role, name: form.name });
        alert('Convite criado: o usuário será vinculado ao cadastrar-se com este e-mail.');
      }
      setForm({ name: '', email: '', password: '', role: 'viewer' });
      fetchData();
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.detail || 'Erro ao adicionar usuário.');
      } else {
        setError('Erro de conexão.');
      }
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Carregando usuários...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ color: '#2e7d32' }}>Usuários da Fazenda</h1>
      {me && me.farm && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 18, fontWeight: 'bold' }}>{me.farm.name}</div>
          <div style={{ fontSize: 14, color: '#555' }}>Você é: {me.role}</div>
        </div>
      )}

      {me && me.role === 'owner' && (
        <div style={{ marginBottom: 30, padding: 20, background: '#f1f8e9', borderRadius: 8, border: '1px solid #c8e6c9' }}>
          <h2 style={{ marginTop: 0 }}>Adicionar usuário</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              style={input}
              type="text"
              placeholder="Nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              style={input}
              type="email"
              placeholder="E-mail"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              style={input}
              type="password"
              placeholder="Senha inicial"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <div style={{ fontSize: 12, color: '#607d8b' }}>
              Dica: deixe a senha em branco para enviar um convite por e-mail. Quando a pessoa se cadastrar, entrará direto na sua fazenda.
            </div>
            <select
              style={input}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="viewer">Visualizador</option>
              <option value="admin">Administrador</option>
            </select>
            {error && <div style={{ color: '#e74c3c', fontSize: 14 }}>{error}</div>}
            <button type="submit" style={button}>Adicionar</button>
          </form>
        </div>
      )}

      <div style={{ padding: 20, background: 'white', borderRadius: 8, border: '1px solid #e0e0e0' }}>
        <h2 style={{ marginTop: 0 }}>Lista de usuários</h2>
        {users.length === 0 ? (
          <div style={{ fontSize: 14, color: '#777' }}>Nenhum usuário cadastrado ainda.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Nome</th>
                <th style={th}>E-mail</th>
                <th style={th}>Papel</th>
              </tr>
            </thead>
            <tbody>
              {users.map((fu) => (
                <tr key={fu.id}>
                  <td style={td}>{fu.user.name}</td>
                  <td style={td}>{fu.user.email}</td>
                  <td style={td}>{fu.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const input = {
  padding: 10,
  borderRadius: 6,
  border: '1px solid #cfd8dc',
  fontSize: 14,
};

const button = {
  padding: 10,
  borderRadius: 6,
  border: 'none',
  backgroundColor: '#2e7d32',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const th = {
  textAlign: 'left',
  padding: 8,
  borderBottom: '1px solid #e0e0e0',
  fontSize: 14,
};

const td = {
  padding: 8,
  borderBottom: '1px solid #f0f0f0',
  fontSize: 14,
};

export default UsersPage;
