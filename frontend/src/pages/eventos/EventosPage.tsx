import useFetch from "../../hooks/useFetch";
import type { Evento } from "../../interface/Evento";
import Table from "../../components/table/Table";
import Button from "../../components/button/Button";
import type { EventoFiltro } from "../../interface/EventoFiltro";
import { useMemo, useState } from "react";
import type { Instituicao } from "../../interface/Instituicao";
import Modal from "../../components/ui/Modal";
import FilterEventosForm from "./FilterEventosForm";
import InsertEventosForm from "./InsertEventosForm";
import UpdateEventosForm from "./UpdateEventosForm";
import useMutation from "../../hooks/useMutation";
import { formatarDataParaExibicao } from "../../utils/Formatters";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SimpleStatsCard from "../../components/card/SimpleStatsCard";
import type { EventoStats } from "../../interface/EventoStats";
import EventoStatsCard from "../../components/card/EventoStatsCard";

const columns = [
    { header: 'Local', accessor: 'Local' as const },
    { header: 'Data', render: (evento: Evento) => formatarDataParaExibicao(evento.Data) },
    { header: 'Organizador', accessor: 'Organizador' as const }
];

const EventosPage = () => {
    /* DECLARACAO DE USESTATES */
    const [filtrosAtivos, setFiltrosAtivos] = useState<EventoFiltro>({});
    const [modalAberto, setModalAberto] = useState<string | null>(null);
    const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
    const [refetchTrigger, setRefetchTrigger] = useState(0);
    const { execute: deletarEvento } = useMutation('/evento', 'DELETE');
    /* CRIANDO QUERYSTRING DINAMICA PRA PROCURAR */
    const queryString = useMemo(() => {
        const activeFilters = Object.fromEntries(
            Object.entries(filtrosAtivos).filter(([_, value]) => value)
        );
        return new URLSearchParams(activeFilters).toString();
    }, [filtrosAtivos]);
    const apiUrl = `/evento?${queryString}&trigger=${refetchTrigger}`;
    /* OBTENDO EVENTOS DO BD */
    const { data: eventos, isLoading, error } = useFetch<Evento[]>(apiUrl);
    /* FETCH DE TODAS INSTITUICOES PARA SELECIONAR NO MODAL */
    const { data: instituicoes } = useFetch<Instituicao[]>('/instituicao');
    /* FETCH DOS STATS */
    const { data: stats, isLoading: isLoadingStats } = useFetch<EventoStats>(`/stats/evento?$trigger=${refetchTrigger}`);
    const handleApplyFiltro = (novosFiltros: EventoFiltro) => {
        setFiltrosAtivos(novosFiltros);
        setModalAberto(null);
    }
    const handleRowClick = (evento: Evento) => {
        if (selectedEvento == evento) {
            setSelectedEvento(null);
        } else {
            setSelectedEvento(evento);
        }
    };
    const handleDeleteClick = async () => {
        try {
            await deletarEvento(null, selectedEvento?.ID_Evento);
            alert("Evento deletado com sucesso!");
            setRefetchTrigger(prev => prev + 1);
            setSelectedEvento(null);
        } catch (err) {
            console.error("Falha ao deletar evento:", err);
        }
    }
    let content;
    if (isLoading) {
        content = <p className="text-center text-gray-400">Carregando eventos...</p>;
    } else if (error) {
        content = <p className="text-center text-red-500">Erro ao buscar dados: {error}</p>;
    } else if (eventos && eventos.length > 0) {
        content = (
            <Table data={eventos} columns={columns} onRowClick={handleRowClick} selectedItem={selectedEvento} />
        )
    } else {
        content = (
            <p className="text-center text-gray-400">Nenhum evento encontrado!</p>
        )
    }
    return (
        <>
            <title>Eventos</title>
            <Modal isOpen={modalAberto === 'inserir'} onClose={() => setModalAberto(null)} title="Adicionar Novo Evento">
                <InsertEventosForm instituicoes={instituicoes || []} onSuccess={() => { setModalAberto(null); setRefetchTrigger(prev => prev + 1); }} />
            </Modal>
            <Modal isOpen={modalAberto === 'procurar'} onClose={() => setModalAberto(null)} title="Buscar Eventos">
                <FilterEventosForm onAplicarFiltros={handleApplyFiltro} instituicoes={instituicoes || []} />
            </Modal>
            <Modal isOpen={modalAberto === 'atualizar'} onClose={() => setModalAberto(null)} title="Atualizar Evento">
                <UpdateEventosForm selectedEvento={selectedEvento!} onSuccess={() => {
                    setModalAberto(null); setRefetchTrigger(prev => prev + 1);
                    setSelectedEvento(null);
                }} instituicoes={instituicoes || []} />
            </Modal>
            <DashboardLayout>
                <div className="grid grid-cols-12 gap-4 rounded-lg inset-shadow-xs inset-shadow-white/25 p-3 bg-gradient-to-t from-basecontainer-100 to-buttonscontainer-100 shadow-[0px_2px_2px] shadow-black/25">
                    <SimpleStatsCard titulo="Eventos" valor={eventos?.length!} isLoading={isLoading} span={4}></SimpleStatsCard>
                    <EventoStatsCard local={stats?.localEvento} dataEvento={stats?.dataEvento} statusEvento={stats?.statusEvento!} diasEvento={stats?.diasEvento} span={4}></EventoStatsCard>
                    <div className={`bg-blue-500 rounded-lg p-6 col-span-4 row-span-4 flex flex-col items-start`}>
                        <span className="text-6xl font-black">{isLoading ? "..." : String(stats?.totalItens).padStart(3, '0')}</span>
                        <h1 className="text-blue-200 font-thin">
                            itens entregues no último evento
                        </h1>
                    </div>
                    <Button name="Criar" onClick={() => { setModalAberto('inserir'); }}>Inserir</Button>
                    {queryString.length > 0 ? <Button name="Procurar" onClick={() => setFiltrosAtivos({})}>Limpar filtros</Button> :
                        <Button name="Procurar" onClick={() => setModalAberto('procurar')}>Procurar</Button>}
                    <Button name="Atualizar" disabled={selectedEvento ? false : true} onClick={() => { setModalAberto('atualizar'); }}>Atualizar</Button>
                    <Button name="Deletar" disabled={selectedEvento ? false : true} onClick={handleDeleteClick}>Deletar</Button>
                </div>
                <div className="container h-full rounded-lg inset-shadow-xs inset-shadow-white/25 shadow-[0px_2px_2px] shadow-black/25 p-4 bg-gradient-to-t from-gradientcontainer-100/50 to-basecontainer-100/50">
                    {content}
                </div>
            </DashboardLayout>
        </>
    )
}

export default EventosPage;