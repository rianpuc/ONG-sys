import type { Evento } from "./Evento";
import type { ItemEntrega } from "./ItemEntrega";
import type { Receptor } from "./Receptor";

export interface Entrega {
    ID_Entrega: number;
    Data_Entrega: Date;
    Evento: Evento;
    Receptor: Receptor;
    itensEntregues: ItemEntrega[];
}