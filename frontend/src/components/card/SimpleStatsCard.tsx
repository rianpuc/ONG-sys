interface SimpleStatsCardProps {
    titulo: string;
    valor: string | number;
    isLoading: boolean;
    span: number;
}

const SimpleStatsCard = ({ titulo, valor, isLoading, span }: SimpleStatsCardProps) => {
    const valorFormatado = isLoading ? '...' : String(valor).padStart(3, '0');

    return (
        <div className={`bg-blue-500 rounded-lg p-6 col-span-${span} row-span-${span} flex flex-col items-start`}>
            <span className="text-6xl font-black">{isLoading ? "..." : valorFormatado}</span>
            <h1 className="text-2xl font-thin">
                {titulo} no Sistema
            </h1>
        </div>
    );
};

export default SimpleStatsCard;