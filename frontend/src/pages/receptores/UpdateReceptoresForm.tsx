import { useState } from 'react';
import useMutation from '../../hooks/useMutation';
import type { Receptor } from '../../interface/Receptor';

interface ReceptorFormProps {
    selectedReceptor: Receptor;
    onSuccess: () => void;
    onError: () => void;
}

const UpdateReceptoresForm = ({ selectedReceptor, onSuccess, onError }: ReceptorFormProps) => {
    const [nome, setNome] = useState(selectedReceptor.Nome);
    const [cpf, setCpf] = useState(selectedReceptor.CPF);
    const [endereco, setEndereco] = useState(selectedReceptor.Endereco);
    const { execute: atualizarReceptor, isLoading, error } = useMutation('/receptor', 'PUT');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const cpfLimpo = cpf.replace(/\D/g, '');
        const updatedVoluntario = {
            CPF: cpfLimpo,
            Nome: nome,
            Endereco: endereco
        };
        try {
            await atualizarReceptor(updatedVoluntario, updatedVoluntario.CPF);
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
                <input disabled type="text" id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 outline-none opacity-50 border-none rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
                <label htmlFor="funcao" className="block text-sm font-medium text-gray-300">Endereço</label>
                <input required type="text" id="funcao" value={endereco} onChange={(e) => setEndereco(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" />
            </div>

            <div className="pt-4 flex justify-end">
                <button type="submit" className="transition-colors cursor-pointer bg-updatebtn-100 hover:bg-purple-800/80 text-white font-bold py-2 px-4 rounded-lg">
                    Salvar Receptor
                </button>
            </div>
        </form>
    );
};

export default UpdateReceptoresForm;