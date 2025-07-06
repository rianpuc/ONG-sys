import type { Doador } from "./Doador"
import type { ItemDoado } from "./ItemDoado";

export interface Doacoes {
    ID_Doacao: number;
    Data: Date;
    Doador: Doador;
    itensDoados: ItemDoado[];
}