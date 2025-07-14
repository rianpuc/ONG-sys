import type { DoadorDistribuicao } from "./DoadorDistribuicao";

export interface DoadorStats {
    doadoresCriados: number;
    doadoresDistribuicao: DoadorDistribuicao[];
}