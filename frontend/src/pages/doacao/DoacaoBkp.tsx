import { useMemo, useState } from "react";
import Button from "../../components/button/Button";
import Table from "../../components/table/Table";
import useFetch from "../../hooks/useFetch";
import type { Doacao } from "../../interface/Doacao";
import type { DoacaoTable } from "../../interface/DoacaoTable";
import type { DoacaoFiltro } from "../../interface/DoacaoFiltro";
import useMutation from "../../hooks/useMutation";
import Modal from "../../components/ui/Modal";
import FilterDoacaoForm from "./FilterDoacaoForm";
import type { Doador } from "../../interface/Doador";
import type { Item } from "../../interface/Item";

const columns = [
    { header: 'Data da Doação', accessor: 'dataDaDoacao' as const },
    { header: 'Doador', accessor: 'nomeDoador' as const },
    { header: 'Item Doado', accessor: 'itemDoado' as const },
    { header: 'Quantidade', accessor: 'quantidade' as const }
];

const Doacao = () => {
    /* DECLARACAO USESTATES */
    const [modalAberto, setModalAberto] = useState<string | null>(null);
    const [selectedDoacao, setSelectedDoacao] = useState<Doacao | null>(null);
    const [selectedLinha, setSelectedLinha] = useState<DoacaoTable | null>(null);
    const [filtrosAtivos, setFiltrosAtivos] = useState<DoacaoFiltro>({});
    const [refetchTrigger, setRefetchTrigger] = useState(0);

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
    const { data: doadores } = useFetch<Doador[]>('/doador');
    const { data: itens } = useFetch<Item[]>('/item');
    const handleApplyFiltro = (novosFiltros: DoacaoFiltro) => {
        setFiltrosAtivos(novosFiltros);
        setModalAberto(null);
    }
    const handleRowClick = (linha: DoacaoTable) => {
        const doacaoID = linha.idDoacao;
        if (selectedDoacao && selectedDoacao.ID_Doacao == doacaoID) {
            setSelectedDoacao(null);
            setSelectedLinha(null);
        } else {
            const doacaoCompleta = doacoes?.find(d => d.ID_Doacao === doacaoID);
            setSelectedLinha(linha);
            setSelectedDoacao(doacaoCompleta || null);
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
    const dadosParaTabela = useMemo((): DoacaoTable[] => {
        if (!doacoes) return [];
        return doacoes.flatMap(doacao =>
            doacao.itensDoados.map(item => ({
                id: `${doacao.ID_Doacao}-${item.ID_Item}`,
                idDoacao: doacao.ID_Doacao,
                dataDaDoacao: doacao.Data,
                nomeDoador: doacao.Doador?.Nome_Doador || 'N/A',
                itemDoado: item.nomeItem,
                quantidade: item.quantidade
            }))
        );
    }, [doacoes]);
    let content;
    if (isLoading) {
        content = <p className="text-center text-gray-400">Carregando itens...</p>;
    } else if (error) {
        content = <p className="text-center text-red-500">Erro ao buscar dados: {error}</p>;
    } else if (dadosParaTabela && dadosParaTabela.length > 0) {
        content = (
            <Table data={dadosParaTabela} columns={columns} onRowClick={handleRowClick} selectedItem={selectedLinha} />
        );
    } else {
        content = <p className="text-center text-gray-500">Nenhuma doacao encontrada!</p>;
    }
    return (
        <>
            <title>Doações</title>
            {/* <Modal isOpen={modalAberto === 'inserir'} onClose={() => setModalAberto(null)} title="Adicionar Novo Doador">
                <InsertDoadoresForm onSuccess={() => { setModalAberto(null); setRefetchTrigger(prev => prev + 1); }} />
            </Modal> */}
            <Modal isOpen={modalAberto === 'procurar'} onClose={() => setModalAberto(null)} title="Buscar Doadores">
                <FilterDoacaoForm doadores={doadores!} itens={itens!} onAplicarFiltros={handleApplyFiltro} />
            </Modal>
            {/* <Modal isOpen={modalAberto === 'atualizar'} onClose={() => setModalAberto(null)} title="Atualizar Doador">
                <UpdateDoadoresForm selectedDoador={selectedDoador!} onSuccess={() => { setModalAberto(null); setRefetchTrigger(prev => prev + 1); }} />
            </Modal> */}
            <div className="flex flex-col items-center gap-6 p-8 bg-gray-900">
                <h1 className="w-full bg-gray-300 text-black font-bold text-center text-lg py-3 px-6 rounded-full">
                    Doações no Sistema: {dadosParaTabela?.length || 0}
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
        </>
    )
}

export default Doacao;