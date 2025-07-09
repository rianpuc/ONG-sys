import { useState } from 'react';
import MaskedInput from '../../components/ui/MaskedInput';
import useMutation from '../../hooks/useMutation';

// O formulário recebe a lista de instituições e uma função para fechar o modal no sucesso
interface ReceptorFormProps {
    name?: string;
    onSuccess: () => void;
}

const InsertReceptoresForm = ({ name, onSuccess }: ReceptorFormProps) => {
    const [nome, setNome] = useState(name ? name : '');
    const [cpf, setCpf] = useState('');
    const [endereco, setEndereco] = useState('');
    const { execute: criarReceptor, isLoading, error } = useMutation('/receptor', 'POST');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const cpfLimpo = cpf.replace(/\D/g, '');
        const novoReceptor = {
            CPF: cpfLimpo,
            Nome: nome,
            Endereco: endereco,
        };
        try {
            await criarReceptor(novoReceptor);
            alert('Receptor cadastrado com sucesso!');
            onSuccess();
        } catch (err) {
            console.error("Falha ao criar receptor:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-300">Nome</label>
                <input required type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
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
                    required={true}
                />
            </div>

            <div>
                <label htmlFor="funcao" className="block text-sm font-medium text-gray-300">Endereço</label>
                <input required type="text" id="funcao" value={endereco} onChange={(e) => setEndereco(e.target.value)}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Salvar Receptor
                </button>
            </div>
        </form>
    );
};

export default InsertReceptoresForm;