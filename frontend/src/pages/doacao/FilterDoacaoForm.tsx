import { useState } from 'react';
import type { Doador } from '../../interface/Doador';
import type { Item } from '../../interface/Item';

// Definindo as props que o formulário recebe
interface FilterFormProps {
    onAplicarFiltros: (filtros: object) => void;
    doadores: Doador[];
    itens: Item[];
}

const FilterDoacaoForm = ({ onAplicarFiltros, doadores, itens }: FilterFormProps) => {
    const [dataAntes, setDataAntes] = useState('');
    const [dataDepois, setDataDepois] = useState('');
    const [operando, setOperando] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [doadorID, setDoadorID] = useState('');
    const [itemID, setItemID] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Impede o recarregamento da página
        // Monta o objeto de filtros com os valores dos estados
        let filtros: { [key: string]: string | number } = {
            antes: dataAntes,
            depois: dataDepois,
            Doador: doadorID,
            Item: itemID
        };
        if (quantidade) {
            filtros[operando] = quantidade;
        }
        // Chama a função do componente pai, passando os filtros
        onAplicarFiltros(filtros);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
                <div className="flex-1">
                    <label htmlFor="dataDepois" className="block text-sm font-medium text-gray-300">A partir de:</label>
                    <input type="date" id="dataDepois" value={dataDepois} onChange={e => setDataDepois(e.target.value)}
                        className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" />
                </div>
                <div className="flex-1">
                    <label htmlFor="dataAntes" className="block text-sm font-medium text-gray-300">Antes de:</label>
                    <input type="date" id="dataAntes" value={dataAntes} onChange={e => setDataAntes(e.target.value)}
                        className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" />
                </div>
            </div>
            <div>
                <label htmlFor="doador" className="block text-sm font-medium text-gray-300">Doador</label>
                <select id="doador" value={doadorID} onChange={e => setDoadorID(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" >
                    <option value="">Todos</option>
                    {doadores.map(d => <option key={d.ID_Doador} value={d.ID_Doador}>{d.Nome_Doador}</option>)}
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
                        className="bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white"
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

export default FilterDoacaoForm;