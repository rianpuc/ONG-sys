import { useMemo, useState } from 'react';
import type { Instituicao } from '../../interface/Instituicao';
import type { Voluntario } from '../../interface/Voluntario';

// Definindo as props que o formulário recebe
interface FilterFormProps {
    onAplicarFiltros: (filtros: object) => void;
    instituicoes: Instituicao[];
    voluntarios: Voluntario[];
}

const FilterVoluntariosForm = ({ onAplicarFiltros, instituicoes, voluntarios }: FilterFormProps) => {
    // Estados locais para cada campo do formulário
    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [funcao, setFuncao] = useState('');
    const [instituicaoId, setInstituicaoId] = useState('');

    const funcoesUnicas = useMemo(() => {
        if (!voluntarios) return [];
        const todosOsTipos = voluntarios.map(voluntario => voluntario.Funcao);
        return [...new Set(todosOsTipos)];
    }, [voluntarios]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Impede o recarregamento da página
        // Monta o objeto de filtros com os valores dos estados
        const filtros = {
            cpf,
            nome,
            funcao,
            instituicaoId
        };
        // Chama a função do componente pai, passando os filtros
        onAplicarFiltros(filtros);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Nome */}
            <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-300">Nome do Voluntário</label>
                <input type="text" id="nome" value={nome} onChange={e => setNome(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" />
            </div>

            <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-300">CPF</label>
                <input type="text" id="cpf" value={cpf} onChange={e => setCpf(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" />
            </div>

            <div>
                <label htmlFor="funcao" className="block text-sm font-medium text-gray-300">Tipo</label>
                <select id="funcao" value={funcao} onChange={e => setFuncao(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white">
                    <option value="">Todos</option>
                    {funcoesUnicas.map(f => <option key={f!} value={f!}>{f!}</option>)}
                </select>
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

export default FilterVoluntariosForm;