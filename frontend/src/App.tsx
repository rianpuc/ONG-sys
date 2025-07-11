import { Routes, Route, useLocation } from 'react-router-dom'
import Homepage from './pages/home/Homepage';
import DoacaoPage from './pages/doacao/DoacaoPage';
import DoadoresPage from './pages/doadores/DoadoresPage';
import EntregasPage from './pages/entregas/EntregasPage';
import EventosPage from './pages/eventos/EventosPage';
import ItensPage from './pages/itens/ItensPage';
import ReceptoresPage from './pages/receptores/ReceptoresPage';
import VoluntariosPage from './pages/voluntarios/VoluntariosPage';
import Sidebar from './components/layout/Sidebar';
import SidebarItem from './components/layout/SidebarItem';
import HomeIcon from './components/icons/HomeIcon';
import DoacaoIcon from './components/icons/DoacaoIcon';
import DoadoresIcon from './components/icons/DoadoresIcon';
import EntregasIcon from './components/icons/EntregasIcon';
import EventosIcon from './components/icons/EventosIcon';
import ItensIcon from './components/icons/ItensIcon';
import ReceptoresIcon from './components/icons/ReceptoresIcon';
import VoluntariosIcon from './components/icons/VoluntariosIcon';
import 'swiper/css';
import 'swiper/css/navigation';

function App() {
  const location = useLocation();
  const backgroundClass = location.pathname === '/' ? 'bg-home' : 'bg';
  return (
    <div className={`flex overflow-hidden overflow-x-hidden overflow-y-hidden ${backgroundClass}`}>
      <Sidebar>
        <SidebarItem icon={<HomeIcon size={24} />} text="Início" href="/" />
        <SidebarItem icon={<DoacaoIcon size={24} />} text="Doações" href="/doacoes" />
        <SidebarItem icon={<DoadoresIcon size={24} />} text="Doadores" href="/doadores" />
        <SidebarItem icon={<EntregasIcon size={24} />} text="Entregas" href="/entregas" />
        <SidebarItem icon={<EventosIcon size={24} />} text="Eventos" href="/eventos" />
        <SidebarItem icon={<ItensIcon size={24} />} text="Itens" href="/itens" />
        <SidebarItem icon={<ReceptoresIcon size={24} />} text="Receptores" href="/receptores" />
        <SidebarItem icon={<VoluntariosIcon size={24} />} text="Voluntários" href="/voluntarios" />
      </Sidebar>
      <main className="flex-1 p-6 overflow-hidden overflow-x-hidden overflow-y-hidden">
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
