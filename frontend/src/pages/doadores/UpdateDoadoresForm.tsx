import { useState } from 'react';
import useMutation from '../../hooks/useMutation';
import type { Doador } from '../../interface/Doador';
import MaskedInput from '../../components/ui/MaskedInput';

// O formulário recebe a lista de instituições e uma função para fechar o modal no sucesso
interface DoadorFormProps {
    selectedDoador: Doador;
    onSuccess: () => void;
    onError: () => void;
}

const UpdateDoadoresForm = ({ selectedDoador, onSuccess, onError }: DoadorFormProps) => {
    const [nome, setNome] = useState(selectedDoador.Nome_Doador);
    const [cpf, setCpf] = useState(selectedDoador.CPF as string | '');
    const [cnpj, setCnpj] = useState(selectedDoador.CNPJ as string | '');
    const [tipo, setTipo] = useState(selectedDoador.Tipo_Doador);
    const { execute: atualizarDoador, isLoading, error } = useMutation('/doador', 'PUT');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const cpfLimpo = cpf ? cpf.replace(/\D/g, '') : '';
        const cnpjLimpo = cnpj ? cnpj.replace(/\D/g, '') : '';
        const updatedDoador = {
            CPF: cpfLimpo,
            CNPJ: cnpjLimpo,
            Nome_Doador: nome,
            Tipo_Doador: tipo
        };
        try {
            await atualizarDoador(updatedDoador, selectedDoador.ID_Doador);
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
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-300">Tipo</label>
                <select id="tipo" value={tipo} onChange={e => {
                    const novoTipo = e.target.value as "Fisica" | "Juridica";
                    setTipo(novoTipo);
                    if (tipo === "Fisica") {
                        setCpf('');
                    } else {
                        setCnpj('');
                    }
                }}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white">
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
                <button type="submit" className="transition-colors cursor-pointer bg-updatebtn-100 hover:bg-purple-800/80 text-white font-bold py-2 px-4 rounded-lg">
                    Salvar Doador
                </button>
            </div>
        </form>
    );
};

export default UpdateDoadoresForm;