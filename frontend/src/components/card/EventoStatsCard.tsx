import { formatarDataParaExibicao } from "../../utils/Formatters";

interface EventoStatsCardProps {
    local?: string;
    dataEvento?: Date;
    statusEvento: string;
    diasEvento?: number;
    span: number;
}

const SimpleStatsCard = ({ local, dataEvento, statusEvento, diasEvento, span }: EventoStatsCardProps) => {
    let content;
    console.log(local, dataEvento, statusEvento, diasEvento);
    if (statusEvento === "PROXIMO") {
        content = (
            <>
                <span className="text-2xl font-thin">Próximo evento em</span>
                <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">{diasEvento}</span>
                    <span className="text-2xl font-light text-blue-200 ml-2">dias</span>
                </div>
                <span className="text-blue-200">Local: {local}</span>
                <span className="text-blue-200">Data: {formatarDataParaExibicao(dataEvento)}</span>
            </>
        );
    } else if (statusEvento === "ULTIMO") {
        content = (
            <>
                <span className="text-2xl font-thin">Último evento há</span>
                <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">{diasEvento}</span>
                    <span className="text-2xl font-light text-blue-200 ml-2">dias</span>
                </div>
                <span className="text-blue-200">Local: {local}</span>
                <span className="text-blue-200">Data: {formatarDataParaExibicao(dataEvento)}</span>
            </>
        );
    } else {
        content = (
            <>
                <span className="text-2xl font-thin">Nenhum evento registrado.</span>
            </>
        );
    }

    return (
        <div className={`bg-blue-500 rounded-lg p-6 col-span-${span} row-span-${span} flex flex-col items-start`}>
            {content}
        </div>
    );
};

export default SimpleStatsCard;