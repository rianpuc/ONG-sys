import type { ReceptorFiltro } from "../../interface/ReceptorFiltro"
import type { Receptor } from "../../interface/Receptor";
import useFetch from "../../hooks/useFetch";
import Table from "../../components/table/Table";
import Button from "../../components/button/Button";
import { formatIdentificacao } from "../../utils/Formatters";
import { useMemo, useState } from "react";
import useMutation from "../../hooks/useMutation";
import Modal from "../../components/ui/Modal";
import InsertReceptoresForm from "./InsertReceptoresForm";
import FilterReceptoresForm from "./FilterReceptoresForm";
import UpdateReceptoresForm from "./UpdateReceptoresForm";
import Dashboard from "../../components/layout/Dashboard";

const columns = [
    { header: 'Identificação', render: (receptor: Receptor) => { return formatIdentificacao(receptor.CPF, "fisica") } },
    { header: 'Nome', accessor: 'Nome' as const },
    { header: 'Endereço', accessor: 'Endereco' as const }
];

const ReceptoresPage = () => {
    /* DECLARACAO USESTATES */
    const [modalAberto, setModalAberto] = useState<string | null>(null);
    const [selectedReceptor, setSelectedReceptor] = useState<Receptor | null>(null);
    const [filtrosAtivos, setFiltrosAtivos] = useState<ReceptorFiltro>({});
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const { execute: deletarReceptor } = useMutation('/receptor', 'DELETE');
    const queryString = useMemo(() => {
        const activeFilters = Object.fromEntries(
            Object.entries(filtrosAtivos).filter(([_, value]) => value)
        );
        return new URLSearchParams(activeFilters).toString();
    }, [filtrosAtivos]);
    const apiUrl = `/receptor?${queryString}&trigger=${refetchTrigger}`;
    /* OBTENDO RECEPTORES DO BD*/
    const { data: receptores, isLoading, error } = useFetch<Receptor[]>(apiUrl);
    const handleApplyFiltro = (novosFiltros: ReceptorFiltro) => {
        setFiltrosAtivos(novosFiltros);
        setModalAberto(null);
    }
    const handleRowClick = (receptor: Receptor) => {
        if (selectedReceptor == receptor) {
            setSelectedReceptor(null);
        } else {
            setSelectedReceptor(receptor);
        }
    }
    const handleDeleteClick = async () => {
        try {
            await deletarReceptor(null, selectedReceptor?.CPF);
            alert("Receptor deletado com sucesso!");
            setRefetchTrigger(prev => prev + 1);
            setSelectedReceptor(null);
        } catch (err) {
            console.error("Falha ao deletar receptor:", err);
        }
    }
    let content;
    if (isLoading) {
        content = <p className="text-center text-gray-400">Carregando receptores...</p>;
    } else if (error) {
        content = <p className="text-center text-red-500">Erro ao buscar dados: {error}</p>;
    } else if (receptores && receptores.length > 0) {
        content = (
            <Table data={receptores} columns={columns} onRowClick={handleRowClick} selectedItem={selectedReceptor} />
        )
    } else {
        content = (
            <p className="text-center text-gray-400">Nenhum receptor encontrado!</p>
        )
    }
    return (
        <>
            <title>Receptores</title>
            <Modal isOpen={modalAberto === 'inserir'} onClose={() => setModalAberto(null)} title="Adicionar Novo Receptor">
                <InsertReceptoresForm onSuccess={() => { setModalAberto(null); setRefetchTrigger(prev => prev + 1); }} />
            </Modal>
            <Modal isOpen={modalAberto === 'procurar'} onClose={() => setModalAberto(null)} title="Buscar Receptores">
                <FilterReceptoresForm onAplicarFiltros={handleApplyFiltro} />
            </Modal>
            <Modal isOpen={modalAberto === 'atualizar'} onClose={() => setModalAberto(null)} title="Atualizar Receptor">
                <UpdateReceptoresForm selectedReceptor={selectedReceptor!} onSuccess={() => {
                    setModalAberto(null); setRefetchTrigger(prev => prev + 1);
                    setSelectedReceptor(null);
                }} />
            </Modal>
            <div className="w-full h-full max-w-10xl p-8 mx-auto flex flex-col gap-8">
                <Dashboard titulo="Receptores" dados={receptores} isLoading={isLoading}>
                    <Button name="Criar" onClick={() => { setModalAberto('inserir'); }}>Inserir</Button>
                    {queryString.length > 0 ? <Button name="Procurar" onClick={() => setFiltrosAtivos({})}>Limpar filtros</Button> :
                        <Button name="Procurar" onClick={() => setModalAberto('procurar')}>Procurar</Button>}
                    <Button name="Atualizar" disabled={selectedReceptor ? false : true} onClick={() => { setModalAberto('atualizar'); }}>Atualizar</Button>
                    <Button name="Deletar" disabled={selectedReceptor ? false : true} onClick={handleDeleteClick}>Deletar</Button>
                </Dashboard>
                <div className="container h-full rounded-lg inset-shadow-xs inset-shadow-white/25 shadow-[0px_2px_2px] shadow-black/25 p-4 bg-gradient-to-t from-gradientcontainer-100/50 to-basecontainer-100/50">
                    {content}
                </div>
            </div>
        </>
    )
}

export default ReceptoresPage;