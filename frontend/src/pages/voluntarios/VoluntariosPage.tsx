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
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import DashboardLayout from "../../components/layout/DashboardLayout";
import SimpleStatsCard from "../../components/card/SimpleStatsCard";
import type { VoluntarioStats } from "../../interface/VoluntarioStats";

type TooltipPayload = ReadonlyArray<any>;

type Coordinate = {
    x: number;
    y: number;
};

type PieSectorData = {
    percent?: number;
    name?: string | number;
    midAngle?: number;
    middleRadius?: number;
    tooltipPosition?: Coordinate;
    value?: number;
    paddingAngle?: number;
    dataKey?: string;
    payload?: any;
    tooltipPayload?: ReadonlyArray<TooltipPayload>;
};

type GeometrySector = {
    cx: number;
    cy: number;
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
};

type PieLabelProps = PieSectorData &
    GeometrySector & {
        tooltipPayload?: any;
    };

const columns = [
    { header: 'Identificação', render: (voluntario: Voluntario) => { return formatIdentificacao(voluntario.CPF, "fisica") } },
    { header: 'Nome', accessor: 'Nome' as const },
    { header: 'Função', accessor: 'Funcao' as const },
    { header: 'Instituição', accessor: 'nomeInstituicao' as const }
]

const RADIAN = Math.PI / 180;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${((percent ?? 1) * 100).toFixed(0)}%`}
        </text>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    console.log(payload);
    const isVisible = active && payload && payload.length;
    return (
        <div className="bg-white/80 rounded-md p-4 text-black" style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
            {isVisible && (
                <>
                    <p className="">{`${payload[0].payload.nomeFuncao}`}</p>
                    <p className="">Quantidade: {`${payload[0].value}`}</p>
                </>
            )}
        </div>
    );
};

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
    /* FETCH DOS STATS */
    const { data: stats, isLoading: isLoadingStats } = useFetch<VoluntarioStats>(`/stats/voluntario?trigger=${refetchTrigger}`);
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
            toast.success("Voluntário deletado com sucesso!");
            setRefetchTrigger(prev => prev + 1);
            setSelectedVoluntario(null);
        } catch (err) {
            toast.error("Falha ao deletar voluntário")
            console.error(err);
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
                <InsertVoluntariosForm instituicoes={instituicoes || []} onError={() => { toast.error("Falha ao criar voluntário") }}
                    onSuccess={() => { setModalAberto(null); setRefetchTrigger(prev => prev + 1); toast.success("Voluntário cadastrado com sucesso!") }} />
            </Modal>
            <Modal isOpen={modalAberto === 'procurar'} onClose={() => setModalAberto(null)} title="Buscar Voluntários">
                <FilterVoluntariosForm onAplicarFiltros={handleApplyFiltro} instituicoes={instituicoes || []} />
            </Modal>
            <Modal isOpen={modalAberto === 'atualizar'} onClose={() => setModalAberto(null)} title="Atualizar Voluntário">
                <UpdateVoluntariosForm selectedVoluntario={selectedVoluntario!} onError={() => { toast.error("Falha ao atualizar voluntário") }}
                    onSuccess={() => {
                        setModalAberto(null); setRefetchTrigger(prev => prev + 1);
                        setSelectedVoluntario(null); toast.success("Voluntário atualizado com sucesso!")
                    }} instituicoes={instituicoes || []} />
            </Modal>
            <DashboardLayout>
                <div className="grid grid-cols-12 gap-4 rounded-lg inset-shadow-xs inset-shadow-white/25 p-3 bg-gradient-to-t from-basecontainer-100 to-buttonscontainer-100 shadow-[0px_2px_2px] shadow-black/25">
                    <SimpleStatsCard titulo="Voluntários" valor={voluntarios?.length!} isLoading={isLoading} span={6}></SimpleStatsCard>
                    <div onClick={() => setModalAberto("voluntariosFuncao")} className={`bg-blue-500 rounded-lg p-6 col-span-6 row-span-6 flex flex-col items-start cursor-pointer`}>
                        <h1 className="text-2xl text-bolder">Voluntários por Função</h1>
                        <span className="text-blue-200">clique para encontrar</span>
                    </div>
                    <Button name="Criar" onClick={() => { setModalAberto('inserir'); }}>Inserir</Button>
                    {queryString.length > 0 ? <Button name="Procurar" onClick={() => setFiltrosAtivos({})}>Limpar filtros</Button> :
                        <Button name="Procurar" onClick={() => setModalAberto('procurar')}>Procurar</Button>}
                    <Button name="Atualizar" disabled={selectedVoluntario ? false : true} onClick={() => { setModalAberto('atualizar'); }}>Atualizar</Button>
                    <Button name="Deletar" disabled={selectedVoluntario ? false : true} onClick={handleDeleteClick}>Deletar</Button>
                </div>
                <div className="container h-full rounded-lg inset-shadow-xs inset-shadow-white/25 shadow-[0px_2px_2px] shadow-black/25 p-4 bg-gradient-to-t from-gradientcontainer-100/50 to-basecontainer-100/50">
                    {content}
                </div>
            </DashboardLayout>
            <Modal isOpen={modalAberto === 'voluntariosFuncao'} onClose={() => setModalAberto(null)} title="Voluntários por Função">
                {stats?.voluntariosPorFuncao &&
                    <div className="bg-gradientcontainer-100/20 border border-secondrow-100/20 rounded-md">
                        <div className="rounded-md">
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart width={400} height={400}>
                                    <Tooltip content={CustomTooltip} />
                                    <Pie
                                        data={stats.voluntariosPorFuncao}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={80}
                                        dataKey="quantidade"
                                    >
                                        {stats.voluntariosPorFuncao.map((entry, index) => (
                                            <Cell key={`cell-${entry.nomeFuncao}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                }
            </Modal>
            <ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
        </>
    )
}

export default VoluntariosPage;