import { useState } from 'react';
import MaskedInput from '../../components/ui/MaskedInput';

// Definindo as props que o formulário recebe
interface FilterFormProps {
    onAplicarFiltros: (filtros: object) => void;
}

const FilterDoadoresForm = ({ onAplicarFiltros }: FilterFormProps) => {
    // Estados locais para cada campo do formulário
    const [cpf, setCpf] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState('');

    // Renderizacao condicional do documento
    const renderDocument = () => {
        if (tipo === 'Fisica') {
            return (
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
            );
        }
        if (tipo === 'Juridica') {
            return (
                <div>
                    <label htmlFor="cnpj" className="block text-sm font-medium text-gray-300">CNPJ</label>
                    <MaskedInput
                        mask="00.000.000/0000-00"
                        id="cnpj"
                        name="cnpj"
                        value={cnpj}
                        onChange={setCnpj}
                        placeholder="00.000.000/0000-00"
                    />
                </div>
            );
        }
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Impede o recarregamento da página
        // Monta o objeto de filtros com os valores dos estados
        const cpfLimpo = cpf ? cpf.replace(/\D/g, '') : '';
        const cnpjLimpo = cnpj ? cnpj.replace(/\D/g, '') : '';
        const filtros = {
            CPF: cpfLimpo,
            CNPJ: cnpjLimpo,
            Nome_Doador: nome,
            Tipo_Doador: tipo
        };
        // Chama a função do componente pai, passando os filtros
        onAplicarFiltros(filtros);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Nome */}
            <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-300">Nome do Doador</label>
                <input type="text" id="nome" value={nome} onChange={e => setNome(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" />
            </div>

            <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-300">Tipo</label>
                <select id="tipo" value={tipo} onChange={e => {
                    setTipo(e.target.value);
                    if (tipo === "Fisica") {
                        setCpf('');
                    } else {
                        setCnpj('');
                    }
                }}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white">
                    <option value="">Todos</option>
                    <option value="Fisica">Fisica</option>
                    <option value="Juridica">Juridica</option>
                </select>
            </div>
            {renderDocument()}
            <div className="pt-4 flex justify-end">
                <button type="submit" className="transition-colors cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                    Aplicar Filtros
                </button>
            </div>
        </form>
    );
};

export default FilterDoadoresForm;