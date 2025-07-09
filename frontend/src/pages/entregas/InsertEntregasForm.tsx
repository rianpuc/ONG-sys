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

// Definindo as props que o formulário recebe
interface InsertFormProps {
    onSuccess: () => void;
    onEventoCreated: () => void;
    onReceptorCreated: () => void;
    onItemCreated: () => void;
    eventos: Evento[];
    receptores: Receptor[];
    itens: Item[];
}

const InsertEntregasForm = ({ onSuccess, onEventoCreated, onReceptorCreated, onItemCreated, eventos, receptores, itens }: InsertFormProps) => {

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
            alert('Por favor, selecione um item válido para todas as linhas.');
            return
        }
        const eventoSelecionado = eventos.find(evento => evento.ID_Evento === Number(eventoID));
        if (!eventoSelecionado) {
            alert('Erro: O evento selecionado é inválido. Por favor, recarregue a página.');
            return;
        }
        const hojeObjeto = new Date();
        const ano = hojeObjeto.getFullYear();
        const mes = String(hojeObjeto.getMonth() + 1).padStart(2, '0');
        const dia = String(hojeObjeto.getDate()).padStart(2, '0');
        const hojeFormatado = `${ano}-${mes}-${dia}`;
        const dataDoEventoString = eventoSelecionado.Data.toString().split('T')[0];
        if (dataDoEventoString > hojeFormatado) {
            alert("Não é possível registrar uma entrega para um evento que ainda não aconteceu!");
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
            alert("Entrega registrada com sucesso!");
            onSuccess();
        } catch (err) {
            console.error("Falha ao criar entrega:", err);
        }
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
                    <CreatableSelect
                        isClearable
                        options={eventosOptions}
                        onChange={(e) => setEventoID(e ? e.value : -1)}
                        onCreateOption={handleCreateEvento}
                        placeholder="Selecione ou digite para criar um novo evento"
                        formatCreateLabel={inputValue => `Criar ${inputValue}...`}
                        className='bg-gray-600 text-black p-2 rounded-md'
                    />
                </div>
                <div>
                    <label htmlFor="receptor" className="block text-sm font-medium text-gray-300">Receptor</label>
                    <CreatableSelect
                        isClearable
                        options={receptoresOptions}
                        onChange={(e) => setReceptorID(e ? String(e.value) : '')}
                        onCreateOption={handleCreateReceptor}
                        placeholder="Selecione ou digite para criar um novo receptor"
                        formatCreateLabel={inputValue => `Criar ${inputValue}...`}
                        className='bg-gray-600 text-black p-2 rounded-md'
                    />
                </div>
                <div>
                    {/* AQUI RENDERIZAMOS A LISTA DINÂMICA */}
                    <label htmlFor="itens" className="block text-sm font-medium text-gray-300">Itens entregues</label>
                    <div className="space-y-3">
                        {itensEntrega.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-700/50 rounded-md">
                                {/* Dropdown de Item */}
                                <CreatableSelect
                                    isClearable
                                    required={true}
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
                                    value={item.Quantidade}
                                    onChange={e => handleItemChange(index, 'Quantidade', (e.target.value))}
                                    min="1"
                                    max="1000"
                                    required
                                    className="w-24 bg-gray-600 text-white p-2 rounded-md"
                                />

                                {/* Botão de Remover (só aparece se houver mais de 1 item) */}
                                {itensEntrega.length > 1 && (
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
                        Salvar Entrega
                    </button>
                </div>
            </form>
            <Modal title="Cadastrar Novo Evento" isOpen={subModalAberto === 'novoEvento'} onClose={() => setSubModalAberto(null)}>
                <InsertEventosForm instituicoes={instituicoes!} name={reutilizar} onSuccess={() => { onEventoCreated(); setSubModalAberto(null); }} />
            </Modal>
            <Modal title="Cadastrar Novo Receptor" isOpen={subModalAberto === 'novoReceptor'} onClose={() => setSubModalAberto(null)}>
                <InsertReceptoresForm name={reutilizar} onSuccess={() => { onReceptorCreated(); setSubModalAberto(null); }} />
            </Modal>
            <Modal title="Cadastrar Novo Item" isOpen={subModalAberto === 'novoItem'} onClose={() => setSubModalAberto(null)}>
                <InsertItensForm name={reutilizar} quantity={true} onSuccess={() => { onItemCreated(); setSubModalAberto(null); }} />
            </Modal>

        </>
    );
};

export default InsertEntregasForm;