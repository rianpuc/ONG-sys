import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface ComparisonStatsCardProps {
    label: string;
    valorAtual: number | null | undefined;
    valorAnterior: number | null | undefined;
    isLoading: boolean;
    span: number;
}

const ComparisonStatsCard = ({ label, valorAtual, valorAnterior, isLoading, span }: ComparisonStatsCardProps) => {
    let percentual: number = 0;
    if (valorAnterior && valorAnterior > 0) {
        percentual = ((valorAtual || 0) - valorAnterior) / valorAnterior * 100;
    } else if (valorAtual && valorAtual > 0) {
        percentual = 100;
    }
    const isPositive = percentual > 0;
    const isNegative = percentual < 0;
    const corTexto = isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-400';
    const Icone = isPositive ? ArrowUpRight : isNegative ? ArrowDownRight : Minus;
    return (
        <div className={`bg-blue-500 rounded-lg p-6 col-span-${span} row-span-${span} flex flex-col items-start`}>
            <div>
                <p className="text-lg text-blue-200">{`${label} no Mês`}</p>
                <p className="text-5xl font-bold tracking-tighter">
                    {isLoading ? '...' : valorAtual ?? 0}
                </p>
            </div>
            <div className="flex items-center text-sm">
                {isLoading ? (
                    <p className="text-blue-200">Calculando...</p>
                ) : (
                    <>
                        <Icone size={16} className={`mr-1 ${corTexto}`} />
                        <span className={corTexto}>{percentual.toFixed(1)}%</span>
                        <span className="text-blue-200 ml-1">em relação ao mês anterior</span>
                    </>
                )}
            </div>
        </div>

    );
};

export default ComparisonStatsCard;