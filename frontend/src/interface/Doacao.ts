import type { Doador } from "./Doador"
import type { ItemDoado } from "./ItemDoado";

export interface Doacao {
    ID_Doacao: number;
    Data: Date;
    Doador: Doador;
    itensDoados: ItemDoado[];
}