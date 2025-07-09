import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import type { Doador } from '../../interface/Doador';
import type { Item } from '../../interface/Item';
import type { ItemDoado } from '../../interface/ItemDoado'
import Modal from '../../components/ui/Modal';
import InsertDoadoresForm from '../doadores/InsertDoadoresForm';
import InsertItensForm from '../itens/InsertItensForm';
import useMutation from '../../hooks/useMutation';
import type Doacao from './Doacao';

// Definindo as props que o formulário recebe
interface UpdateFormProps {
    onSuccess: () => void;
    onDoadorCreated: () => void;
    onItemCreated: () => void;
    selectedDoacao: Doacao;
    doadores: Doador[];
    itens: Item[];
}

const UpdateDoacaoForm = ({ onSuccess, doadores, itens, selectedDoacao, onDoadorCreated, onItemCreated }: UpdateFormProps) => {

    const [subModalAberto, setSubModalAberto] = useState<null | 'novoDoador' | 'novoItem'>(null);
    const [data, setData] = useState(selectedDoacao.Data.toString().split('T')[0]);
    const [doadorID, setDoadorID] = useState(selectedDoacao.Doador.ID_Doador);
    const { execute: atualizarDoacao, isLoading, error } = useMutation('/doacao', 'PUT');
    /* LOGICA PARA USAR CREATABLESELECT */
    const doadorOptions = doadores.map(d => ({ value: d.ID_Doador, label: d.Nome_Doador }));
    const itensOptions = itens.map(d => ({ value: d.ID_Item, label: d.Nome_Item }));
    const handleCreateDoador = (inputValue: string) => {
        setSubModalAberto('novoDoador');
    }
    const handleCreateItem = (inputValue: string) => {
        setSubModalAberto('novoItem');
    }
    const [itensDoados, setItensDoados] = useState<ItemDoado[]>(selectedDoacao.itensDoados);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Impede o recarregamento da página
        const itemInvalido = itensDoados.some(item => item.ID_Item === '');
        if (itemInvalido) {
            alert('Por favor, selecione um item válido para todas as linhas.');
            return
        }
        const novaDoacao = {
            Data: data,
            Doador: doadorID,
            itensDoados: itensDoados.map(item => ({
                ID_Item: item.ID_Item,
                Quantidade: item.quantidade
            }))
        };
        try {
            await atualizarDoacao(novaDoacao, selectedDoacao.ID_Doacao);
            alert("Doacao registrada com sucesso!");
            onSuccess();
        } catch (err) {
            console.error("Falha ao criar doacao:", err);
        }
    };

    const handleItemChange = (index: number, field: keyof ItemDoado, value: string) => {
        let novosItens = [...itensDoados];
        if (field === 'ID_Item') {
            novosItens[index][field] = value === '' ? '' : Number(value);
        } else if (field === 'quantidade') {
            novosItens[index][field] = Number(value);
        } else {
            novosItens[index][field] = value;
        }
        setItensDoados(novosItens);
    }

    const adicionarItem = () => {
        setItensDoados([...itensDoados, { ID_Item: '', nomeItem: '', tipoItem: '', quantidade: 0 }])
    }

    const removerItem = (index: number) => {
        const novosItens = itensDoados.filter((_, i) => i !== index);
        setItensDoados(novosItens);
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="data" className="block text-sm font-medium text-gray-300">Data:</label>
                    <input required type="date" id="data" value={data} onChange={e => setData(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white" />
                </div>
                <div>
                    <label htmlFor="doador" className="block text-sm font-medium text-gray-300">Doador</label>
                    <CreatableSelect
                        isClearable
                        options={doadorOptions}
                        value={{ value: selectedDoacao.Doador.ID_Doador, label: selectedDoacao.Doador.Nome_Doador }}
                        onChange={(e) => setDoadorID(e ? e.value : -1)}
                        onCreateOption={handleCreateDoador}
                        placeholder="Selecione ou digite para criar um novo doador"
                        formatCreateLabel={inputValue => `Criar ${inputValue}...`}
                        className='bg-gray-600 text-black p-2 rounded-md'
                    />
                </div>
                <div>
                    {/* AQUI RENDERIZAMOS A LISTA DINÂMICA */}
                    <label htmlFor="itens" className="block text-sm font-medium text-gray-300">Itens doados</label>
                    <div className="space-y-3">
                        {itensDoados.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-700/50 rounded-md">
                                {/* Dropdown de Item */}
                                <CreatableSelect
                                    isClearable
                                    required={true}
                                    value={{ value: item.ID_Item, label: item.nomeItem }}
                                    options={itensOptions}
                                    onChange={(e) => handleItemChange(index, 'ID_Item', (e ? String(e.value) : ''))}
                                    onCreateOption={handleCreateItem}
                                    placeholder="Selecione um item"
                                    formatCreateLabel={inputValue => `Criar ${inputValue}...`}
                                    className='bg-gray-600 text-black rounded-md flex-1'
                                />
                                {/* Input de Quantidade */}
                                <input
                                    type="number"
                                    value={item.quantidade}
                                    onChange={e => handleItemChange(index, 'quantidade', (e.target.value))}
                                    min="1"
                                    max="1000"
                                    required
                                    className="w-24 bg-gray-600 text-white p-2 rounded-md"
                                />

                                {/* Botão de Remover (só aparece se houver mais de 1 item) */}
                                {itensDoados.length > 1 && (
                                    <button type="button" onClick={() => removerItem(index)} className="bg-red-600 hover:bg-red-700 p-2 rounded-md text-white font-bold">X</button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Botão para Adicionar Nova Linha */}
                    <button type="button" onClick={adicionarItem} className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold">
                        + Adicionar outro item
                    </button>
                </div>
                <div className="pt-4 flex justify-end">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Salvar Doacao
                    </button>
                </div>
            </form>
            <Modal title="Cadastrar Novo Doador" isOpen={subModalAberto === 'novoDoador'} onClose={() => setSubModalAberto(null)}>
                <InsertDoadoresForm onSuccess={() => { onDoadorCreated(); setSubModalAberto(null); }}></InsertDoadoresForm>
            </Modal>
            <Modal title="Cadastrar Novo Item" isOpen={subModalAberto === 'novoItem'} onClose={() => setSubModalAberto(null)}>
                <InsertItensForm quantity={true} onSuccess={() => { onItemCreated(); setSubModalAberto(null); }}></InsertItensForm>
            </Modal>

        </>
    );
};

export default UpdateDoacaoForm;