import './App.css'
import { Routes, Route } from 'react-router-dom'
import Homepage from './pages/home/Homepage';
import Itens from './pages/itens/Itens';
import Doacoes from './pages/doacao/Doacao';
import Doadores from './pages/doadores/Doadores';
import Entregas from './pages/entregas/Entregas';
import Eventos from './pages/eventos/Eventos';
import Receptores from './pages/receptores/Receptores';
import Header from './components/layout/Header';
import Voluntarios from './pages/voluntarios/Voluntarios';


function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          {/* 2. Esta é a rota que define sua página principal */}
          <Route path="/" element={<Homepage />} />
          <Route path="/itens" element={<Itens />} />
          <Route path="/doacoes" element={<Doacoes />} />
          <Route path="/doadores" element={<Doadores />} />
          <Route path="/entregas" element={<Entregas />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/receptores" element={<Receptores />} />
          <Route path="/voluntarios" element={<Voluntarios />} />
          {/* Adicione outras rotas aqui conforme for criando as páginas */}
        </Routes>
      </main>
    </div>
  )
}

export default App
