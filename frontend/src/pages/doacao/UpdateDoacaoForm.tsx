import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import type { Doador } from '../../interface/Doador';
import type { Item } from '../../interface/Item';
import type { ItemDoado } from '../../interface/ItemDoado'
import Modal from '../../components/ui/Modal';
import InsertDoadoresForm from '../doadores/InsertDoadoresForm';
import InsertItensForm from '../itens/InsertItensForm';
import useMutation from '../../hooks/useMutation';
import type { Doacao } from '../../interface/Doacao';
import classNames from 'classnames';
import type { ClassNamesConfig } from 'react-select';
import { X } from 'lucide-react';

interface DoadorOption {
    label: string | undefined;
    value: number | "";
}

// Definindo as props que o formulário recebe
interface UpdateFormProps {
    onSuccess: () => void;
    onError: (mensagem: string) => void;
    onWarn: (mensagem: string) => void;
    onDoadorCreated: () => void;
    onItemCreated: () => void;
    selectedDoacao: Doacao;
    doadores: Doador[];
    itens: Item[];
}

const UpdateDoacaoForm = ({ onSuccess, onError, onWarn, doadores, itens, selectedDoacao, onDoadorCreated, onItemCreated }: UpdateFormProps) => {

    const [subModalAberto, setSubModalAberto] = useState<null | 'novoDoador' | 'novoItem'>(null);
    const [data, setData] = useState(selectedDoacao.Data.toString().split('T')[0]);
    const [doador, setDoador] = useState(selectedDoacao.Doador);
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
            onWarn('Por favor, selecione um item válido para todas as linhas.');
            return
        }
        const novaDoacao = {
            Data: data,
            Doador: doador.ID_Doador,
            itensDoados: itensDoados.map(item => ({
                ID_Item: item.ID_Item,
                Quantidade: item.quantidade
            }))
        };
        try {
            await atualizarDoacao(novaDoacao, selectedDoacao.ID_Doacao);
            onSuccess();
        } catch (err) {
            onError("Falha ao atualizar doação");
            console.error(err);
        }
    };

    const handleItemChange = (index: number, field: keyof ItemDoado, value: string) => {
        let novosItens = [...itensDoados];
        if (field === 'ID_Item') {
            const itemSelecionado = itens.find((item) => item.ID_Item === Number(value));
            if (novosItens.find((item) => item.ID_Item === itemSelecionado?.ID_Item)) {
                onError("Não é possivel adicionar o mesmo item duas vezes");
                return;
            }
            novosItens[index][field] = Number(value);
            novosItens[index]["nomeItem"] = itemSelecionado?.Nome_Item;
            novosItens[index]["tipoItem"] = itemSelecionado?.Tipo_Item;
            console.log(novosItens[index]);
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
        control: (state) =>
            classNames(
                'block w-full rounded-md py-2 px-3 text-white',
                `${state.isDisabled ? 'cursor-not-allowed bg-inputfield-100/50' : 'cursor-pointer bg-inputfield-100'}`
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
                        isDisabled={!selectedDoacao.Doador.Status}
                        options={doadorOptions}
                        value={{ value: doador.ID_Doador, label: doador.Status === true ? doador.Nome_Doador : "Doador Anônimo" }}
                        onChange={(e) => { setDoador({ ID_Doador: Number(e?.value), CPF: "", CNPJ: "", Nome_Doador: e?.label!, Tipo_Doador: "Fisica", Status: true }); }}
                        onCreateOption={handleCreateDoador}
                        placeholder="Selecione ou digite para criar um novo doador"
                        formatCreateLabel={inputValue => `Criar ${inputValue}...`}
                        classNames={customClassNames}
                    />
                </div>
                <div>
                    {/* AQUI RENDERIZAMOS A LISTA DINÂMICA */}
                    <label htmlFor="itens" className="block text-sm font-medium text-gray-300">Itens doados</label>
                    <div className="space-y-3">
                        {itensDoados.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                {/* Dropdown de Item */}
                                <CreatableSelect<DoadorOption>
                                    isClearable
                                    unstyled
                                    required={true}
                                    value={{ value: item.ID_Item, label: item.nomeItem }}
                                    options={itensOptions}
                                    onChange={(e) => handleItemChange(index, 'ID_Item', (e ? String(e.value) : ''))}
                                    onCreateOption={handleCreateItem}
                                    placeholder="Selecione um item"
                                    formatCreateLabel={inputValue => `Criar ${inputValue}...`}
                                    classNames={customClassNames}
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
                    <button type="submit" className="transition-colors cursor-pointer bg-updatebtn-100 hover:bg-purple-800/80 text-white font-bold py-2 px-4 rounded-lg">
                        Salvar Doação
                    </button>
                </div>
            </form>
            <Modal title="Cadastrar Novo Doador" isOpen={subModalAberto === 'novoDoador'} onClose={() => setSubModalAberto(null)}>
                <InsertDoadoresForm onError={() => onError("Falha ao criar doador")} onSuccess={() => { onDoadorCreated(); setSubModalAberto(null); }}></InsertDoadoresForm>
            </Modal>
            <Modal title="Cadastrar Novo Item" isOpen={subModalAberto === 'novoItem'} onClose={() => setSubModalAberto(null)}>
                <InsertItensForm itens={itens!} onError={() => onError("Falha ao criar item")} quantity={true} onSuccess={() => { onItemCreated(); setSubModalAberto(null); }}></InsertItensForm>
            </Modal>
        </>
    );
};

export default UpdateDoacaoForm;