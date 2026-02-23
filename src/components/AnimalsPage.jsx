import React, { useEffect, useState } from 'react';
import api, { baseURL } from '../api/client';
import { useNavigate } from 'react-router-dom';

const AnimalsPage = () => {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchAnimals = async () => {
    try {
      const skip = (page - 1) * limit;
      const res = await api.get(`/animals?limit=${limit}&skip=${skip}`);
      setAnimals(res.data);
    } catch (err) {
      console.error('Erro ao buscar animais', err);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, [page]);

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };
  const thStyle = { padding: '8px', borderBottom: '1px solid #ddd', fontSize: '0.9em' };
  const tdStyle = { padding: '8px', borderBottom: '1px solid #f0f0f0', fontSize: '0.9em' };
  const buttonStyle = { padding: '6px 10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Animais</h1>
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Foto</th>
                <th style={thStyle}>Nome</th>
                <th style={thStyle}>Total Passagens</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Visto por último</th>
                <th style={thStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {animals.map((a) => (
                <tr key={a.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={tdStyle}>#{a.id}</td>
                  <td style={tdStyle}>
                    {a.image_path ? (
                      <img
                        src={`${baseURL.replace('/api/v1', '')}/static/${a.image_path}`}
                        alt="Animal"
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : '-'}
                  </td>
                  <td style={tdStyle}>{a.name || '-'}</td>
                  <td style={tdStyle}>{a.total_passes}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: 'white',
                        backgroundColor:
                          a.status === 'active' ? 'green' : a.status === 'warning' ? 'orange' : 'gray',
                      }}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td style={tdStyle}>{a.last_seen ? new Date(a.last_seen).toLocaleString() : '-'}</td>
                  <td style={tdStyle}>
                    <button style={buttonStyle} onClick={() => navigate(`/animal/${a.id}`)}>Editar</button>
                  </td>
                </tr>
              ))}
              {animals.length === 0 && (
                <tr>
                  <td colSpan="7" style={tdStyle}>Nenhum animal encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ ...buttonStyle, backgroundColor: page === 1 ? '#ccc' : '#3498db' }}
          >
            Anterior
          </button>
          <span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>Página {page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={animals.length < limit}
            style={{ ...buttonStyle, backgroundColor: animals.length < limit ? '#ccc' : '#3498db' }}
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimalsPage;

