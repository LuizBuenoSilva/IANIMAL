import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { baseURL } from '../api/client';

const EditAnimal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [formData, setFormData] = useState({ name: '', breed: '', weight: '' });
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState({ status: '', amount: '' });

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const response = await api.get(`/animals/${id}`);
        setAnimal(response.data);
        setFormData({
          name: response.data.name || '',
          breed: response.data.breed || '',
          weight: response.data.weight || ''
        });
        setStatusData({
          status: response.data.status || 'active',
          amount: ''
        });
      } catch (error) {
        console.error("Error fetching animal:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimal();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/animals/${id}`, formData);
      alert('Animal atualizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error("Error updating animal:", error);
      alert('Erro ao atualizar animal.');
    }
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/animals/${id}/status`, {
        status: statusData.status,
        amount: statusData.status === 'sold' ? parseFloat(statusData.amount || '0') : undefined
      });
      alert('Status atualizado com sucesso!');
      const response = await api.get(`/animals/${id}`);
      setAnimal(response.data);
    } catch (error) {
      console.error("Error updating status:", error);
      alert('Erro ao atualizar status.');
    }
  };

  if (loading) return <div style={{padding: 20}}>Carregando...</div>;
  if (!animal) return <div style={{padding: 20}}>Animal não encontrado.</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c3e50' }}>Editar Animal #{id}</h1>
      
      {animal.image_path && (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <img 
                src={`${baseURL.replace('/api/v1', '')}/static/${animal.image_path}`} 
                alt="Animal" 
                style={{ maxWidth: '100%', borderRadius: '8px', maxHeight: '300px' }}
            />
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nome:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Raça:</label>
          <input
            type="text"
            value={formData.breed}
            onChange={(e) => setFormData({...formData, breed: e.target.value})}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Peso (kg):</label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData({...formData, weight: parseInt(e.target.value)})}
            style={inputStyle}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" style={buttonStyle}>Salvar</button>
            <button type="button" onClick={() => navigate('/')} style={{...buttonStyle, backgroundColor: '#7f8c8d'}}>Cancelar</button>
        </div>
      </form>
      
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ color: '#2c3e50' }}>Status Atual: {animal.status}</h2>
        <form onSubmit={handleStatusSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status</label>
            <select
              value={statusData.status}
              onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
              style={inputStyle}
            >
              <option value="active">Ativo</option>
              <option value="sold">Vendido</option>
              <option value="slaughtered">Abatido</option>
            </select>
          </div>
          {statusData.status === 'sold' && (
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Valor da Venda (R$)</label>
              <input
                type="number"
                step="0.01"
                value={statusData.amount}
                onChange={(e) => setStatusData({ ...statusData, amount: e.target.value })}
                style={inputStyle}
                placeholder="0,00"
              />
            </div>
          )}
          <div>
            <button type="submit" style={{...buttonStyle, backgroundColor: '#27ae60'}}>Atualizar Status</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '16px'
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold'
};

export default EditAnimal;
