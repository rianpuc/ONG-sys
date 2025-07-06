import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import type { Doador } from "../../interface/Doador";
import Table from "../../components/table/Table";
import Button from "../../components/button/Button";
import { formatIdentificacao } from "../../utils/Formatters";

const columns = [
    { header: 'Nome', accessor: 'Nome_Doador' as const },
    { header: 'Tipo', accessor: 'Tipo_Doador' as const },
    {
        header: 'Identificação', render: (doador: Doador) => {
            const doc = doador.CPF || doador.CNPJ;
            return formatIdentificacao(doc!, doador.Tipo_Doador);
        }
    }
];

const Doadores = () => {
    const { data: doadores, isLoading, error } = useFetch<Doador[]>('/doador');
    const [selectedDoador, setSelectedDoador] = useState<Doador | null>(null);
    const handleRowClick = (doador: Doador) => {
        setSelectedDoador(doador);
        console.log("Doador selecionado: ", doador);
    }
    let content;
    if (isLoading) {
        content = <p className="text-center text-gray-400">Carregando itens...</p>;
    } else if (error) {
        content = <p className="text-center text-red-500">Erro ao buscar dados: {error}</p>;
    } else if (doadores && doadores.length > 0) {
        content = (
            <Table data={doadores} columns={columns} onRowClick={handleRowClick} />
        )
    }
    return (
        <>
            <div className="flex flex-col items-center gap-6 p-8 bg-gray-900">
                <h1 className="w-full bg-gray-300 text-black font-bold text-center text-lg py-3 px-6 rounded-full">
                    Doadores no Sistema: {doadores?.length || 0}
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

export default Doadores;