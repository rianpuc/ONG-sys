import { useMemo } from "react";
import useFetch from "../../hooks/useFetch"
import type { Entrega } from "../../interface/Entrega";
import Table from "../../components/table/Table";
import type { EntregaTable } from "../../interface/EntregaTable";
import Button from "../../components/button/Button";

const columns = [
    { header: 'Data da Entrega', accessor: 'dataDaEntrega' as const },
    { header: 'Evento', accessor: 'evento' as const },
    { header: 'Receptor', accessor: 'nomeReceptor' as const },
    { header: 'Item', accessor: 'itemDoado' as const },
    { header: 'Quantidade', accessor: 'quantidade' as const }
];
const Entregas = () => {
    const { data: entregas, isLoading, error } = useFetch<Entrega[]>('/entrega');
    // const [selectedEntrega, setSelectedEntrega] = useState<EntregaTable | null>(null);
    const handleRowClick = (entrega: EntregaTable) => {
        // setSelectedEntrega(entrega);
        console.log("Entrega selecionada: ", entrega);
    }
    const dadosParaTabela = useMemo((): EntregaTable[] => {
        if (!entregas) return [];
        return entregas.flatMap(entrega =>
            entrega.itensEntregues.map(item => ({
                id: `${entrega.ID_Entrega}-${item.ID_Item}`,
                dataDaEntrega: entrega.Data_Entrega,
                evento: entrega.Local_Evento,
                nomeReceptor: entrega.Nome_Receptor,
                itemDoado: item.Nome_Item,
                quantidade: item.Quantidade,
            }))
        );
    }, [entregas]);
    let content;
    if (isLoading) {
        content = <p className="text-center text-gray-400">Carregando itens...</p>;
    } else if (error) {
        content = <p className="text-center text-red-500">Erro ao buscar dados: {error}</p>;
    } else if (entregas && entregas.length > 0) {
        content = (
            <Table data={dadosParaTabela} columns={columns} onRowClick={handleRowClick} />
        )
    }
    return (
        <>
            <div className="flex flex-col items-center gap-6 p-8 bg-gray-900">
                <h1 className="w-full bg-gray-300 text-black font-bold text-center text-lg py-3 px-6 rounded-full">
                    Entregas no Sistema: {dadosParaTabela?.length || 0}
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

export default Entregas;