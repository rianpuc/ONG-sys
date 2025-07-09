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
import UpdateDoacaoForm from "./UpdateDoacaoForm";
import Lupa from "../../components/icons/Lupa";


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
        { header: 'Doador', render: (doacao: Doacao) => doacao.Doador?.Nome_Doador || 'N/A' },
        { header: 'Qtd. de Itens', render: (doacao: Doacao) => doacao.itensDoados.length },
        {
            header: 'Detalhes', render: (doacao: Doacao) => (
                <div className="flex justify-center">
                    <button
                        onClick={() => setOpenDetalhes(doacao)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full transition-colors"
                        aria-label={`Ver detalhes da doação ${doacao.ID_Doacao}`}
                    >
                        <Lupa className="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ];

    const handleDoadorCreated = () => setDoadorRefetchTrigger(prev => prev + 1);
    const handleItemCreated = () => setItemRefetchTrigger(prev => prev + 1);

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
            alert("Doacao deletada com sucesso!");
            setRefetchTrigger(prev => prev + 1);
            setSelectedDoacao(null);
        } catch (err) {
            console.error("Falha ao deletar doador:", err);
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
    return (
        <>
            <title>Doações</title>
            <Modal isOpen={modalAberto === 'inserir'} onClose={() => setModalAberto(null)} title="Adicionar Nova Doacao">
                <InsertDoacaoForm doadores={doadores!} itens={itens!} onDoadorCreated={handleDoadorCreated} onItemCreated={handleItemCreated}
                    onSuccess={() => { setModalAberto(null); setRefetchTrigger(prev => prev + 1); }} />
            </Modal>
            <Modal isOpen={modalAberto === 'procurar'} onClose={() => setModalAberto(null)} title="Buscar Doacoes">
                <FilterDoacaoForm doadores={doadores!} itens={itens!} onAplicarFiltros={handleApplyFiltro} />
            </Modal>
            <Modal isOpen={modalAberto === 'atualizar'} onClose={() => setModalAberto(null)} title="Atualizar Doacao">
                <UpdateDoacaoForm doadores={doadores!} itens={itens!} selectedDoacao={selectedDoacao!} onDoadorCreated={handleDoadorCreated}
                    onItemCreated={handleItemCreated} onSuccess={() => { setModalAberto(null); setRefetchTrigger(prev => prev + 1); }} />
            </Modal>
            <div className="flex flex-col items-center gap-6 p-8 bg-gray-900">
                <h1 className="w-full bg-gray-300 text-black font-bold text-center text-lg py-3 px-6 rounded-full">
                    Doações no Sistema: {doacoes?.length || 0}
                </h1>
                <div className="flex flex-wrap justify-center gap-4">
                    <Button name="Criar" onClick={() => { setModalAberto('inserir'); }}>Inserir</Button>
                    {queryString.length > 0 ? <Button name="Procurar" onClick={() => setFiltrosAtivos({})}>Limpar filtros</Button> :
                        <Button name="Procurar" onClick={() => setModalAberto('procurar')}>Procurar</Button>}
                    <Button name="Atualizar" disabled={selectedDoacao ? false : true} onClick={() => { setModalAberto('atualizar'); }}>Atualizar</Button>
                    <Button name="Deletar" disabled={selectedDoacao ? false : true} onClick={handleDeleteClick}>Deletar</Button>
                </div>
                <Button name="Plano">Mostrar plano de execução</Button>
            </div>
            <div className="container mx-auto p-4">
                {content}
            </div>
            <Modal
                isOpen={openDetalhes ? true : false}
                onClose={() => setOpenDetalhes(null)}
                title={`Detalhes da Doação #${openDetalhes?.ID_Doacao}`}
            >
                {openDetalhes && (
                    <div>
                        <div className="flex flex-row justify-between mb-4">
                            <span><b>Doador:</b> {openDetalhes.Doador.Nome_Doador}</span>
                            <span><b>Data:</b> {formatarDataParaExibicao(openDetalhes.Data)}</span>
                        </div>
                        <h4 className="font-semibold text-lg mb-2 text-cyan-400">Itens Inclusos:</h4>
                        <ul className="list-disc list-inside space-y-2 bg-gray-900 p-4 rounded-md">
                            {openDetalhes.itensDoados.map(item => (
                                <li key={item.ID_Item}>
                                    <span className="font-semibold">{item.nomeItem}</span> - Quantidade: <span className="font-bold text-lg">{item.quantidade}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Modal>
        </>
    )
}

export default DoacaoPage;