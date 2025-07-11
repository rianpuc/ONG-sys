import { useMemo, useState } from "react";
import useFetch from "../../hooks/useFetch"
import type { Entrega } from "../../interface/Entrega";
import Table from "../../components/table/Table";
import Button from "../../components/button/Button";
import { formatarDataParaExibicao } from "../../utils/Formatters";
import Lupa from "../../components/icons/Lupa";
import Modal from "../../components/ui/Modal";
import type { EntregaFiltro } from "../../interface/EntregaFiltro";
import useMutation from "../../hooks/useMutation";
import type { Receptor } from "../../interface/Receptor";
import type { Evento } from "../../interface/Evento";
import type { Item } from "../../interface/Item";
import FilterEntregasForm from "./FilterEntregasForm";
import InsertEntregasForm from "./InsertEntregasForm";
import UpdateEntregasForm from "./UpdateEntregasForm";
import Dashboard from "../../components/layout/Dashboard";

const EntregasPage = () => {
    const [modalAberto, setModalAberto] = useState<string | null>(null);
    const [selectedEntrega, setSelectedEntrega] = useState<Entrega | null>(null);
    const [openDetalhes, setOpenDetalhes] = useState<Entrega | null>(null);
    const [filtrosAtivos, setFiltrosAtivos] = useState<EntregaFiltro>({});
    const [eventoRefetchTrigger, setEventoRefetchTrigger] = useState(0);
    const [receptorRefetchTrigger, setReceptorRefetchTrigger] = useState(0);
    const [itemRefetchTrigger, setItemRefetchTrigger] = useState(0);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const columns = [
        { header: 'Data da Entrega', render: (entrega: Entrega) => formatarDataParaExibicao(entrega.Data_Entrega) },
        { header: 'Evento', render: (entrega: Entrega) => entrega.Evento.Local },
        { header: 'Receptor', render: (entrega: Entrega) => entrega.Receptor.Nome },
        { header: 'Qtd. de Itens', render: (entrega: Entrega) => entrega.itensEntregues.length },
        {
            header: 'Detalhes', render: (entrega: Entrega) => (
                <div className="flex justify-center">
                    <button
                        onClick={() => setOpenDetalhes(entrega)}
                        className="text-gray-400 hover:text-white hover:bg-gray-600 rounded-full transition-colors"
                        aria-label={`Ver detalhes da doação ${entrega.ID_Entrega}`}
                    >
                        <Lupa className="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ];

    const handleEventoCreated = () => setEventoRefetchTrigger(prev => prev + 1);
    const handleReceptorCreated = () => setReceptorRefetchTrigger(prev => prev + 1);
    const handleItemCreated = () => setItemRefetchTrigger(prev => prev + 1);
    const { execute: deletarEntrega } = useMutation('/entrega', 'DELETE');

    const queryString = useMemo(() => {
        const activeFilters = Object.fromEntries(
            Object.entries(filtrosAtivos).filter(([_, value]) => value)
        );
        return new URLSearchParams(activeFilters).toString();
    }, [filtrosAtivos]);
    const apiUrl = `/entrega?${queryString}&trigger=${refetchTrigger}`;
    /* OBTENDO ENTREGAS DO BD */
    const { data: entregas, isLoading, error } = useFetch<Entrega[]>(apiUrl);
    /* FETCH PARA COLOCAR NOS MODALS */
    const { data: receptores } = useFetch<Receptor[]>(`/receptor?trigger=${receptorRefetchTrigger}`);
    const { data: eventos } = useFetch<Evento[]>(`/evento?trigger=${eventoRefetchTrigger}`);
    const { data: itens } = useFetch<Item[]>(`/item?trigger=${itemRefetchTrigger}`);
    const handleApplyFiltro = (novosFiltros: EntregaFiltro) => {
        setFiltrosAtivos(novosFiltros);
        setModalAberto(null);
    }
    const handleRowClick = (entrega: Entrega) => {
        if (selectedEntrega?.ID_Entrega == entrega.ID_Entrega) {
            setSelectedEntrega(null);
        } else {
            setSelectedEntrega(entrega);
        }
    }
    const handleDeleteClick = async () => {
        try {
            await deletarEntrega(null, selectedEntrega?.ID_Entrega);
            alert("Entrega deletada com sucesso!");
            setRefetchTrigger(prev => prev + 1);
            setSelectedEntrega(null);
        } catch (err) {
            console.error("Falha ao deletar doador:", err);
        }
    }
    let content;
    if (isLoading) {
        content = <p className="text-center text-gray-400">Carregando entregas...</p>;
    } else if (error) {
        content = <p className="text-center text-red-500">Erro ao buscar dados: {error}</p>;
    } else if (entregas && entregas.length > 0) {
        content = (
            <Table data={entregas} columns={columns} onRowClick={handleRowClick} selectedItem={selectedEntrega} button={true} />
        )
    } else {
        content = (
            <p className="text-center text-gray-400">Nenhuma entrega encontrada!</p>
        )
    }
    return (
        <>
            <title>Entregas</title>
            <Modal isOpen={modalAberto === 'inserir'} onClose={() => setModalAberto(null)} title="Adicionar Nova Entrega">
                <InsertEntregasForm eventos={eventos!} itens={itens!} receptores={receptores!} onEventoCreated={handleEventoCreated} onItemCreated={handleItemCreated}
                    onReceptorCreated={handleReceptorCreated} onSuccess={() => { setModalAberto(null); setRefetchTrigger(prev => prev + 1); }} />
            </Modal>
            <Modal isOpen={modalAberto === 'procurar'} onClose={() => setModalAberto(null)} title="Buscar Entregas">
                <FilterEntregasForm eventos={eventos!} receptores={receptores!} itens={itens!} onAplicarFiltros={handleApplyFiltro} />
            </Modal>
            <Modal isOpen={modalAberto === 'atualizar'} onClose={() => setModalAberto(null)} title="Atualizar Entrega">
                <UpdateEntregasForm eventos={eventos!} receptores={receptores!} itens={itens!} selectedEntrega={selectedEntrega!} onEventoCreated={handleEventoCreated}
                    onReceptorCreated={handleReceptorCreated} onItemCreated={handleItemCreated} onSuccess={() => { setModalAberto(null); setRefetchTrigger(prev => prev + 1); }} />
            </Modal>
            <div className="w-full h-full max-w-10xl p-8 mx-auto flex flex-col gap-8">
                <Dashboard titulo="Entregas" dados={entregas} isLoading={isLoading}>
                    <Button name="Criar" onClick={() => { setModalAberto('inserir'); }}>Inserir</Button>
                    {queryString.length > 0 ? <Button name="Procurar" onClick={() => setFiltrosAtivos({})}>Limpar filtros</Button> :
                        <Button name="Procurar" onClick={() => setModalAberto('procurar')}>Procurar</Button>}
                    <Button name="Atualizar" disabled={selectedEntrega ? false : true} onClick={() => { setModalAberto('atualizar'); }}>Atualizar</Button>
                    <Button name="Deletar" disabled={selectedEntrega ? false : true} onClick={handleDeleteClick}>Deletar</Button>
                </Dashboard>
                <div className="container h-full rounded-lg inset-shadow-xs inset-shadow-white/25 shadow-[0px_2px_2px] shadow-black/25 p-4 bg-gradient-to-t from-gradientcontainer-100/50 to-basecontainer-100/50">
                    {content}
                </div>
            </div>
            <Modal
                isOpen={openDetalhes ? true : false}
                onClose={() => setOpenDetalhes(null)}
                title={`Detalhes da Doação #${openDetalhes?.ID_Entrega}`}
            >
                {openDetalhes && (
                    <div>
                        <div className="flex flex-row justify-between mb-4">
                            <span><b>Receptor:</b> {openDetalhes.Receptor.Nome}</span>
                            <span><b>Data:</b> {formatarDataParaExibicao(openDetalhes.Data_Entrega)}</span>
                        </div>
                        <h4 className="font-semibold text-lg mb-2 text-cyan-400">Itens Inclusos:</h4>
                        <ul className="list-disc list-inside space-y-2 bg-gray-900 p-4 rounded-md">
                            {openDetalhes.itensEntregues.map(item => (
                                <li key={item.ID_Item}>
                                    <span className="font-semibold">{item.Nome_Item}</span> - Quantidade: <span className="font-bold text-lg">{item.Quantidade}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Modal>
        </>
    )
}

export default EntregasPage;