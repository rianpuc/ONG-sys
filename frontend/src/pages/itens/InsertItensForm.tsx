import { useMemo, useState } from 'react';
import useMutation from '../../hooks/useMutation';
import CreatableSelect from 'react-select/creatable';
import type { Item } from '../../interface/Item';
import type { ClassNamesConfig } from 'react-select';
import classNames from 'classnames';


interface TipoOption {
    label: string
    value: string
}

// O formulário recebe a lista de instituições e uma função para fechar o modal no sucesso
interface ItemFormProps {
    quantity?: boolean;
    name?: string;
    itens: Item[];
    onSuccess: () => void;
    onError: () => void;
}

const InsertItensForm = ({ onSuccess, itens, onError, quantity, name }: ItemFormProps) => {
    const [nome, setNome] = useState(name ? name : '');
    const [tipo, setTipo] = useState('');
    let lockedQuantity = quantity ? true : false;
    const [quantidade, setQuantidade] = useState(0);
    const tiposUnicos = useMemo(() => {
        if (!itens) return [];
        const todosOsTipos = itens.map(item => item.Tipo_Item);
        return [...new Set(todosOsTipos)];
    }, [itens]);
    const tipoOptions = tiposUnicos.map(t => ({ value: t, label: t }));
    const customClassNames: ClassNamesConfig<TipoOption> = {
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
    const { execute: criarItem, isLoading, error } = useMutation('/item', 'POST');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const novoItem = {
            Nome_Item: nome,
            Tipo_Item: tipo,
            Quantidade_Atual: quantidade
        };
        try {
            await criarItem(novoItem);
            onSuccess();
        } catch (err) {
            onError();
            console.error(err);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-300">Item</label>
                    <input required type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)}
                        className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" />
                </div>
                <div>
                    <label htmlFor="tipo" className="block text-sm font-medium text-gray-300">Tipo</label>
                    <CreatableSelect<TipoOption>
                        isClearable
                        unstyled
                        options={tipoOptions}
                        classNames={customClassNames}
                        onChange={(e) => setTipo(e ? e.value : "")}
                        placeholder="Selecione ou digite para criar um novo tipo"
                        formatCreateLabel={inputValue => `Criar ${inputValue}...`}
                    />
                </div>
                <div>
                    <label htmlFor="quantidade" className="block text-sm font-medium text-gray-300">Quantidade</label>
                    <input required disabled={lockedQuantity} type="number" min={0} max={1000} id="quantidade" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))}
                        className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" />
                </div>

                <div className="pt-4 flex justify-end">
                    <button type="submit" className="transition-colors bg-green-500 hover:bg-green-600 cursor-pointer text-white font-bold py-2 px-4 rounded-lg">
                        Inserir Item
                    </button>
                </div>
            </form>
        </>
    );
};

export default InsertItensForm;