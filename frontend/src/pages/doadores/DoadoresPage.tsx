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
import Dashboard from "../../components/layout/Dashboard";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SimpleStatsCard from "../../components/card/SimpleStatsCard";
import type { DoadorStats } from "../../interface/DoadorStats";

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
    /* FETCH DOS STATS */
    const { data: stats, isLoading: isLoadingStats } = useFetch<DoadorStats>(`/stats/doador?trigger=${refetchTrigger}`);
    console.log(stats);
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
            <DashboardLayout>
                <div className="grid grid-cols-12 gap-4 rounded-lg inset-shadow-xs inset-shadow-white/25 p-3 bg-gradient-to-t from-basecontainer-100 to-buttonscontainer-100 shadow-[0px_2px_2px] shadow-black/25">
                    <SimpleStatsCard titulo="Doadores" valor={doadores?.length!} isLoading={isLoading} span={4}></SimpleStatsCard>
                    <div className={`bg-blue-500 rounded-lg p-6 col-span-4 row-span-4 flex flex-col items-start`}>
                        <span className="text-2xl font-thin">Doadores criados</span>
                        <span className="text-6xl font-black">{isLoadingStats ? "..." : stats?.doadoresCriados}</span>
                        <span className="text-blue-200 ml-1">nos últimos 30 dias</span>
                    </div>
                    <div className={`bg-blue-500 rounded-lg p-4 col-span-4 row-span-4 flex flex-col items-start`}>
                        <span className="text-2xl font-bold">Distribuição de Doadores</span>
                        <p className="mt-2 text-xl text-blue-200 ml-1 font-thin">{`Física(s): ${stats?.doadoresDistribuicao[0].quantidade}`}</p>
                        <p className="text-xl text-blue-200 ml-1 font-thin">{`Jurídica(s): ${stats?.doadoresDistribuicao[1].quantidade}`}</p>
                    </div>
                    <Button name="Criar" onClick={() => { setModalAberto('inserir'); }}>Inserir</Button>
                    {queryString.length > 0 ? <Button name="Procurar" onClick={() => setFiltrosAtivos({})}>Limpar filtros</Button> :
                        <Button name="Procurar" onClick={() => setModalAberto('procurar')}>Procurar</Button>}
                    <Button name="Atualizar" disabled={selectedDoador ? false : true} onClick={() => { setModalAberto('atualizar'); }}>Atualizar</Button>
                    <Button name="Deletar" disabled={selectedDoador ? false : true} onClick={handleDeleteClick}>Deletar</Button>
                </div>
                <div className="container h-full rounded-lg inset-shadow-xs inset-shadow-white/25 shadow-[0px_2px_2px] shadow-black/25 p-4 bg-gradient-to-t from-gradientcontainer-100/50 to-basecontainer-100/50">
                    {content}
                </div>
            </DashboardLayout>
        </>
    )
}

export default DoadoresPage;