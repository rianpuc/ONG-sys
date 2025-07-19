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
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, type SectorProps, Sector } from 'recharts'
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
};

type PieSectorDataItem = React.SVGProps<SVGPathElement> & Partial<SectorProps> & PieSectorData;

const columns = [
    { header: 'Identificação', render: (voluntario: Voluntario) => { return formatIdentificacao(voluntario.CPF, "fisica") } },
    { header: 'Nome', accessor: 'Nome' as const },
    { header: 'Função', accessor: 'Funcao' as const },
    { header: 'Instituição', accessor: 'nomeInstituicao' as const }
]

const COLORS = ["#49de83", "#2852fb", "#742ede", "#f93e68"]

const renderActiveShape = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
}: PieSectorDataItem) => {
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * (midAngle ?? 1));
    const cos = Math.cos(-RADIAN * (midAngle ?? 1));
    const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
    const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
    const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
    const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#FFF">
                {payload.nomeFuncao}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                stroke="none"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                stroke="none"
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={(outerRadius ?? 0) + 6}
                outerRadius={(outerRadius ?? 0) + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#FFF">{`Qtd: ${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(${((percent ?? 1) * 100).toFixed(2)}%)`}
            </text>
        </g>
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
                <InsertVoluntariosForm voluntarios={voluntarios!} instituicoes={instituicoes || []} onError={() => { toast.error("Falha ao criar voluntário") }}
                    onSuccess={() => { setModalAberto(null); setRefetchTrigger(prev => prev + 1); toast.success("Voluntário cadastrado com sucesso!") }} />
            </Modal>
            <Modal isOpen={modalAberto === 'procurar'} onClose={() => setModalAberto(null)} title="Buscar Voluntários">
                <FilterVoluntariosForm voluntarios={voluntarios!} onAplicarFiltros={handleApplyFiltro} instituicoes={instituicoes || []} />
            </Modal>
            <Modal isOpen={modalAberto === 'atualizar'} onClose={() => setModalAberto(null)} title="Atualizar Voluntário">
                <UpdateVoluntariosForm voluntarios={voluntarios!} selectedVoluntario={selectedVoluntario!} onError={() => { toast.error("Falha ao atualizar voluntário") }}
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
                        <span className="text-blue-200">clique para visualizar</span>
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
                    <div className="bg-gradientcontainer-100/50 border border-secondrow-100/20 rounded-md">
                        <div className="rounded-md">
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart width={400} height={400}>
                                    <Pie
                                        data={stats.voluntariosPorFuncao}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        activeShape={renderActiveShape}
                                        fill="#20307D"
                                        stroke="none"
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