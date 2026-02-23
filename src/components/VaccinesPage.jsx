import React, { useEffect, useState } from 'react';
import api from '../api/client';

const VaccinesPage = () => {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ animal_id: '', vaccine_name: '', date_administered: '', next_due_date: '', notes: '' });

  const fetchData = async () => {
    try {
      const res = await api.get('/vaccines');
      setRecords(res.data);
    } catch (err) {
      console.error('Erro ao buscar vacinas', err);
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
      await api.post('/vaccines', {
        animal_id: parseInt(form.animal_id),
        vaccine_name: form.vaccine_name,
        date_administered: form.date_administered ? new Date(form.date_administered).toISOString() : undefined,
        next_due_date: form.next_due_date ? new Date(form.next_due_date).toISOString() : undefined,
        notes: form.notes || undefined,
      });
      setForm({ animal_id: '', vaccine_name: '', date_administered: '', next_due_date: '', notes: '' });
      fetchData();
    } catch (err) {
      console.error('Erro ao salvar vacina', err);
      alert('Erro ao salvar vacina');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remover este registro de vacina?')) return;
    try {
      await api.delete(`/vaccines/${id}`);
      fetchData();
    } catch (err) {
      console.error('Erro ao remover vacina', err);
      alert('Erro ao remover vacina');
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
      <h1>Vacinas</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        <div style={cardStyle}>
          <h2>Novo Registro</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>ID do Animal</label>
              <input
                type="number"
                name="animal_id"
                value={form.animal_id}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Vacina</label>
              <input
                type="text"
                name="vaccine_name"
                value={form.vaccine_name}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Aplicada em</label>
              <input
                type="date"
                name="date_administered"
                value={form.date_administered}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Próxima dose</label>
              <input
                type="date"
                name="next_due_date"
                value={form.next_due_date}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Observações</label>
              <input
                type="text"
                name="notes"
                value={form.notes}
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
          <h2>Registros</h2>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Animal</th>
                  <th style={thStyle}>Vacina</th>
                  <th style={thStyle}>Aplicada em</th>
                  <th style={thStyle}>Próxima dose</th>
                  <th style={thStyle}>Obs.</th>
                  <th style={thStyle}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id}>
                    <td style={tdStyle}>{r.id}</td>
                    <td style={tdStyle}>{r.animal_id}</td>
                    <td style={tdStyle}>{r.vaccine_name}</td>
                    <td style={tdStyle}>{r.date_administered ? new Date(r.date_administered).toLocaleDateString() : '-'}</td>
                    <td style={tdStyle}>{r.next_due_date ? new Date(r.next_due_date).toLocaleDateString() : '-'}</td>
                    <td style={tdStyle}>{r.notes || '-'}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleDelete(r.id)}
                        style={{ padding: '4px 8px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr>
                    <td colSpan="7" style={tdStyle}>Nenhum registro de vacina.</td>
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

export default VaccinesPage;

