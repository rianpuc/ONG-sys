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
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import DashboardLayout from "../../components/layout/DashboardLayout";
import SimpleStatsCard from "../../components/card/SimpleStatsCard";
import type { EntregaStats } from "../../interface/EntregaStats";

const CustomTooltip = ({ active, payload, label }: any) => {
    const isVisible = active && payload && payload.length;
    return (
        <div className="bg-white/50 rounded-md p-4" style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
            {isVisible && (
                <>
                    <p className="text-white">{`${label}`}</p>
                    <p className="">Quantidade doada: {`${payload[0].value}`} unid.</p>
                    <p className="">Quantidade entregue: {`${payload[1].value}`} unid.</p>
                </>
            )}
        </div>
    );
};

const EntregasPage = () => {
    const [modalAberto, setModalAberto] = useState<string | null>(null);
    const [selectedEntrega, setSelectedEntrega] = useState<Entrega | null>(null);
    const [openDetalhes, setOpenDetalhes] = useState<Entrega | null>(null);
    const [filtrosAtivos, setFiltrosAtivos] = useState<EntregaFiltro>({});
    const [eventoRefetchTrigger, setEventoRefetchTrigger] = useState(0);
    const [receptorRefetchTrigger, setReceptorRefetchTrigger] = useState(0);
    const [itemRefetchTrigger, setItemRefetchTrigger] = useState(0);
    const [refetchTrigger, setRefetchTrigger] = useState(0);
    const [balancoMensalOpen, setBalancoMensalOpen] = useState(false);

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
                        className="text-gray-400 hover:text-white rounded-full transition-colors"
                        aria-label={`Ver detalhes da entrega ${entrega.ID_Entrega}`}
                    >
                        <Lupa className="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ];

    const handleEventoCreated = () => { setEventoRefetchTrigger(prev => prev + 1); toast.success("Evento cadastrado com sucesso!"); }
    const handleReceptorCreated = () => { setReceptorRefetchTrigger(prev => prev + 1); toast.success("Receptor cadastrado com sucesso!"); }
    const handleItemCreated = () => { setItemRefetchTrigger(prev => prev + 1); toast.success("Item cadastrado com sucesso!"); }
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
    /* FETCH PARA STATS */
    const { data: stats, isLoading: isLoadingStats } = useFetch<EntregaStats>(`/stats/entrega?trigger=${refetchTrigger}`);
    const formattedBalanco = stats?.balancoMensal.filter((balance) => balance.Quantidade_Doada > 0 || balance.Quantidade_Entregue > 0);
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
            toast.success("Entrega deletada com sucesso!");
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
                    onError={(msg) => { toast.error("Falha ao criar entrega: " + msg) }} onWarn={(mensagem) => { toast.warn(mensagem) }}
                    onReceptorCreated={handleReceptorCreated} onSuccess={() => { setModalAberto(null); setRefetchTrigger(prev => prev + 1); toast.success("Entrega registrada com sucesso!") }} />
            </Modal>
            <Modal isOpen={modalAberto === 'procurar'} onClose={() => setModalAberto(null)} title="Buscar Entregas">
                <FilterEntregasForm eventos={eventos!} receptores={receptores!} itens={itens!} onAplicarFiltros={handleApplyFiltro} />
            </Modal>
            <Modal isOpen={modalAberto === 'atualizar'} onClose={() => setModalAberto(null)} title="Atualizar Entrega">
                <UpdateEntregasForm eventos={eventos!} receptores={receptores!} itens={itens!} selectedEntrega={selectedEntrega!} onEventoCreated={handleEventoCreated}
                    onError={(msg) => { toast.error("Falha ao atualizar entrega: " + msg) }} onWarn={(mensagem) => { toast.warn(mensagem) }}
                    onReceptorCreated={handleReceptorCreated} onItemCreated={handleItemCreated} onSuccess={() => { setModalAberto(null); setRefetchTrigger(prev => prev + 1); toast.success("Entrega atualizada com sucesso!") }} />
            </Modal>
            <DashboardLayout>
                <div className="grid grid-cols-12 gap-4 rounded-lg inset-shadow-xs inset-shadow-white/25 p-3 bg-gradient-to-t from-basecontainer-100 to-buttonscontainer-100 shadow-[0px_2px_2px] shadow-black/25">
                    <SimpleStatsCard titulo="Entregas" valor={entregas?.length!} isLoading={isLoading} span={4}></SimpleStatsCard>
                    <div className={`bg-blue-500 rounded-lg p-6 col-span-4 row-span-4 flex flex-col items-start`}>
                        <span className="text-2xl font-thin">Entregas realizadas</span>
                        <span className="text-6xl font-black">{isLoadingStats ? "..." : stats?.entregasRealizadas}</span>
                        <span className="text-blue-200">nos últimos 30 dias</span>
                    </div>
                    <div onClick={() => setBalancoMensalOpen(true)} className={`bg-blue-500 rounded-lg p-6 col-span-4 row-span-4 flex flex-col justify-center items-start cursor-pointer`}>
                        <span className="text-4xl font-black">Balanço</span>
                        <span className="text-blue-200">nos últimos 30 dias</span>
                    </div>
                    <Button name="Criar" onClick={() => { setModalAberto('inserir'); }}>Inserir</Button>
                    {queryString.length > 0 ? <Button name="Procurar" onClick={() => setFiltrosAtivos({})}>Limpar filtros</Button> :
                        <Button name="Procurar" onClick={() => setModalAberto('procurar')}>Procurar</Button>}
                    <Button name="Atualizar" disabled={selectedEntrega ? false : true} onClick={() => { setModalAberto('atualizar'); }}>Atualizar</Button>
                    <Button name="Deletar" disabled={selectedEntrega ? false : true} onClick={handleDeleteClick}>Deletar</Button>
                </div>
                <div className="container h-full rounded-lg inset-shadow-xs inset-shadow-white/25 shadow-[0px_2px_2px] shadow-black/25 p-4 bg-gradient-to-t from-gradientcontainer-100/50 to-basecontainer-100/50">
                    {content}
                </div>
            </DashboardLayout>
            <Modal
                isOpen={openDetalhes ? true : false}
                onClose={() => setOpenDetalhes(null)}
                title={`Detalhes da Entrega`}
                id={`#${openDetalhes?.ID_Entrega}`}
            >
                {openDetalhes && (
                    <div>
                        <div className="flex flex-row justify-between mb-4 p-4 rounded-md bg-secondrow-100/40">
                            <span><b>Receptor:</b> {openDetalhes.Receptor.Nome}</span>
                            <span><b>Data:</b> {formatarDataParaExibicao(openDetalhes.Data_Entrega)}</span>
                        </div>
                        <div className="bg-inputfield-100 p-4 rounded-md">
                            <h4 className="font-semibold text-lg mb-2 text-cyan-400">Itens Inclusos:</h4>
                            <div className="bg-modal-100/20 rounded-md overflow-y-scroll max-h-40">
                                <ul className="list-disc list-inside space-y-2 p-4 rounded-md">
                                    {openDetalhes.itensEntregues.map(item => (
                                        <li key={item.ID_Item}>
                                            <span className="font-semibold">{item.Nome_Item}</span><span className="font-thin text-sm"> /{item.Quantidade}unid.</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
            <Modal
                isOpen={balancoMensalOpen ? true : false}
                onClose={() => setBalancoMensalOpen(false)}
                title={`Balanço`}
            >
                {balancoMensalOpen && (
                    <div className="bg-gradientcontainer-100/50 border border-secondrow-100/20 rounded-md">
                        <div className="rounded-md">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={formattedBalanco} className={"p-4 mt-2"}>
                                    <XAxis dataKey="Nome_Item" hide />
                                    <YAxis padding={{ top: 10 }} axisLine={{ stroke: "rgba(0, 0, 0, 0)" }} tick={{ fill: "#FFF" }} tickLine={{ stroke: "#FFF" }} />
                                    <Tooltip content={CustomTooltip} cursor={{ fill: 'rgba(206, 206, 206, 0.2)', radius: 5 }} />
                                    <Bar dataKey="Quantidade_Doada" fill="#20307D" />
                                    <Bar dataKey="Quantidade_Entregue" fill="#34469D" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </Modal >
            < ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
        </>
    )
}

export default EntregasPage;