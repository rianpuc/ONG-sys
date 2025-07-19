import { useMemo, useState } from 'react';
import useMutation from '../../hooks/useMutation';
import type { Item } from '../../interface/Item';
import classNames from 'classnames';
import type { ClassNamesConfig } from 'react-select';
import CreatableSelect from 'react-select/creatable';

interface TipoOption {
    label: string
    value: string
}

// O formulário recebe a lista de instituições e uma função para fechar o modal no sucesso
interface ItemFormProps {
    selectedItem: Item;
    itens: Item[];
    onSuccess: () => void;
    onError: () => void;
}

const UpdateReceptoresForm = ({ selectedItem, itens, onSuccess, onError }: ItemFormProps) => {
    const [nome, setNome] = useState(selectedItem.Nome_Item);
    const [tipo, setTipo] = useState(selectedItem.Tipo_Item);
    const [quantidade, setQuantidade] = useState(selectedItem.Quantidade_Atual);
    const { execute: atualizarItem, isLoading, error } = useMutation('/item', 'PUT');
    const tiposUnicos = useMemo(() => {
        if (!itens) return [];
        const todosOsTipos = itens.map(item => item.Tipo_Item);
        return [...new Set(todosOsTipos)];
    }, [itens]);
    const tipoOptions = tiposUnicos.map(t => ({ value: t, label: t }));
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedItem = {
            Nome_Item: nome,
            Tipo_Item: tipo,
            Quantidade_Atual: quantidade
        };
        try {
            await atualizarItem(updatedItem, selectedItem.ID_Item);
            onSuccess();
        } catch (err) {
            onError();
            console.error(err);
        }
    };
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

    return (
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
                    value={{ value: tipo, label: tipo }}
                    options={tipoOptions}
                    classNames={customClassNames}
                    onChange={(e) => setTipo(e ? e.value : "")}
                    placeholder="Selecione ou digite para criar um novo tipo"
                    formatCreateLabel={inputValue => `Criar ${inputValue}...`}
                />
            </div>
            <div>
                <label htmlFor="quantidade" className="block text-sm font-medium text-gray-300">Quantidade</label>
                <input required type="number" min={0} max={1000} id="quantidade" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" />
            </div>

            <div className="pt-4 flex justify-end">
                <button type="submit" className="transition-colors cursor-pointer bg-updatebtn-100 hover:bg-purple-800/80 text-white font-bold py-2 px-4 rounded-lg">
                    Salvar Item
                </button>
            </div>
        </form>
    );
};

export default UpdateReceptoresForm;