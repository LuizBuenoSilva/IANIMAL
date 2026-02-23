import React, { useEffect, useState } from 'react';
import api from '../api/client';

const FinancePage = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ type: 'income', amount: '', description: '' });
  const [summary, setSummary] = useState({ income_total: 0, expense_total: 0, balance: 0 });

  const fetchData = async () => {
    try {
      const [financeRes, statsRes] = await Promise.all([
        api.get('/finance'),
        api.get('/stats'),
      ]);
      setItems(financeRes.data);
      setSummary({
        income_total: statsRes.data.income_total || 0,
        expense_total: statsRes.data.expense_total || 0,
        balance: statsRes.data.balance || 0,
      });
    } catch (err) {
      console.error('Erro ao buscar dados financeiros', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/finance', {
        type: form.type,
        amount: parseFloat(form.amount),
        description: form.description,
      });
      setForm({ type: 'income', amount: '', description: '' });
      fetchData();
    } catch (err) {
      console.error('Erro ao salvar lançamento', err);
      alert('Erro ao salvar lançamento');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remover este lançamento?')) return;
    try {
      await api.delete(`/finance/${id}`);
      fetchData();
    } catch (err) {
      console.error('Erro ao remover lançamento', err);
      alert('Erro ao remover lançamento');
    }
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const thStyle = {
    padding: '8px',
    borderBottom: '1px solid #ddd',
    fontSize: '0.9em',
  };

  const tdStyle = {
    padding: '8px',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '0.9em',
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Controle Financeiro</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={cardStyle}>
          <h3>Entradas (R$)</h3>
          <p style={{ fontSize: '1.8em', fontWeight: 'bold', color: 'green' }}>
            {summary.income_total.toFixed(2)}
          </p>
        </div>
        <div style={cardStyle}>
          <h3>Saídas (R$)</h3>
          <p style={{ fontSize: '1.8em', fontWeight: 'bold', color: 'red' }}>
            {summary.expense_total.toFixed(2)}
          </p>
        </div>
        <div style={cardStyle}>
          <h3>Saldo (R$)</h3>
          <p style={{ fontSize: '1.8em', fontWeight: 'bold', color: summary.balance >= 0 ? 'green' : 'red' }}>
            {summary.balance.toFixed(2)}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        <div style={cardStyle}>
          <h2>Novo Lançamento</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Tipo</label>
              <select name="type" value={form.type} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                <option value="income">Entrada</option>
                <option value="expense">Saída</option>
              </select>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Descrição</label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Salvar
            </button>
          </form>
        </div>

        <div style={cardStyle}>
          <h2>Lançamentos</h2>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Data</th>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Descrição</th>
                  <th style={thStyle}>Valor (R$)</th>
                  <th style={thStyle}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td style={tdStyle}>{new Date(item.timestamp).toLocaleString()}</td>
                    <td style={tdStyle}>{item.type === 'income' ? 'Entrada' : 'Saída'}</td>
                    <td style={tdStyle}>{item.description || '-'}</td>
                    <td style={tdStyle}>{item.amount.toFixed(2)}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{ padding: '4px 8px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan="5" style={tdStyle}>Nenhum lançamento cadastrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancePage;

