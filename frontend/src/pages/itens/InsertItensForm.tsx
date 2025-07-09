import { useState } from 'react';
import useMutation from '../../hooks/useMutation';

// O formulário recebe a lista de instituições e uma função para fechar o modal no sucesso
interface ItemFormProps {
    quantity?: boolean;
    onSuccess: () => void;
}

const InsertItensForm = ({ onSuccess, quantity }: ItemFormProps) => {
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState('');
    let lockedQuantity = quantity ? true : false;
    const [quantidade, setQuantidade] = useState(0);
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
            alert('Item cadastrado com sucesso!');
            onSuccess();
        } catch (err) {
            console.error("Falha ao criar item:", err);
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
                <input required disabled={lockedQuantity} type="number" min={0} max={1000} id="quantidade" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))}
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

export default InsertItensForm;