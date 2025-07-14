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
import DashboardLayout from "../../components/layout/DashboardLayout";
import SimpleStatsCard from "../../components/card/SimpleStatsCard";
import type { ReceptorStats } from "../../interface/ReceptorStats";

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
    /* DANDO FETCH NOS STATS */
    const { data: stats, isLoading: isLoadingStats } = useFetch<ReceptorStats>(`/stats/receptor?trigger=${refetchTrigger}`);
    const titleAusente = stats?.receptoresAusentes.length! > 1 ? "Receptores ausentes" : "Receptor ausente";
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
            <DashboardLayout>
                <div className="grid grid-cols-12 gap-4 rounded-lg inset-shadow-xs inset-shadow-white/25 p-3 bg-gradient-to-t from-basecontainer-100 to-buttonscontainer-100 shadow-[0px_2px_2px] shadow-black/25">
                    <SimpleStatsCard titulo="Receptores" valor={receptores?.length!} isLoading={isLoading} span={4}></SimpleStatsCard>
                    <div className={`bg-blue-500 rounded-lg p-6 col-span-4 row-span-4 flex flex-col items-start`}>
                        <span className="text-2xl font-thin">Receptores cadastrados</span>
                        <span className="text-6xl font-black">{isLoadingStats ? "..." : stats?.receptoresRegistrados}</span>
                        <span className="text-blue-200">nos últimos 30 dias</span>
                    </div>
                    <div onClick={() => setModalAberto("receptorAusente")} className={`bg-blue-500 rounded-lg p-6 col-span-4 row-span-4 flex flex-col items-start cursor-pointer`}>
                        <h1 className="text-2xl font-thin">
                            {titleAusente}
                        </h1>
                        <span className="text-blue-200">no último evento</span>
                    </div>
                    <Button name="Criar" onClick={() => { setModalAberto('inserir'); }}>Inserir</Button>
                    {queryString.length > 0 ? <Button name="Procurar" onClick={() => setFiltrosAtivos({})}>Limpar filtros</Button> :
                        <Button name="Procurar" onClick={() => setModalAberto('procurar')}>Procurar</Button>}
                    <Button name="Atualizar" disabled={selectedReceptor ? false : true} onClick={() => { setModalAberto('atualizar'); }}>Atualizar</Button>
                    <Button name="Deletar" disabled={selectedReceptor ? false : true} onClick={handleDeleteClick}>Deletar</Button>
                </div>
                <div className="container h-full rounded-lg inset-shadow-xs inset-shadow-white/25 shadow-[0px_2px_2px] shadow-black/25 p-4 bg-gradient-to-t from-gradientcontainer-100/50 to-basecontainer-100/50">
                    {content}
                </div>
            </DashboardLayout>
            <Modal isOpen={modalAberto === 'receptorAusente'} onClose={() => setModalAberto(null)} title={titleAusente}>
                {stats?.receptoresAusentes &&
                    <div className="bg-gradientcontainer-100/20 border border border-secondrow-100/20 rounded-md">
                        <table className="w-full text-left table-auto min-w-max">
                            <thead>
                                <tr className="bg-secondrow-100/20">
                                    <th className="p-4">
                                        <p className="block font-sans text-center text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                            Nome do Receptor</p>
                                    </th>
                                    <th className="p-4">
                                        <p className="block font-sans text-center text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                            CPF</p>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.receptoresAusentes.map((item, index) => (
                                    <tr key={item.receptorCPF} className={`${index % 2 === 0 ? '' : 'bg-secondrow-100/20'}`}>
                                        <td className="p-4">
                                            <p className="block font-sans text-center text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {item.receptorNome}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <p className="block font-sans text-center text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {item.receptorCPF}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
            </Modal>
        </>
    )
}

export default ReceptoresPage;