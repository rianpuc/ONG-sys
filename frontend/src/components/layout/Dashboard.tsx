interface StatsData {
    titulo: string;
    dados?: any[] | null;
    isLoading: boolean;
    span: number;
}

const DashboardStats = ({ titulo, dados, isLoading, span }: StatsData) => {
    const quantidade = dados?.length || 0;
    const formattedQuantidade = String(quantidade).padStart(3, '0');
    return (
        <div className='bg-blue-500 rounded-lg p-6 col-span-2 row-span-2 flex flex-col items-start'>
            <span className="text-6xl font-black">{isLoading ? "..." : formattedQuantidade}</span>
            <h1 className="text-2xl font-thin">
                {titulo} no Sistema
            </h1>
        </div>
    );
};

export default DashboardStats;