import type { TopItem } from "./TopItem";

export interface ItemStats {
    maisDoado: TopItem[];
    maisEntregue: TopItem[];
    menoresItensEmEstoque: TopItem[];
}