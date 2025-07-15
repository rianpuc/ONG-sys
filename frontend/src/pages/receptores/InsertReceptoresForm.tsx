import { useState } from 'react';
import MaskedInput from '../../components/ui/MaskedInput';
import useMutation from '../../hooks/useMutation';

// O formulário recebe a lista de instituições e uma função para fechar o modal no sucesso
interface ReceptorFormProps {
    name?: string;
    onSuccess: () => void;
    onError: () => void;
}

const InsertReceptoresForm = ({ name, onSuccess, onError }: ReceptorFormProps) => {
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
            onSuccess();
        } catch (err) {
            onError();
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-300">Nome</label>
                <input required type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)}
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
                    required={true}
                />
            </div>

            <div>
                <label htmlFor="funcao" className="block text-sm font-medium text-gray-300">Endereço</label>
                <input required type="text" id="funcao" value={endereco} onChange={(e) => setEndereco(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" />
            </div>

            <div className="pt-4 flex justify-end">
                <button type="submit" className="transition-colors bg-green-500 hover:bg-green-600 cursor-pointer text-white font-bold py-2 px-4 rounded-lg">
                    Inserir Receptor
                </button>
            </div>
        </form>
    );
};

export default InsertReceptoresForm;