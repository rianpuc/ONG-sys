import { useMemo, useState } from "react";
import Button from "../../components/button/Button";
import Table from "../../components/table/Table";
import useFetch from "../../hooks/useFetch";
import type { Doacao } from "../../interface/Doacao";
import type { DoacaoFiltro } from "../../interface/DoacaoFiltro";
import useMutation from "../../hooks/useMutation";
import Modal from "../../components/ui/Modal";
import FilterDoacaoForm from "./FilterDoacaoForm";
import type { Doador } from "../../interface/Doador";
import type { Item } from "../../interface/Item";
import { formatarDataParaExibicao } from "../../utils/Formatters";
import InsertDoacaoForm from "./InsertDoacaoForm";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import UpdateDoacaoForm from "./UpdateDoacaoForm";
import Lupa from "../../components/icons/Lupa";
import type { DoacaoStats } from "../../interface/DoacaoStats";
import SimpleStatsCard from "../../components/card/SimpleStatsCard";
import ComparisonStatsCard from "../../components/card/ComparisonStatsCard";
import TopItemCard from "../../components/card/TopItemCard";
import DashboardLayout from "../../components/layout/DashboardLayout";


const DoacaoPage = () => {
    /* DECLARACAO USESTATES */
    const [modalAberto, setModalAberto] = useState<string | null>(null);
    const [selectedDoacao, setSelectedDoacao] = useState<Doacao | null>(null);
    const [openDetalhes, setOpenDetalhes] = useState<Doacao | null>(null);
    const [filtrosAtivos, setFiltrosAtivos] = useState<DoacaoFiltro>({});
    const [doadorRefetchTrigger, setDoadorRefetchTrigger] = useState(0);
    const [itemRefetchTrigger, setItemRefetchTrigger] = useState(0);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const columns = [
        { header: 'Data da Doação', render: (doacao: Doacao) => formatarDataParaExibicao(doacao.Data) },
        { header: 'Doador', render: (doacao: Doacao) => doacao.Doador.Status ? doacao.Doador?.Nome_Doador : 'Doador Anônimo' },
        { header: 'Qtd. de Itens', render: (doacao: Doacao) => doacao.itensDoados.length },
        {
            header: 'Detalhes', render: (doacao: Doacao) => (
                <div className="flex justify-center">
                    <button
                        onClick={() => setOpenDetalhes(doacao)}
                        className="text-gray-400 hover:text-white rounded-full transition-colors"
                        aria-label={`Ver detalhes da doação ${doacao.ID_Doacao}`}
                    >
                        <Lupa className="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ];

    const handleDoadorCreated = () => {
        setDoadorRefetchTrigger(prev => prev + 1);
        toast.success("Doador cadastrado com sucesso!");
    }
    const handleItemCreated = () => {
        setItemRefetchTrigger(prev => prev + 1);
        toast.success("Item cadastrado com sucesso!");
    }
    const { execute: deletarDoacao } = useMutation('/doacao', 'DELETE');
    const queryString = useMemo(() => {
        const activeFilters = Object.fromEntries(
            Object.entries(filtrosAtivos).filter(([_, value]) => value)
        );
        return new URLSearchParams(activeFilters).toString();
    }, [filtrosAtivos]);
    const apiUrl = `/doacao?${queryString}&trigger=${refetchTrigger}`;
    /* OBTENDO DOACOES DO BD */
    const { data: doacoes, isLoading, error } = useFetch<Doacao[]>(apiUrl);
    /* FETCH PARA COLOCAR NOS MODALS */
    const { data: doadores } = useFetch<Doador[]>(`/doador?trigger=${doadorRefetchTrigger}`);
    const { data: itens } = useFetch<Item[]>(`/item?trigger=${itemRefetchTrigger}`);
    /* FETCH PARA PEGAR STATS */
    const { data: stats, isLoading: statsIsLoading } = useFetch<DoacaoStats>(`/stats/doacao?trigger=${refetchTrigger}`);
    const handleApplyFiltro = (novosFiltros: DoacaoFiltro) => {
        setFiltrosAtivos(novosFiltros);
        setModalAberto(null);
    }
    const handleRowClick = (doacao: Doacao) => {
        if (selectedDoacao?.ID_Doacao === doacao.ID_Doacao) {
            setSelectedDoacao(null);
        } else {
            setSelectedDoacao(doacao);
        }
    }
    const handleDeleteClick = async () => {
        try {
            await deletarDoacao(null, selectedDoacao?.ID_Doacao);
            toast.success("Doação deletada com sucesso!");
            setRefetchTrigger(prev => prev + 1);
            setSelectedDoacao(null);
        } catch (err) {
            toast.error("Falha ao deletar doação")
            console.error(err);
        }
    }
    let content;
    if (isLoading) {
        content = <p className="text-center text-gray-400">Carregando itens...</p>;
    } else if (error) {
        content = <p className="text-center text-red-500">Erro ao buscar dados: {error}</p>;
    } else if (doacoes && doacoes.length > 0) {
        content = (
            <Table data={doacoes} columns={columns} onRowClick={handleRowClick} selectedItem={selectedDoacao} button={true} />
        );
    } else {
        content = <p className="text-center text-gray-500">Nenhuma doacao encontrada!</p>;
    }
    console.log(doacoes);
    return (
        <>
            <title>Doações</title>
            <Modal isOpen={modalAberto === 'inserir'} onClose={() => setModalAberto(null)} title="Adicionar Nova Doação">
                <InsertDoacaoForm doadores={doadores!} itens={itens!} onDoadorCreated={handleDoadorCreated} onItemCreated={handleItemCreated}
                    onError={(msg) => { toast.error(msg) }} onWarn={(mensagem) => { toast.warn(mensagem) }}
                    onSuccess={() => { setModalAberto(null); setRefetchTrigger(prev => prev + 1); toast.success("Doação registrada com sucesso!"); }} />
            </Modal>
            <Modal isOpen={modalAberto === 'procurar'} onClose={() => setModalAberto(null)} title="Buscar Doações">
                <FilterDoacaoForm doadores={doadores!} itens={itens!} onAplicarFiltros={handleApplyFiltro} />
            </Modal>
            <Modal isOpen={modalAberto === 'atualizar'} onClose={() => setModalAberto(null)} title="Atualizar Doação">
                <UpdateDoacaoForm doadores={doadores!} itens={itens!} selectedDoacao={selectedDoacao!} onDoadorCreated={handleDoadorCreated}
                    onError={(mensagem) => { toast.error(mensagem) }} onWarn={(mensagem) => { toast.warn(mensagem) }}
                    onItemCreated={handleItemCreated} onSuccess={() => {
                        setModalAberto(null);
                        setRefetchTrigger(prev => prev + 1);
                        toast.success("Doação atualizada com sucesso!");
                    }
                    } />
            </Modal>
            <DashboardLayout>
                <div className="grid grid-cols-12 gap-4 rounded-lg inset-shadow-xs inset-shadow-white/25 p-3 bg-gradient-to-t from-basecontainer-100 to-buttonscontainer-100 shadow-[0px_2px_2px] shadow-black/25">
                    <SimpleStatsCard titulo="Doações" valor={doacoes?.length!} isLoading={isLoading} span={4}></SimpleStatsCard>
                    <ComparisonStatsCard label="Doações" span={4} valorAtual={stats?.doacoesMesAtual} valorAnterior={stats?.doacoesMesAnterior} isLoading={statsIsLoading}></ComparisonStatsCard>
                    <TopItemCard titulo="Doações" itens={stats?.top3Itens} isLoading={statsIsLoading} span={4}></TopItemCard>
                    <Button name="Criar" onClick={() => { setModalAberto('inserir'); }}>Inserir</Button>
                    {queryString.length > 0 ? <Button name="Procurar" onClick={() => setFiltrosAtivos({})}>Limpar filtros</Button> :
                        <Button name="Procurar" onClick={() => setModalAberto('procurar')}>Procurar</Button>}
                    <Button name="Atualizar" disabled={selectedDoacao ? false : true} onClick={() => { setModalAberto('atualizar'); }}>Atualizar</Button>
                    <Button name="Deletar" disabled={selectedDoacao ? false : true} onClick={handleDeleteClick}>Deletar</Button>
                </div>
                <div className="container h-full rounded-lg inset-shadow-xs inset-shadow-white/25 shadow-[0px_2px_2px] shadow-black/25 p-4 bg-gradient-to-t from-gradientcontainer-100/50 to-basecontainer-100/50">
                    {content}
                </div>
            </DashboardLayout>
            <Modal
                isOpen={openDetalhes ? true : false}
                onClose={() => setOpenDetalhes(null)}
                title={`Detalhes da Doação`}
                id={`#${openDetalhes?.ID_Doacao}`}
            >
                {openDetalhes && (
                    <div>
                        <div className="flex flex-row justify-between mb-4 p-4 rounded-md bg-secondrow-100/40">
                            <span><b>Doador:</b> {openDetalhes.Doador.Status ? openDetalhes.Doador?.Nome_Doador : 'Doador Anônimo'}</span>
                            <span><b>Data:</b> {formatarDataParaExibicao(openDetalhes.Data)}</span>
                        </div>
                        <div className="bg-inputfield-100 p-4 rounded-md">
                            <h4 className="font-semibold text-lg mb-2 text-cyan-400">Itens Inclusos:</h4>
                            <div className="bg-modal-100/20 rounded-md overflow-y-scroll max-h-40">
                                <ul className="list-disc list-inside space-y-2 p-4 rounded-md">
                                    {openDetalhes.itensDoados.map(item => (
                                        <li key={item.ID_Item}>
                                            <span className="font-semibold">{item.nomeItem}</span><span className="font-thin text-sm"> /{item.quantidade}unid.</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
            <ToastContainer
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

export default DoacaoPage;