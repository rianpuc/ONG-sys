import { useState } from 'react';
import type { Instituicao } from '../../interface/Instituicao'
import type { Evento } from '../../interface/Evento';
import useMutation from '../../hooks/useMutation';

// O formulário recebe a lista de instituições e uma função para fechar o modal no sucesso
interface VoluntarioFormProps {
    instituicoes: Instituicao[];
    selectedEvento: Evento;
    onSuccess: () => void;
    onError: () => void;
}

const UpdateVoluntariosForm = ({ instituicoes, selectedEvento, onSuccess, onError }: VoluntarioFormProps) => {
    const [local, setLocal] = useState(selectedEvento.Local);
    const [data, setData] = useState<string>(selectedEvento.Data.toString().split('T')[0]);
    const selecionadaInstituicao = instituicoes.find(inst => inst.Nome === selectedEvento.Organizador);
    const [selectedInstituicaoId, setSelectedInstituicaoId] = useState(selecionadaInstituicao!.CNPJ);
    const { execute: atualizarEvento, isLoading, error } = useMutation('/evento', 'PUT');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedEvento = {
            Local: local,
            Data: data,
            Organizador: selectedInstituicaoId
        };
        try {
            await atualizarEvento(updatedEvento, selectedEvento.ID_Evento);
            onSuccess();
        } catch (err) {
            onError();
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
                <button type="submit" className="transition-colors cursor-pointer bg-updatebtn-100 hover:bg-purple-800/80 text-white font-bold py-2 px-4 rounded-lg">
                    Salvar Evento
                </button>
            </div>
        </form>
    );
};

export default UpdateVoluntariosForm;