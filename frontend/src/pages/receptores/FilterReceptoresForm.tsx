import { useState } from 'react';
import MaskedInput from '../../components/ui/MaskedInput';

// Definindo as props que o formulário recebe
interface FilterFormProps {
    onAplicarFiltros: (filtros: object) => void;
}

const FilterReceptoresForm = ({ onAplicarFiltros }: FilterFormProps) => {
    // Estados locais para cada campo do formulário
    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [endereco, setEndereco] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Impede o recarregamento da página
        const cpfLimpo = cpf.replace(/\D/g, '');
        // Monta o objeto de filtros com os valores dos estados
        const filtros = {
            cpf: cpfLimpo,
            nome,
            endereco,
        };
        // Chama a função do componente pai, passando os filtros
        onAplicarFiltros(filtros);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Nome */}
            <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-300">Nome do Receptor</label>
                <input type="text" id="nome" value={nome} onChange={e => setNome(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" />
            </div>

            <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-300">CPF</label>
                <MaskedInput
                    mask="000.000.000-00"
                    id="cpf"
                    name="cpf"
                    value={cpf}
                    onChange={setCpf}
                    placeholder="000.000.000-00"
                />
            </div>

            <div>
                <label htmlFor="funcao" className="block text-sm font-medium text-gray-300">Endereço</label>
                <input type="text" id="funcao" value={endereco} onChange={e => setEndereco(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" />
            </div>

            <div className="pt-4 flex justify-end">
                <button type="submit" className="transition-colors cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                    Aplicar Filtros
                </button>
            </div>
        </form>
    );
};

export default FilterReceptoresForm;