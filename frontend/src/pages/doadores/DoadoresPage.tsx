import useFetch from "../../hooks/useFetch";
import type { Doador } from "../../interface/Doador";
import Table from "../../components/table/Table";
import Button from "../../components/button/Button";
import { formatIdentificacao } from "../../utils/Formatters";
import { useMemo, useState } from "react";
import type { DoadorFiltro } from "../../interface/DoadorFiltro";
import useMutation from "../../hooks/useMutation";
import Modal from "../../components/ui/Modal";
import InsertDoadoresForm from "./InsertDoadoresForm";
import FilterDoadoresForm from "./FilterDoadoresForm";
import UpdateDoadoresForm from "./UpdateDoadoresForm";

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

const DoadoresPage = () => {
    /* DECLARACAO USESTATES */
    const [modalAberto, setModalAberto] = useState<string | null>(null);
    const [selectedDoador, setSelectedDoador] = useState<Doador | null>(null);
    const [filtrosAtivos, setFiltrosAtivos] = useState<DoadorFiltro>({});
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const { execute: deletarDoador } = useMutation('/doador', 'DELETE');
    const queryString = useMemo(() => {
        const activeFilters = Object.fromEntries(
            Object.entries(filtrosAtivos).filter(([_, value]) => value)
        );
        return new URLSearchParams(activeFilters).toString();
    }, [filtrosAtivos]);
    const apiUrl = `/doador?${queryString}&trigger=${refetchTrigger}`;
    /* OBTENDO DOADORES DO BD */
    const { data: doadores, isLoading, error } = useFetch<Doador[]>(apiUrl);
    const handleApplyFiltro = (novosFiltros: DoadorFiltro) => {
        setFiltrosAtivos(novosFiltros);
        setModalAberto(null);
    }
    const handleRowClick = (doador: Doador) => {
        if (selectedDoador == doador) {
            setSelectedDoador(null);
        } else {
            setSelectedDoador(doador);
        }
    }
    const handleDeleteClick = async () => {
        try {
            await deletarDoador(null, selectedDoador?.ID_Doador);
            alert("Doador deletado com sucesso!");
            setRefetchTrigger(prev => prev + 1);
            setSelectedDoador(null);
        } catch (err) {
            console.error("Falha ao deletar doador:", err);
        }
    }
    let content;
    if (isLoading) {
        content = <p className="text-center text-gray-400">Carregando doadores...</p>;
    } else if (error) {
        content = <p className="text-center text-red-500">Erro ao buscar dados: {error}</p>;
    } else if (doadores && doadores.length > 0) {
        content = (
            <Table data={doadores} columns={columns} onRowClick={handleRowClick} selectedItem={selectedDoador} />
        )
    } else {
        <p className="text-center text-gray-400">Nenhum doador encontrado!</p>
    }
    return (
        <>
            <title>Doadores</title>
            <Modal isOpen={modalAberto === 'inserir'} onClose={() => setModalAberto(null)} title="Adicionar Novo Doador">
                <InsertDoadoresForm onSuccess={() => { setModalAberto(null); setRefetchTrigger(prev => prev + 1); }} />
            </Modal>
            <Modal isOpen={modalAberto === 'procurar'} onClose={() => setModalAberto(null)} title="Buscar Doadores">
                <FilterDoadoresForm onAplicarFiltros={handleApplyFiltro} />
            </Modal>
            <Modal isOpen={modalAberto === 'atualizar'} onClose={() => setModalAberto(null)} title="Atualizar Doador">
                <UpdateDoadoresForm selectedDoador={selectedDoador!} onSuccess={() => { setModalAberto(null); setRefetchTrigger(prev => prev + 1); }} />
            </Modal>
            <div className="flex flex-col items-center gap-6 p-8 bg-gray-900">
                <h1 className="w-full bg-gray-300 text-black font-bold text-center text-lg py-3 px-6 rounded-full">
                    Doadores no Sistema: {doadores?.length || 0}
                </h1>
                <div className="flex flex-wrap justify-center gap-4">
                    <Button name="Criar" onClick={() => { setModalAberto('inserir'); }}>Inserir</Button>
                    {queryString.length > 0 ? <Button name="Procurar" onClick={() => setFiltrosAtivos({})}>Limpar filtros</Button> :
                        <Button name="Procurar" onClick={() => setModalAberto('procurar')}>Procurar</Button>}
                    <Button name="Atualizar" disabled={selectedDoador ? false : true} onClick={() => { setModalAberto('atualizar'); }}>Atualizar</Button>
                    <Button name="Deletar" disabled={selectedDoador ? false : true} onClick={handleDeleteClick}>Deletar</Button>
                </div>
                <Button name="Plano">Mostrar plano de execução</Button>
            </div>
            <div className="container mx-auto p-4">
                {content}
            </div>
        </>
    )
}

export default DoadoresPage;