import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import type { Doador } from '../../interface/Doador';
import type { Item } from '../../interface/Item';
import type { ItemDoado } from '../../interface/ItemDoado'
import Modal from '../../components/ui/Modal';
import InsertDoadoresForm from '../doadores/InsertDoadoresForm';
import InsertItensForm from '../itens/InsertItensForm';
import useMutation from '../../hooks/useMutation';
import type { ClassNamesConfig, StylesConfig } from 'react-select';
import classNames from 'classnames';
import { X } from 'lucide-react';


interface DoadorOption {
    label: string
    value: number
}

// Definindo as props que o formulário recebe
interface InsertFormProps {
    onSuccess: () => void;
    onDoadorCreated: () => void;
    onItemCreated: () => void;
    doadores: Doador[];
    itens: Item[];
}

const InsertDoacaoForm = ({ onSuccess, doadores, itens, onDoadorCreated, onItemCreated }: InsertFormProps) => {

    const [subModalAberto, setSubModalAberto] = useState<null | 'novoDoador' | 'novoItem'>(null);
    const [data, setData] = useState('');
    const [reutilizar, setReutilizar] = useState('');
    const [doadorID, setDoadorID] = useState(0);
    const { execute: criarDoacao, isLoading, error } = useMutation('/doacao', 'POST');
    /* LOGICA PARA USAR CREATABLESELECT */
    const doadorOptions = doadores.map(d => ({ value: d.ID_Doador, label: d.Nome_Doador }));
    const itensOptions = itens.map(d => ({ value: d.ID_Item, label: d.Nome_Item }));
    const handleCreateDoador = (inputValue: string) => {
        setReutilizar(inputValue);
        setSubModalAberto('novoDoador');
    }
    const handleCreateItem = (inputValue: string) => {
        setReutilizar(inputValue);
        setSubModalAberto('novoItem');
    }
    const [itensDoados, setItensDoados] = useState<ItemDoado[]>([{
        ID_Item: '', nomeItem: '', tipoItem: '', quantidade: 0
    }]);

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
            await criarDoacao(novaDoacao);
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
    const customClassNames: ClassNamesConfig<DoadorOption> = {
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
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="data" className="block text-sm font-medium text-gray-300">Data:</label>
                    <input required type="date" id="data" value={data} onChange={e => setData(e.target.value)}
                        className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white" />
                </div>
                <div>
                    <label htmlFor="doador" className="block text-sm font-medium text-gray-300">Doador</label>
                    <CreatableSelect<DoadorOption>
                        isClearable
                        unstyled
                        options={doadorOptions}
                        classNames={customClassNames}
                        onChange={(e) => setDoadorID(e ? e.value : -1)}
                        onCreateOption={handleCreateDoador}
                        placeholder="Selecione ou digite para criar um novo doador"
                        formatCreateLabel={inputValue => `Criar ${inputValue}...`}
                    />
                </div>
                <div>
                    {/* AQUI RENDERIZAMOS A LISTA DINÂMICA */}
                    <label htmlFor="itens" className="block text-sm font-medium text-gray-300">Itens doados</label>
                    <div className="space-y-3">
                        {itensDoados.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <CreatableSelect<DoadorOption, false>
                                    isClearable
                                    unstyled
                                    classNames={customClassNames}
                                    required={true}
                                    options={itensOptions}
                                    onChange={(e) => handleItemChange(index, 'ID_Item', (e ? String(e.value) : ''))}
                                    onCreateOption={handleCreateItem}
                                    placeholder="Selecione um item"
                                    formatCreateLabel={inputValue => `Criar ${inputValue}...`}
                                    className='flex-1'
                                />
                                <input
                                    type="number"
                                    value={item.quantidade}
                                    onChange={e => handleItemChange(index, 'quantidade', (e.target.value))}
                                    min="1"
                                    max="1000"
                                    required
                                    className="w-24 bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white"
                                />

                                {/* Botão de Remover (só aparece se houver mais de 1 item) */}
                                {itensDoados.length > 1 && (
                                    <X onClick={() => removerItem(index)} className='cursor-pointer rounded-md text-rose-500' />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Botão para Adicionar Nova Linha */}
                    <button type="button" onClick={adicionarItem} className="transition-colors text-sm cursor-pointer text-cyan-400 hover:text-cyan-300 font-semibold">
                        + Adicionar outro item
                    </button>
                </div>
                <div className="pt-4 flex justify-end">
                    <button type="submit" className="transition-colors bg-green-500 hover:bg-green-600 cursor-pointer text-white font-bold py-2 px-4 rounded-lg">
                        Inserir Doação
                    </button>
                </div>
            </form>
            <Modal title="Cadastrar Novo Doador" isOpen={subModalAberto === 'novoDoador'} onClose={() => setSubModalAberto(null)}>
                <InsertDoadoresForm name={reutilizar} onSuccess={() => { onDoadorCreated(); setSubModalAberto(null); }}></InsertDoadoresForm>
            </Modal>
            <Modal title="Cadastrar Novo Item" isOpen={subModalAberto === 'novoItem'} onClose={() => setSubModalAberto(null)}>
                <InsertItensForm name={reutilizar} quantity={true} onSuccess={() => { onItemCreated(); setSubModalAberto(null); }}></InsertItensForm>
            </Modal>

        </>
    );
};

export default InsertDoacaoForm;