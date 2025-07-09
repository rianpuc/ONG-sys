import './Homepage.css'; // Vamos criar um CSS para estilizar a página
import { Card } from '../../components/card/Card';

const Homepage = () => {
    return (
        <>
            <title>Home</title>
            <div>
                <section className="bg-gray-400 p-4 h-max flex flex-col flex-wrap items-center justify-between">
                    <h1 className='text-2xl'>Bem-vindo ao Sistema de Gestão da ONG</h1>
                    <p>Gerencie doações, doadores, entregas, eventos, itens, receptores e voluntários de forma centralizada e eficiente.</p>
                </section>

                <section className="">
                    <h2 className='text-2xl m-10 text-center block'>Acesso Rápido</h2>
                    <div className="card-container">
                        {/* Cada card é um link para outra página */}
                        <Card to="/doacoes">
                            <h3 className='card-title'>Controle de Doações</h3>
                            <p className='grow'>Registre e gerencie todas as doações recebidas pela ONG.</p>
                        </Card>
                        <Card to="/doadores">
                            <h3 className='card-title'>Gerenciar Doadores</h3>
                            <p>Visualize, adicione e edite informações dos doadores cadastrados.</p>
                        </Card>
                        <Card to="/entregas">
                            <h3 className='card-title'>Registrar Entregas</h3>
                            <p className='grow'>Acompanhe a distribuição de doações para os receptores.</p>
                        </Card>
                        <Card to="/eventos">
                            <h3 className='card-title'>Próximos Eventos</h3>
                            <p className='grow'>Organize e divulgue os eventos de arrecadação e distribuição.</p>
                        </Card>
                        <Card to="/itens">
                            <h3 className='card-title'>Controle de Itens</h3>
                            <p className='grow'>Monitore o estoque de itens doados e que serão distribuídos.</p>
                        </Card>
                        <Card to="/receptores">
                            <h3 className='card-title'>Gerenciar Receptores</h3>
                            <p className='grow'>Mantenha o cadastro de pessoas e famílias que recebem ajuda.</p>
                        </Card>
                        <Card to="/voluntarios">
                            <h3 className='card-title'>Gerenciar Voluntários</h3>
                            <p className='grow'>Cadastre e organize os voluntários e suas atividades na ONG.</p>
                        </Card>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Homepage;