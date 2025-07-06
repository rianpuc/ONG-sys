import type { ItemEntrega } from "./ItemEntrega";

export interface Entrega {
    ID_Entrega: number;
    Data_Entrega: Date;
    Local_Evento: string;
    Nome_Receptor: string;
    itensEntregues: ItemEntrega[];
}