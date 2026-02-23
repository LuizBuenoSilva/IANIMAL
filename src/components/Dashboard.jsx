import React, { useEffect, useState } from 'react';
import api, { baseURL } from '../api/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Camera Form State
  const [showAddCamera, setShowAddCamera] = useState(false);
  const [newCamera, setNewCamera] = useState({ name: '', source: '' });

  const fetchStats = async () => {
    try {
      const response = await api.get('/stats');
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchCameras = async () => {
    try {
      const response = await api.get('/cameras');
      setCameras(response.data);
    } catch (error) {
      console.error("Error fetching cameras:", error);
    }
  };

  const fetchAnimals = async () => {
    try {
      const skip = (page - 1) * limit;
      const response = await api.get(`/animals?limit=${limit}&skip=${skip}`);
      setAnimals(response.data);
    } catch (error) {
      console.error("Error fetching animals:", error);
    }
  };

  const handleAddCamera = async (e) => {
    e.preventDefault();
    try {
      await api.post('/cameras', newCamera);
      setNewCamera({ name: '', source: '' });
      setShowAddCamera(false);
      fetchCameras();
    } catch (error) {
      alert("Erro ao adicionar câmera");
    }
  };

  const handleDeleteCamera = async (id) => {
    if (!window.confirm("Tem certeza que deseja remover esta câmera?")) return;
    try {
      await api.delete(`/cameras/${id}`);
      fetchCameras();
    } catch (error) {
      alert("Erro ao remover câmera");
    }
  };

  useEffect(() => {
    fetchStats();
    fetchAnimals();
    fetchCameras();
    setLoading(false);

    // Poll every 1 second for faster updates
    const interval = setInterval(() => {
      fetchStats();
      fetchAnimals();
      // Don't poll cameras too often, they don't change much
    }, 1000);

    return () => clearInterval(interval);
  }, [page]); // Re-run when page changes

  if (loading) return <div style={{padding: 20}}>Carregando painel...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>🐮 Painel de Controle IA Gado</h1>
        <button 
            onClick={() => setShowAddCamera(!showAddCamera)}
            style={{ ...buttonStyle, backgroundColor: '#3498db' }}
        >
            {showAddCamera ? 'Cancelar' : '+ Adicionar Câmera'}
        </button>
      </div>
      
      {/* Add Camera Form */}
      {showAddCamera && (
        <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3>Adicionar Nova Câmera</h3>
          <form onSubmit={handleAddCamera} style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <label>Nome da Câmera</label>
              <input 
                type="text" 
                value={newCamera.name} 
                onChange={(e) => setNewCamera({...newCamera, name: e.target.value})}
                placeholder="Ex: Câmera Curral 1"
                style={inputStyle}
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 2 }}>
              <label>Endereço / IP (ou "0" para webcam)</label>
              <input 
                type="text" 
                value={newCamera.source} 
                onChange={(e) => setNewCamera({...newCamera, source: e.target.value})}
                placeholder="Ex: http://192.168.1.5:8080/video ou 0"
                style={inputStyle}
                required
              />
              <small style={{ color: '#666', marginTop: '5px' }}>
                Dica: Para apps como "IP Webcam", adicione <b>/video</b> ao final. <br/>
                Ex: <code>http://192.168.15.6:8080/video</code>
              </small>
            </div>
            <button type="submit" style={buttonStyle}>Salvar</button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={cardStyle}>
          <h3>Animais Hoje</h3>
          <p style={numberStyle}>{stats?.total_animals_today || 0}</p>
        </div>
        <div style={cardStyle}>
          <h3>Total Histórico</h3>
          <p style={numberStyle}>{stats?.total_animals_all_time || 0}</p>
        </div>
        <div style={cardStyle}>
          <h3>Câmeras Ativas</h3>
          <p style={numberStyle}>{cameras.length}</p>
        </div>
        <div style={cardStyle}>
          <h3>Entradas Hoje</h3>
          <p style={numberStyle} title="Contagem de 'in' no dia">{stats?.entries_today || 0}</p>
        </div>
        <div style={cardStyle}>
          <h3>Saídas Hoje</h3>
          <p style={numberStyle} title="Contagem de 'out' no dia">{stats?.exits_today || 0}</p>
        </div>
        <div style={cardStyle}>
          <h3>Saldo (R$)</h3>
          <p
            style={{
              ...numberStyle,
              color: ((stats && typeof stats.balance === 'number' ? stats.balance : 0) >= 0) ? '#27ae60' : '#e74c3c'
            }}
          >
            {(() => {
              const balance = stats && typeof stats.balance === 'number' ? stats.balance : 0;
              return balance.toFixed(2);
            })()}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Live Feeds Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cameras.map(camera => (
                <div key={camera.id} style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h2>🎥 {camera.name}</h2>
                        <button 
                            onClick={() => handleDeleteCamera(camera.id)}
                            style={{ ...buttonStyle, backgroundColor: '#e74c3c', padding: '5px 10px', fontSize: '0.8em' }}
                        >
                            Remover
                        </button>
                    </div>
                    <div style={{ width: '100%', height: '400px', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                        <img 
                        src={`${baseURL}/video_feed/${camera.id}`} 
                        alt={`Live Stream ${camera.name}`}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={(e) => {e.target.style.display='none'; e.target.parentNode.innerHTML='<p style="color:white;text-align:center">Conectando...<br/><small>Verifique se o IP está correto e o servidor da câmera iniciado.</small></p>'}}
                        />
                        <div style={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', padding: '5px', borderRadius: '4px', fontSize: '0.8em' }}>
                            {camera.source}
                        </div>
                    </div>
                </div>
            ))}
            
            {cameras.length === 0 && (
                <div style={cardStyle}>
                    <h2>Nenhuma Câmera Ativa</h2>
                    <p>Adicione uma câmera para começar o monitoramento.</p>
                </div>
            )}
        </div>

        {/* Recent Activity List */}
        <div style={{...cardStyle, height: 'fit-content'}}>
          <h2>Passagens Recentes</h2>
          <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '5px' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {stats?.last_passages?.map((passage) => (
                <li key={passage.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                  <strong>{passage.animal?.name || `Animal #${passage.animal_id}`}</strong>
                  <br />
                  <span style={{ fontSize: '0.8em', color: '#666' }}>
                    {new Date(passage.timestamp).toLocaleString()}
                  </span>
                  <span style={{ float: 'right', color: passage.direction === 'in' ? 'green' : 'blue' }}>
                    {passage.direction?.toUpperCase()}
                  </span>
                </li>
              ))}
              {(!stats?.last_passages || stats.last_passages.length === 0) && <p>Nenhuma atividade recente.</p>}
            </ul>
          </div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div style={cardStyle}>
          <h2>Status dos Animais</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Ativos', value: stats?.active_count || 0 },
                    { name: 'Vendidos', value: stats?.sold_count || 0 },
                    { name: 'Abatidos', value: stats?.slaughtered_count || 0 },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  <Cell fill="#27ae60" />
                  <Cell fill="#3498db" />
                  <Cell fill="#e74c3c" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={cardStyle}>
          <h2>Resumo</h2>
          <p>Ativos: {stats?.active_count || 0}</p>
          <p>Vendidos: {stats?.sold_count || 0}</p>
          <p>Abatidos: {stats?.slaughtered_count || 0}</p>
        </div>
      </div>

      {/* Animals List Table */}
      <div style={{ marginTop: '40px' }}>
        <h2>📋 Registro de Animais</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', backgroundColor: 'white' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Foto</th>
                <th style={thStyle}>Nome</th>
                <th style={thStyle}>Total Passagens</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Visto por último</th>
                <th style={thStyle}>Cartão</th>
              </tr>
            </thead>
            <tbody>
              {animals.map((animal) => (
                <tr key={animal.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={tdStyle}>#{animal.id}</td>
                  <td style={tdStyle}>
                    {animal.image_path ? (
                        <img src={`${baseURL.replace('/api/v1', '')}/static/${animal.image_path}`} alt="Animal" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : '-'}
                  </td>
                  <td style={tdStyle}>{animal.name || '-'}</td>
                  <td style={tdStyle}>{animal.total_passes}</td>
                  <td style={tdStyle}>
                    <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        backgroundColor: animal.status === 'active' ? '#d4edda' : '#f8d7da',
                        color: animal.status === 'active' ? '#155724' : '#721c24',
                        fontSize: '0.9em'
                    }}>
                        {animal.status === 'active' ? 'Ativo' : 'Atenção'}
                    </span>
                  </td>
                  <td style={tdStyle}>{new Date(animal.last_seen).toLocaleString()}</td>
                  <td style={tdStyle}>
                    {animal.qr_code_path && (
                        <a href={`${baseURL.replace('/api/v1', '')}/static/${animal.qr_code_path}`} target="_blank" rel="noopener noreferrer">
                            Ver Cartão
                        </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px', alignItems: 'center' }}>
            <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ ...buttonStyle, backgroundColor: page === 1 ? '#ccc' : '#3498db' }}
            >
                Anterior
            </button>
            <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Página {page}</span>
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

const cardStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const numberStyle = {
  fontSize: '2.5em',
  fontWeight: 'bold',
  color: '#3498db',
  margin: '10px 0 0 0',
};

const thStyle = {
  padding: '12px',
  fontWeight: '600',
  color: '#2c3e50',
};

const tdStyle = {
  padding: '12px',
  color: '#555',
};

const inputStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px'
};

const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
};

export default Dashboard;
