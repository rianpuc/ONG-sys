import { useState } from 'react';
import type { Instituicao } from '../../interface/Instituicao'
import type { Voluntario } from '../../interface/Voluntario';
import useMutation from '../../hooks/useMutation';

// O formulário recebe a lista de instituições e uma função para fechar o modal no sucesso
interface VoluntarioFormProps {
    instituicoes: Instituicao[];
    selectedVoluntario: Voluntario;
    onSuccess: () => void;
}

const UpdateVoluntariosForm = ({ instituicoes, selectedVoluntario, onSuccess }: VoluntarioFormProps) => {
    const [nome, setNome] = useState(selectedVoluntario.Nome);
    const [cpf, setCpf] = useState(selectedVoluntario.CPF);
    const [funcao, setFuncao] = useState(selectedVoluntario.Funcao);
    const selecionadaInstituicao = instituicoes.find(inst => inst.Nome === selectedVoluntario.nomeInstituicao);
    const [selectedInstituicaoId, setSelectedInstituicaoId] = useState<number | ''>(Number(selecionadaInstituicao!.CNPJ));
    const { execute: atualizarVoluntario, isLoading, error } = useMutation('/voluntario', 'PUT');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const cpfLimpo = cpf.replace(/\D/g, '');
        const updatedVoluntario = {
            CPF: cpfLimpo,
            Nome: nome,
            Funcao: funcao,
            instituicaoId: selectedInstituicaoId
        };
        try {
            await atualizarVoluntario(updatedVoluntario, updatedVoluntario.CPF);
            alert('Voluntário atualizado com sucesso!');
            onSuccess();
        } catch (err) {
            console.error("Falha ao atualizar voluntário:", err);
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
                <input disabled type="text" id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)}
                    className="mt-1 block w-full bg-gray-900 opacity-50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
                <label htmlFor="funcao" className="block text-sm font-medium text-gray-300">Função</label>
                <input required type="text" id="funcao" value={funcao} onChange={(e) => setFuncao(e.target.value)}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
                <label htmlFor="instituicao" className="block text-sm font-medium text-gray-300">Instituição</label>
                <select required id="instituicao" value={selectedInstituicaoId} onChange={(e) => setSelectedInstituicaoId(Number(e.target.value))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione uma instituição</option>
                    {instituicoes?.map(inst => (
                        <option key={inst.CNPJ} value={inst.CNPJ}>
                            {inst.Nome}
                        </option>
                    ))}
                </select>
            </div>

            <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Salvar Voluntário
                </button>
            </div>
        </form>
    );
};

export default UpdateVoluntariosForm;