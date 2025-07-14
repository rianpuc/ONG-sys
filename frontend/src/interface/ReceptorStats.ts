import type { ReceptorAusente } from "./ReceptorAusente";

export interface ReceptorStats {
    receptoresRegistrados: number;
    receptoresAusentes: ReceptorAusente[];
}