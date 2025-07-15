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
import { Bounce, ToastContainer, toast } from 'react-toastify';
import DashboardLayout from "../../components/layout/DashboardLayout";
import SimpleStatsCard from "../../components/card/SimpleStatsCard";
import type { ItemStats } from "../../interface/ItemStats";

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
    /* FETCH DE STATS */
    const { data: stats, isLoading: isLoadingStats } = useFetch<ItemStats>(`/stats/item?trigger=${refetchTrigger}`);
    const titleDoado = stats?.maisDoado.length! > 1 ? "Itens mais doados" : "Item mais doado";
    const titleEntregue = stats?.maisEntregue.length! > 1 ? "Itens mais entregues" : "Item mais entregue";
    const titleEstoque = stats?.menoresItensEmEstoque.length! > 1 ? "Menores itens em estoque" : "Menor item em estoque";
    console.log(stats);
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
            toast.success("Item deletado com sucesso!");
            setRefetchTrigger(prev => prev + 1);
            setSelectedItem(null);
        } catch (err) {
            toast.error("Falha ao deletar item");
            console.error(err);
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
                <InsertItensForm onSuccess={() => { setModalAberto(null); setRefetchTrigger(prev => prev + 1); toast.success("Item cadastrado com sucesso!"); }}
                    onError={() => { toast.error("Falha ao criar item") }} />
            </Modal>
            <Modal isOpen={modalAberto === 'procurar'} onClose={() => setModalAberto(null)} title="Buscar Itens">
                <FilterItensForm onAplicarFiltros={handleApplyFiltro} />
            </Modal>
            <Modal isOpen={modalAberto === 'atualizar'} onClose={() => setModalAberto(null)} title="Atualizar Item">
                <UpdateItensForm selectedItem={selectedItem!} onError={() => { toast.error("Falha ao atualizar item") }} onSuccess={() => {
                    setModalAberto(null); setRefetchTrigger(prev => prev + 1);
                    setSelectedItem(null); toast.success("Item atualizado com sucesso!");
                }} />
            </Modal>
            <DashboardLayout>
                <div className="grid grid-cols-12 gap-4 rounded-lg inset-shadow-xs inset-shadow-white/25 p-3 bg-gradient-to-t from-basecontainer-100 to-buttonscontainer-100 shadow-[0px_2px_2px] shadow-black/25">
                    <SimpleStatsCard titulo="Itens" valor={itens?.length!} isLoading={isLoading} span={3}></SimpleStatsCard>
                    <div onClick={() => setModalAberto("maisDoados")} className={`bg-blue-500 rounded-lg p-6 col-span-3 row-span-3 flex flex-col items-start cursor-pointer`}>
                        <h1 className="text-2xl font-thin">
                            {titleDoado}
                        </h1>
                        <span className="text-blue-200">nos últimos 30 dias</span>
                    </div>
                    <div onClick={() => setModalAberto("maisEntregues")} className={`bg-blue-500 rounded-lg p-6 col-span-3 row-span-3 flex flex-col items-start cursor-pointer`}>
                        <h1 className="text-2xl font-thin">
                            {titleEntregue}
                        </h1>
                        <span className="text-blue-200">nos últimos 30 dias</span>
                    </div>
                    <div onClick={() => handleApplyFiltro({ igualA: stats?.menoresItensEmEstoque[0].quantidadeTotal! })} className={`bg-blue-500 rounded-lg p-6 col-span-3 row-span-3 flex flex-col items-start cursor-pointer`}>
                        <h1 className="text-2xl font-thin">
                            {titleEstoque}
                        </h1>
                        <span className="text-blue-200">clique para encontrar</span>
                    </div>
                    <Button name="Criar" onClick={() => { setModalAberto('inserir'); }}>Inserir</Button>
                    {queryString.length > 0 ? <Button name="Procurar" onClick={() => setFiltrosAtivos({})}>Limpar filtros</Button> :
                        <Button name="Procurar" onClick={() => setModalAberto('procurar')}>Procurar</Button>}
                    <Button name="Atualizar" disabled={selectedItem ? false : true} onClick={() => { setModalAberto('atualizar'); }}>Atualizar</Button>
                    <Button name="Deletar" disabled={selectedItem ? false : true} onClick={handleDeleteClick}>Deletar</Button>
                </div>
                <div className="container h-full rounded-lg inset-shadow-xs inset-shadow-white/25 shadow-[0px_2px_2px] shadow-black/25 p-4 bg-gradient-to-t from-gradientcontainer-100/50 to-basecontainer-100/50">
                    {content}
                </div>
            </DashboardLayout>
            <Modal isOpen={modalAberto === 'maisDoados'} onClose={() => setModalAberto(null)} title={titleDoado}>
                {stats?.maisDoado &&
                    <div className="bg-gradientcontainer-100/20 border border border-secondrow-100/20 rounded-md">
                        <div className="overflow-y-scroll overflow-x-hidden max-h-80 rounded-md">
                            <table className="w-full text-left table-auto">
                                <thead>
                                    <tr className="bg-secondrow-100/20">
                                        <th className="p-4">
                                            <p className="block font-sans text-center text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                                Nome do Item</p>
                                        </th>
                                        <th className="p-4">
                                            <p className="block font-sans text-center text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                                Quantidade Doada</p>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.maisDoado.map((item, index) => (
                                        <tr key={item.nomeItem} className={`${index % 2 === 0 ? '' : 'bg-secondrow-100/20'}`}>
                                            <td className="p-4">
                                                <p className="block font-sans text-center text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                    {item.nomeItem}
                                                </p>
                                            </td>
                                            <td className="p-4">
                                                <p className="block font-sans text-center text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                    {item.quantidadeTotal}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </Modal>
            <Modal isOpen={modalAberto === 'maisEntregues'} onClose={() => setModalAberto(null)} title={titleEntregue}>
                {stats?.maisEntregue &&
                    <div className="bg-gradientcontainer-100/20 border border border-secondrow-100/20 rounded-md">
                        <div className="overflow-y-scroll overflow-x-hidden max-h-80 rounded-md">
                            <table className="w-full text-left table-auto">
                                <thead>
                                    <tr className="bg-secondrow-100/20">
                                        <th className="p-4">
                                            <p className="block font-sans text-center text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                                Nome do Item</p>
                                        </th>
                                        <th className="p-4">
                                            <p className="block font-sans text-center text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                                Quantidade Entregue</p>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.maisEntregue.map((item, index) => (
                                        <tr key={item.nomeItem} className={`${index % 2 === 0 ? '' : 'bg-secondrow-100/20'}`}>
                                            <td className="p-4">
                                                <p className="block font-sans text-center text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                    {item.nomeItem}
                                                </p>
                                            </td>
                                            <td className="p-4">
                                                <p className="block font-sans text-center text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                    {item.quantidadeTotal}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
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

export default ItensPage;