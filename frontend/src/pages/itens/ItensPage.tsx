import { useMemo, useState } from "react";
import Button from "../../components/button/Button";
import Table from "../../components/table/Table";
import useFetch from "../../hooks/useFetch";
import type { Item } from "../../interface/Item";
import type { ItemFiltro } from "../../interface/ItemFiltro";
import useMutation from "../../hooks/useMutation";
import Modal from "../../components/ui/Modal";
import InsertItensForm from "./InsertItensForm";
import FilterItensForm from "./FilterItensForm";
import UpdateItensForm from "./UpdateItensForm";
import Dashboard from "../../components/layout/Dashboard";

const columns = [
    { header: 'Nome do Item', accessor: 'Nome_Item' as const },
    { header: 'Tipo', accessor: 'Tipo_Item' as const },
    { header: 'Quantidade', accessor: 'Quantidade_Atual' as const }
];

const ItensPage = () => {
    /* DECLARACAO USESTATES */
    const [modalAberto, setModalAberto] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [filtrosAtivos, setFiltrosAtivos] = useState<ItemFiltro>({});
    const [refetchTrigger, setRefetchTrigger] = useState(0);
    const { execute: deletarItem } = useMutation('/item', 'DELETE');
    const queryString = useMemo(() => {
        const activeFilters = Object.fromEntries(
            Object.entries(filtrosAtivos).filter(([_, value]) => value)
        );
        return new URLSearchParams(activeFilters).toString();
    }, [filtrosAtivos]);
    const apiUrl = `/item?${queryString}&trigger=${refetchTrigger}`;
    /* OBTENDO ITENS DO BD */
    const { data: itens, isLoading, error } = useFetch<Item[]>(apiUrl);
    const handleApplyFiltro = (novosFiltros: ItemFiltro) => {
        setFiltrosAtivos(novosFiltros);
        setModalAberto(null);
    }
    const handleRowClick = (item: Item) => {
        if (selectedItem == item) {
            setSelectedItem(null);
        } else {
            setSelectedItem(item);
        }
    }
    const handleDeleteClick = async () => {
        try {
            await deletarItem(null, selectedItem?.ID_Item);
            alert("Item deletado com sucesso!");
            setRefetchTrigger(prev => prev + 1);
            setSelectedItem(null);
        } catch (err) {
            console.error("Falha ao deletar item:", err);
        }
    }
    let content;
    if (isLoading) {
        content = <p className="text-center text-gray-400">Carregando itens...</p>;
    } else if (error) {
        content = <p className="text-center text-red-500">Erro ao buscar dados: {error}</p>;
    } else if (itens && itens.length > 0) {
        content = (
            <Table data={itens} columns={columns} onRowClick={handleRowClick} selectedItem={selectedItem} />
        );
    } else {
        content = <p className="text-center text-gray-500">Nenhum item encontrado!</p>;
    }
    return (
        <>
            <title>Itens</title>
            <Modal isOpen={modalAberto === 'inserir'} onClose={() => setModalAberto(null)} title="Adicionar Novo Item">
                <InsertItensForm onSuccess={() => { setModalAberto(null); setRefetchTrigger(prev => prev + 1); }} />
            </Modal>
            <Modal isOpen={modalAberto === 'procurar'} onClose={() => setModalAberto(null)} title="Buscar Itens">
                <FilterItensForm onAplicarFiltros={handleApplyFiltro} />
            </Modal>
            <Modal isOpen={modalAberto === 'atualizar'} onClose={() => setModalAberto(null)} title="Atualizar Item">
                <UpdateItensForm selectedItem={selectedItem!} onSuccess={() => {
                    setModalAberto(null); setRefetchTrigger(prev => prev + 1);
                    setSelectedItem(null);
                }} />
            </Modal>
            <div className="w-full h-full max-w-10xl p-8 mx-auto flex flex-col gap-8">
                <Dashboard titulo="Itens" dados={itens} isLoading={isLoading}>
                    <Button name="Criar" onClick={() => { setModalAberto('inserir'); }}>Inserir</Button>
                    {queryString.length > 0 ? <Button name="Procurar" onClick={() => setFiltrosAtivos({})}>Limpar filtros</Button> :
                        <Button name="Procurar" onClick={() => setModalAberto('procurar')}>Procurar</Button>}
                    <Button name="Atualizar" disabled={selectedItem ? false : true} onClick={() => { setModalAberto('atualizar'); }}>Atualizar</Button>
                    <Button name="Deletar" disabled={selectedItem ? false : true} onClick={handleDeleteClick}>Deletar</Button>
                </Dashboard>
                <div className="container h-full rounded-lg inset-shadow-xs inset-shadow-white/25 shadow-[0px_2px_2px] shadow-black/25 p-4 bg-gradient-to-t from-gradientcontainer-100/50 to-basecontainer-100/50">
                    {content}
                </div>
            </div>
        </>
    )
}

export default ItensPage;