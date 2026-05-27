import AulasList from './Components/AulasList/AulasList';
import SimuladorAsignacion from './pages/SimuladorAsignacion/SimuladorAsignacion';
import Cronograma from '/src/pages/Cronograma/Cronograma';
import MateriasList from './pages/MateriasList/MateriasList';
import ComisionesList from './pages/ComisionesList/ComisionesList';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import DocentesList from './pages/DocentesList/DocentesList';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/aulas" element={<AulasList />} />
          <Route path="/materias" element={<MateriasList />} />
          <Route path="/comisiones" element={<ComisionesList />} />
          <Route path="/simulador" element={<SimuladorAsignacion />} />
          <Route path="/cronograma" element={<Cronograma />} />
          <Route path="/docentes" element={<DocentesList />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;