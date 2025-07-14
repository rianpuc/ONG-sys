import type { SaldoDoadoEntregue } from "./SaldoDoadoEntregue";

export interface EntregaStats {
    entregasRealizadas: number;
    balancoMensal: SaldoDoadoEntregue[];
}