import { useState } from 'react';
import type { Instituicao } from '../../interface/Instituicao';

// Definindo as props que o formulário recebe
interface FilterFormProps {
    onAplicarFiltros: (filtros: object) => void;
    instituicoes: Instituicao[];
}

const FilterEventosForm = ({ onAplicarFiltros, instituicoes }: FilterFormProps) => {
    // Estados locais para cada campo do formulário
    const [local, setLocal] = useState('');
    const [data, setData] = useState('');
    const [instituicaoId, setInstituicaoId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Impede o recarregamento da página
        // Monta o objeto de filtros com os valores dos estados
        const filtros = {
            local,
            data,
            instituicaoId,
        };
        // Chama a função do componente pai, passando os filtros
        onAplicarFiltros(filtros);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Nome */}
            <div>
                <label htmlFor="local" className="block text-sm font-medium text-gray-300">Local do Evento</label>
                <input type="text" id="local" value={local} onChange={e => setLocal(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" />
            </div>

            <div>
                <label htmlFor="data" className="block text-sm font-medium text-gray-300">Data do Evento</label>
                <input type="date" id="data" value={data} onChange={e => setData(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" />
            </div>

            <div>
                <label htmlFor="instituicao" className="block text-sm font-medium text-gray-300">Instituição</label>
                <select id="instituicao" value={instituicaoId} onChange={e => setInstituicaoId(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white">
                    <option value="">Todas</option>
                    {instituicoes.map(inst => (
                        <option key={inst.CNPJ} value={inst.CNPJ}>
                            {inst.Nome}
                        </option>
                    ))}
                </select>
            </div>

            <div className="pt-4 flex justify-end">
                <button type="submit" className="transition-colors cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                    Aplicar Filtros
                </button>
            </div>
        </form>
    );
};

export default FilterEventosForm;