import { useState } from 'react';
import MaskedInput from '../../components/ui/MaskedInput';
import useMutation from '../../hooks/useMutation';

// O formulário recebe a lista de instituições e uma função para fechar o modal no sucesso
interface DoadorFormProps {
    onSuccess: () => void;
    name?: string;
}

const InsertReceptoresForm = ({ onSuccess, name }: DoadorFormProps) => {
    const [nome, setNome] = useState(name ? name : '');
    const [tipo, setTipo] = useState('Fisica');
    const [cpf, setCpf] = useState('');
    const [cnpj, setCnpj] = useState('');
    const { execute: criarDoador, isLoading, error } = useMutation('/doador', 'POST');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const cpfLimpo = cpf.replace(/\D/g, '');
        const cnpjLimpo = cnpj.replace(/\D/g, '');
        const novoDoador = {
            CPF: cpfLimpo,
            CNPJ: cnpjLimpo,
            Nome_Doador: nome,
            Tipo_Doador: tipo,
        };
        try {
            await criarDoador(novoDoador);
            alert('Doador cadastrado com sucesso!');
            onSuccess();
        } catch (err) {
            console.error("Falha ao criar doador:", err);
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
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-300">Tipo</label>
                <select id="tipo" value={tipo} onChange={e => {
                    setTipo(e.target.value);
                    if (tipo === "Fisica") {
                        setCpf('');
                    } else {
                        setCnpj('');
                    }
                }}
                    className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white">
                    <option value="Fisica">Fisica</option>
                    <option value="Juridica">Juridica</option>
                </select>
            </div>

            {tipo === "Fisica" ?
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
                </div> :
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
            }


            <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Salvar Receptor
                </button>
            </div>
        </form>
    );
};

export default InsertReceptoresForm;