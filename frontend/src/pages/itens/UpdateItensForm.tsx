import { useState } from 'react';
import useMutation from '../../hooks/useMutation';
import type { Item } from '../../interface/Item';

// O formulário recebe a lista de instituições e uma função para fechar o modal no sucesso
interface ItemFormProps {
    selectedItem: Item;
    onSuccess: () => void;
}

const UpdateReceptoresForm = ({ selectedItem, onSuccess }: ItemFormProps) => {
    const [nome, setNome] = useState(selectedItem.Nome_Item);
    const [tipo, setTipo] = useState(selectedItem.Tipo_Item);
    const [quantidade, setQuantidade] = useState(selectedItem.Quantidade_Atual);
    const { execute: atualizarItem, isLoading, error } = useMutation('/item', 'PUT');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedItem = {
            Nome_Item: nome,
            Tipo_Item: tipo,
            Quantidade_Atual: quantidade
        };
        try {
            await atualizarItem(updatedItem, selectedItem.ID_Item);
            alert('Item atualizado com sucesso!');
            onSuccess();
        } catch (err) {
            console.error("Falha ao atualizar item:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-300">Item</label>
                <input required type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-300">Tipo</label>
                <input required type="text" id="tipo" value={tipo} onChange={e => setTipo(e.target.value)}
                    className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white" />
            </div>
            <div>
                <label htmlFor="quantidade" className="block text-sm font-medium text-gray-300">Quantidade</label>
                <input required type="number" min={0} max={1000} id="quantidade" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Salvar Item
                </button>
            </div>
        </form>
    );
};

export default UpdateReceptoresForm;