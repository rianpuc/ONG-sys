import { useState } from "react";
import Button from "../../components/button/Button";
import Table from "../../components/table/Table";
import useFetch from "../../hooks/useFetch";
import type { Item } from "../../interface/Item";

const columns = [
    { header: 'Nome do Item', accessor: 'Nome_Item' as const },
    { header: 'Tipo', accessor: 'Tipo_Item' as const },
    { header: 'Quantidade', accessor: 'Quantidade_Atual' as const }
];

const Itens = () => {
    const { data: itens, isLoading, error } = useFetch<Item[]>('/item');
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const handleRowClick = (item: Item) => {
        setSelectedItem(item);
        console.log("Item selecionado:", item);
    };
    let content;
    if (isLoading) {
        content = <p className="text-center text-gray-400">Carregando itens...</p>;
    } else if (error) {
        content = <p className="text-center text-red-500">Erro ao buscar dados: {error}</p>;
    } else if (itens && itens.length > 0) {
        content = (
            <Table data={itens} columns={columns} onRowClick={handleRowClick} />
        );
    } else {
        content = <p className="text-center text-gray-500">Nenhum item encontrado.</p>;
    }
    return (
        <>
            <div className="flex flex-col items-center gap-6 p-8 bg-gray-900">
                <h1 className="w-full bg-gray-300 text-black font-bold text-center text-lg py-3 px-6 rounded-full">
                    Itens no Sistema: {itens?.length || 0}
                </h1>
                <div className="flex flex-wrap justify-center gap-4">
                    <Button name="Criar">Inserir</Button>
                    <Button name="Procurar">Procurar</Button>
                    <Button name="Atualizar">Atualizar</Button>
                    <Button name="Deletar">Deletar</Button>
                </div>
                <Button name="Plano">Mostrar plano de execução</Button>
            </div>
            <div className="container mx-auto p-4">
                {content}
            </div>
        </>
    )
}

export default Itens;