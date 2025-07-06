import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import type { Receptor } from "../../interface/Receptor";
import Table from "../../components/table/Table";
import Button from "../../components/button/Button";
import { formatIdentificacao } from "../../utils/Formatters";

const columns = [
    { header: 'Identificação', render: (receptor: Receptor) => { return formatIdentificacao(receptor.CPF, "fisica") } },
    { header: 'Nome', accessor: 'Nome' as const },
    { header: 'Endereço', accessor: 'Endereco' as const }
];

const Receptores = () => {
    const { data: receptores, isLoading, error } = useFetch<Receptor[]>('/receptor');
    const [selectedReceptor, setSelectedReceptor] = useState<Receptor | null>(null);
    const handleRowClick = (receptor: Receptor) => {
        setSelectedReceptor(receptor);
        console.log("Receptor selecionado: ", receptor);
    }
    let content;
    if (isLoading) {
        content = <p className="text-center text-gray-400">Carregando itens...</p>;
    } else if (error) {
        content = <p className="text-center text-red-500">Erro ao buscar dados: {error}</p>;
    } else if (receptores && receptores.length > 0) {
        content = (
            <Table data={receptores} columns={columns} onRowClick={handleRowClick} />
        )
    }
    return (
        <>
            <div className="flex flex-col items-center gap-6 p-8 bg-gray-900">
                <h1 className="w-full bg-gray-300 text-black font-bold text-center text-lg py-3 px-6 rounded-full">
                    Receptores no Sistema: {receptores?.length || 0}
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

export default Receptores;