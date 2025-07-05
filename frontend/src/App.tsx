import './App.css'
import { Routes, Route } from 'react-router-dom'
import Homepage from './pages/home/Homepage';
import Itens from './pages/itens/Itens';
import Doacao from './pages/doacao/Doacao';
import Header from './components/layout/Header';


function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          {/* 2. Esta é a rota que define sua página principal */}
          <Route path="/" element={<Homepage />} />
          <Route path="/itens" element={<Itens />} />
          <Route path="/doacoes" element={<Doacao />} />
          {/* Adicione outras rotas aqui conforme for criando as páginas */}
        </Routes>
      </main>
    </div>
  )
}

export default App
