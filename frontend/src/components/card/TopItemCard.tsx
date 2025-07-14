interface TopItem {
    nomeItem: string;
    quantidadeTotal: number;
}

interface TopItemCardProps {
    titulo: string;
    itens: TopItem[] | null | undefined;
    isLoading: boolean;
    span: number;
}

const TopItemCard = ({ titulo, itens, isLoading, span }: TopItemCardProps) => {
    return (
        <div className={`bg-blue-500 rounded-lg p-6 col-span-${span} row-span-${span} flex flex-col items-start`}>
            <h3 className="font-bold text-2xl mb-2">{`Top ${titulo}`}</h3>
            {isLoading ? <p>Carregando...</p> : (
                <ul className="space-y-1">
                    {itens && itens.length > 0 ? (
                        itens.map(item => (
                            <li key={item.nomeItem} className="flex justify-between text-sm">
                                <span>{item.nomeItem}</span>
                                <span className="font-semibold">{item.quantidadeTotal} un.</span>
                            </li>
                        ))
                    ) : (
                        <p className="text-blue-200 text-sm">Nenhuma {titulo.toLowerCase()} no mês.</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default TopItemCard;