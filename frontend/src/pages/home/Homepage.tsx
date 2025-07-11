import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../../components/card/Card';
import DoacaoIcon from '../../components/icons/DoacaoIcon';
import DoadoresIcon from '../../components/icons/DoadoresIcon';
import EntregasIcon from '../../components/icons/EntregasIcon';
import EventosIcon from '../../components/icons/EventosIcon';
import ItensIcon from '../../components/icons/ItensIcon';
import ReceptoresIcon from '../../components/icons/ReceptoresIcon';
import VoluntariosIcon from '../../components/icons/VoluntariosIcon';
import HeroCard from '../../components/layout/HeroCard';

const cardsData = [
    { to: "/doacoes", title: 'Controle de Doações', icon: <DoacaoIcon size={48} />, description: 'Registre e gerencie todas as doações recebidas pela ONG.' },
    { to: "/doadores", title: 'Gerenciar Doadores', icon: <DoadoresIcon size={48} />, description: 'Visualize, adicione e edite informações dos doadores cadastrados.' },
    { to: "/entregas", title: 'Registrar Entregas', icon: <EntregasIcon size={48} />, description: 'Acompanhe a distribuição de doações para os receptores.' },
    { to: "/eventos", title: 'Próximos Eventos', icon: <EventosIcon size={48} />, description: 'Organize e divulgue os eventos de arrecadação e distribuição.' },
    { to: "/itens", title: 'Controle de Itens', icon: <ItensIcon size={48} />, description: 'Monitore o estoque de itens doados e que serão distribuídos.' },
    { to: "/receptores", title: 'Gerenciar Receptores', icon: <ReceptoresIcon size={48} />, description: 'Mantenha o cadastro de pessoas e famílias que recebem ajuda.' },
    { to: "/voluntarios", title: 'Gerenciar Voluntários', icon: <VoluntariosIcon size={48} />, description: 'Cadastre e organize os voluntários e suas atividades na ONG.' }
];

const Homepage = () => {
    return (
        <>
            <title>Home</title>
            <div className='w-full h-full flex flex-col items-center justify-center gap-12'>
                <div className="w-full max-w-7xl">
                    <HeroCard></HeroCard>
                </div>

                <div className="w-full max-w-7xl">
                    <div className="relative">
                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={100}
                            slidesPerView={3}
                            loop={true}
                            navigation={{
                                nextEl: '.swiper-button-next-custom',
                                prevEl: '.swiper-button-prev-custom',
                            }}
                            breakpoints={{
                                320: { slidesPerView: 1, spaceBetween: 10 },
                                768: { slidesPerView: 2, spaceBetween: 20 },
                                1024: { slidesPerView: 3, spaceBetween: 30 },
                            }}
                        >
                            {cardsData.map((cardInfo) => (
                                <SwiperSlide className='h-auto py-10' key={cardInfo.to}>
                                    <Card {...cardInfo} className="h-full px-10" />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div className="swiper-button-prev-custom absolute top-1/2 -translate-y-1/2 left-0 -translate-x-16 z-10 p-2 bg-gray-800/50 hover:bg-gray-700/70 rounded-full cursor-pointer">
                            <ChevronLeft size={32} />
                        </div>
                        <div className="swiper-button-next-custom absolute top-1/2 -translate-y-1/2 right-0 translate-x-16 z-10 p-2 bg-gray-800/50 hover:bg-gray-700/70 rounded-full cursor-pointer">
                            <ChevronRight size={32} />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Homepage;