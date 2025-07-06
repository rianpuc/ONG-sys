import { useMemo } from "react";
import Button from "../../components/button/Button";
import Table from "../../components/table/Table";
import useFetch from "../../hooks/useFetch";
import type { Doacoes } from "../../interface/Doacoes";
import type { DoacaoTable } from "../../interface/DoacaoTable";

const columns = [
    { header: 'Data da Doação', accessor: 'dataDaDoacao' as const },
    { header: 'Doador', accessor: 'nomeDoador' as const },
    { header: 'Item Doado', accessor: 'itemDoado' as const },
    { header: 'Quantidade', accessor: 'quantidade' as const }
];

const Doacao = () => {
    const { data: doacoes, isLoading, error } = useFetch<Doacoes[]>('/doacao');
    // const [selectedDoacao, setSelectedDoacao] = useState<DoacaoTable | null>(null);
    const handleRowClick = (doacao: DoacaoTable) => {
        // setSelectedDoacao(doacao);
        console.log("Doacao selecionada:", doacao);
    };
    const dadosParaTabela = useMemo((): DoacaoTable[] => {
        if (!doacoes) return [];
        return doacoes.flatMap(doacao =>
            doacao.itensDoados.map(item => ({
                id: `${doacao.ID_Doacao}-${item.ID_Item}`, // Chave única para o React
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
            <Table data={dadosParaTabela} columns={columns} onRowClick={handleRowClick} />
        );
    } else {
        content = <p className="text-center text-gray-500">Nenhuma doacao encontrada.</p>;
    }
    return (
        <>
            <div className="flex flex-col items-center gap-6 p-8 bg-gray-900">
                <h1 className="w-full bg-gray-300 text-black font-bold text-center text-lg py-3 px-6 rounded-full">
                    Doações no Sistema: {dadosParaTabela?.length || 0}
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

export default Doacao;