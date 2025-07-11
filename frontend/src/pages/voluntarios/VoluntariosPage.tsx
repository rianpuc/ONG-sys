import type { Voluntario } from "../../interface/Voluntario";
import type { Instituicao } from "../../interface/Instituicao";
import type { VoluntarioFiltro } from "../../interface/VoluntarioFiltro";
import { formatIdentificacao } from "../../utils/Formatters";
import { useMemo, useState } from "react";
import useFetch from "../../hooks/useFetch";
import Button from "../../components/button/Button";
import Table from "../../components/table/Table";
import Modal from "../../components/ui/Modal";
import InsertVoluntariosForm from "./InsertVoluntariosForm";
import FilterVoluntariosForm from "./FilterVoluntariosForm";
import UpdateVoluntariosForm from "./UpdateVoluntariosForm";
import useMutation from "../../hooks/useMutation";
import Dashboard from "../../components/layout/Dashboard";

const columns = [
    { header: 'Identificação', render: (voluntario: Voluntario) => { return formatIdentificacao(voluntario.CPF, "fisica") } },
    { header: 'Nome', accessor: 'Nome' as const },
    { header: 'Função', accessor: 'Funcao' as const },
    { header: 'Instituição', accessor: 'nomeInstituicao' as const }
]

const VoluntariosPage = () => {
    /* DECLARACAO DE USESTATES */
    const [filtrosAtivos, setFiltrosAtivos] = useState<VoluntarioFiltro>({});
    const [modalAberto, setModalAberto] = useState<string | null>(null);
    const [selectedVoluntario, setSelectedVoluntario] = useState<Voluntario | null>(null);
    const { execute: deletarVoluntario } = useMutation('/voluntario', 'DELETE');
    const [refetchTrigger, setRefetchTrigger] = useState(0);
    /* CRIANDO QUERYSTRING DINAMICA PRA PROCURAR */
    const queryString = useMemo(() => {
        const activeFilters = Object.fromEntries(
            Object.entries(filtrosAtivos).filter(([_, value]) => value)
        );
        return new URLSearchParams(activeFilters).toString();
    }, [filtrosAtivos]);
    const apiUrl = `/voluntario?${queryString}&trigger=${refetchTrigger}`;
    /* OBTENDO VOLUNTARIOS DO BD */
    const { data: voluntarios, isLoading, error } = useFetch<Voluntario[]>(apiUrl);
    /* FETCH DE TODAS INSTITUICOES PARA SELECIONAR NO MODAL */
    const { data: instituicoes } = useFetch<Instituicao[]>('/instituicao');
    const handleApplyFiltro = (novosFiltros: VoluntarioFiltro) => {
        setFiltrosAtivos(novosFiltros);
        setModalAberto(null);
    }
    const handleRowClick = (voluntario: Voluntario) => {
        if (selectedVoluntario == voluntario) {
            setSelectedVoluntario(null);
        } else {
            setSelectedVoluntario(voluntario);
        }
    }
    const handleDeleteClick = async () => {
        try {
            await deletarVoluntario(null, selectedVoluntario?.CPF);
            alert("Voluntário deletado com sucesso!");
            setRefetchTrigger(prev => prev + 1);
            setSelectedVoluntario(null);
        } catch (err) {
            console.error("Falha ao deletar voluntário:", err);
        }
    }
    let content;
    if (isLoading) {
        content = <p className="text-center text-gray-400">Carregando voluntários...</p>;
    } else if (error) {
        content = <p className="text-center text-red-500">Erro ao buscar dados: {error}</p>;
    } else if (voluntarios && voluntarios.length > 0) {
        content = (
            <Table data={voluntarios} columns={columns} onRowClick={handleRowClick} selectedItem={selectedVoluntario} />
        )
    } else {
        content = (
            <p className="text-center text-gray-400">Nenhum voluntário encontrado!</p>
        )
    }
    return (
        <>
            <title>Voluntários</title>
            <Modal isOpen={modalAberto === 'inserir'} onClose={() => setModalAberto(null)} title="Adicionar Novo Voluntário">
                <InsertVoluntariosForm instituicoes={instituicoes || []} onSuccess={() => { setModalAberto(null); setRefetchTrigger(prev => prev + 1); }} />
            </Modal>
            <Modal isOpen={modalAberto === 'procurar'} onClose={() => setModalAberto(null)} title="Buscar Voluntários">
                <FilterVoluntariosForm onAplicarFiltros={handleApplyFiltro} instituicoes={instituicoes || []} />
            </Modal>
            <Modal isOpen={modalAberto === 'atualizar'} onClose={() => setModalAberto(null)} title="Atualizar Voluntário">
                <UpdateVoluntariosForm selectedVoluntario={selectedVoluntario!} onSuccess={() => {
                    setModalAberto(null); setRefetchTrigger(prev => prev + 1);
                    setSelectedVoluntario(null)
                }} instituicoes={instituicoes || []} />
            </Modal>
            <div className="w-full h-full max-w-10xl p-8 mx-auto flex flex-col gap-8">
                <Dashboard titulo="Voluntários" dados={voluntarios} isLoading={isLoading}>
                    <Button name="Criar" onClick={() => { setModalAberto('inserir'); }}>Inserir</Button>
                    {queryString.length > 0 ? <Button name="Procurar" onClick={() => setFiltrosAtivos({})}>Limpar filtros</Button> :
                        <Button name="Procurar" onClick={() => setModalAberto('procurar')}>Procurar</Button>}
                    <Button name="Atualizar" disabled={selectedVoluntario ? false : true} onClick={() => { setModalAberto('atualizar'); }}>Atualizar</Button>
                    <Button name="Deletar" disabled={selectedVoluntario ? false : true} onClick={handleDeleteClick}>Deletar</Button>
                </Dashboard>
                <div className="container h-full rounded-lg inset-shadow-xs inset-shadow-white/25 shadow-[0px_2px_2px] shadow-black/25 p-4 bg-gradient-to-t from-gradientcontainer-100/50 to-basecontainer-100/50">
                    {content}
                </div>
            </div>
        </>
    )
}

export default VoluntariosPage;