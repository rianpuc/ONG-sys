import { useState } from 'react';
import useMutation from '../../hooks/useMutation';

// O formulário recebe a lista de instituições e uma função para fechar o modal no sucesso
interface ItemFormProps {
    quantity?: boolean;
    name?: string;
    onSuccess: () => void;
}

const InsertItensForm = ({ onSuccess, quantity, name }: ItemFormProps) => {
    const [nome, setNome] = useState(name ? name : '');
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
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" />
            </div>
            <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-300">Tipo</label>
                <input required type="text" id="tipo" value={tipo} onChange={e => setTipo(e.target.value)}
                    className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" />
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
    );
};

export default InsertItensForm;