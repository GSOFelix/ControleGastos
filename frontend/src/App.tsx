import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Pessoas } from './pages/Pessoas';
import { Categorias } from './pages/Categorias';
import { Relatorios } from './pages/Relatorios';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pessoas" element={<Pessoas />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
