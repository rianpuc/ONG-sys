import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header';
import Homepage from './pages/home/Homepage';
import DoacaoPage from './pages/doacao/DoacaoPage';
import DoadoresPage from './pages/doadores/DoadoresPage';
import EntregasPage from './pages/entregas/EntregasPage';
import EventosPage from './pages/eventos/EventosPage';
import ItensPage from './pages/itens/ItensPage';
import ReceptoresPage from './pages/receptores/ReceptoresPage';
import VoluntariosPage from './pages/voluntarios/VoluntariosPage';


function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/doacoes" element={<DoacaoPage />} />
          <Route path="/doadores" element={<DoadoresPage />} />
          <Route path="/entregas" element={<EntregasPage />} />
          <Route path="/eventos" element={<EventosPage />} />
          <Route path="/itens" element={<ItensPage />} />
          <Route path="/receptores" element={<ReceptoresPage />} />
          <Route path="/voluntarios" element={<VoluntariosPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;
