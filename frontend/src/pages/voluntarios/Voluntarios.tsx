import useFetch from "../../hooks/useFetch";
import type { Voluntario } from "../../interface/Voluntario";
import Button from "../../components/button/Button";
import Table from "../../components/table/Table";
import { formatIdentificacao } from "../../utils/Formatters";

const columns = [
    { header: 'Identificação', render: (voluntario: Voluntario) => { return formatIdentificacao(voluntario.CPF, "fisica") } },
    { header: 'Nome', accessor: 'Nome' as const },
    { header: 'Função', accessor: 'Funcao' as const },
    { header: 'Instituição', accessor: 'nomeInstituicao' as const }
]

const Voluntarios = () => {
    const { data: voluntarios, isLoading, error } = useFetch<Voluntario[]>('/voluntario');
    // const [selectedVoluntario, setSelectedVoluntario] = useState<Voluntario | null>(null);
    const handleRowClick = (voluntario: Voluntario) => {
        // setSelectedVoluntario(voluntario);
        console.log("Voluntario selecionado: ", voluntario);
    }
    let content;
    if (isLoading) {

    } else if (error) {

    } else if (voluntarios && voluntarios.length > 0) {
        content = (
            <Table data={voluntarios} columns={columns} onRowClick={handleRowClick} />
        )
    }
    return (
        <>
            <div className="flex flex-col items-center gap-6 p-8 bg-gray-900">
                <h1 className="w-full bg-gray-300 text-black font-bold text-center text-lg py-3 px-6 rounded-full">
                    Voluntarios no Sistema: {voluntarios?.length || 0}
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

export default Voluntarios;