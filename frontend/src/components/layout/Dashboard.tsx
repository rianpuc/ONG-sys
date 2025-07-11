interface StatsData {
    titulo: string;
    dados: any[] | null;
    isLoading: boolean;
    children: React.ReactNode;
}

const DashboardStats = ({ titulo, dados, isLoading, children }: StatsData) => {
    const quantidade = dados?.length || 0;
    const formattedQuantidade = String(quantidade).padStart(3, '0');
    return (
        <div className="grid grid-cols-4 gap-4 rounded-lg inset-shadow-xs inset-shadow-white/25 p-3 bg-gradient-to-t from-basecontainer-100 to-buttonscontainer-100 shadow-[0px_2px_2px] shadow-black/25">
            <div className='bg-blue-500 rounded-lg p-6 col-span-2 row-span-2 flex flex-col items-start'>
                <span className="text-6xl font-black">{isLoading ? "..." : formattedQuantidade}</span>
                <h1 className="text-2xl font-thin">
                    {titulo} no Sistema
                </h1>
            </div>
            <div className='bg-blue-500 rounded-lg p-3 col-span-2 row-span-2 flex flex-col items-start justify-center'>
                <h1 className="text-2xl font-thin">
                    Mostrar
                </h1>
                <span className="text-4xl font-black">Plano de execução</span>
            </div>
            {/* A área onde os botões (children) serão renderizados */}
            {children}

        </div >
    );
};

export default DashboardStats;