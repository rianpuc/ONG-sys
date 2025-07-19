import { useMemo, useState } from 'react';
import type { Item } from '../../interface/Item';

// Definindo as props que o formulário recebe
interface FilterFormProps {
    onAplicarFiltros: (filtros: object) => void;
    itens: Item[];
}

const FilterItensForm = ({ onAplicarFiltros, itens }: FilterFormProps) => {
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [operando, setOperando] = useState('');

    const tiposUnicos = useMemo(() => {
        if (!itens) return [];
        const todosOsTipos = itens.map(item => item.Tipo_Item);
        return [...new Set(todosOsTipos)];
    }, [itens]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Impede o recarregamento da página
        let filtros: { [key: string]: string | number } = {
            Nome: nome,
            Tipo: tipo
        };
        if (quantidade) {
            filtros[operando] = Number(quantidade);
        }
        onAplicarFiltros(filtros);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-300">Item</label>
                <input type="text" id="nome" value={nome} onChange={e => setNome(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" />
            </div>
            <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-300">Tipo</label>
                <select id="tipo" value={tipo} onChange={e => setTipo(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white">
                    <option value="">Todos</option>
                    {tiposUnicos.map(i => <option key={i!} value={i!}>{i!}</option>)}
                </select>
            </div>
            <div>
                <div className="flex items-center gap-2">
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

export default FilterItensForm;