import useFetch from "../../hooks/useFetch";
import type { Evento } from "../../interface/Evento";
import Table from "../../components/table/Table";
import Button from "../../components/button/Button";

const columns = [
    { header: 'Local', accessor: 'Local' as const },
    { header: 'Data', accessor: 'Data' as const },
    { header: 'Organizador', accessor: 'Organizador' as const }
];

const Eventos = () => {
    const { data: eventos, isLoading, error } = useFetch<Evento[]>('/evento');
    // const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
    const handleRowClick = (evento: Evento) => {
        // setSelectedEvento(evento);
        console.log("Evento selecionado: ", evento);
    };
    let content;
    if (isLoading) {
        content = <p className="text-center text-gray-400">Carregando itens...</p>;
    } else if (error) {
        content = <p className="text-center text-red-500">Erro ao buscar dados: {error}</p>;
    } else if (eventos && eventos.length > 0) {
        content = (
            <Table data={eventos} columns={columns} onRowClick={handleRowClick} />
        )
    }
    return (
        <>
            <div className="flex flex-col items-center gap-6 p-8 bg-gray-900">
                <h1 className="w-full bg-gray-300 text-black font-bold text-center text-lg py-3 px-6 rounded-full">
                    Eventos no Sistema: {eventos?.length || 0}
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

export default Eventos;