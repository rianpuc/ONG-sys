import { useState } from 'react';
import type { Instituicao } from '../../interface/Instituicao'
import useMutation from '../../hooks/useMutation';

// O formulário recebe a lista de instituições e uma função para fechar o modal no sucesso
interface EventoFormProps {
    name?: string;
    instituicoes: Instituicao[];
    onSuccess: () => void;
    onError: () => void;
}

const InsertEventosForm = ({ name, instituicoes, onSuccess, onError }: EventoFormProps) => {
    const [local, setLocal] = useState(name ? name : '');
    const [data, setData] = useState('');
    const [selectedInstituicaoId, setSelectedInstituicaoId] = useState('');
    const { execute: criarEvento, isLoading, error } = useMutation('/evento', 'POST');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const novoEvento = {
            Local: local,
            Data: data,
            Organizador: selectedInstituicaoId
        };
        try {
            await criarEvento(novoEvento);
            onSuccess();
        } catch (err) {
            onError()
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="local" className="block text-sm font-medium text-gray-300">Local do Evento</label>
                <input required type="text" id="local" value={local} onChange={e => setLocal(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" />
            </div>

            <div>
                <label htmlFor="data" className="block text-sm font-medium text-gray-300">Data do Evento</label>
                <input required type="date" id="data" value={data} onChange={e => setData(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" />
            </div>

            <div>
                <label htmlFor="instituicao" className="block text-sm font-medium text-gray-300">Instituição</label>
                <select required id="instituicao" value={selectedInstituicaoId} onChange={e => setSelectedInstituicaoId(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white">
                    <option value="">Selecione uma instituição</option>
                    {instituicoes.map(inst => (
                        <option key={inst.CNPJ} value={inst.CNPJ}>
                            {inst.Nome}
                        </option>
                    ))}
                </select>
            </div>

            <div className="pt-4 flex justify-end">
                <button type="submit" className="transition-colors bg-green-500 hover:bg-green-600 cursor-pointer text-white font-bold py-2 px-4 rounded-lg">
                    Inserir Evento
                </button>
            </div>
        </form>
    );
};

export default InsertEventosForm;