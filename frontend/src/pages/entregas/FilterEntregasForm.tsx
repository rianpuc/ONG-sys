import { useState } from 'react';
import type { Item } from '../../interface/Item';
import type { Evento } from '../../interface/Evento';
import type { Receptor } from '../../interface/Receptor';
import { formatarDataParaExibicao } from '../../utils/Formatters';

// Definindo as props que o formulário recebe
interface FilterFormProps {
    onAplicarFiltros: (filtros: object) => void;
    eventos: Evento[];
    receptores: Receptor[];
    itens: Item[];
}

const FilterEntregasForm = ({ onAplicarFiltros, eventos, receptores, itens }: FilterFormProps) => {
    const [operando, setOperando] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [eventoID, setEventoID] = useState('');
    const [receptorID, setReceptorID] = useState('');
    const [itemID, setItemID] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Impede o recarregamento da página
        // Monta o objeto de filtros com os valores dos estados
        let filtros: { [key: string]: string | number } = {
            Evento: Number(eventoID),
            Receptor: receptorID,
            Item: Number(itemID)
        };
        if (quantidade) {
            filtros[operando] = quantidade;
        }
        // Chama a função do componente pai, passando os filtros
        onAplicarFiltros(filtros);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="evento" className="block text-sm font-medium text-gray-300">Evento</label>
                <select id="evento" value={eventoID} onChange={e => setEventoID(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" >
                    <option value="">Todos</option>
                    {eventos.map(e => <option key={e.ID_Evento} value={e.ID_Evento}>{e.Local} - {formatarDataParaExibicao(e.Data)}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="receptor" className="block text-sm font-medium text-gray-300">Receptor</label>
                <select id="receptor" value={receptorID} onChange={e => setReceptorID(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white">
                    <option value="">Todos</option>
                    {receptores.map(r => <option key={r.CPF} value={r.CPF}>{r.Nome}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="item" className="block text-sm font-medium text-gray-300">Item</label>
                <select id="item" value={itemID} onChange={e => setItemID(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white">
                    <option value="">Todos</option>
                    {itens.map(i => <option key={i.ID_Item} value={i.ID_Item}>{i.Nome_Item}</option>)}
                </select>
            </div>
            <div>
                <div className="flex items-center gap-2 mt-1">
                    <label htmlFor="funcao" className="block text-sm font-medium text-gray-300">Quantidade</label>
                    <select
                        value={operando}
                        onChange={e => setOperando(e.target.value)}
                        className="block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white"
                    >
                        <option value="">Selecione</option>
                        <option value="maiorQue">Maior que</option>
                        <option value="menorQue">Menor que</option>
                        <option value="igualA">Igual a</option>
                    </select>
                    <input
                        type="number"
                        disabled={operando === '' ? true : false}
                        min={0}
                        max={1000}
                        value={quantidade}
                        onChange={e => setQuantidade(e.target.value)}
                        className={`block w-full border-none outline-none rounded-md py-2 px-3 text-white ${operando === '' ? "bg-inputfield-100/50" : "bg-inputfield-100"}`}
                        placeholder="Ex: 50"
                    />
                </div>
            </div>
            <div className="pt-4 flex justify-end">
                <button type="submit" className="transition-colors cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                    Aplicar Filtros
                </button>
            </div>

        </form>
    );
};

export default FilterEntregasForm;