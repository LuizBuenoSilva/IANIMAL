import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import EditAnimal from './components/EditAnimal';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/animal/:id" element={<EditAnimal />} />
      </Routes>
    </div>
  );
}

export default App;
