import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import type { Doador } from '../../interface/Doador';
import type { Item } from '../../interface/Item';
import type { ItemDoado } from '../../interface/ItemDoado'
import Modal from '../../components/ui/Modal';
import InsertDoadoresForm from '../doadores/InsertDoadoresForm';
import InsertItensForm from '../itens/InsertItensForm';
import useMutation from '../../hooks/useMutation';
import type { Evento } from '../../interface/Evento';
import type { Receptor } from '../../interface/Receptor';
import { formatarDataParaExibicao } from '../../utils/Formatters';
import type { ItemEntrega } from '../../interface/ItemEntrega';
import InsertEventosForm from '../eventos/InsertEventosForm';
import InsertReceptoresForm from '../receptores/InsertReceptoresForm';
import useFetch from '../../hooks/useFetch';
import type { Instituicao } from '../../interface/Instituicao';
import type { ClassNamesConfig } from 'react-select';
import classNames from 'classnames';
import { X } from 'lucide-react';

interface EntregaOption {
    label: string | undefined;
    value: number | string;
}

// Definindo as props que o formulário recebe
interface InsertFormProps {
    onSuccess: () => void;
    onError: (mensagem: string) => void;
    onWarn: (mensagem: string) => void;
    onEventoCreated: () => void;
    onReceptorCreated: () => void;
    onItemCreated: () => void;
    eventos: Evento[];
    receptores: Receptor[];
    itens: Item[];
}

const InsertEntregasForm = ({ onSuccess, onError, onWarn, onEventoCreated, onReceptorCreated, onItemCreated, eventos, receptores, itens }: InsertFormProps) => {

    const [subModalAberto, setSubModalAberto] = useState<null | 'novoEvento' | 'novoReceptor' | 'novoItem'>(null);
    const [reutilizar, setReutilizar] = useState('');
    const [eventoID, setEventoID] = useState(0);
    const [receptorID, setReceptorID] = useState('');
    const { execute: criarEntrega, isLoading, error } = useMutation('/entrega', 'POST');
    const { data: instituicoes } = useFetch<Instituicao[]>('/instituicao')
    /* LOGICA PARA USAR CREATABLESELECT */
    const eventosOptions = eventos.map(e => ({ value: e.ID_Evento, label: e.Local + ' - ' + formatarDataParaExibicao(e.Data) }))
    const receptoresOptions = receptores.map(r => ({ value: r.CPF, label: r.Nome }));
    const itensOptions = itens.map(d => ({ value: d.ID_Item, label: d.Nome_Item }));
    const handleCreateEvento = (inputValue: string) => {
        setReutilizar(inputValue);
        setSubModalAberto('novoEvento');
    }
    const handleCreateReceptor = (inputValue: string) => {
        setReutilizar(inputValue);
        setSubModalAberto('novoReceptor');
    }
    const handleCreateItem = (inputValue: string) => {
        setReutilizar(inputValue);
        setSubModalAberto('novoItem');
    }
    const [itensEntrega, setItensEntrega] = useState<ItemEntrega[]>([{
        ID_Item: '', Nome_Item: '', Tipo_Item: '', Quantidade: 0
    }]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Impede o recarregamento da página
        const itemInvalido = itensEntrega.some(item => item.ID_Item === '');
        if (itemInvalido) {
            onWarn('Por favor, selecione um item válido para todas as linhas.');
            return
        }
        const eventoSelecionado = eventos.find(evento => evento.ID_Evento === Number(eventoID));
        if (!eventoSelecionado) {
            onWarn('Erro: O evento selecionado é inválido. Por favor, recarregue a página.');
            return;
        }
        const hojeObjeto = new Date();
        const ano = hojeObjeto.getFullYear();
        const mes = String(hojeObjeto.getMonth() + 1).padStart(2, '0');
        const dia = String(hojeObjeto.getDate()).padStart(2, '0');
        const hojeFormatado = `${ano}-${mes}-${dia}`;
        const dataDoEventoString = eventoSelecionado.Data.toString().split('T')[0];
        if (dataDoEventoString > hojeFormatado) {
            onWarn("Não é possível registrar uma entrega para um evento que ainda não aconteceu!");
            return;
        }
        const novaEntrega = {
            Data: eventoSelecionado.Data,
            Evento: Number(eventoID),
            Receptor: String(receptorID),
            itensEntregues: itensEntrega.map(item => ({
                ID_Item: item.ID_Item,
                Quantidade: item.Quantidade
            }))
        };
        try {
            await criarEntrega(novaEntrega);
            onSuccess();
        } catch (err) {
            onError(String(err));
            console.error(err);
        }
    };

    const customClassNames: ClassNamesConfig<EntregaOption> = {
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

    const handleItemChange = (index: number, field: keyof ItemEntrega, value: string) => {
        let novosItens = [...itensEntrega];
        if (field === 'ID_Item') {
            novosItens[index][field] = value === '' ? '' : Number(value);
        } else if (field === 'Quantidade') {
            novosItens[index][field] = Number(value);
        } else {
            novosItens[index][field] = value;
        }
        setItensEntrega(novosItens);
    }

    const adicionarItem = () => {
        setItensEntrega([...itensEntrega, { ID_Item: '', Nome_Item: '', Tipo_Item: '', Quantidade: 0 }])
    }

    const removerItem = (index: number) => {
        const novosItens = itensEntrega.filter((_, i) => i !== index);
        setItensEntrega(novosItens);
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="evento" className="block text-sm font-medium text-gray-300">Evento</label>
                    <CreatableSelect<EntregaOption>
                        isClearable
                        unstyled
                        classNames={customClassNames}
                        options={eventosOptions}
                        onChange={(e) => setEventoID(e ? Number(e.value) : -1)}
                        onCreateOption={handleCreateEvento}
                        placeholder="Selecione ou digite para criar um novo evento"
                        formatCreateLabel={inputValue => `Criar ${inputValue}...`}
                    />
                </div>
                <div>
                    <label htmlFor="receptor" className="block text-sm font-medium text-gray-300">Receptor</label>
                    <CreatableSelect<EntregaOption>
                        isClearable
                        unstyled
                        options={receptoresOptions}
                        onChange={(e) => setReceptorID(e ? String(e.value) : '')}
                        onCreateOption={handleCreateReceptor}
                        placeholder="Selecione ou digite para criar um novo receptor"
                        formatCreateLabel={inputValue => `Criar ${inputValue}...`}
                        classNames={customClassNames}
                    />
                </div>
                <div>
                    {/* AQUI RENDERIZAMOS A LISTA DINÂMICA */}
                    <label htmlFor="itens" className="block text-sm font-medium text-gray-300">Itens entregues</label>
                    <div className="space-y-3">
                        {itensEntrega.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 rounded-md">
                                {/* Dropdown de Item */}
                                <CreatableSelect<EntregaOption>
                                    isClearable
                                    unstyled
                                    required={true}
                                    options={itensOptions}
                                    onChange={(e) => handleItemChange(index, 'ID_Item', (e ? String(e.value) : ''))}
                                    onCreateOption={handleCreateItem}
                                    placeholder="Selecione um item"
                                    formatCreateLabel={inputValue => `Criar ${inputValue}...`}
                                    classNames={customClassNames}
                                    className='flex-1'
                                />
                                {/* Input de Quantidade */}
                                <input
                                    type="number"
                                    value={item.Quantidade}
                                    onChange={e => handleItemChange(index, 'Quantidade', (e.target.value))}
                                    min="1"
                                    max="1000"
                                    required
                                    className="w-24 bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white"
                                />

                                {/* Botão de Remover (só aparece se houver mais de 1 item) */}
                                {itensEntrega.length > 1 && (
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
                        Inserir Entrega
                    </button>
                </div>
            </form>
            <Modal title="Cadastrar Novo Evento" isOpen={subModalAberto === 'novoEvento'} onClose={() => setSubModalAberto(null)}>
                <InsertEventosForm onError={() => onError("Falha ao criar evento")} instituicoes={instituicoes!} name={reutilizar} onSuccess={() => { onEventoCreated(); setSubModalAberto(null); }} />
            </Modal>
            <Modal title="Cadastrar Novo Receptor" isOpen={subModalAberto === 'novoReceptor'} onClose={() => setSubModalAberto(null)}>
                <InsertReceptoresForm onError={() => onError("Falha ao criar receptor")} name={reutilizar} onSuccess={() => { onReceptorCreated(); setSubModalAberto(null); }} />
            </Modal>
            <Modal title="Cadastrar Novo Item" isOpen={subModalAberto === 'novoItem'} onClose={() => setSubModalAberto(null)}>
                <InsertItensForm onError={() => onError("Falha ao criar item")} name={reutilizar} quantity={true} onSuccess={() => { onItemCreated(); setSubModalAberto(null); }} />
            </Modal>

        </>
    );
};

export default InsertEntregasForm;