import { useState } from 'react';

// Definindo as props que o formulário recebe
interface FilterFormProps {
    onAplicarFiltros: (filtros: object) => void;
}

const FilterItensForm = ({ onAplicarFiltros }: FilterFormProps) => {
    // Estados locais para cada campo do formulário
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [operando, setOperando] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Impede o recarregamento da página
        // Monta o objeto de filtros com os valores dos estados
        let filtros: { [key: string]: string | number } = {
            Nome: nome,
            Tipo: tipo
        };
        if (quantidade) {
            filtros[operando] = Number(quantidade);
        }
        // Chama a função do componente pai, passando os filtros
        onAplicarFiltros(filtros);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Nome */}
            <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-300">Item</label>
                <input type="text" id="nome" value={nome} onChange={e => setNome(e.target.value)}
                    className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white" />
            </div>
            <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-300">Tipo</label>
                <input type="text" id="tipo" value={tipo} onChange={e => setTipo(e.target.value)}
                    className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white" />
            </div>

            <div>
                <div className="flex items-center gap-2 mt-1">
                    <label htmlFor="funcao" className="block text-sm font-medium text-gray-300">Quantidade</label>
                    <select
                        value={operando}
                        onChange={e => setOperando(e.target.value)}
                        className="bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white"
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
                        className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white"
                        placeholder="Ex: 50"
                    />
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Aplicar Filtros
                </button>
            </div>
        </form>
    );
};

export default FilterItensForm;