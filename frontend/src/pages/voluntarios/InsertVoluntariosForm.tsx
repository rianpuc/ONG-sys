import { useMemo, useState } from 'react';
import type { Instituicao } from '../../interface/Instituicao'
import MaskedInput from '../../components/ui/MaskedInput';
import useMutation from '../../hooks/useMutation';
import type { Voluntario } from '../../interface/Voluntario';
import type { ClassNamesConfig } from 'react-select';
import classNames from 'classnames';
import CreatableSelect from 'react-select/creatable';

interface FuncaoOption {
    label: string
    value: string
}


// O formulário recebe a lista de instituições e uma função para fechar o modal no sucesso
interface VoluntarioFormProps {
    instituicoes: Instituicao[];
    voluntarios: Voluntario[];
    onSuccess: () => void;
    onError: () => void;
}

const InsertVoluntariosForm = ({ instituicoes, onSuccess, voluntarios }: VoluntarioFormProps) => {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [funcao, setFuncao] = useState('');
    const [selectedInstituicaoId, setSelectedInstituicaoId] = useState<number | ''>('');
    const { execute: criarVoluntario, isLoading, error } = useMutation('/voluntario', 'POST');
    const tiposUnicos = useMemo(() => {
        if (!voluntarios) return [];
        const todosOsTipos = voluntarios.map(voluntario => voluntario.Funcao);
        return [...new Set(todosOsTipos)];
    }, [voluntarios]);
    const tipoOptions = tiposUnicos.map(t => ({ value: t, label: t }));
    const customClassNames: ClassNamesConfig<FuncaoOption> = {
        control: () =>
            classNames(
                'block w-full cursor-pointer bg-inputfield-100 rounded-md py-2 px-3 text-white'
            ),
        option: () =>
            classNames(
                'text-white py-2 px-3 mb-2 bg-inputoption-100 rounded-md transition-colors hover:bg-inputoption-100/30'
            ),
        menu: () =>
            classNames(
                'mt-1 bg-inputfield-100 rounded-md text-white',
            ),
        menuList: () =>
            classNames(
                'p-4 h-50'
            ),
        dropdownIndicator: () =>
            classNames(
                'text-gray-600'
            ),
        clearIndicator: () =>
            classNames(
                'text-gray-600'
            )
        ,
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const cpfLimpo = cpf.replace(/\D/g, '');
        const novoVoluntario = {
            CPF: cpfLimpo,
            Nome: nome,
            Funcao: funcao,
            instituicaoId: String(selectedInstituicaoId)
        };
        try {
            await criarVoluntario(novoVoluntario);
            onSuccess();
        } catch (err) {
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
                <label htmlFor="funcao" className="block text-sm font-medium text-gray-300">Função</label>
                <CreatableSelect<FuncaoOption>
                    isClearable
                    unstyled
                    options={tipoOptions}
                    classNames={customClassNames}
                    onChange={(e) => setFuncao(e ? e.value : "")}
                    placeholder="Selecione ou digite para criar uma nova função"
                    formatCreateLabel={inputValue => `Criar ${inputValue}...`}
                />
            </div>
            <div>
                <label htmlFor="instituicao" className="block text-sm font-medium text-gray-300">Instituição</label>
                <select required id="instituicao" value={selectedInstituicaoId} onChange={(e) => setSelectedInstituicaoId(Number(e.target.value))}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white">
                    <option value="">Selecione uma instituição</option>
                    {instituicoes?.map(inst => (
                        <option key={inst.CNPJ} value={inst.CNPJ}>
                            {inst.Nome}
                        </option>
                    ))}
                </select>
            </div>

            <div className="pt-4 flex justify-end">
                <button type="submit" className="transition-colors bg-green-500 hover:bg-green-600 cursor-pointer text-white font-bold py-2 px-4 rounded-lg">
                    Inserir Voluntário
                </button>
            </div>
        </form>
    );
};

export default InsertVoluntariosForm;